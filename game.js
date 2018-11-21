var game = new Phaser.Game(500, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, backgroundColor: '#f3cca3' });

function preload() {

  //game.load.image('pan', 'assets/pan.png');
  game.load.image('bacon', '/assets/bacon.png');
  game.load.image('sandwich', '/assets/sandwich.png');
  game.load.image('pan', '/assets/pan.png');

}

var baconHead;
var pan;
var pressed100msAgo = false;

function create() {
	game.stage.backgroundColor = "#FDD1C6";

	game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1200;

    createSandwich();
	createBacon(4, 50, 50);
	createPan();
}

game.exampleMethod = function(data){


};


function update() {
	if (game.input.activePointer.isDown)
    {
    	if (!pressed100msAgo) {
      		pressed100msAgo = true;
      		console.log("test");
        	lancer();
        	hitPan();
      		putPressed100msAgoFalse();
      }
    	
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
            newRect = game.add.sprite(x, y, 'bacon', 1);
        }   
        else
        {
            newRect = game.add.sprite(x, y, 'bacon', 0);
            lastRect.bringToTop();
        }

        //  Enable physicsbody
        game.physics.p2.enable(newRect, false);

        newRect.anchor.setTo(0.5, 0.5);

        //  Set custom rectangle
        newRect.width = width;
        newRect.height = height;
        newRect.body.setRectangle(width, height);
        if (i === 0)
        {
            newRect.body.static = true;
            baconHead = newRect;
        }
        else
        {  
            //  Anchor the first one created
            newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
            newRect.body.mass = 50;     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect)
        {
            game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
        }

        lastRect = newRect;

    }
}

function createSandwich(){
	var sarah = game.add.sprite(400, 600, 'sandwich');

	sarah.width = 200;
	sarah.height = 120;

	game.physics.p2.enable(sarah, false);

	sarah.body.setRectangle(200, 120);

	sarah.body.static = true;
}

function lancer(){
	if (baconHead.body.static) {
		baconHead.body.static = false;
	}
}

function createPan(){
	pan = game.add.sprite(110, 600, 'pan');

	pan.width = 260;
	pan.height = 50;

	game.physics.p2.enable(pan, false);

	pan.body.setRectangle(260, 50);

	//pan.body.collideWorldBounds = false;

	pan.angle = 20;
	pan.body.angle = 20;

	pan.body.static = true;

	pan.body.mass = 1000;
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