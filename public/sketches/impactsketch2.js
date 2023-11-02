let vectors = [];
let resolution = 0.1;
let balls = [];
let textPoints = [];
let numberOfBalls = 1000;
let fieldMag = 1;

let imgResolution = 5;
let img;

let canvas;

function preload() {
  img = loadImage('../sketches/GROW.png');
}

function setup() {
  
  canvas = createCanvas(windowWidth, windowHeight)
  canvas.position(0, 0)
  canvas.style('z-index','-1')
  img.resize(height, height)
  pixelDensity(1);
  // noiseSeed(100); 
  loadPixels();
  noStroke();
  frameRate(60);
  tint(255, 10)
  
  // sets up vector array, vectors[width level][height level]
  vectors = new Array(width);
  for(let i = 0; i < width; i++) {
    vectors[i] = new Array(height);
  }
  
  
  // sets up Perlin noise
  let xoff = 0;
  for(let a = 0; a < width; a++) {
    let yoff = 0;
    for(let b = 0; b < height; b++) {
      let index = (a+b*width) * 4;
      let rand = noise(xoff, yoff);
      
      // sets up vector field
      let angle = map(rand, 0, 1, 0, TWO_PI);
      //vectors[a][b] = createVector(resolution * sin(angle), resolution * cos(angle));
      vectors[a][b] = p5.Vector.fromAngle(angle + HALF_PI, resolution);
      vectors[a][b].setMag(fieldMag);
      
      // draws noise
      pixels[index] = rand*255;
      pixels[index+1] = rand*255;
      pixels[index+2] = rand*255;
      pixels[index+3] = 255;
      yoff += 0.01
    }
    xoff += 0.01
    
  }
  print(vectors.length);
  // sets up balls
  for(let i = 0; i < numberOfBalls; i++) {
    let randX = floor(random(0, width))
    let randY = floor(random(0, height))
    balls[i] = new Particle(createVector(randX, randY));
  }
  
  for(let i = 0; i < height; i ++) {
    for(let j = 0; j < width; j ++) {
      if(img.get(j, i)[3] != 0) {
        textPoints.push(createVector(j+width/2-img.width/4, i))
        if(i%imgResolution==0 && j%imgResolution == 0) {
          let randX = floor(random(0, width))
          let randY = floor(random(0, height))
          ball = new Particle(createVector(randX, randY));
          ball.isWord = true;
          // ball.timer = 0;
          balls.push(ball);
        }
      }
    }
  }
  
//   updatePixels();
//   background(0,255)
}

function draw() {
  
  if(frameCount > 600) noLoop();
  
  // displays line
  
  strokeWeight(5);
  strokeCap(PROJECT);
  for(let i = 0; i < balls.length; i++) {
    stroke(balls[i].col);
    balls[i].update();
    
  }
}

class Particle {
    constructor(pos) {
      this.pos = pos;
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.pastPos = createVector(0, 0);
      this.col = color(255,255,255,0.01);
      this.timer = 999;
      this.maxVel = 2;
      
      this.isWord = false;
      
    }
    
    update() {
      // field force
      this.acc.set(0,0);
      if(this.pos.x > width-1 || this.pos.x < 0 || this.pos.y > height-1 || this.pos.y < 0) {
        this.pos = textPoints[abs(floor(random(0, textPoints.length)))].copy();
        if(!this.isWord) {
          this.pos.y = height-1;
        } else {
          this.timer = 0;
        }
        this.pastPos = this.pos.copy();
        
      }
  
      this.acc.add(vectors[abs(floor(this.pos.x))][abs(floor(this.pos.y))]);
      this.acc.mult(0.1);
      
      
      this.pastPos = this.pos.copy();
      this.vel.add(this.acc);
      this.vel.limit(this.maxVel);
      this.pos.add(this.vel);
      
      if(this.timer < 50) this.timer++;
      this.maxVel = map(this.timer, 0, 100, 0.01, 2, true)
      this.col = lerpColor(color(0,100+map(frameCount, 0,600, 0,50),0,2),color(234,255,194,30), map(this.timer, 0, 50, 1, 0, true))
      
      
      
      line(this.pos.x, this.pos.y, this.pastPos.x, this.pastPos.y);
    }
  }
