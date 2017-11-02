var gameRoomsList = [];
var playerId = null;

$.get('/api/player/getMyId').done(id => {
    playerId = id;
});

$(document).ready(function () {
    window.gameCanvas = $('#game-canvas')
    gameCanvas.hide();
    window.$roomsWrapper = $('#rooms-wrapper');

    gameHubInit();
});

function gameHubInit() {
    var gameHub = $.connection.gameHub;

    $.connection.hub.start().done(function () {
        gameHub.server.getRooms();
    });

    gameHub.client.sentRooms = function (rooms) {
        renderGameRooms(rooms);
    };
}

function renderGameRooms(rooms) {
    $roomsWrapper.empty();
    $roomsWrapper.append('<button class="btn btn-success create-room-btn">Create room</button>');

    gameRoomsList = [];

    if (!rooms || !rooms.length) return;

    rooms.forEach(room => {
        renderGameRoom(room);
    });
}

function renderGameRoom(room) {
    if (!room) return;

    var $gameRoomDiv = `
        <br>
        <div class="room-wrapper row">
            <input type="hidden" value="${room.Id}" />

            ${ room.Player1
                ? `
                <div class="game-room-player-wrapper game-room-player1-wrapper col-sm-2 col-sm-offset-1">
                    <input type="hidden" value="${room.Player1.Id}" />
                    <span>${room.Player1.Name}</span>
                    <span>${room.Player1.Ready ? 'Ready' : ''}</span>
                </div>`
                : '<div class="game-room-player-wrapper col-sm-2">-</div>'
             }

            ${ room.Player2
                ? `
                <div class="game-room-player-wrapper game-room-player2-wrapper col-sm-2">
                    <input type="hidden" value="${room.Player2.Id}" />
                    <span>${room.Player2.Name}</span>
                    <span>${room.Player2.Ready ? 'Ready' : ''}</span>
                </div>
                <button class="btn btn-primary game-room-btn">JoinRoom</button>
                <button class="btn btn-primary game-room-btn">Leave Room</button>
                `
                : `<div class="game-room-player-wrapper col-sm-2">-</div> 
                    ${isPlayerInRoom(room.Id, playerId) ? '<button class="btn btn-primary game-room-btn">Leave Room</button>' : ''}`
             }

        </div>
    `;

    gameRoomsList.push({ room: room, roomDiv: $gameRoomDiv });
    $roomsWrapper.append($gameRoomDiv);
}

function isPlayerInRoom(roomId, playerId) {
    if (!roomId || !playerId) return false;
    return !!gameRoomsList.filter(r => (r.Player2 && r.Player1.Id === playerId) || (r.Player2 && r.Player2.Id === r.playerId)).length;
}