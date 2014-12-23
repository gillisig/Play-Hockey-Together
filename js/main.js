// Example http://examples.phaser.io/_site/view_full.html?d=p2%20physics&f=world+move.js&t=world%20move
//  http://examples.phaser.io/_site/view_full.html?d=arcade%20physics&f=gravity+and+drag.js&t=gravity%20and%20drag
// http://examples.phaser.io/_site/view_full.html?d=input&f=multi+touch.js&t=multi%20touch
/*global Phaser, p2:false */ // JSHint should ignore these variables and not give errors

var game = new Phaser.Game(300, 500, Phaser.AUTO, "", { preload: preload, create: create, update: update, render: render });
function preload() {
  game.load.image("background", "assets/Pong-background.png");
  game.load.image("border", "assets/Pong-border.png");
  game.load.image("ball", "assets/Pong-ball.png");
  game.load.image("pong-red", "assets/Pong-red.png");
  game.load.image("pong-green", "assets/Pong-green.png");
}

var playerGreen;
var playerRed;
var ball;

var mouseBodyFirst;
var mouseBodySecond;
var mouseConstraintFirst;
var mouseConstraintSecond;

function create() {

  // Set background color for the scene
  game.stage.backgroundColor = "#2b3d51";

  // Enable physics
  game.world.setBounds(0, 0, 300, 500);
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;
  var thirdOfWorld = game.world.width / 3;

  // graphics are used for borders
  var graphics = game.add.graphics(0, 0);

  // Top goal
  graphics.lineStyle(8, 0xf61b68, 1);
  graphics.lineTo(thirdOfWorld, 4);
  graphics.lineTo(thirdOfWorld * 2, 4);
  graphics.endFill();

  // Bottom goal
  graphics.lineStyle(8, 0xf61b68, 1);
  graphics.lineTo(thirdOfWorld, game.world.height - 4);
  graphics.lineTo(thirdOfWorld * 2, game.world.height - 4);
  graphics.endFill();
  // Remove default padding
  graphics.boundsPadding = 0;
  // empty sprite so graphics can be used with collision
  var wallLeft = game.add.sprite(0,0);
  var wallRight = game.add.sprite(game.world.width,0);
  var wallTopLeft = game.add.sprite(0,0);
  var wallTopRight = game.add.sprite(0,0);
  var wallBottomLeft = game.add.sprite(0,0);
  var wallBottomRight = game.add.sprite(0,0);
  var goalTop = game.add.sprite(0,0);
  var goalBottom = game.add.sprite(0,0);
  // add the graphics as a child of the wallLeft
  // wallLeft.addChild(graphics);


  // Green player
  playerGreen = game.add.sprite(125, 50, "pong-green");

  // Red player
  playerRed = game.add.sprite(125, game.world.height - 100, "pong-red");

  // ball
  ball = game.add.sprite(142, game.world.height - (game.world.height / 2), "ball");

  // Enable the physics bodies on all the sprites
  // game.physics.p2.enable(playerGreen, false);
  game.physics.p2.enable([playerGreen, playerRed, ball, wallLeft, wallRight, wallTopLeft, wallTopRight, wallBottomLeft, wallBottomRight, goalTop, goalBottom ], /* Debug*/ true );

  playerGreen.body.setCircle(25);
  playerRed.body.setCircle(25);
  playerGreen.body.fixedRotation = true;
  playerRed.body.fixedRotation = true;
  ball.body.setCircle(12.5);

  // Walls will be extra tchick because of a bug causing the ball to pass through them on high velocity
  wallLeft.body.setRectangle(48, game.world.height, -23, game.world.height / 2);
  wallLeft.body.static = true;
  wallRight.body.setRectangle(48, game.world.height, 23, game.world.height / 2);
  wallRight.body.static = true;
  // top and bottom walls
  wallTopLeft.body.setRectangle(thirdOfWorld, 48, thirdOfWorld / 2, -23);
  wallTopLeft.body.static = true;
  wallTopRight.body.setRectangle(thirdOfWorld, 48, thirdOfWorld * 3 - (thirdOfWorld / 2), -23);
  wallTopRight.body.static = true;
  wallBottomLeft.body.setRectangle(thirdOfWorld, 48, thirdOfWorld / 2, game.world.height + 23);
  wallBottomLeft.body.static = true;
  wallBottomRight.body.setRectangle(thirdOfWorld, 48, thirdOfWorld * 3 - (thirdOfWorld / 2), game.world.height + 23);
  wallBottomRight.body.static = true;

  goalTop.body.setRectangle(thirdOfWorld, 48, thirdOfWorld * 2 - (thirdOfWorld / 2), -23);
  goalTop.body.static = true;
  goalBottom.body.setRectangle(thirdOfWorld, 48, thirdOfWorld * 2 - (thirdOfWorld / 2), game.world.height + 23);
  goalBottom.body.static = true;


  //  Create collision group for the players and ball
  var playerCollisionGroup = game.physics.p2.createCollisionGroup();
  // Create a special collisiongroup for the walls
  var ballCollisionGroup = game.physics.p2.createCollisionGroup();

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  // game.physics.p2.updateBoundsCollisionGroup();

  // Add objects to CollisionGroups
  playerGreen.body.setCollisionGroup(playerCollisionGroup);
  playerGreen.body.collides([playerCollisionGroup, ballCollisionGroup]);

  playerRed.body.setCollisionGroup(playerCollisionGroup);
  playerRed.body.collides([playerCollisionGroup, ballCollisionGroup]);

  ball.body.setCollisionGroup(ballCollisionGroup);
  ball.body.collides([playerCollisionGroup, ballCollisionGroup]);

  wallLeft.body.setCollisionGroup(ballCollisionGroup);
  wallLeft.body.collides([playerCollisionGroup, ballCollisionGroup]);
  wallRight.body.setCollisionGroup(ballCollisionGroup);
  wallRight.body.collides([playerCollisionGroup, ballCollisionGroup]);
  wallTopLeft.body.setCollisionGroup(ballCollisionGroup);
  wallTopLeft.body.collides([playerCollisionGroup, ballCollisionGroup]);
  wallTopRight.body.setCollisionGroup(ballCollisionGroup);
  wallTopRight.body.collides([playerCollisionGroup, ballCollisionGroup]);
  wallBottomLeft.body.setCollisionGroup(ballCollisionGroup);
  wallBottomLeft.body.collides([playerCollisionGroup, ballCollisionGroup]);
  wallBottomRight.body.setCollisionGroup(ballCollisionGroup);
  wallBottomRight.body.collides([playerCollisionGroup, ballCollisionGroup]);

  goalTop.body.setCollisionGroup(playerCollisionGroup);
  goalTop.body.collides([playerCollisionGroup]);
  goalBottom.body.setCollisionGroup(playerCollisionGroup);
  goalBottom.body.collides([playerCollisionGroup]);

  // create phyics body for touch input wich we will use for dragging clicked bodies
  mouseBodyFirst = new p2.Body();
  game.physics.p2.world.addBody(mouseBodyFirst);

  mouseBodySecond = new p2.Body();
  game.physics.p2.world.addBody(mouseBodySecond);




  // attach pointer events
  game.input.onDown.add(click, this);
  game.input.onUp.add(release, this);
  game.input.addMoveCallback(move, this);
}

function click(pointer) {

  var bodies = game.physics.p2.hitTest(pointer.position, [ playerGreen.body, playerRed.body ]);

  // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];

  if (bodies.length)
  {
    var clickedBody = bodies[0];

    var localPointInBody = [0, 0];

    // this function takes physicsPos and coverts it to the body's local coordinate system
    clickedBody.toLocalFrame(localPointInBody, physicsPos);

    // use a revoluteContraint to attach mouseBody to the clicked body
    if (pointer.id === 1) {
      mouseConstraintFirst = this.game.physics.p2.createRevoluteConstraint(mouseBodyFirst, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ]);
    }
    else {
      mouseConstraintSecond = this.game.physics.p2.createRevoluteConstraint(mouseBodySecond, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ]);
    }
  }
}

function release(pointer) {
  // remove constraint from object's body
  if (pointer.id === 1) {
    game.physics.p2.removeConstraint(mouseConstraintFirst);
  }
  else {
    game.physics.p2.removeConstraint(mouseConstraintSecond);
  }
}

function move(pointer) {

  // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  if (pointer.id === 1) {
    mouseBodyFirst.position[0] = game.physics.p2.pxmi(pointer.position.x);
    mouseBodyFirst.position[1] = game.physics.p2.pxmi(pointer.position.y);
  }
  else {
    mouseBodySecond.position[0] = game.physics.p2.pxmi(pointer.position.x);
    mouseBodySecond.position[1] = game.physics.p2.pxmi(pointer.position.y);
  }
}

function render() {
  // game.debug.inputInfo(32, 32);

  /*game.debug.pointer(game.input.mousePointer);
  game.debug.pointer(game.input.pointer1);
  game.debug.pointer(game.input.pointer2);
  game.debug.pointer(game.input.pointer3);
  game.debug.pointer(game.input.pointer4);
  game.debug.pointer(game.input.pointer5);
  game.debug.pointer(game.input.pointer6);*/

}

function update() {
  // Limit the speed of Players and ball
  constrainVelocity(ball, 100);
  constrainVelocity(playerGreen, 100);
  constrainVelocity(playerRed, 100);
}

function constrainVelocity(sprite, maxVelocity) {
  var body = sprite.body;
  var angle, currVelocitySqr, vx, vy;

  vx = body.data.velocity[0];
  vy = body.data.velocity[1];

  currVelocitySqr = vx * vx + vy * vy;

  if (currVelocitySqr > maxVelocity * maxVelocity) {
    angle = Math.atan2(vy, vx);

    vx = Math.cos(angle) * maxVelocity;
    vy = Math.sin(angle) * maxVelocity;

    body.data.velocity[0] = vx;
    body.data.velocity[1] = vy;
    console.log('limited speed to: '+maxVelocity);
  }


}