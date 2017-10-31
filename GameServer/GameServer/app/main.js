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
    loadPlayerSprites($('#player1Url').val());
}

function loadPlayerSprites(imageUrl) {
    var img = new Image();
    img.src = imageUrl;

    img.onload = function () {
        var data = {
            images: [img],
            frames: { width: 51 * 2, height: 51 * 2, regY: 102 - canvas.height },
            animations: {
                walk: [0, 7, "walk"]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(data);
        var animation = new createjs.Sprite(spriteSheet, "walk");
        stage.addChild(animation);
        
        createjs.Ticker.setFPS(8);
        createjs.Ticker.addEventListener("tick", stage);
    };
}