var dog, dogImg, happyDogImg, hungryDog, database, foodS ,foodStock;
var foodObj; 
var fedTime, lastFed, feed, addFood, currentTime;
var gameState = "hungry";
var readState;
var bedroomIMG, gardenIMG, washroomIMG,sleepIMG,runIMG;

function preload(){
	dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
  hungryDog = loadImage("dogImg1.png");
  bedroomIMG = loadImage("Bed Room.png");
  gardenIMG = loadImage("Garden.png");
  washroomIMG = loadImage("Wash Room.png");
  sleepIMG = loadImage("Lazy.png");  
  runIMG = loadImage("running.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();

  //read gamestate from the database
  readState = database.ref('gamestate');
  readState.on("value", function(data){
    gameState = data.val();
  })
  
  foodObj = new Food();
  
  foodStock = database.ref("food");
  foodStock.on("value",readStock);
  
  dog = createSprite(800,220,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background("green");
  
  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime === (lastFed + 2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  
  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed%12 + "PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM", 350,30);
  }else{
    text("Last Feed : "+ lastFed + "AM", 350, 30);
  }  
  


  if(gameState !== "hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else {
    feed.show();
    addFood.show();
    dog.display(); 
  }

  drawSprites();
}

//Function to read values from DB
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to update FoodStock and last FeedTime
function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods() {
  foodObj.updateFoodStock(foodObj.getFoodStock()+1);
  database.ref('/').update({
    Food : foodS
  })
}

//function to update the 
function update(state){
  database.ref('/').update({
    gamestate: state
  });
}