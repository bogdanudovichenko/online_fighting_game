$(document).ready(start);

function start() {
    window.canvas = document.getElementById('game-canvas');
    window.stage = new createjs.Stage(canvas);
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
                regX: playerNumber === 1 ? 0 : canvas.width,
                regY: height - canvas.height
            },
            animations: {
                stay: [8, 8, "stay"],
                walk: [0, 7, "walk"],
                strike: [30, 38, "stay"],
                jump: [16, 24, "stay"]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(spriteData);

        var animation = new createjs.Sprite(spriteSheet, "jump");
        if (playerNumber === 2) animation.scaleX = -1;
        stage.addChild(animation);
        
        createjs.Ticker.setFPS(8);
        createjs.Ticker.addEventListener("tick", stage);
    };
}