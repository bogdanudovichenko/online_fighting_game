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
    loadPlayer1Sprites();
    loadPlayer2Sprites();
}

function loadPlayer1Sprites() {
    var img = new Image();
    img.src = $('#player1Url').val();

    img.onload = function () {
        var width = 102;
        var height = width;

        var spriteData = {
            images: [img],
            frames: { width: width, height: height, regY: height - canvas.height },
            animations: {
                stayRight: [8, 8, "stayRight"],
                walkRight: [0, 7, "walkRight"],
                strikeRight: [30, 38, "stayRight"],
                jumpRight: [16, 24, "stayRight"]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(spriteData);

        var animation = new createjs.Sprite(spriteSheet, "walkRight");
        stage.addChild(animation);
        
        createjs.Ticker.setFPS(8);
        createjs.Ticker.addEventListener("tick", stage);
    };
}

function loadPlayer2Sprites(imageUrl) {
    var img = new Image();
    img.src = $('#player1Url').val();

    img.onload = function () {
        var width = 102;
        var height = width;

        var spriteData = {
            images: [img],
            frames: { width: width, height: height, regX: 750, /*regX: width - canvas.width,*/ regY: height - canvas.height },
            animations: {
                stayRight: [8, 8, "stayRight"],
                walkRight: [0, 7, "walkRight"],
                strikeRight: [30, 38, "stayRight"],
                jumpRight: [16, 24, "stayRight"]
            }
        };

        var spriteSheet = new createjs.SpriteSheet(spriteData);
        //console.log(spriteSheet);
        //spriteSheet.scaleX = -spriteSheet.scaleX;

        var animation = new createjs.Sprite(spriteSheet, "walkRight");
        animation.scaleX = -1;
        console.log(animation.scaleX);
        stage.addChild(animation);

        createjs.Ticker.setFPS(8);
        createjs.Ticker.addEventListener("tick", stage);
    };
}