//$(document).ready(startBattle);

var canvas = null;
var stage = null;

var $player1Health = $('#player1-health');
var $player2Health = $('#player2-health');

var keys = {
    a: 65,
    d: 68,
    s: 83,
    w: 87,
    space: 32,
    shift: 16,
    ctrl: 17,
    alt: 18
};

var pressedKeyCodes = {};

var actionsEnum = {
    stay: 'stay',
    walk: 'walk',
    jump: 'jump',
    strike: 'strike'
};

var directionsEnum = {
    left: 'left',
    right: 'right'
};

var actions = Object.keys(actionsEnum);

var isKeyDown = false;

var player1State = {
    animation: null
};

var player2State = {
    animation: null
};

var mySelfState = null;
var enemyState = null;

var enemyActionsQueue = [];
var strikeQueue = [];

enemyActionsQueue = [];

function startBattle() {
    //gameHub.client.sentActions = sentActions;

    $gameCanvas.show();
    $('#players-health-wrapper').show();
    //$roomsTable.hide();
    canvas = document.getElementById('game-canvas');
    stage = new createjs.Stage(canvas);
    init();
}

function init() {
    setupBackgroundImage(function () {
        loadPlayersSprites();
    });
}

function setupBackgroundImage(loadedComplete) {
    var gameBgUrl = $('#gameBgUrl').val();

    var backgroundImage = new Image();
    backgroundImage.src = gameBgUrl;

    backgroundImage.onload = function () {
        var bg = new createjs.Bitmap(backgroundImage);
        stage.addChild(bg);

        stage.update();
        loadedComplete();
    };
}

function loadPlayersSprites() {
    loadPlayerSprites(1);
    loadPlayerSprites(2);

    var rooms = gameRoomsList.map(r => r.room);

    var room = rooms.filter(r => r.Player1 && r.Player2)
        .filter(r => r.Player1.Ready && r.Player2.Ready)
        .filter(r => r.Player1.Id === playerId || r.Player2.Id === playerId)[0];

    if (!room) throw 'Can`t start battle because can`t find game room.';

    if (room.Player1.Id == playerId) {
        mySelfState = player1State;
        enemyState = player2State;

        mySelfState.healthBlock = $player1Health;
        enemyState.healthBlock = $player2Health;
    } else if (room.Player2.Id == playerId) {
        mySelfState = player2State;
        enemyState = player1State;

        mySelfState.healthBlock = $player2Health;
        enemyState.healthBlock = $player1Health;
    } else {
        throw 'Player is not in a room.';
    }

    mySelfState.setHp = setHp;
    enemyState.setHp = setHp;
    mySelfState.takeStrike = takeStrike;
    enemyState.takeStrike = takeStrike;

    mySelfState.setHp(100);
    enemyState.setHp(100);

    function setHp(hp) {
        this.hp = hp;
        this.healthBlock.text(hp);
    }

    function takeStrike() {
        if(this.hp > 0) this.setHp(this.hp - 10);
        if(mySelfState === this && this.hp <= 0) gameHub.server.lose();
    }
}

function loadPlayerSprites(playerNumber) {
    var img = new Image();
    img.src = $('#player' + playerNumber + 'Url').val();

    img.onload = function () {
        var width = 102;
        var height = width;

        var spriteData = {
            images: [img],
            frames: {
                width: width,
                height: height,
                regY: height - canvas.height
            },
            animations: {
                stay: [8, 8, "stay"],
                walk: [0, 7, "walk"],
                strike: [30, 31, "stay"],
                jump: [16, 23, "stay"]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(spriteData);

        var animation = new createjs.Sprite(spriteSheet, "stay");

        stage.addChild(animation);

        createjs.Ticker.setFPS(8);
        createjs.Ticker.addEventListener("tick", tick);

        if (playerNumber === 1) {
            player1State.animation = animation;
            player1State.width = width;
        }
        else if (playerNumber === 2) {
            player2State.animation = animation;
            player2State.width = width;
            animation.scaleX = -1;
            animation.x = canvas.width;
        }
    };
}

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;

function onKeyDown(ev) {
    isKeyDown = true;
    pressedKeyCodes[ev.keyCode] = true;

    if (ev.keyCode === keys.ctrl) {
        setTimeout(function () {
            delete pressedKeyCodes[keys.ctrl];
        }, 400);
    }

    if (ev.keyCode !== keys.space) {
        delete pressedKeyCodes[keys.space];
    }

    if (ev.keyCode !== keys.ctrl) {
        delete pressedKeyCodes[keys.ctrl];
    }
}

function onKeyUp(ev) {
    isKeyDown = false;

    if (ev.keyCode !== keys.space && ev.keyCode !== keys.ctrl) {
        delete pressedKeyCodes[ev.keyCode];
    }
}

function tick() {
    playerTick();
    enemyTick();

    stage.update();
}

function playerTick() {
    if(strikeQueue && strikeQueue.length) {
        strikeQueue.shift();
        mySelfState.takeStrike();
    } 

    if (isKeyDown) {
        if (pressedKeyCodes[keys.d]) { //walk right
            gameHub.server.doActions({ action: actionsEnum.walk, direction: directionsEnum.right });

            if (mySelfState.animation.currentAnimation !== actionsEnum.walk) {
                mySelfState.animation.gotoAndPlay(actionsEnum.walk);
            }

            if (mySelfState.animation.scaleX !== 1) {
                mySelfState.animation.scaleX = 1;
                mySelfState.animation.x -= mySelfState.width;
            } else if (mySelfState.animation.x < canvas.width - mySelfState.width) {
                mySelfState.animation.x += 15;
            }
        }

        if (pressedKeyCodes[keys.a]) { //walk left
            gameHub.server.doActions({ action: actionsEnum.walk, direction: directionsEnum.left });

            if (mySelfState.animation.currentAnimation !== actionsEnum.walk) {
                mySelfState.animation.gotoAndPlay(actionsEnum.walk);
            }

            if (mySelfState.animation.scaleX !== -1) {
                mySelfState.animation.scaleX = -1;
                mySelfState.animation.x += mySelfState.width;
            } else if (mySelfState.animation.x > mySelfState.width) {
                mySelfState.animation.x -= 15;
            }
        }

        if (pressedKeyCodes[keys.space]) { //jump
            if (mySelfState.animation.currentAnimation !== actionsEnum.jump) {
                mySelfState.animation.gotoAndPlay(actionsEnum.jump);
                gameHub.server.doActions({ action: actionsEnum.jump });
            }

            mySelfState.animation.y -= 20;
            if (mySelfState.animation.scaleX === 1) mySelfState.animation.x += 10;
            else if (mySelfState.animation.scaleX === -1) mySelfState.animation.x -= 10;

            setTimeout(function () {
                mySelfState.animation.y += 20;
            }, 500);
        }

    } else if (!pressedKeyCodes[keys.space] && !pressedKeyCodes[keys.ctrl]) {
        mySelfState.animation.gotoAndPlay(actionsEnum.stay);
    } else if (pressedKeyCodes[keys.ctrl]) {
        if (mySelfState.animation.currentAnimation !== actionsEnum.strike) { //strike
            mySelfState.animation.gotoAndPlay(actionsEnum.strike);
            gameHub.server.doActions({ action: actionsEnum.strike });

            if (calculateDistanse(mySelfState, enemyState) <= mySelfState.width 
                    && (isFaceToFace(mySelfState, enemyState) || isFaceToBack(mySelfState, enemyState))) {
                gameHub.server.strike();
                enemyState.takeStrike();
            }
        }
    }
}

function enemyTick() {
    if (!enemyActionsQueue.length) {
        enemyState.animation.gotoAndPlay(actionsEnum.stay);
        return;
    }

    var enemyAction = enemyActionsQueue.shift();

    if (enemyAction.action === actionsEnum.walk) {
        if (enemyState.animation.currentAnimation !== actionsEnum.walk) {
            enemyState.animation.gotoAndPlay(actionsEnum.walk);
        }

        if (enemyAction.direction === directionsEnum.left) {
            if (enemyState.animation.scaleX !== -1) {
                enemyState.animation.scaleX = -1;
                enemyState.animation.x += mySelfState.width;
            }

            if (enemyState.animation.x > enemyState.width) {
                enemyState.animation.x -= 15;
            }
        } else {//right
            if (enemyState.animation.scaleX !== 1) {
                enemyState.animation.scaleX = 1;
                enemyState.animation.x -= mySelfState.width;
            }

            if (enemyState.animation.x < canvas.width - enemyState.width) {
                enemyState.animation.x += 15;
            }
        }
    }

    if (enemyAction.action === actionsEnum.strike) {
        if (enemyState.animation.currentAnimation !== actionsEnum.strike) {
            enemyState.animation.gotoAndPlay(actionsEnum.strike);
        }
    }

    if (enemyAction.action === actionsEnum.jump) {
        if (enemyState.animation.currentAnimation !== actionsEnum.jump) {
            enemyState.animation.gotoAndPlay(actionsEnum.jump);
        }

        enemyState.animation.y -= 20;
        if (enemyState.animation.scaleX === 1) enemyState.animation.x += 10;
        else if (enemyState.animation.scaleX === -1) enemyState.animation.x -= 10;

        setTimeout(function () {
            enemyState.animation.y += 20;
        }, 500);
    }
}

//game server event
function sentActions(action) {
    console.log('sentActions', action);
    if (!action) return;

    enemyActionsQueue.push(action)
}

function calculateDistanse(player1State, player2State) {
    return Math.abs(Math.abs(player1State.animation.x - player2State.animation.x) - player1State.width / 3);
}

function isFaceToFace(player1State, player2State) {
    if ((player1State.animation.x + player1State.width) < player2State.animation.x
        && player1State.animation.scaleX === 1 && player2State.animation.scaleX === -1) return true;

    if ((player1State.animation.x + player1State.width) > player2State.animation.x
        && player1State.animation.scaleX === -1 && player2State.animation.scaleX === 1) return true

    return false;
}

function isFaceToBack(player1State, player2State) {

    if(player1State.animation.x > player2State.animation.x && (player1State.animation.x - player1State.width / 1.5) <= player2State.animation.x
        && player1State.animation.scaleX === -1 && player2State.animation.scaleX === -1) return true;

    if(player1State.animation.x < player2State.animation.x && (player1State.animation.x + player1State.width / 1.5) >= player2State.animation.x
        && player1State.animation.scaleX === 1 && player2State.animation.scaleX === 1) return true;

    return false;
}