var bg, bgImage, ground, groundImage;
var mario, marioImage, invisibleground, jumpSound, obstacle, obstacle1, obstacle2, obstacle3, obstacle4,obstaclesImage;


var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;

function preload() {
  bgImage = loadImage("bg.png");
  marioImage = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  marioJump = loadAnimation("mario00.png");
  jumpSound = loadSound("jump.mp3");
  groundImage = loadImage("ground2.png");

  obstacleImage = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  bricksImage = loadImage("brick.png");
 obstaclesImage=loadImage('obstacle2.png');
  dieSound = loadSound("die.mp3");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  marioCollided = loadImage("collided.png");
  coinImage = loadImage("coin.jpg");
    checkPointSound=loadSound("checkPoint.mp3");


}

function setup() {
  createCanvas(windowWidth,windowHeight);
  bg = createSprite(width/2,height/3,width,height);
  bg.addImage("bg", bgImage);
  bg.scale = 2.2;

  mario = createSprite(width/7, 420, 20, 20);
  mario.addAnimation("mario", marioImage);
  mario.addAnimation("collided", marioCollided);
  mario.addAnimation('jump',marioJump);
  mario.scale = 1.7;
  //mario.debug=true;
  mario.setCollider("rectangle", 0, 0, 20, mario.height);

  invisibleGround = createSprite(width/2,height-height/10,width,0);
  invisibleGround.visible = false;

  ground = createSprite(width/2,height,width,height);
  ground.addImage("ground", groundImage);
  ground.scale = 1;

  obstacleGroup = new Group();
  bricksGroup = new Group();

  gameOver = createSprite(width/2,height/3, 30, 30);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(width/2,height/2, 30, 30);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;

    
}

function draw() {
  background(220);

  // console.log(mario.y)
  if (gameState === PLAY) {
    bg.velocityX = -8;

    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }
    ground.velocityX = -8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if ((touches.length > 0 || keyDown("space")) && mario.y > 416) {
      mario.changeAnimation('jump',marioJump);
      mario.velocityY = -12;
      jumpSound.play();
      touches = [];

    }
    if(keyWentUp('space')){
       mario.changeAnimation("mario", marioImage);
    }
    if (keyDown("left_arrow")) {
      mario.x = mario.x - 4;
    }
    if (keyDown("right_arrow")) {
      mario.x = mario.x + 4;
    }

    mario.velocityY = mario.velocityY + 0.4;


    spawnObstacles();
    spawnBricks();
    for (var i = 0; i < bricksGroup.length; i++) {
      if (mario.isTouching(bricksGroup.get(i))) {
        coin.velocityY = -8;
        coin.visible = true;
        bricksGroup.get(i).destroy();
        score++;
         if(score>0 && score%20===0)
      {
        checkPointSound.play();
      }
      }
    }
    
     for(var i=0;i<obstacleGroup.length;i++)
     {
        if (mario.isTouching(obstacleGroup.get(i))) {
            obstacle.addImage("obstcales", obstaclesImage);
            gameState = END;
            dieSound.play();
            mario.velocityY = 0;
     
       }
   
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    bg.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    mario.changeAnimation("collided", marioCollided);
    bricksGroup.setVelocityXEach(0);
    // obstacleGroup.destroyEach();
    //bricksGroup.destroyEach();
    gameOver.visible = true;
    restart.visible = true;

    bricksGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);

    if (touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches = [];
    }
  }
  mario.collide(invisibleGround);
  drawSprites();



  fill("white");
  textSize(20);
  text("score :" + score, 450, 50);
}

function spawnObstacles() {
  if (frameCount % 130 === 0) {
    obstacle = createSprite(600, height-height/6.5, 20, 20);
    obstacle.velocityX = -8;

    obstacle.addAnimation("obstcales", obstacleImage);
   
    obstacle.lifetime = 200;
    obstacle.depth = mario.depth;
    mario.depth++;

    obstacleGroup.add(obstacle);
    obstacle.setLifetime = 500;
  }
}

function spawnBricks() {
  if (frameCount % 60 === 0) {
    bricks = createSprite(600, 280, 20, 20);
    bricks.y = Math.round(random(250, 300));
    bricks.velocityX = -8  ;
    bricks.addImage(bricksImage);

    coin = createSprite(100, 250, 10, 10);
    // coin.x=bricks.x;
    coin.y = bricks.y;
    coin.addImage(coinImage);
    coin.scale = 0.081;
    coin.visible = false;
    coin.lifetime = 50;

    bricksGroup.add(bricks);
    bricks.setLifetime = 500;
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstacleGroup.destroyEach();
  bricksGroup.destroyEach();

  mario.changeAnimation("mario", marioImage);


  //console.log(localStorage["HighestScore"]);

  score = 0;

}