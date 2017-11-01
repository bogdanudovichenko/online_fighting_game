$(document).ready(start);

var canvas = null;
var stage = null;

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

enemyActionsQueue = [
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },

    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },

    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },
    { action: 'walk', direction: 'left' },

    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
    { action: 'walk', direction: 'right' },
];

function start() {
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

    mySelfState = player1State;
    enemyState = player2State;
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
    if (isKeyDown) {
        if (pressedKeyCodes[keys.d]) { //move right
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

        if (pressedKeyCodes[keys.a]) { //move left
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

            enemyState.animation.x -= 15;
        } else {
            if (enemyState.animation.scaleX !== 1) {
                enemyState.animation.scaleX = 1;
                enemyState.animation.x -= mySelfState.width;
            }

            enemyState.animation.x += 15;
        }
    }
}