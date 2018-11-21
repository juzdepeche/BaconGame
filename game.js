var game = new Phaser.Game(700, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update, backgroundColor: '#f3cca3' });

function preload() {

  //game.load.image('pan', 'assets/pan.png');
  game.load.image('bacon', '/assets/bacon.png');
  game.load.image('sandwich', '/assets/sandwich.png');
  game.load.image('pan', '/assets/pan.png');
  this.game.load.physics("pan_hitbox", "assets/panhitbox.json");
}

var baconHead;
var secondHead;
var wholeBacon = [];
var pan;
var initialized;
var sandwich;
var destroy = false;
function create() {
    game.stage.backgroundColor = "#FDD1C6";

    game.physics.startSystem(Phaser.Physics.P2JS);
    
    game.physics.p2.defaultRestitution = 0.8;
    game.physics.p2.gravity.y = 2000;

    createSandwich();
    createPan();
	createBacon(4, 50, 50);
    initialized = true;

    baconHead.body.collides(sandwich, hitSandwich, this);

}

function restart(){
    destroy=false;
    //deleteOldBacon();
    createBacon(4, 50, 50);
}

function deleteOldBacon(){
    
}

game.flipPan = function(){
    pan.body.rotateLeft(160);
  };
  
  
function hitSandwich(body, bodyB, shapeA, shapeB, equation){
    console.log("hit")
}

function update() {
  
    if(initialized == true){
    
      if(game.input.activePointer.isDown){
        game.flipPan();
        lancer();
      }
      else{
        //pan.body.rotateLeft(0);
        if(pan.body.angle < 30){
          pan.body.rotateLeft(-160);
          pan.goingBack = true;
        }
      }
  
      if(pan.goingBack && pan.body.angle >= 30) {
        console.log("F");
        pan.body.rotateLeft(0);
        pan.goingBack = false;
      }
      console.log(pan.body.angle);

      if(baconHead.y >= game.height-100) restart();
    }

}

function createBacon(length, xAnchor, yAnchor){

	var lastRect;
    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 1000000;   //  The force that holds the rectangles together.

	for (var i = 0; i <= length; i++)
    {
        var x = xAnchor;                    //  All rects are on the same x position
        var y = yAnchor + (i * height);     //  Every new rect is positioned below the last

        if (i % 2 === 0)
        {
            //  Add sprite (and switch frame every 2nd time)
            wholeBacon[i] = game.add.sprite(x, y, 'bacon', 1);
        }   
        else
        {
            wholeBacon[i] = game.add.sprite(x, y, 'bacon', 0);
            lastRect.bringToTop();
        }

        //  Enable physicsbody
        game.physics.p2.enable(wholeBacon[i], false);

        wholeBacon[i].body.collideWorldBounds = true;


        wholeBacon[i].anchor.setTo(0.5, 0.5);

        //  Set custom rectangle
        wholeBacon[i].width = width;
        wholeBacon[i].height = height;
        
        wholeBacon[i].body.setRectangle(width, height);

        wholeBacon[i].body.friction = 0.1;
        if (i === 0)
        {
            wholeBacon[i].body.static = true;
            baconHead = wholeBacon[i];
        }
        else
        {

            //  Anchor the first one created
            wholeBacon[i].body.velocity.x = 400;      //  Give it a push :) just for fun
            wholeBacon[i].body.mass = 50;     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect)
        {
            game.physics.p2.createRevoluteConstraint(wholeBacon[i], [0, -10], lastRect, [0, 10], maxForce);
        }

        if(i === 1){
            secondHead = wholeBacon[i];
        }

        lastRect = wholeBacon[i];

    }
}

function createSandwich(){
	sandwich = game.add.sprite(500, 600, 'sandwich');

	sandwich.width = 200;
	sandwich.height = 120;

	game.physics.p2.enable(sandwich, false);

	sandwich.body.setRectangle(200, 120);

    sandwich.body.static = true;

    sandwich.body.friction = 1;
    
    sandwich.body.onBeginContact.add(hitSandwich, this);
}

function lancer(){
    if(!destroy){
        if (baconHead.body.static) {
            baconHead.body.static = false;
            baconHead.body.mass = 50;
            game.physics.p2.createRevoluteConstraint(baconHead, [0, -10], secondHead, [0, 10], 1000000);
            destroy = true;
        }
    }
}

function createPan(){
	pan = game.add.sprite(110, 600, 'pan');


	game.physics.p2.enable(pan, true);

    //pan.body.collideWorldBounds = false;
    
    pan.body.angle = 40;

    pan.body.static = true;  
    pan.body.friction = 0.1;
    pan.body.data.gravityScale= 0;

    pan.body.clearShapes();

    pan.body.loadPolygon("pan_hitbox", "pan");
    
    

}

function hitPan(){
	pan.angle -= 30;
	pan.body.angle -= 30;
}

function putPressed100msAgoFalse(){
	setTimeout(function(){ 
		pressed100msAgo = false;
		pan.angle += 30;
	pan.body.angle += 30;
	 }, 100);
}