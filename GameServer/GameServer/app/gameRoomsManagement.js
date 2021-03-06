﻿var gameRoomsList = [];
var playerId = null;
var gameHub = null;
var $gameMessage = $('#game-message-block');

$.get('/api/player/getMyId').done(id => {
    playerId = id;
});

$(document).ready(function () {
    window.$gameCanvas = $('#game-canvas')
    window.$roomsTable = $('#rooms-table');

    gameHubInit();
});

function gameHubInit() {
    var gameHub = $.connection.gameHub;
    $gameMessage.text('');

    $.connection.hub.start().done(function () {
        gameHub.server.getRooms();
        window.gameHub = gameHub;
    });

    gameHub.client.sentRooms = function (rooms) {
        renderGameRooms(rooms);
    };

    gameHub.client.startBattle = function() {
        startBattle();
    }

    gameHub.client.sentActions = function(act) {
        enemyActionsQueue.push(act);
    };

    gameHub.client.takeStrike = function () {
        strikeQueue.push(true);
    };

    gameHub.client.win = function() {
        $gameMessage.text('You win');
        onGameEnd();
        
    };

    gameHub.client.lose = function () {
        $gameMessage.text('You lose');
        onGameEnd();
    };
}

function onGameEnd() {
    $gameCanvas.hide();
    setTimeout(function() {
            $gameMessage.text('');
            startBattle();
        }, 2000);
}

function renderGameRooms(rooms) {
    $gameCanvas.hide();
    $('#players-health-wrapper').hide();
    $roomsTable.empty();

    gameRoomsList = [];

    if (!rooms || !rooms.length) return;

    rooms.forEach(room => gameRoomsList.push({ room: room }));

    rooms.forEach(room => {
        renderGameRoom(room);
    });

    var $existingButton = $('#create-room-btn');
    $existingButton.remove();

    if (!isPlayerInAnyRoom(playerId)) {
        var button = `<button id="create-room-btn" class="btn btn-success create-room-btn" onclick="createRoom()">
                            Создать комнату
                      </button>`
        $roomsTable.parent().parent().append(button);
    }

    if(canStartBattle()) {
        startBattle();
    }
}

function renderGameRoom(room) {
    if (!room) return;

    var $gameRoomTr = `
        <tr>
            ${ room.Player1
            ? `
                <td>
                    <input type="hidden" value="${room.Id}" />
                    <input type="hidden" value="${room.Player1.Id}" />
                    <span>${room.Player1.Name}</span>
                    <span>${room.Player1.Ready ? '[Готов]' : ''}</span>
                </td>`
             : '<td class="game-room-player-wrapper col-sm-2"><input type="hidden" value="${room.Id}" />-</td>'
            }

            ${ room.Player2
            ? `
                <td>
                    <input type="hidden" value="${room.Player2.Id}" />
                    <span>${room.Player2.Name}</span>
                    <span>${room.Player2.Ready ? '[Готов]' : ''}</span>
                </td>
                <td>
                    ${!isPlayerInRoom(room.Id, playerId) && !isPlayerInAnyRoom(playerId) ? `<button class="btn btn-primary game-room-btn" onclick="joinRoom(${room.Id})">Присоедениться</button>` : ''} 
                    ${isPlayerInRoom(room.Id, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="leaveRoom()">Покинуть комнату</button>` : ''}
                    ${isPlayerInRoom(room.Id, playerId) && !isPlayerReady(room, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="iamReady()">я готов</button>` : ''}
                </td>
                `
             : 
                `<td class="game-room-player-wrapper col-sm-2">-</td>
                 <td>
                    ${!isPlayerInRoom(room.Id, playerId) && !isPlayerInAnyRoom(playerId) ? `<button class="btn btn-primary game-room-btn" onclick="joinRoom(${room.Id})">Присоедениться</button>` : ''} 
                    ${isPlayerInRoom(room.Id, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="leaveRoom()">Покинуть комнату</button>` : ''}
                    ${isPlayerInRoom(room.Id, playerId) && !isPlayerReady(room, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="iamReady()">я готов</button>` : ''}
                 </td>
                 ` 
            }

        </tr>
    `;

    var gameRoom = gameRoomsList.filter(r => r.room == room)[0];
    if (gameRoom) gameRoom.gameRoomDiv = $gameRoomTr;

    $roomsTable.append($gameRoomTr);
}

function isPlayerInRoom(roomId, playerId) {

    if (!roomId || !playerId) return false;

    var result = !!gameRoomsList
        .map(r => r.room)
        .filter(r => r.Id === roomId)
        .filter(r => (r.Player1 && r.Player1.Id === playerId) || (r.Player2 && r.Player2.Id === playerId))
        .length;

    return result;
}

function isPlayerInAnyRoom(playerId) {
    if (!playerId) return false;

    var result = !!gameRoomsList
        .map(r => r.room)
        .filter(r => (r.Player1 && r.Player1.Id === playerId) || (r.Player2 && r.Player2.Id === playerId))
        .length;

    return result;
}

function createRoom() {
    if (!gameHub) return;
    gameHub.server.createRoom();
}

function joinRoom(roomId) {
    if (!gameHub || !roomId) return;
    gameHub.server.joinRoom(roomId);
}

function leaveRoom() {
    if (!gameHub) return;
    gameHub.server.leaveRoom();
}

function iamReady() {
    if (!gameHub) return;
    gameHub.server.iamReady();
}

function isPlayerReady(room, playerId) {
    if (!room || !playerId) return false;

    if (room.Player1 && room.Player1.Id === playerId && room.Player1.Ready) return true;
    if (room.Player2 && room.Player2.Id === playerId && room.Player2.Ready) return true;
    return false;
}

function canStartBattle() {
    if(!rooms || !rooms.length || playerId) false;

    var rooms = gameRoomsList.map(r => r.room);

    var room = rooms.filter(r => r.Player1 && r.Player2)
                    .filter(r => r.Player1.Ready && r.Player2.Ready)
                    .filter(r => r.Player1.Id === playerId || r.Player2.Id === playerId)[0];

    return !!room;
}