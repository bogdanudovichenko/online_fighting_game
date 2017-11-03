var gameRoomsList = [];
var playerId = null;
var gameHub = null;

$.get('/api/player/getMyId').done(id => {
    playerId = id;
});

$(document).ready(function () {
    window.gameCanvas = $('#game-canvas')
    gameCanvas.hide();
    window.$roomsTable = $('#rooms-table');

    gameHubInit();
});

function gameHubInit() {
    var gameHub = $.connection.gameHub;

    $.connection.hub.start().done(function () {
        gameHub.server.getRooms();
        window.gameHub = gameHub;
    });

    gameHub.client.sentRooms = function (rooms) {
        renderGameRooms(rooms);
    };
}

function renderGameRooms(rooms) {
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
                            Create room
                      </button>`
        $roomsTable.parent().parent().append(button);
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
                    <span>${room.Player1.Ready ? 'Ready' : ''}</span>
                </td>`
             : '<td class="game-room-player-wrapper col-sm-2"><input type="hidden" value="${room.Id}" />-</td>'
            }

            ${ room.Player2
            ? `
                <td>
                    <input type="hidden" value="${room.Player2.Id}" />
                    <span>${room.Player2.Name}</span>
                    <span>${room.Player2.Ready ? 'Ready' : ''}</span>
                </td>
                <td>
                    ${!isPlayerInRoom(room.Id, playerId) && !isPlayerInAnyRoom(playerId) ? `<button class="btn btn-primary game-room-btn" onclick="joinRoom(${room.Id})">JoinRoom</button>` : ''} 
                    ${isPlayerInRoom(room.Id, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="leaveRoom()">Leave Room</button>` : ''}
                    ${isPlayerInRoom(room.Id, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="iamReady()">Leave Room</button>` : ''}
                </td>
                `
             : 
                `<td class="game-room-player-wrapper col-sm-2">-</td>
                 <td>
                    ${!isPlayerInRoom(room.Id, playerId) && !isPlayerInAnyRoom(playerId) ? `<button class="btn btn-primary game-room-btn" onclick="joinRoom(${room.Id})">JoinRoom</button>` : ''} 
                    ${isPlayerInRoom(room.Id, playerId) ? `<button class="btn btn-primary game-room-btn" onclick="leaveRoom()">Leave Room</button>` : ''}
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