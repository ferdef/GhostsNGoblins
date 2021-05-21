// Avviso!
// Come al solito sono partito con le migliori intenzioni commentando il codice e cercando di fare le cose in modo più pulito possibile.
// Non pensavo però di realizzare un minigame, sono partito cercando si muovere i background e lo sprite dell'omino principale.
// Poi l'ho fatto saltare... Poi ho aggiunto le tombe... poi le scale... poi l'ho fatto sparare le lance... poi gli zombie... poi i corvi... poi la pedana mobile... poi l'intro... poi la fine... poi la pianta carnivore... poi l'attract screen...
// Per questo ad un certo punto il codice può sembrare un po' ingarbugliato (inoltre l'intro e la fine sono realizzate step by step senza aver pianificato ad esempio una coda degli eventi per gestirle)
// Comunque penso che il risultato finale sia gradevole e Phaser è davvero un grandissimo framework!
//
// - Karza -

var ID_DEMO = "gng";
function appReady(){ 
	showLink33();
  Global.showPreloaderApp();
  Global.app.hide();

  if (Model.ie8) {
    Global.hidePreloaderApp();
    alert("I'm sorry, this webapp won't run on Internet Explorer 8,7,6,5,4,3,2,1,0!\nTry it with IE9 or Chrome, Firefox, Safari...");
    return
  }
  
  // Inizializzo Phaser
  initPhaser();
}


var SPEED = 2;
var FALLING_VELOCITY = -500;
var PLAYER_GRAVITY = 1500;

var MAX_LANCE = 3;

var DEBUG_NO_ZOMBIE = false;
var DEBUG_NO_CROW = false;

var ZOMBIE_DELAY = 1500;
var ZOMBIE_DELAY_RND = 2000;
var ZOMBIE_SPEED = 100;
var MAX_ZOMBIE = 3;
var ZOMBIE_RETREAT_AT_DISTANCE = 512;

var PLATFORM_VELOCITY = 100;
var VOLUME = 1;
var VOLUME_MAIN = 0.5;

var SHOW_INTRO= true;
var TINT = 0x99FF99;

//DEBUG_NO_ZOMBIE = true
//DEBUG_NO_CROW = true;
//VOLUME = 0;
//VOLUME_MAIN = 0;
//SHOW_INTRO = false;


var nextZombieDelay = ZOMBIE_DELAY+rnd(ZOMBIE_DELAY_RND);
var game;
var joystick;
var player;
var walkpath;
var graves;
var ladders;
var weapons;
var zombies;
var movingPlatform;
var princess;
var devil;
var blackBg;
var crowes;
var armour;
var gbullets;
var bmpText;
var armourDrop;
var attract;
var fired = new Array();
var enemies = new Array();
var enemiesPositions = new Array();
var sounds = new Object();
var flyers = new Array();
var firers = new Array();
var bullets = new Array();


function initPhaser(){
	// Inizializzo il gioco
	game = new Phaser.Game(512, 448, Phaser.CANVAS, 'gngApp', { preload: preload, create: create, update: mainLoop});
}


function preload(){
	// Carico gli sfondi
	for (var x=0;x<14;x++){
		game.load.image("back"+x, "assets/backgrounds/back"+x+".gif");
	}

  // Carico le tombe
  for (var x=0;x<3;x++){
    game.load.image("grave"+x, "assets/grave"+x+".png");
  }

  // Carico l'attract screen
  game.load.image("attract", "assets/attract.png");

  // Carico la piattaforma
  game.load.image("walkpath", "assets/platform.png");

  // Carico la lancia
  game.load.image("lance", "assets/lance.png");


  // Carico le scintille
  game.load.spritesheet("spark", "assets/spark.png",88,64);

  // Carico lo spritesheet del personaggio
  game.load.spritesheet('arthur', 'assets/arthur.png', 64, 64);

  // Carico lo spritesheet dello zombie
  game.load.spritesheet('zombie', 'assets/zombie.png', 64, 64);

  // Carico lo spritesheet dello zombie (quando nasce)
  game.load.spritesheet('zombieBorn', 'assets/zombieBorn.png', 64, 64);

  // Carico lo spritesheet dell'esplosione (quando viene colpito lo zombie)
  game.load.spritesheet('burst', 'assets/burst.png', 64, 64);

  // Carico lo spritesheet della perdita dell'armatura 
  game.load.spritesheet('armourGone', 'assets/armourGone.png', 128, 128);

  // Carico l'immagine della pedana mobile
  game.load.image('movingplatform', 'assets/movingPlatform.png');

  // Carico l'immagine dell'acqua
  game.load.image('water', 'assets/water.png');

  // Carico l'immagine del vaso
  game.load.image('jar', 'assets/jar.png');

	// Carico l'immagine dell'armatura
	game.load.image('armour', 'assets/armour.png');


  // Carico lo spritesheet della principess
  game.load.spritesheet('princess', 'assets/princess.png', 64, 64);

  // Carico lo spritesheet del diavolo
  game.load.spritesheet('devil', 'assets/devil.png', 96, 128);

  // Carico lo spritesheet del corvo
  game.load.spritesheet('crow', 'assets/crow.png', 32, 32);

  // Carico lo spritesheet della pianta carnivora
  game.load.spritesheet('plant', 'assets/plant.png', 32, 64);

  // Carico lo spritesheet del bullet
  game.load.spritesheet('bullet', 'assets/bullet.png', 32, 32);

  // Carico lo spritesheet della tv
  game.load.atlasJSONHash('tv', 'assets/tv.png', 'assets/tv.txt');


  // Effetti sonori
  game.load.audio('sndBurst', 'assets/sounds/burst.mp3');
  game.load.audio('sndDie', 'assets/sounds/gameover.mp3');
  game.load.audio('sndHitGrave', 'assets/sounds/hitGrave.mp3');
  game.load.audio('sndJumpEnd', 'assets/sounds/jumpEnd.mp3');
  game.load.audio('sndJumpStart', 'assets/sounds/jumpStart.mp3');
  game.load.audio('sndLance', 'assets/sounds/lance.mp3');
  game.load.audio('sndRemoveArmour', 'assets/sounds/removeArmour.mp3');
  game.load.audio('sndZombieBorn', 'assets/sounds/zombieBorn.mp3');
  game.load.audio('sndCrow', 'assets/sounds/crow.mp3');
  game.load.audio('sndCrowDie', 'assets/sounds/crowDie.mp3');
  game.load.audio('sndPutArmour', 'assets/sounds/putArmour.mp3');
  // Musica
  game.load.audio('sndIntro', 'assets/sounds/intro.mp3');
  game.load.audio('sndTheme', 'assets/sounds/gngTheme.mp3');
  game.load.audio('sndEndTheme', 'assets/sounds/gngEndTheme.mp3');

  // Pulsanti per il controllo touch
  game.load.spritesheet('buttonhorizontal', 'assets/buttons/button-horizontal.png',96,64);
  game.load.spritesheet('buttonvertical', 'assets/buttons/button-vertical.png',64,64);
  game.load.spritesheet('buttonhorizontal', 'assets/buttons/button-horizontal.png',96,64);
  game.load.spritesheet('buttondiagonal', 'assets/buttons/button-diagonal.png',64,64);
  game.load.spritesheet('buttonfire', 'assets/buttons/button-round-a.png',96,96);
  game.load.spritesheet('buttonjump', 'assets/buttons/button-round-b.png',96,96);
  game.load.spritesheet('buttonround', 'assets/buttons/button-round.png',96,96);

  // Font
  game.load.bitmapFont('gng', 'assets/gng_font.png', 'assets/gng_font.xml');
 

}

function create(){
  // Mostro l'app
  Global.hidePreloaderApp();
  Global.app.show();

  // Inizializza il mondo e la fisica
  initWorld();


  if (Model.mobile){
    // Creo gli sfondi
    createBackground();
    bmpText = game.add.bitmapText(40,96*2, 'gng',"I'm sorry!\nThis game is not designed\nfor mobile devices.", 16);
    bmpText.fixedToCamera = true;
    return
  }

  // Crea l'area calpestabile
  createWalkArea();

  // Crea le scale
  createLadders();

  // Creo gli sfondi
  createBackground();

  // Crea la pedana mobile
  createMovingPlatform();

  // Crea il background nero
  createIntroBackground();

  // Crea il diavolone
  createDevil();

  // Crea la principessa
  createPrincess();
  
  // Creo l'avatar del player 
  createPlayer();

  // Crea l'acqua
  createWater();

  // Creo le tombe
  createGraves();

  // Creo il gruppo per le piante carnivore
  createPlantPool();

  // Creo il gruppo per gli zombie
  createZombiePool();

  // Crea il gruppo per i bullets
  createBulletsPool();

  // Creo il gruppo per le lance
  createWeaponsPool()

  // Setto la game camera a seguire gli spostamenti del player
  setCamera();

  // Creo il gestore degli input
  handleInput();

  // Creo il gruppo per i corvi
  createCrowPool();


  // Creo il gestore dei suoni
  createSounds();

  // Crea l'attract screen
  createAttract();

}

function initWorld(){
  // Inizializzo la fisica del gioco in modalità arcade
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // Setto la grandezza del quadro di gioco (14 backgrounds da 512)
  //game.world.setBounds(0, 0, 512*14, 448);
  game.world.setBounds(0, 0, 512*8, 448);
}

function createAttract(){
  var pl = joystick.states;
  attract = game.add.sprite(0,0,"attract");
  pl.attractMode = true;
}


function createWalkArea(){
  // Creo il gruppo per l'area calpestabile
  walkpath = game.add.group();
  walkpath.enableBody = true;
  walkpath.immovable = true;

  // Creo le varie aree calpestabili in base allo sfondo
  for (var x=0;x<9;x++){
    if (x == 2){
      createOneWalk(x*512,512)
      createOneWalk(x*512+178,334,226)
    }else if (x == 3){
      createOneWalk(x*512,512)
      createOneWalk(x*512,512,226)
    }else if (x == 4){
      createOneWalk(x*512,512)
      createOneWalk(x*512,190,226)
    }else if (x == 6){
      createOneWalk(x*512,216)
      createOneWalk(x*512+506,12)
    /*}else if (x == 7){      
      createOneWalk(x*512,306)
      createOneWalk(x*512+378,60)
      createOneWalk(x*512+500,12)*/
    }else if (x == 9){      
      createOneWalk(x*512,340)
      createOneWalk(x*512+412,100)
    }else if (x == 10){       
      createOneWalk(x*512,470)     
    }else if (x == 11){       
      createOneWalk(x*512+24,488)     
    }else{
      createOneWalk(x*512,512)
    }
  }
}

function createOneWalk(x,width,y){
  if (y == null){
    y = 386;
  }
  var walk = walkpath.create(x, y, "walkpath");
  walk.body.immovable = true;
  walk.width = width;
  walk.body.checkCollision.down = false;
}


function createLadders(){
  // Creo il gruppo per le scale
  ladders = game.add.group();
  ladders.enableBody = true;
  ladders.immovable = true;

  createOneLadder(512*2+388);
  createOneLadder(512*3+262);
  createOneLadder(512*4+70);

}

function createOneLadder(x){
  var ladder = ladders.create(x, 212, "walkpath");
  ladder.body.immovable = true;
  ladder.width = 46;
  ladder.height = 172;
}

function createBackground(){
  // Creo gli sfondi come semplici sprites
  for (var x=0;x<14;x++){
    game.add.sprite(x*512, 0, 'back'+x).alpha = 1//0.5;
  }
}

function createMovingPlatform(){
  movingPlatform = game.add.sprite(6*512+256, 392, "movingplatform");
  game.physics.arcade.enable(movingPlatform);
  movingPlatform.body.immovable = true;
}

function createWater(){
  game.add.sprite(6*512+202, 416, "water");
}

function createIntroBackground(){
  blackBg = game.add.graphics(0, 0);
  blackBg.beginFill(0x000000, 1);
  blackBg.drawRect(0, 0, game.width, game.height);
  blackBg.alpha = 0;
  blackBg.endFill();
}


function createPlayer(){
  
  // Creo il player
  //player = game.add.sprite(256,  386, "arthur");
  player = game.add.sprite(512*7,  386, "arthur");


  // Setto le animazioni del player
  player.animations.add("idle", [4], 10, false);
  player.animations.add("walk", [0, 1, 2, 3], 14, true);
  player.animations.add("walkjump", [5], 10, false);
  player.animations.add("jump", [7], 10, false);
  player.animations.add("crouch", [6], 10, false);
  player.animations.add("climb", [12,15], 10, true);
  player.animations.add("climbstopleft", [12], 10, false);
  player.animations.add("climbstopright", [15], 10, false);
  player.animations.add("climbontop0", [14], 10, false);
  player.animations.add("climbontop1", [13], 10, false);
  player.animations.add("fireup", [8,9], 10, false);
  player.animations.add("firedown", [10,11], 10, false);

  player.animations.add("idlen", [20], 10, false);
  player.animations.add("walkn", [16, 17, 18, 19], 14, true);
  player.animations.add("walkjumpn", [21], 10, false);
  player.animations.add("jumpn", [23], 10, false);
  player.animations.add("crouchn", [22], 10, false);
  player.animations.add("climbn", [28,31], 10, true);
  player.animations.add("climbstopleftn", [28], 10, false);
  player.animations.add("climbstoprightn", [31], 10, false);
  player.animations.add("climbontop0n", [30], 10, false);
  player.animations.add("climbontop1n", [29], 10, false);
  player.animations.add("fireupn", [24,25], 10, false);
  player.animations.add("firedownn", [26,27], 10, false);
  
  player.animations.add("removearmour", [33,39], 10, true);
  player.animations.add("die", [33,34,33,34,33,34,33,34,35,36,37,37,37,37,37,38], 10, false);

  player.animations.add("won", [40], 10, false);
  player.animations.add("rest", [41], 10, false);

  player.events.onAnimationComplete.add(fireAnimationOver, this);
  

  // Setto il punto di registrazione dello sprite a metà (così posso poi flipparlo bene)
  player.anchor.setTo(.5, 1);

  // Associo il motore fisico al player
  game.physics.arcade.enable(player);

  // Setto il bounding box al player
  player.body.setSize(32,62);
  
  // Setto il peso del player e la sua accelerazione
  setPlayerWeight(true);


  // Forzo il player a stare dentro al quadro di gioco
  player.body.collideWorldBounds = true;  
}

function createDevil(){
  
  devil = game.add.sprite(350,  116, "devil");
  devil.animations.add("hidden", [4], 10, false);
  devil.animations.add("hiddenblink", [4,5], 10, true);
  devil.animations.add("idle", [0,1,2,1], 6, true);
  devil.animations.add("idleidle", [0], 6, false);
  devil.animations.add("attack", [3], 10, false);
  devil.animations.add("kidnap", [6], 10, false);
  if (!SHOW_INTRO){
    devil.alpha = 0;
  }
}

function createPrincess(){
  princess = game.add.sprite(512*8,  384, "princess");
  game.physics.arcade.enable(princess);
  princess.anchor.setTo(.5, 1);
  princess.animations.add("rest1", [0], 10, false);
  princess.animations.add("rest0", [1], 10, false);
  princess.animations.add("idle", [3], 10, false);
  princess.animations.add("run", [3,4], 10, true);
  princess.animations.add("hug", [5], 10, false);
  princess.animations.add("shocked", [2], 2, false);
  princess.animations.play("idle");
}


function fireAnimationOver(sprite){
  var key = sprite.animations.currentAnim.name;
  if (key.indexOf("fire") >= 0){
    joystick.states.stillFiring = false;
  }

}

function setPlayerWeight(lActivate){
  if (lActivate){
    player.body.gravity.y = PLAYER_GRAVITY;
    player.body.acceleration.y = 0;
  }else{
    player.body.gravity.y = 0;
    player.body.acceleration.y = 0;
  }
}

function createWeaponsPool(){
  weapons = game.add.group();
  weapons.enableBody = true;
  
  game.physics.arcade.enable(weapons);
}

function createBulletsPool(){
  gbullets = game.add.group();
  gbullets.enableBody = true;
  
  game.physics.arcade.enable(gbullets);
}


function createGraves(){
  // Creo il gruppo delle tombe
  graves = game.add.group();
  graves.enableBody = true;
  graves.immovable = true;

  // Creo le singole tombe
  createOneGrave(0,64,324,0)
  createOneGrave(0,474,324,1)
  createOneGrave(1,280,324,0)
  createOneGrave(2,-10,324,2)
  createOneGrave(2,442,324,0)
  createOneGrave(2,474,164,1)
  createOneGrave(3,156,164,2)
  createOneGrave(3,348,164,2)
  createOneGrave(3,348,324,0)
  createOneGrave(4,124,324,0)
  createOneGrave(4,444,324,1)
  createOneGrave(5,442,324,2)
}

function createOneGrave(part,x,y,key){
  var grave = graves.create(512*part+x, y, "grave"+key);
  grave.body.immovable = true;
  grave.body.checkCollision.down = false;
  grave.body.setSize(32,36,16,28);
}

function createPlantPool(){
  plants = game.add.group();
  plants.enableBody = true;
  game.physics.arcade.enable(plants);
  createOnePlant(3,76+16,186+16,0,0);
  createOnePlant(4,162,186+16,0,1);
}

function createOnePlant(part,x,y,key,id){
  var plant = plants.create(512*part+x, y, "plant");
  plant.body.immovable = true;
  plant.body.checkCollision.down = false;
  plant.anchor.setTo(0.5,0.5);
  plant.idplant = id;
  plant.isFiring = false;
  plant.hasBegunToFire = false;
  plant.animations.add("idle", [0], 10, false);
  plant.animations.add("fire", [1,2,3,4,3,2,1,0], 14, false);
  plant.play("idle");
  firers.push(plant);
}



function createZombiePool(){
  zombies = game.add.group();
  zombies.enableBody = true;
  game.physics.arcade.enable(zombies);
}

function createCrowPool(){
  crowes = game.add.group();
  crowes.enableBody = true;
  game.physics.arcade.enable(crowes);

  if (DEBUG_NO_CROW){
    return;
  }
  createOneCrow(2,474,332,0);
  createOneCrow(3,188,172,0);
  createOneCrow(4,158,332,0);
  createOneCrow(4,476,332,0);
  createOneCrow(5,476,332,0);
}

function createOneCrow(part,x,y,key){
  var pl = joystick.states;
  var crow = crowes.create(512*part+x, y, "crow");
  crow.body.immovable = true;
  crow.body.checkCollision.down = false;
  crow.anchor.setTo(0.5,0.5);
  crow.idcrow = pl.idcrow;
  crow.hasSeenPlayer = false;
  crow.isFlying = false;
  crow.isDead = false;
  crow.startToFly = false;
  pl.idcrow++;
  crow.startingPosx = 512*part+x; // salva la posizione iniziale
  crow.animations.add("idle", [0], 10, false);
  crow.animations.add("craak", [1,2,3,2], 6, false);
  crow.animations.add("fly", [4,5,6,7], 10, false);
  crow.play("idle");
  crow.events.onAnimationComplete.add(craakAnimationOver, this);
  flyers.push(crow);
}

function craakAnimationOver(sprite){
  var key = sprite.animations.currentAnim.name;
  if (key.indexOf("craak") >= 0){
    sprite.startToFly = true;
  }
}


function setCamera(){
  // Setto la game camera a seguire gli spostamenti del player
  game.camera.follow(player)
}

function handleInput(){
  // Creo il gestore degli input
  if (!Model.mobile){
    joystick = game.input.keyboard.createCursorKeys();

    //joystick.CTRL = game.input.keyboard.addKey(17);
    //joystick.ALT = game.input.keyboard.addKey(18);
    joystick.CTRL = game.input.keyboard.addKey(65);
    joystick.ALT = game.input.keyboard.addKey(83);
  }else{
    //jQuery(".comandi").show();
    joystick = new Object();
    joystick.right = new Object();
    joystick.left = new Object();
    joystick.up = new Object();
    joystick.down = new Object();
    joystick.CTRL = new Object();
    joystick.ALT = new Object();
    joystick.right.isDown = false;
    joystick.left.isDown = false;
    joystick.up.isDown = false;
    joystick.down.isDown = false;
    joystick.CTRL.isDown = false;
    joystick.ALT.isDown = false;
    joystick.right.isUp = false;
    joystick.left.isUp = false;
    joystick.up.isUp = false;
    joystick.down.isUp = false;
    joystick.CTRL.isUp = false;
    joystick.ALT.isUp = false;

    buttonjump = game.add.button(316, 384, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
    buttonjump.events.onInputOver.add(function(){onBtnDown("ALT")});
    buttonjump.events.onInputOut.add(function(){onBtnUp("ALT")});
    buttonjump.events.onInputDown.add(function(){onBtnDown("ALT")});
    buttonjump.events.onInputUp.add(function(){onBtnUp("ALT")});

    buttonfire = game.add.button(416, 384, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function(){onBtnDown("CTRL")});
    buttonfire.events.onInputOut.add(function(){onBtnUp("CTRL")});
    buttonfire.events.onInputDown.add(function(){onBtnDown("CTRL")});
    buttonfire.events.onInputUp.add(function(){onBtnUp("CTRL")});        

    buttonup = game.add.button(96, 320, 'buttonround', null, this, 0, 1, 0, 1);
    buttonup.fixedToCamera = true;
    buttonup.events.onInputOver.add(function(){onBtnDown("up")});
    buttonup.events.onInputOut.add(function(){onBtnUp("up")});
    buttonup.events.onInputDown.add(function(){onBtnDown("up")});
    buttonup.events.onInputUp.add(function(){onBtnUp("up")});

    buttonright = game.add.button(192, 384, 'buttonround', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){onBtnDown("right")});
    buttonright.events.onInputOut.add(function(){onBtnUp("right")});
    buttonright.events.onInputDown.add(function(){onBtnDown("right")});
    buttonright.events.onInputUp.add(function(){onBtnUp("right")});    

    buttonleft = game.add.button(0, 384, 'buttonround', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){onBtnDown("left")});
    buttonleft.events.onInputOut.add(function(){onBtnUp("left")});
    buttonleft.events.onInputDown.add(function(){onBtnDown("left")});
    buttonleft.events.onInputUp.add(function(){onBtnUp("left")});

    buttondown = game.add.button(96, 384, 'buttonround', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){onBtnDown("down")});
    buttondown.events.onInputOut.add(function(){onBtnUp("down")});
    buttondown.events.onInputDown.add(function(){onBtnDown("down")});
    buttondown.events.onInputUp.add(function(){onBtnUp("down")});


  }

  // Creo un oggetto di appoggio che contiene una serie di variabili per valutare quali animazioni selezionare e come spostare l'avatar
  joystick.states = new Object();
  joystick.states.LEFT = "left";  
  joystick.states.RIGHT = "right";
  joystick.states.WEAPON_DELAY = 150;
  joystick.states.disableInteraction = false;  
  joystick.states.isWalking = false;  // sx o dx premuti 
  joystick.states.isJumping = false;  // ALT premuto
  joystick.states.releasedJump = true;
  joystick.states.isIdle = true;      // sx o dx NON premuti
  joystick.states.isCrouched = false; // down premuto
  joystick.states.isFiring = false;   // CTRL premuto
  joystick.states.releasedFire = true;
  joystick.states.isOnTheGround = true; // è sul terreno (o sul terrapieno o su una tomba)
  joystick.states.isLongJump = false;   // il salto è un salto in lungo (e non sul posto)
  joystick.states.isFalling = false;    // sta cadendo
  joystick.states.isFallingBecauseOfJump = false; // sta cadendo in seguito ad un salto (è nella parte discendente del salto)
  joystick.states.lastSpeed = 0;  // velocità precedente
  joystick.states.direction = joystick.states.RIGHT; // direzione
  joystick.states.lastDirection = joystick.states.RIGHT;  // direzione precedente
  joystick.states.isClimbing = false;   // tasto up premuto
  joystick.states.onLadder = false;     // sta scendendo o salendo una scala
  joystick.states.counterEndClimb = 0;  // contatore interno per selezione frame in cima alla scala
  joystick.states.stillFiring = false;  // l'animazione di sparo non è ancora terminata
  joystick.states.lastShot = game.time.now;  // quando ha sparato l'ultima volta una lancia
  joystick.states.idweapon = 0;  // Enum di id per le lance 
  joystick.states.idzombie = 0;  // Enum di id per gli zombie 
  joystick.states.idcrow = 0;  // Enum di id per i corvi
  joystick.states.idbullet = 0;  // Enum di id per i bullet delle piante
  joystick.states.lastZombie = game.time.now;  // quando è stato creato uno zombie l'ultima volta
  joystick.states.postfix = "";  // Controlla quale set di animazione usare
  joystick.states.invincible = false;
  joystick.states.invincibleCount = 0;
  joystick.states.invincibleToggle = false;
  joystick.states.hasArmour = true;
  joystick.states.removingArmour = false;
  joystick.states.disableInput = false;
  joystick.states.isDead = false;
  joystick.states.gameOver = false;
  joystick.states.flagNoSoundExitLadder = true;
  joystick.states.platformDirection = joystick.states.RIGHT;
  joystick.states.inWater = false;
  joystick.states.endingScene = false;
  joystick.states.intro = SHOW_INTRO;
  joystick.states.armourDropped = false;
  joystick.states.attractMode = true;
  joystick.states.soundStarted = false;
  joystick.states.initedStartGame = false;
  joystick.states.gameEnded = false;
}

function onBtnDown(s){
  joystick[s].isDown = true;
  joystick[s].isUp = false;
}
function onBtnUp(s){
  joystick[s].isDown = false;
  joystick[s].isUp = true;
}


function createSounds(){
  sounds.sndLance = game.add.audio('sndLance',VOLUME);
  sounds.sndBurst = game.add.audio('sndBurst',VOLUME);
  sounds.sndDie = game.add.audio('sndDie',VOLUME);
  sounds.sndHitGrave = game.add.audio('sndHitGrave',VOLUME);
  sounds.sndJumpEnd = game.add.audio('sndJumpEnd',VOLUME);
  sounds.sndJumpStart = game.add.audio('sndJumpStart',VOLUME);
  sounds.sndRemoveArmour = game.add.audio('sndRemoveArmour',VOLUME);
  sounds.sndZombieBorn = game.add.audio('sndZombieBorn',VOLUME);
  sounds.sndCrow = game.add.audio('sndCrow',VOLUME);
  sounds.sndCrowDie = game.add.audio('sndCrowDie',VOLUME);
  sounds.sndPutArmour = game.add.audio('sndPutArmour',VOLUME);
  sounds.sndTheme = game.add.audio('sndTheme',VOLUME_MAIN,true);
  sounds.sndIntro = game.add.audio('sndIntro',VOLUME);
  sounds.sndEndTheme = game.add.audio('sndEndTheme',VOLUME);
  sounds.play = function(key){
    this[key].play();
  }
  sounds.stop = function(key){
   this[key].stop();
  }
    
}

function startTheme(){
  sounds.play("sndTheme");
}

function startGame(){
  attract.destroy();
  joystick.states.attractMode = false;
}

function mainLoop(){
  if (Model.mobile){
    return
  }
  if (!SHOW_INTRO){
    startGame();
  }

  if (joystick.states.gameEnded){
    if (game.input.activePointer.isDown){
      location.reload();
    }
  }

  if (joystick.states.attractMode){
    game.physics.arcade.collide(player, walkpath);
    player.x = 100;
    if (game.input.activePointer.isDown){
      if (!joystick.states.initedStartGame){
        joystick.states.initedStartGame = true;
        setTimeout(startGame,100);
      }
    }
  }else{
    if (!joystick.states.soundStarted){
      joystick.states.soundStarted = true;
      if (SHOW_INTRO){
        sounds.play("sndIntro");
        sounds.sndIntro.onStop.add(startTheme);
      }else{
        startTheme();
      }
    }

    // Controlla le collisioni con l'area calpestabile, con le tombe e con le scale
    game.physics.arcade.collide(player, walkpath);
    if (!joystick.states.intro){
      game.physics.arcade.collide(player, graves);
    }
    game.physics.arcade.collide(player, movingPlatform);

    if (princess != null){
      game.physics.arcade.collide(princess, walkpath);
    }

    if (joystick.states.intro){
      // Mostra l'intro
      showIntro();
    }else{

      // Controllo gli input
    	checkInput();

      // Muove la piattaforma
      movePlatform();

      // Muove il player in base all'input
      movePlayer();

      // Muove la principessa
      movePrincess();

      // Muove le eventuali lance
      moveWeapons();

      // Muove gli eventuali bullets
      moveBullets();

      // Muove gli eventuali zombie
      moveZombie();

      // Muove i corvi
      moveCrowes();

      // Controlla se una pianta deve sparare
      checkFirePlants();

      // Controlla se può creare uno zombie nemico 
      checkZombieCreation();

      // Controlla nuovamente le collisioni con le tombe
      game.physics.arcade.collide(player, graves);
    }
  }

  //debugShowSpriteBounds();
}


function checkInput(){
  var pl = joystick.states;
  if (pl.disableInput){
    return
  }

  // Controllo se cammina (in quale direzione) o se è fermo
  if (joystick.left.isDown){
    // Sx
    pl.isIdle = false;
    pl.isWalking = true;
    pl.isLongJump = true;
    if (!pl.onLadder){
      // non permette il cambio di direzione quando sta salendo una scala
      pl.lastDirection = pl.direction;
      pl.direction = pl.LEFT;
    }
  }else if (joystick.right.isDown){
    // Dx
    pl.isIdle = false;
    pl.isWalking = true;
    pl.isLongJump = true;
    if (!pl.onLadder){
      // non permette il cambio di direzione quando sta salendo una scala
      pl.lastDirection = pl.direction;
      pl.direction = pl.RIGHT;
    }
  }else{
    // Fermo
    pl.isWalking = false;
    pl.isLongJump = false;
    pl.isIdle = true;
  }

  // Controllo se vuole salire
  if (joystick.up.isDown){
    pl.isClimbing = true; 
  }else{
    pl.isClimbing = false; 
  }

  // Controllo se è accucciato
  if (joystick.down.isDown){
    pl.isCrouched = true;
  }else{
    pl.isCrouched = false;
  }

  // Controllo se sta saltando
  if (pl.releasedJump){
    if (joystick.ALT.isDown){
      pl.isJumping = true;
    }else{
      pl.isJumping = false;
    }
  }else{
    pl.isJumping = false;
  }

  // Controllo se sta sparando
  if (pl.releasedFire){
    if (joystick.CTRL.isDown){
      if (!pl.onLadder){
        pl.isFiring = true;
        pl.stillFiring = true;
        fireLance();
      }
    }else{
      pl.isFiring = false;
    }
  }else{
    pl.isFiring = false;
  }

  // Controlla se è stato rilasciato il pulsante di salto
  pl.releasedJump = joystick.ALT.isUp;

  // Controlla se è stato rilasciato il pulsante di fuoco
  pl.releasedFire = joystick.CTRL.isUp;

}

function movePlatform(){
  if (joystick.states.disableInteraction){
    movingPlatform.body.velocity.x = 0;
    return
  }
  var pl = joystick.states;
  if (movingPlatform.body.x >= 3510){
    pl.platformDirection = joystick.states.LEFT;
  }else if (movingPlatform.body.x <= 3290){
    pl.platformDirection = joystick.states.RIGHT;
  }

  if (pl.platformDirection == joystick.states.LEFT){
    movingPlatform.body.velocity.x = -PLATFORM_VELOCITY;
  }else{
    movingPlatform.body.velocity.x = PLATFORM_VELOCITY;
  }
}

function movePlayer(){
  var pl = joystick.states;
  //trace(player.body.y);
  if (!pl.hasArmour){
    //trace(player.body.x+ " "+player.body.y);
    if ((player.body.x >= 2870) && (player.body.x <= 2890)){
      if (player.body.y < 324){
        if (!pl.armourDropped){
          pl.armourDropped = true;
          dropArmour();
        }
      }
    }
  }
  if (game.physics.arcade.overlap(player, armourDrop)){
    armourDrop.destroy();
    pl.hasArmour = true;
    pl.postfix = "";
    sounds.play("sndPutArmour")
  }


  if (player.body.x >= 3810){
    pl.disableInput = true;
    player.body.x += SPEED;
    if (player.body.touching.down){
      if (!pl.forcedWalkInEnd){
        pl.forcedWalkInEnd = true;
        player.play("walk"+pl.postfix);
      }
    }
    if (player.body.x >= 3890){
      SPEED = 0;
      //player.animations.play("won");
      if (!pl.endingScene){
        player.animations.play("idle"+pl.postfix);
        pl.endingScene = true;
        //endingScene();
      }
    }
    return
  }
  if (pl.endingScene){
    return;
  }

  // Controllo sulla morte perchè cade in acqua
  if (player.y > 392){
    pl.removingArmour = true;
    pl.isDead = true;
    pl.inWater = true;
  }
  
  // Controlli per il fix della movingPlatform (automaticamente mette il player sulla "riva")
  if (pl.isOnTheGround){
    if (player.y == 392){
      if (player.body.x <= 3286){
        player.y = 386;
      }else if (player.body.x >= 3550){
        player.y = 386;
      }
    }
  }

  if (pl.removingArmour){
    if (!pl.isDead){
      if (pl.direction == joystick.states.RIGHT){
        player.body.x += -SPEED;
      }else{
        player.body.x += SPEED;
      }

      if (player.body.touching.down){
        pl.removingArmour = false;
        pl.hasArmour = false;
        pl.disableInput = false;
        pl.postfix = "n";
        setTimeout(disableInvincibility,3000);
      }
    }else{
      if (pl.inWater){
        if (!pl.gameOver){
          pl.gameOver = true;
          sounds.stop("sndTheme");
          sounds.play("sndDie");
          endGame();
        }
        return
      }
      if (player.body.touching.down){
        if (!pl.gameOver){
          pl.gameOver = true;
          setTimeout(endGame,1000);
        }
      }else{
        if (pl.direction == joystick.states.RIGHT){
          player.body.x += -SPEED;
        }else{
          player.body.x += SPEED;
        }
      }
    }
    return
  }else{
    if (pl.invincible){
      pl.invincibleCount++
      if (pl.invincibleCount == 3){
        pl.invincibleCount = 0;
        pl.invincibleToggle = !pl.invincibleToggle;
        if (pl.invincibleToggle){
          player.alpha = 0;
        }else{
          player.alpha = 1;
        }
      }
    }
  }

  // Controlla se è per aria (se sta saltando)
  if (player.body.touching.down){
    if (!pl.isOnTheGround){
      if (!pl.flagNoSoundExitLadder){
        sounds.play("sndJumpEnd");
      }else{
        pl.flagNoSoundExitLadder = false;
      }
    }
    pl.isOnTheGround = true;
    pl.isFallingBecauseOfJump = false;

  }else{
    pl.isOnTheGround = false;
  }

  // Controlla se overlappa con una scala (non lo a come gruppo perchè così ottengo subito l'elemento con cui collide)
  var ladder
  if (!pl.onLadder){
    // Questo controllo viene fatto solo se non è già su una scala
    if (pl.isOnTheGround){
      if (pl.isClimbing){
        // Controlla se sta salendo
        for (var x=0;x<ladders.total;x++){
          var ladder = ladders.getAt(x);
          if (ladder.y < player.body.y){
            if (game.physics.arcade.overlap(player, ladder)){
              // aggiusta la posizione dello sprite in base alla scala
              pl.counterEndClimb = 0;
              pl.onLadder = true;
              player.body.x = ladder.x+6;
              // Gli toglie il peso in modo che non cada
              setPlayerWeight(false);
              break;
            }
          }
        }
      }else if (pl.isCrouched){
        // Controlla se sta scendendo
        for (var x=0;x<ladders.total;x++){
          var ladder = ladders.getAt(x);
          if (ladder.y > player.body.y){
            if (game.physics.arcade.overlap(player, ladder)){
              // aggiusta la posizione dello sprite in base alla scala
              pl.counterEndClimb = 24;
              pl.onLadder = true;
              player.body.x = ladder.x+6;
              player.body.y = 190;
              // Gli toglie il peso in modo che non cada
              setPlayerWeight(false);
              break;
            }
          }
        }
      }
    }
  }

  if (!pl.onLadder){
    // Questi controlli vengono fatti solo se non è su una scala (per la scala cambia la gestione, vedi sotto)
    if (pl.isWalking){
      // Sta camminando
      if (pl.direction == joystick.states.LEFT){
        // a sx
        if (pl.isOnTheGround){
          // sta toccando qualcosa in basso (erba o tombe)
          if (!pl.isCrouched){
            if (!pl.stillFiring){
              player.animations.play("walk"+pl.postfix);
              pl.lastSpeed = -SPEED;
              player.body.x += -SPEED;
            }
          }
        }else{
          // è in aria
          player.body.x += pl.lastSpeed;
        }
        // Lo flippa
        if (pl.lastDirection != pl.direction){
          player.scale.x = -1;
        }
      }else{
        // a dx
        if (pl.isOnTheGround){
          // sta toccando qualcosa in basso (erba o tombe)
          if (!pl.isCrouched){
            if (!pl.stillFiring){
              player.animations.play("walk"+pl.postfix);
              pl.lastSpeed = SPEED;
              player.body.x += SPEED;
            }
          }
        }else{
          // è in aria
          player.body.x += pl.lastSpeed;
        }
        // Lo flippa
        if (pl.lastDirection != pl.direction){
          player.scale.x = 1;
        }
      }


    }

    if (pl.isIdle){
      // E' fermo
      if (pl.isOnTheGround){
        pl.lastSpeed = 0;
        if (!pl.stillFiring){
          player.animations.play("idle"+pl.postfix);
        }
      }else{
        player.body.x += pl.lastSpeed;
      }
    }

    // sta saltando (o da fermo o mentre cammina)
    if (pl.isJumping && player.body.touching.down){
      pl.isOnTheGround = false;
      pl.isFallingBecauseOfJump = true;
      if (!pl.stillFiring){
        if (pl.isIdle){
          // fermo
          player.animations.play("jump"+pl.postfix);
        }else{
          // cammina
          player.animations.play("walkjump"+pl.postfix);
        }
        sounds.play("sndJumpStart");
      }
      player.body.velocity.y = FALLING_VELOCITY;
    }

    // Sta cadendo (o per via di un salto o perchè sta cadendo dalla tomba o dal terrapieno etc etc)
    if (player.body.prev.y < player.body.y){
      pl.isFalling = true;
      if (!pl.isFallingBecauseOfJump){
        // Se sta cadendo da un terrapieno viene settato l'idle
        if (!pl.stillFiring){
          player.animations.play("idle"+pl.postfix);
        }
        player.body.x += -pl.lastSpeed;
      }
    }else{
      // E' atterrato
      pl.isFalling = false;
    }

    if (pl.isCrouched){
      // Si sta chinando
      if (!pl.isFalling){
        if (pl.isOnTheGround){
          if (!pl.stillFiring){
            player.animations.play("crouch"+pl.postfix);
          }
        }
      }
    }

    if (pl.isFiring){
      if (pl.isCrouched){
        player.animations.play("firedown"+pl.postfix);
      }else{
        player.animations.play("fireup"+pl.postfix);
      }
    }


  }else{
    // Si trova sulla scala
    if (player.body.y < 192){
      // ha raggiunto la cima della scala
      // Incrementa o decrementa un contatore speciale per mostrare gli step per quando lascia la scala o inizia a scendere
      if (pl.isClimbing){
        // Salendo
        pl.counterEndClimb++;
      }
      if (pl.isCrouched){
        // Scendendo
        pl.counterEndClimb--;
      }

      if (pl.counterEndClimb > 24){
        // Lo toglie dalla scala e gli risetta il peso
        player.body.y = 164;
        pl.onLadder = false;
        setPlayerWeight(true);
        pl.flagNoSoundExitLadder = true;
      }else if (pl.counterEndClimb > 12){
        // Setta il primo frame custom dell'animazione
        player.animations.play("climbontop0"+pl.postfix);
      }else if (pl.counterEndClimb >= 0){
        // Setta il secondo frame custom dell'animazione
        player.animations.play("climbontop1"+pl.postfix);
      }else{
        // lo toglie dalla cima della scala
        player.body.y = 194;
      }
    }else if (player.body.y > 324){
      // E' al fondo della scala
      player.body.y = 324;
      pl.onLadder = false;
      setPlayerWeight(true);
    }else{
      // E' sulla scala
      if (pl.isClimbing){
        // Sale
        player.animations.play("climb"+pl.postfix);
        player.body.y += -SPEED;
      }else if (pl.isCrouched){
        // Scende
        player.animations.play("climb"+pl.postfix);
        player.body.y += SPEED;
      }else{
        // E' fermo (prende l'ultimo frame dell'animazione che ha usato mentre saliva e setta l'idle di conseguenza)
        var anim = player.animations.getAnimation("climb");
        if ((anim.currentFrame.index == 12) || (anim.currentFrame.index == 28)){
          player.animations.play("climbstopleft"+pl.postfix);
        }else{
          player.animations.play("climbstopright"+pl.postfix);
        }
      }
    }
  }
}

function dropArmour(){
  jar = game.add.sprite(512*5+500,300,"jar");
  s = game.add.tween(jar)
  s.to({ y: 354 }, 250, null)
  s.onComplete.add(this.showArmour, this)
  s.start();
}
function showArmour(){
  jar.destroy();
  armourDrop = game.add.sprite(512*5+500,354,"armour");
  game.physics.arcade.enable(armourDrop);
}

function disableInvincibility(){
  var pl = joystick.states;
  pl.invincible = false;
  player.alpha = 1;
}

function fireLance(){
  // Controlla se può creare una nuova lancia
  var pl = joystick.states;
  if (fired.length < MAX_LANCE){
    // Ne crea una solo se il numero di lance ancora attive è inferiore a 3...
    if (game.time.now - pl.WEAPON_DELAY > pl.lastShot ){
      // ...e solo se è passato un certo tempo dall'ultima che ha creato
      pl.lastShot = game.time.now;
      fired.push(createLance());
    }
  }
}

function createLance(){
  // Crea la nuova lancia
  var pl = joystick.states;
  var spanx = 0;
  // In base alla direzione del player
  if (pl.direction == joystick.states.RIGHT){
    spanx = 40;
  }
  // e alla sua altezza
  var spany = 28;
  if (pl.isCrouched){
    spany += 24;
  }

  var lance = weapons.create(player.body.x+spanx, player.body.y+spany, "lance");
  lance.anchor.setTo(.5, 1);
  lance.startingPosx = player.body.x; // salva la posizione iniziale
  lance.direction = pl.direction; // salva la direzione
  lance.idweapon = pl.idweapon; // gli assegna un id
  lance.hasHit = false; // flag che servirà per effettuare un delay prima di distruggere
  lance.canHit = false; // flag per eludere un bug sulla creazione dello sprite

  // Controlla la direzione e setta la velocità
  if (lance.direction == joystick.states.RIGHT){ 
    lance.body.velocity.x = 500;
  }else{
    lance.scale.x = -1;
    lance.body.velocity.x = -500;
  }

  pl.idweapon++;

  //
  sounds.play("sndLance");

  return lance
}

function moveBullets(){
  var pl = joystick.states;
  if (joystick.states.disableInteraction){
  /*  for (var x=0;x<bullets.length;x++){
      var bullet = bullets[x];  
      bullet.body.velocity.x = 0;
      bullet.body.velocity.y = 0;
      bullet.animations.stop();
    }*/
    return
  }
  if (pl.isDead){
    /*for (var x=0;x<bullets.length;x++){
      var bullet = bullets[x];  
      bullet.body.velocity.x = 0;
      bullet.body.velocity.y = 0;
      bullet.animations.stop();
    }*/
    return;
  }
  if (pl.invincible){
    return;
  }
  for (var x=0;x<bullets.length;x++){
    var bullet = bullets[x];
    if (!bullet.hasHit){
      if (game.physics.arcade.overlap(bullet, player)){
        bullet.hasHit = true;
        hitPlayer();
      }
    }
    var lKilled = false;
    if ((bullet.y > 500) || (bullet.y<0)){
      killBullet(bullet);
      lKilled = true;
    }
    if (getDistance(player.x,bullet.x) > 512){
      if (!lKilled){
        killBullet(bullet);
      }
    }
  }
}

function killBullet(bullet){
  bullet.destroy();
  var a = new Array();
  for (var x=0;x<bullets.length;x++){
    if (bullets[x].bullets != bullet.idbullet){
      a.push(bullets[x]);
    }
  }
  bullets = a;
}


function moveWeapons(){
  // Sposta le lance
  for (var x=0;x<fired.length;x++){
    var lance = fired[x];
    // Considera solo quelle che non hanno già colpito un bersaglio
    if (!lance.hasHit){

      // Controlla se la lancia si allontana troppo e in quel caso la killa
      if (getDistance(lance.startingPosx,lance.body.x) > 260){
        lance.canHit = false;
        killLance(lance);
      }
      // Controlla le collisioni
      if (lance.canHit){
        // Controlla le collisioni con le tombe
        for (var y=0;y<graves.total;y++){      
          var grave = graves.getAt(y);
          if (game.physics.arcade.overlap(lance, grave)){
            lance.body.velocity = 0;
            // Posiziona la lancia nel punto di hit della tomba
            if (lance.direction == joystick.states.LEFT){        
              lance.body.x = grave.body.x+20;
            }else{
              lance.body.x = grave.body.x-40;
            }
            // Mostra la scintilla
            showSpark(lance,grave);
            lance.hasHit = true;
            // Distrugge la lancia dopo un minimo ritardo
            //setTimeout(killLance,20,lance)
            setTimeout(jQuery.proxy(killLance,null,lance),20);
            break;
          }
        }
        // Controlla le collisioni con gli zombie
        for (var y=0;y<zombies.total;y++){      
          var zombie = zombies.getAt(y);
          if (game.physics.arcade.overlap(lance, zombie)){
            lance.body.velocity = 0;
            // Distrugge la lancia
            killLance(lance);
            // Mostra l'esplosione
            showBurstZombie(lance,zombie);
          }
        }
        // Controlla le collisioni con i corvi
        for (var y=0;y<crowes.total;y++){      
          var crow = crowes.getAt(y);
          if (game.physics.arcade.overlap(lance, crow)){
            lance.body.velocity = 0;
            // Distrugge la lancia
            killLance(lance);
            // Mostra l'esplosione
            showBurstCrow(lance,crow);
          }
        }
        // Controlla le collisioni con i le piante
        for (var y=0;y<plants.total;y++){      
          var plant = plants.getAt(y);
          if (game.physics.arcade.overlap(lance, plant)){
            lance.body.velocity = 0;
            // Distrugge la lancia
            killLance(lance);
            // Mostra l'esplosione
            showBurstPlant(lance,plant);
          }
        }
      }else{
        lance.canHit = true;
      }
    }
    
  }
}

function moveZombie(){

  var pl = joystick.states;
  // Controlla che gli zombie non siano troppo distanti dal player e che stiano nel terrapieno
  for (var x=0;x<enemies.length;x++){
    var zombie = enemies[x];

    if (joystick.states.disableInteraction){
      zombie.body.velocity = 0;
      zombie.animations.stop();

    }else{
      
      if (getDistance(zombie.x,player.x) > ZOMBIE_RETREAT_AT_DISTANCE){
        // troppo distanti player e zombie
        retreatZombie(zombie);
      }

      if (getDistance(zombie.startingPosx,zombie.body.x) > 512){  
        // Ha percorso troppo spazio
        retreatZombie(zombie);
      }

      // Troppo avanti
      if (zombie.x >= 3280){
        retreatZombie(zombie); 
      }
      // e che se la loro y è sul terrapieno (226) si ritirino se non sono nell'intervallo 1226-2224
      if (zombie.y <= 226){
        if (!isOnRampart(zombie.x)){
          // stanno per lasciare il terrapieno
          retreatZombie(zombie);   
        }
      }
      // Controlla la collisione col player
      if (!pl.invincible){
        if (game.physics.arcade.overlap(player, zombie)){
          hitPlayer();
        }
      }
    }
  }
}

function hitPlayer(){
  var pl = joystick.states;
  if (pl.onLadder){
    pl.onLadder = false;
    setPlayerWeight(true);
  }
  if (pl.hasArmour){
    // Collisione (con l'armatura)
    removeArmour();
  }else{
    // Collisione (muore)
    die();
  }
}

function moveCrowes(){
  var pl = joystick.states;

  for (var x=0;x<flyers.length;x++){
    var crow = flyers[x];
    if (joystick.states.disableInteraction){
      crow.body.velocity = 0;
      crow.animations.stop();
      game.tweens.removeAll()
      return
    }
    //return

    // Controlla quando e se atttivare il corvo
    if (!crow.hasSeenPlayer){
      if (getDistance(crow.x,player.x) < 240){
        crow.hasSeenPlayer = true;
        crow.play("craak");
        sounds.play("sndCrow");
      }
    }
    // il corvo ha iniziato a volare
    if (crow.startToFly){
      if (getDistance(crow.x,player.x) > 512){
        killCrow(crow);
      }else{
        // attiva l'animazione di volo
        crow.play("fly");
        crow.body.velocity.x = -100;

        if (!crow.isFlying){
          crow.startingPosY = crow.y;  
          crow.isFlying = true;
          s = game.add.tween(crow)
          s.to({ y: crow.startingPosY-16 }, 150, null)
          s.onComplete.add(this.crowGoDown, this,crow)
          s.start();
        }
        if (!pl.invincible){
          if (game.physics.arcade.overlap(player, crow)){
            hitPlayer();
          }
        }
      }
    }
  }
}

function crowGoDown(crow){
  if (!crow.isDead){
    s = game.add.tween(crow)
    s.to({ y: crow.startingPosY+16 }, 300, null)
    s.onComplete.add(this.crowGoUp, this,crow)
    s.start();
  }
}
function crowGoUp(crow){
  if (!crow.isDead){
    s = game.add.tween(crow)
    s.to({ y: crow.startingPosY-16 }, 300, null)
    s.onComplete.add(this.crowGoDown, this,crow)
    s.start();
  }
}


function checkFirePlants(){
  var pl = joystick.states;
  //trace(firers.length)
  for (var x=0;x<firers.length;x++){
    var plant = firers[x];

    if (joystick.states.disableInteraction){
      plant.animations.stop();
    }else{
      // Controlla quando e se sparare
      if (getDistance(plant.x,player.x) < 256+64){
        plant.isFiring = true;
        if (!plant.hasBegunToFire){
          plant.hasBegunToFire = true;
          plant.play("fire");
          bullets.push(createBullet(plant));
          setTimeout(jQuery.proxy(nextBullet,null,plant),2000);
        }
      }
    }
    // Controlla se tocca il player
    if (!pl.invincible){
      if (game.physics.arcade.overlap(player, plant)){
        hitPlayer();
      }
    }

  }
}

function nextBullet(plant){
  plant.hasBegunToFire = false;
}


function createBullet(plant){
  // Crea un nuovo bullet
  var pl = joystick.states;
  var bullet = gbullets.create(plant.x, plant.y, "bullet");
 
  bullet.anchor.setTo(.5, .5);
  bullet.body.setSize(16,16);
  bullet.startingPosx = plant.x; // salva la posizione iniziale
  bullet.startingPosy = plant.y; // salva la posizione iniziale
  bullet.idbullet = pl.idbullet; // gli assegna un id
  bullet.hasHit = false; // flag che servirà per effettuare un delay prima di distruggere
  bullet.animations.add("fire", [0,1,2,3], 14, true);
  bullet.play("fire");
  // Sceglie l'angolo in base al quadrante in cui si trova il player
  var angle = getAngleFromPosition(player,plant)*Math.PI/180;

  //speed_x = speed_length * cos (speed_angle); 
  //speed_y = speed_length * sin (speed_angle);
  var base_speed = 300;
  //var angle = 158 * Math.PI / 180;
  var speed_x = base_speed * Math.cos(angle); 
  var speed_y = base_speed * Math.sin(angle);
  bullet.body.velocity.x = speed_x;
  bullet.body.velocity.y = speed_y;


/*  s = game.add.tween(bullet)
  s.to({ x: player.x,y: player.y }, 1000, null)
  //s.onComplete.add(this.endStep10, this)
  s.start();*/

  
  pl.idbullet++;

  return bullet;

}
function getAngleFromPosition(player,plant){
  var deltaY = plant.y - player.y+26;
  var deltaX = plant.x - player.x
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI+270;
  var n = Math.floor(angle/360);
  angle = angle - 360*n;
  
  var deg = 0;
  var delta = [0,23,45,68,90,113,135,158,180,203,225,248,270,293,315,338,360];
  for (var x=0;x<delta.length-1;x++){
    if ((angle >= delta[x]) && (angle < delta[x+1])){
      var dist0 = angle - delta[x]
      var dist1 = delta[x+1] -angle;
      if (dist0>dist1){
        deg = delta[x+1]
      }else{
        deg = delta[x]
      }
      break;
    }
  }
  deg = deg -90;
  return deg;
}

function removeArmour(){
  var pl = joystick.states;
  pl.stillFiring = false;
  pl.invincible = true;
  pl.removingArmour = true;
  pl.disableInput = true;
  player.body.velocity.y = FALLING_VELOCITY;
  player.animations.play("removearmour");
  showArmourGone();
  sounds.play("sndRemoveArmour");

}

function showArmourGone(){
  var pl = joystick.states;
  var span = 0;
  if (pl.direction == joystick.states.LEFT){
    span = 16;
  }
  var armourGone = game.add.sprite(player.x+span,  player.y-32, "armourGone");
  armourGone.anchor.setTo(0.5,0.5);
  var anim = armourGone.animations.add("armourGone", [0,1,2,3,3], 14, false);
  anim.play("armourGone");
  anim.killOnComplete = true;
}

function die(){
  var pl = joystick.states;
  pl.invincible = true;
  pl.removingArmour = true;
  pl.disableInput = true;
  pl.isDead = true;
  player.body.velocity.y = FALLING_VELOCITY;
  player.animations.play("die");
  sounds.stop("sndTheme");
  sounds.play("sndDie");
}

function isOnRampart(x){
  if ((x >= 1220) && (x <= 2224)){
    return true;
  }
  return false;
}

function killLance(lance){
  // Distrugge la lancia liberando il posto per una nuova
  lance.destroy();
  var a = new Array();
  for (var x=0;x<fired.length;x++){
    if (fired[x].idweapon != lance.idweapon){
      a.push(fired[x]);
    }
  }
  fired = a;
}

function showSpark(lance,grave){
  // Mostra le scintille
  var pl = joystick.states;
  var span = -12;
  var flip = false;
  if (lance.direction == joystick.states.LEFT){
    span = 64+12;
    flip = true;
  }
  var spark = game.add.sprite(grave.x+span, grave.y, "spark");

  if (flip){
    spark.scale.x = -1;
  }

  var anim = spark.animations.add("spark", [0,1,2], 14, false);
  anim.killOnComplete = true;
  spark.animations.play("spark")

  sounds.play("sndHitGrave");
}

function checkZombieCreation(){
  if (DEBUG_NO_ZOMBIE){
    return
  }
  //return
  // Nessuna interazione (quando il giocatore muore)
  if (joystick.states.disableInteraction){
    return true;
  }
  if (joystick.states.endingScene){
    return true;
  }

  if (player.x > 512*5+356){
    return;
  }
  // Controlla se può creare lo zombie
  var pl = joystick.states;
  // Non più di un tot sullo schermo
  if (enemies.length < MAX_ZOMBIE){
    // è passato un po' di tempo
    if (game.time.now - nextZombieDelay > pl.lastZombie ){
      pl.lastZombie = game.time.now;
      nextZombieDelay = ZOMBIE_DELAY+rnd(ZOMBIE_DELAY_RND);
      var pos = choseNextZombiePosition();
      createZombie(pos);
    }
  }
}

function choseNextZombiePosition(){
  var pl = joystick.states;
  // Sceglie una distanza casuale dal giocatore
  var posx = 0;
  if (enemiesPositions.length == 0){
    enemiesPositions = [-200,-100,100,200,300,400];
    enemiesPositions = shuffle(enemiesPositions);
  }
  posx = player.x+enemiesPositions.shift();
  posy = 386;

  var lRamparty = false;

  if (!pl.onLadder){
    // Se non è sulla scala
    if ((player.y > 226) && (player.y <= 386)){
      // non si trova sul terrapieno
      lRamparty = false;
    }
    if (player.y <= 226){
      // si trova sul terrapieno
      lRamparty = true;
    }
  }else{
    // è quasi alla fine della scala
    if (player.y <= 290){
      lRamparty = true;
    }
  }

  if (lRamparty){
    posy = 226;
    // Controlla che la x non sia fuori dal terrapieno
    if (!isOnRampart(posx)){
      return choseNextZombiePosition();
    }
  }
  return {x:posx,y:posy};
}

function createZombie(pos){
  // Crea un'animazione di entrata per lo zombie (che spunta da sottoterra)
  var zombie = game.add.sprite(pos.x,  pos.y, "zombieBorn");
  zombie.anchor.setTo(.5, 1);
  var anim = zombie.animations.add("zombieBorn", [0,0,1,1,2,2,3,4,5,6], 10, false);
  anim.play("zombieBorn");
  if (pos.x < player.x){
    zombie.scale.x = -1;
    zombie.direction = joystick.states.LEFT;
  }else{
    zombie.direction = joystick.states.RIGHT;
  }
  zombie.events.onAnimationComplete.add(zombieBornOver, this);

  sounds.play("sndZombieBorn");
}

function zombieBornOver(zombieBorn){
  // Lo zombie è "nato", toglie l'animazione di entrata e crea lo zombie vero e proprio
  var pl = joystick.states;
  var posx = zombieBorn.x;
  var posy = zombieBorn.y;
  var dir = joystick.states.RIGHT;//zombieBorn.direction;
  if (posx < player.x){
    dir = joystick.states.LEFT;
  }

  zombieBorn.kill();

  var zombie = zombies.create(posx,  posy, "zombie");
  var anim = zombie.animations.add("zombieWalk", [0,1,2], 14, true);
  zombie.anchor.setTo(.5, 1);
  zombie.body.setSize(32,54);
  zombie.body.velocity.x = -ZOMBIE_SPEED;
  zombie.direction = dir;
  if (dir == joystick.states.LEFT){
    zombie.body.velocity.x = ZOMBIE_SPEED;
    zombie.scale.x = -1;
  }

  zombie.idzombie = pl.idzombie;
  zombie.startingPosx = posx; // salva la posizione iniziale
  pl.idzombie++;
  anim.play("zombieWalk");
  enemies.push(zombie);
}

function showBurstZombie(lance,zombie){
  var pl = joystick.states;
  var span = 0;
  var flip = false;
  if (lance.direction == joystick.states.RIGHT){
    span = -6;
    flip = true;
  }
  var burst = game.add.sprite(zombie.x+span, zombie.y, "burst");
  burst.anchor.setTo(.5, 1);
  if (flip){
    burst.scale.x = -1;
  }

  var anim = burst.animations.add("burst", [0,1,2,4], 14, false);
  anim.killOnComplete = true;
  burst.animations.play("burst")
  
  killZombie(zombie);

  sounds.play("sndBurst");
}
function showBurstCrow(lance,crow){
  var pl = joystick.states;
  var span = 0;
  var flip = false;
  if (lance.direction == joystick.states.RIGHT){
    span = -6;
    flip = true;
  }
  var burst = game.add.sprite(crow.x+span, crow.y+32, "burst");
  burst.anchor.setTo(.5, 1);
  if (flip){
    burst.scale.x = -1;
  }

  var anim = burst.animations.add("burst", [0,1,2,4], 14, false);
  anim.killOnComplete = true;
  burst.animations.play("burst")

  killCrow(crow);

  sounds.play("sndCrowDie");
}
function showBurstPlant(lance,plant){
  var pl = joystick.states;
  var span = 0;
  var flip = false;
  if (lance.direction == joystick.states.RIGHT){
    span = -6;
    flip = true;
  }
  var burst = game.add.sprite(plant.x+span, plant.y+32, "burst");
  burst.anchor.setTo(.5, 1);
  if (flip){
    burst.scale.x = -1;
  }

  var anim = burst.animations.add("burst", [0,1,2,4], 14, false);
  anim.killOnComplete = true;
  burst.animations.play("burst")

  killPlant(plant);

  sounds.play("sndBurst");
}
function killZombie(zombie){
  zombie.destroy();
  var a = new Array();
  for (var x=0;x<enemies.length;x++){
    if (enemies[x].idzombie != zombie.idzombie){
      a.push(enemies[x]);
    }
  }
  enemies = a;
}
function killPlant(plant){
  plant.destroy();
  var a = new Array();
  for (var x=0;x<firers.length;x++){
    if (firers[x].idplant != plant.idplant){
      a.push(firers[x]);
    }
  }
  firers = a;
}
function killCrow(crow){
  crow.destroy();
  var a = new Array();
  for (var x=0;x<flyers.length;x++){
    if (flyers[x].idcrow != crow.idcrow){
      a.push(flyers[x]);
    }
  }
  flyers = a;
}

function retreatZombie(zombieWalk){
  var posx = zombieWalk.x;
  var posy = zombieWalk.y;
  var dir = zombieWalk.direction;
  // Toglie lo sprite dello zombie
  killZombie(zombieWalk);

  // Mostra lo zombie che rientra nella terra
  var zombie = game.add.sprite(posx,  posy, "zombieBorn");
  zombie.anchor.setTo(.5, 1);
  if (dir == joystick.states.LEFT){
    zombie.scale.x = -1;
  }

  var anim = zombie.animations.add("zombieRetreat", [6,5,4,3,2,2,1,1,0,0], 10, false);
  anim.killOnComplete = true;
  anim.play("zombieRetreat");

}

function endGame(){
  joystick.states.disableInteraction = true;
  setTimeout(showGameOver,1200);
}

function showGameOver(){
  bmpText = game.add.bitmapText(70,96*2, 'gng','GAME OVER    PLAYER ONE', 16);
  bmpText.fixedToCamera = true;
  joystick.states.gameEnded = true;
}

function showGameOverWin(){
  bmpText = game.add.bitmapText(90,96*2, 'gng','EPIC WIN     PLAYER ONE', 16);
  bmpText.fixedToCamera = true;
  tv.animations.stop();
  joystick.states.gameEnded = true;
}

var endingFlags = new Object();


function movePrincess(){
  var pl = joystick.states;
  if (pl.endingScene){
    if (!endingFlags.step0){
      if (!endingFlags.doingStep0){
        endingFlags.doingStep0 = true;
        doStep0();
      }
      return
    }
    if (!endingFlags.step1){
      doStep1();
      return
    }
    if (!endingFlags.step2){
      if (!endingFlags.doingStep2){
        endingFlags.doingStep2 = true;
        doStep2();
      }
      return
    }
    if (!endingFlags.step3){
      doStep3();
      return
    }
    if (!endingFlags.step4){
      if (!endingFlags.doingStep4){
        endingFlags.doingStep4 = true;
        doStep4();
      }
      return
    }

    if (!endingFlags.step5){
      if (!endingFlags.doingStep5){
        endingFlags.doingStep5 = true;
        doStep5();
      }
      return
    }

    if (!endingFlags.step6){
      if (!endingFlags.doingStep6){
        endingFlags.doingStep6 = true;
        doStep6();
      }
      return
    }

    if (!endingFlags.step7){
      if (!endingFlags.doingStep7){
        endingFlags.doingStep7 = true;
        doStep7();
      }
      return
    }

    if (!endingFlags.step8){
      if (!endingFlags.doingStep8){
        endingFlags.doingStep8 = true;
        doStep8();
      }
      return
    }

    if (!endingFlags.step9){
      if (!endingFlags.doingStep9){
        endingFlags.doingStep9 = true;
        doStep9();
      }
      return
    }

    if (!endingFlags.step10){
      if (!endingFlags.doingStep10){
        endingFlags.doingStep10 = true;
        doStep10();
      }
      return
    }

    if (!endingFlags.step11){
      if (!endingFlags.doingStep11){
        endingFlags.doingStep11 = true;
        doStep11();
      }
      return
    }

    if (!endingFlags.step12){
      if (!endingFlags.doingStep12){
        endingFlags.doingStep12 = true;
        doStep12();
      }
      return
    }



    /*princess.body.velocity.x = -100;
    
    if (princess.x <= 3948){
      princess.x = 3944;
      princess.body.velocity = 0;
      princess.animations.play("hug");
      player.animations.play("won");
    }*/
  }
}

function doStep0(){
  sounds.stop("sndTheme");
  sounds.play("sndEndTheme");

  bmpText = game.add.bitmapText(292,300-8, 'gng','!?!?', 16);
  bmpText.fixedToCamera = true;
  setTimeout(endStep0,750);
}

function endStep0(){
  bmpText.destroy();
  endingFlags.step0 = true;
}

function doStep1(){
  princess.animations.play("run");
  princess.body.velocity.x = -100;
  if (princess.x <= 3948){
    princess.x = 3944;
    princess.body.velocity.x = 0;
    princess.animations.play("hug");
    game.world.bringToTop(princess);
    //player.animations.play("won");
    endingFlags.step1 = true;
  }
}

function doStep2(){
  setTimeout(endStep2,500)
}

function endStep2(){
  player.animations.play("idle"+joystick.states.postfix);
  princess.animations.play("run");
  princess.body.velocity.x = 100;
  princess.scale.x = -1;
  endingFlags.step2 = true;
}

function doStep3(){
  if (princess.x >= 3970){
    princess.scale.x = 1;
    princess.x +=32;
    princess.body.velocity.x = 0;
    princess.animations.play("idle");
    endingFlags.step3 = true;
  }
}

function doStep4(){
  bmpText0 = game.add.bitmapText(222,300-32, 'gng','You managed', 16);
  bmpText1 = game.add.bitmapText(222,300-8, 'gng',' to escape!', 16);
  bmpText0.fixedToCamera = true;
  bmpText1.fixedToCamera = true;
  setTimeout(preEndStep4,1500);
}

function preEndStep4(){
  bmpText0.destroy();
  bmpText1.destroy();
  setTimeout(endStep4,400);
}

function endStep4(){
  endingFlags.step4 = true;
}

function doStep5(){
  bmpText0 = game.add.bitmapText(324,300-80, 'gng','Suddently', 16);
  bmpText1 = game.add.bitmapText(324,300-56, 'gng','he mumbled', 16);
  bmpText2 = game.add.bitmapText(324,300-32, 'gng','about the', 16);
  bmpText3 = game.add.bitmapText(324,300-8,  'gng','World Cup...', 16);
  bmpText0.fixedToCamera = true;
  bmpText1.fixedToCamera = true;
  bmpText2.fixedToCamera = true;
  bmpText3.fixedToCamera = true;
  bmpText0.tint = TINT;
  bmpText1.tint = TINT;
  bmpText2.tint = TINT;
  bmpText3.tint = TINT;
  setTimeout(preEndStep5,3000);
}
function preEndStep5(){
  bmpText0.destroy();
  bmpText1.destroy();
  bmpText2.destroy();
  bmpText3.destroy();
  setTimeout(endStep5,250);
}

function endStep5(){
  endingFlags.step5 = true;
}

function doStep6(){
  bmpText0 = game.add.bitmapText(334,300-80, 'gng','  ...then', 16);
  bmpText1 = game.add.bitmapText(334,300-56, 'gng',' dropped', 16);
  bmpText2 = game.add.bitmapText(334,300-32, 'gng','  me and', 16);
  bmpText3 = game.add.bitmapText(334,300-8,  'gng','ran away!', 16);
  bmpText0.fixedToCamera = true;
  bmpText1.fixedToCamera = true;
  bmpText2.fixedToCamera = true;
  bmpText3.fixedToCamera = true;
  bmpText0.tint = TINT;
  bmpText1.tint = TINT;
  bmpText2.tint = TINT;
  bmpText3.tint = TINT;

  setTimeout(preEndStep6,2500);
}
function preEndStep6(){
  bmpText0.destroy();
  bmpText1.destroy();
  bmpText2.destroy();
  bmpText3.destroy();
  setTimeout(endStep6,400);
}

function endStep6(){
  endingFlags.step6 = true;
}


function doStep7(){
  endingFlags.step7 = true;
  return;
  bmpText = game.add.bitmapText(270,300, 'gng','Ah! Yes!', 16);
  bmpText.fixedToCamera = true;
  setTimeout(preEndStep7,1000);
}

function preEndStep7(){
  bmpText.destroy();
  setTimeout(endStep7,250);
}

function endStep7(){
  endingFlags.step7 = true;
}

function doStep8(){
  bmpText0 = game.add.bitmapText(280,300-56, 'gng','  The', 16);
  bmpText1 = game.add.bitmapText(278,300-32, 'gng','World', 16);
  bmpText2 = game.add.bitmapText(278,300-8, 'gng','  Cup!', 16);
  bmpText0.fixedToCamera = true;
  bmpText1.fixedToCamera = true;
  bmpText2.fixedToCamera = true;
  setTimeout(preEndStep8,2500);
}

function preEndStep8(){
  bmpText0.destroy();
  bmpText1.destroy();
  bmpText2.destroy();
  setTimeout(endStep8,250);
}

function endStep8(){
  endingFlags.step8 = true;
}

function doStep9(){
  bmpText0 = game.add.bitmapText(262,300-56, 'gng','How did', 16);
  bmpText1 = game.add.bitmapText(262,300-32, 'gng','I forget', 16);
  bmpText2 = game.add.bitmapText(262,300-8, 'gng','  that?', 16);
  bmpText0.fixedToCamera = true;
  bmpText1.fixedToCamera = true;
  bmpText2.fixedToCamera = true;
  setTimeout(preEndStep9,2500);
}

function preEndStep9(){
  bmpText0.destroy();
  bmpText1.destroy();
  bmpText2.destroy();
  setTimeout(endStep9,250);
}

function endStep9(){
  endingFlags.step9 = true;
}

function doStep10(){
  spr_bg = game.add.graphics(0, 0);
  spr_bg.beginFill(0x000000, 1);
  spr_bg.drawRect(0, 0, game.width, game.height);
  //spr_bg.alpha = 0;
  spr_bg.endFill();
  spr_bg.fixedToCamera = true;
 /* s = game.add.tween(spr_bg)
  s.to({ alpha: 1 }, 500, null)
  s.onComplete.add(this.endStep10, this)
  s.start();*/
  setTimeout(endStep10,250);
}

function endStep10(){
  /*endingFlags.step0 = true;
  endingFlags.step1 = true;
  endingFlags.step2 = true;
  endingFlags.step3 = true;
  endingFlags.step4 = true;
  endingFlags.step5 = true;
  endingFlags.step6 = true;
  endingFlags.step7 = true;
  endingFlags.step8 = true;
  endingFlags.step9 = true;*/

  endingFlags.step10 = true; 
}

function doStep11(){
  endingFlags.step11 = true;
  devil.destroy();

  player.animations.play("rest");
  player.x = 160+32;
  createTv();
  game.world.bringToTop(spr_bg);

  princess.play("idle");
  princess.x = 340;

}

function createTv(){
  tv = game.add.sprite(246, 324, 'tv');
  tv.animations.add('idle', [0], 10, false);
  tvOnAnim = tv.animations.add('turnOn', [0, 1, 2, 3, 4, 5, 6, 7, 8], 12, false);
  tvOnAnim.onComplete.add(broadcastTv, this);
  tv.animations.add('shutOff', [8, 7, 6, 5, 4, 3, 2, 1, 0], 12, false);
  tv.animations.add('broadcast', [9, 10], 5, true);
  tv.animations.play("idle");
}

function doStep12(){
  /*s = game.add.tween(spr_bg)
  s.to({ alpha: 0 }, 500, null)
  s.onComplete.add(this.endStep12, this)
  s.start();*/
  setTimeout(endStep12,250);
}

function endStep12(){
  spr_bg.destroy();
  setTimeout(turnOnTv,2000);
}

function broadcastTv(){
  princess.play("shocked");
  tv.play('broadcast');
  setTimeout(showGameOverWin,2200);
}

function turnOnTv(){
  tv.play("turnOn");

}

function debugShowSpriteBounds(){
  // Mostra gli active bounds degli sprite
  game.debug.body(player);
  graves.forEach(game.debug.body,game.debug)
  ladders.forEach(game.debug.body,game.debug)
  weapons.forEach(game.debug.body,game.debug)
  zombies.forEach(game.debug.body,game.debug)
}

function getDistance(x1, x2){
  var dx = x1-x2;
  return Math.sqrt(dx * dx);
}

function rnd(max,min){
  if (!min){
     min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(o){ 
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

var introFlags = new Object();
function showIntro(){
  if (!introFlags.step0){
    if (!introFlags.doingStep0){
      introFlags.doingStep0 = true;
      doIntro0();
    }
    return
  }

  if (!introFlags.step1){
    if (!introFlags.doingStep1){
      introFlags.doingStep1 = true;
      doIntro1();
    }
    return
  }

  if (!introFlags.step2){
    if (!introFlags.doingStep2){
      introFlags.doingStep2 = true;
      doIntro2();
    }
    return
  }

  if (!introFlags.step3){
    if (!introFlags.doingStep3){
      introFlags.doingStep3 = true;
      doIntro3();
    }
    return
  }

  if (!introFlags.step4){
    if (!introFlags.doingStep4){
      introFlags.doingStep4 = true;
      doIntro4();
    }
    return
  }

  if (!introFlags.step5){
    if (!introFlags.doingStep5){
      introFlags.doingStep5 = true;
      doIntro5();
    }
    return
  }
  if (!introFlags.step6){
    doIntro6();
    return
  }
  if (!introFlags.step7){
    if (!introFlags.doingStep7){
      introFlags.doingStep7 = true;
      doIntro7();
    }
    return
  }
  if (!introFlags.step8){
    doIntro8();
    return
  }
  if (!introFlags.step9){
    doIntro9();
    return
  }
  joystick.states.intro = false;

}

function doIntro0(){
  player.animations.play("rest");
  player.x = 160+32;
  princess.animations.play("rest0");
  princess.x = 240;
  graves.alpha = 0;
  devil.alpha = 0;
  armour = game.add.sprite(140,354,"armour");
  setTimeout(endIntro0,500);
}

function endIntro0(){
  introFlags.step0 = true;
}

function doIntro1(){
  blackBg.alpha = 0.2;
  setTimeout(endIntro1,2000);  
}

function endIntro1(){
  introFlags.step1 = true;
}

function doIntro2(){
  blackBg.alpha = 0.4;
  princess.play("rest1");
  setTimeout(endIntro2,1000);  
}

function endIntro2(){
  introFlags.step2 = true;
}

function doIntro3(){
  blackBg.alpha = 1;
  devil.alpha = 1;
  devil.play("hiddenblink")
  setTimeout(endIntro3,1000);  
}

function endIntro3(){
  introFlags.step3 = true;
}

function doIntro4(){
  devil.play("idle")
  setTimeout(endIntro4,1000);  
}

function endIntro4(){
  introFlags.step4 = true;
}

function doIntro5(){
  devil.play("attack");
  s = game.add.tween(devil)
  s.to({ y: 292,x:192 }, 250, null)
  s.onComplete.add(this.endIntro5, this)
  s.start();
}

function endIntro5(){
  var pl = joystick.states;
  princess.x = 512*8;
  devil.play("kidnap");
  introFlags.step5 = true;

  player.body.velocity.y = FALLING_VELOCITY;
  player.body.velocity.x = -120;
  player.play("jumpn");

  s = game.add.tween(devil)
  s.to({ y: 108,x:238 }, 250, null)
  s.onComplete.add(this.devilDisappear, this)
  s.start();

}

function doIntro6(){
  if (player.body.touching.down){
    player.body.velocity.x = 0;
    introFlags.step6 = true;   
  }
}

function devilDisappear(){
  devil.play("hiddenblink");

}

function doIntro7(){
  setTimeout(endIntro7,250);  
}

function endIntro7(){
  devil.alpha = 0;
  player.play("walkn");
  player.body.velocity.x = 100;
  introFlags.step7 = true;   
}

function doIntro8(){
  if (player.body.x >= 136){
    player.body.velocity.x = 0;
    player.play("idle");
    armour.destroy();
    setTimeout(endIntro8,500)
  }
}

function endIntro8(){
  player.body.velocity.x = 100;
  player.play("walk");
  introFlags.step8 = true;   
}

function doIntro9(){
  if (player.body.x >= 224){
    player.body.velocity.x = 0;
    player.play("idle");
    introFlags.step9 = true;   
    blackBg.destroy();    
    graves.alpha = 1;
  }
}