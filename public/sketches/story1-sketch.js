const rightRoots = (sketch) => {
    class Tree {
        constructor() {
          this.leaves = [];
          this.branches = [];
          for(let i = 0; i < 300; i++) {
            this.leaves.push(new Leaf())
          }
          
          let pos = sketch.createVector(sketch.width, sketch.height/2);
          let dir = sketch.createVector(0, -1);
          let root = new Branch(null, pos, dir);
          this.branches.push(root);
          
          let current = root;
          
          let found = false;
          while(!found) {
            for(let i = 0; i<this.leaves.length;i++) {
              let d = p5.Vector.dist(current.pos, this.leaves[i].pos);
              if (d < max_dist) {
                found = true;
              }
            }
            
            if(!found) {
              let branch = current.next();
              current = branch;
              this.branches.push(current);
            }
          }
        }
        grow() {
          for(let i = 0; i < this.leaves.length;i++) {
            let leaf = this.leaves[i];
            
            let closestBranch = null;
            let record = 100000
            for(let j = 0; j < this.branches.length; j++) {
              let branch = this.branches[j];
              let d = p5.Vector.dist(leaf.pos, branch.pos);
              if(d<min_dist) {
                leaf.reached = true;
                closestBranch = null;
                break;
              } else if(d > max_dist) {
                
              } else if(closestBranch == null || d < record) {
                closestBranch = branch;
                record = d;
              }
            }
            if(closestBranch != null) {
              let newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
              newDir.normalize();
              closestBranch.dir.add(newDir);
              closestBranch.count++;
            }
          }
          for(let i = this.leaves.length-1; i >= 0; i--) {
            if(this.leaves[i].reached) {
              this.leaves.splice(i,1);
            }
          }
          for(let i = this.branches.length-1; i >=0 ; i--) {
            let branch = this.branches[i]
            if(branch.count > 0) {
              branch.dir.div(branch.count+1); 
              // let rand = p5.Vector.random2D();
              // rand.setMag(0.3)
              // branch.dir.add(rand);
              this.branches.push(branch.next());
            }
            branch.reset();
          }
            
        }
        
        show() {
          // for(let i = 0; i < this.leaves.length; i++) {
          //   this.leaves[i].show()
          // }
          
          for(let i = 0; i < this.branches.length; i++) {
            let branch = this.branches[i];
            if(branch.parent != null) {
              let weight = sketch.map(i, 0, this.branches.length, 10, 0);
              sketch.strokeWeight(weight)
              sketch.stroke(100, 60, 60);
              sketch.line(branch.pos.x, branch.pos.y, branch.parent.pos.x, branch.parent.pos.y);
            }
          }
        }
    }
    class Leaf {
        constructor() {
          
        //   let vect = sketch.createVector(sketch.random(sketch.width)-100, sketch.random(sketch.height))
        //   let origin = sketch.createVector(sketch.width-100, sketch.height/2)
        //   while(p5.Vector.dist(vect, origin) > sketch.height/3) {
        //     vect = sketch.createVector(sketch.random(sketch.width)-100, sketch.random(sketch.height))
        //   }
          
          let vect = p5.Vector.random2D()
          vect.mult(sketch.random(sketch.width/2));
          vect.x += sketch.width/2
          vect.y += sketch.height/2
          this.pos = vect
          this.reached = false;
        }
      
        show() {
          sketch.noStroke();
          sketch.fill(255);
          sketch.ellipse(this.pos.x, this.pos.y, 4, 4);
        }
    }
    class Branch {
        constructor(parent, pos, dir) {
          this.pos = pos;
          this.parent = parent;
          this.dir = dir;
          this.origDir = dir.copy();
          this.count = 0;
          this.len = 2;
        }
        reset() {
          this.dir = this.origDir.copy();
          this.count = 0;
        }
        next() {
          let nextDir = p5.Vector.mult(this.dir, this.len);
          let nextPos = p5.Vector.add(this.pos, nextDir);
          let nextBranch = new Branch(this, nextPos, this.dir.copy());
          return nextBranch;
        }
    }
    
    let tree; 
    let max_dist = 100;
    let min_dist = 10;


    sketch.setup = () => {
        canvas = sketch.createCanvas(600, 600);
        canvas.position(sketch.windowWidth-600, 50);
        canvas.style('z-index','5')
        tree = new Tree();
    }

    sketch.draw = () => {
        // background(0);
        tree.show();
        tree.grow();
    }   
};
const leftRoots = (sketch) => {
  class Tree {
      constructor() {
        this.leaves = [];
        this.branches = [];
        for(let i = 0; i < 300; i++) {
          this.leaves.push(new Leaf())
        }
        
        let pos = sketch.createVector(0, sketch.height/2);
        let dir = sketch.createVector(0, -1);
        let root = new Branch(null, pos, dir);
        this.branches.push(root);
        
        let current = root;
        
        let found = false;
        while(!found) {
          for(let i = 0; i<this.leaves.length;i++) {
            let d = p5.Vector.dist(current.pos, this.leaves[i].pos);
            if (d < max_dist) {
              found = true;
            }
          }
          
          if(!found) {
            let branch = current.next();
            current = branch;
            this.branches.push(current);
          }
        }
      }
      grow() {
        for(let i = 0; i < this.leaves.length;i++) {
          let leaf = this.leaves[i];
          
          let closestBranch = null;
          let record = 100000
          for(let j = 0; j < this.branches.length; j++) {
            let branch = this.branches[j];
            let d = p5.Vector.dist(leaf.pos, branch.pos);
            if(d<min_dist) {
              leaf.reached = true;
              closestBranch = null;
              break;
            } else if(d > max_dist) {
              
            } else if(closestBranch == null || d < record) {
              closestBranch = branch;
              record = d;
            }
          }
          if(closestBranch != null) {
            let newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
            newDir.normalize();
            closestBranch.dir.add(newDir);
            closestBranch.count++;
          }
        }
        for(let i = this.leaves.length-1; i >= 0; i--) {
          if(this.leaves[i].reached) {
            this.leaves.splice(i,1);
          }
        }
        for(let i = this.branches.length-1; i >=0 ; i--) {
          let branch = this.branches[i]
          if(branch.count > 0) {
            branch.dir.div(branch.count+1); 
            // let rand = p5.Vector.random2D();
            // rand.setMag(0.3)
            // branch.dir.add(rand);
            this.branches.push(branch.next());
          }
          branch.reset();
        }
          
      }
      
      show() {
        // for(let i = 0; i < this.leaves.length; i++) {
        //   this.leaves[i].show()
        // }
        
        for(let i = 0; i < this.branches.length; i++) {
          let branch = this.branches[i];
          if(branch.parent != null) {
            let weight = sketch.map(i, 0, this.branches.length, 10, 0);
            sketch.strokeWeight(weight)
            sketch.stroke(100, 60, 60);
            sketch.line(branch.pos.x, branch.pos.y, branch.parent.pos.x, branch.parent.pos.y);
          }
        }
      }
  }
  class Leaf {
      constructor() {
        
      //   let vect = sketch.createVector(sketch.random(sketch.width)-100, sketch.random(sketch.height))
      //   let origin = sketch.createVector(sketch.width-100, sketch.height/2)
      //   while(p5.Vector.dist(vect, origin) > sketch.height/3) {
      //     vect = sketch.createVector(sketch.random(sketch.width)-100, sketch.random(sketch.height))
      //   }
        
        let vect = p5.Vector.random2D()
        vect.mult(sketch.random(sketch.width/2));
        vect.x += sketch.width/2
        vect.y += sketch.height/2
        this.pos = vect
        this.reached = false;
      }
    
      show() {
        sketch.noStroke();
        sketch.fill(255);
        sketch.ellipse(this.pos.x, this.pos.y, 4, 4);
      }
  }
  class Branch {
      constructor(parent, pos, dir) {
        this.pos = pos;
        this.parent = parent;
        this.dir = dir;
        this.origDir = dir.copy();
        this.count = 0;
        this.len = 2;
      }
      reset() {
        this.dir = this.origDir.copy();
        this.count = 0;
      }
      next() {
        let nextDir = p5.Vector.mult(this.dir, this.len);
        let nextPos = p5.Vector.add(this.pos, nextDir);
        let nextBranch = new Branch(this, nextPos, this.dir.copy());
        return nextBranch;
      }
  }
  
  let tree; 
  let max_dist = 100;
  let min_dist = 10;


  sketch.setup = () => {
      canvas = sketch.createCanvas(600, 600);
      canvas.position(0, sketch.windowHeight*3);
      canvas.style('z-index','5')
      tree = new Tree();
  }

  sketch.draw = () => {
      // background(0);
      tree.show();
      tree.grow();
  }   
};

const rightVines = (sketch) => {
  class Particle {
    constructor(pos) {
      this.pos = pos;
      this.vel = sketch.createVector(0, 0);
      this.pastPosX = 0;
      this.pastPosY = 0;
    }
    
    update() {
      // movement
      this.vel = vectors[Math.floor(this.pos.x)][Math.floor(this.pos.y)];
      this.pastPosX = this.pos.x;
      this.pastPosY = this.pos.y;
      this.pos.add(this.vel);
        
       if(this.pos.x > sketch.width-1 || this.pos.x < 0 || this.pos.y > sketch.height-1 || this.pos.y < 0) {

        this.pos = sketch.createVector(sketch.random(sketch.width), sketch.random(sketch.height));
        this.pastPosX = this.pos.x;
        this.pastPosY = this.pos.y;
      }
      
      sketch.stroke('rgba(129, 173, 74, 0.01)');
      // let alpha = 0.01;
      // if(this.pos.x > sketch.width-30) {
      //   alpha = sketch.map(this.pos.x, sketch.width-30, sketch.width, 0.01, 0, true)
      // }
      // else if(this.pos.x < 30) {
      //   alpha = sketch.map(this.pos.x, 0, 30, 0, 0.01, true)
      // }
      // if(this.pos.y > sketch.height-30) {
      //   alpha = sketch.map(this.pos.y, sketch.height-30, sketch.height, 0.01, 0, true)
      // }
      // else if(this.pos.y < 30) {
      //   alpha = sketch.map(this.pos.y, 0, 30, 0, 0.01, true)
      // }
      // if(alpha < 0) console.log(alpha);
      // sketch.stroke('rgba(0, 150, 50, ' + alpha + ')');
      sketch.line(this.pos.x, this.pos.y, this.pastPosX, this.pastPosY);
    }
  }

  var vectors = [];
  var resolution = 1;
  var balls = [];
  var numberOfBalls = 500;
  let seed = 2;

  sketch.setup=()=> {

    canvas = sketch.createCanvas(800, 800);
    canvas.position(sketch.windowWidth-800, sketch.windowHeight*1.5);
    canvas.style('z-index','5')
    sketch.noiseSeed(seed)
    sketch.pixelDensity(1);
    sketch.loadPixels();
    sketch.frameRate(120);
    
    
    sketch.strokeWeight(5);
    sketch.strokeCap(sketch.PROJECT);
    // sets up vector array, vectors[width level][height level]
    vectors = new Array(sketch.width);
    for(let i = 0; i < sketch.width; i++) {
      vectors[i] = new Array(sketch.height);
    }
    
    
    // sets up Perlin noise
    let yoff = 0;
    for(let a = 0; a < sketch.height; a++) {
      let xoff = 0;
      for(let b = 0; b < sketch.width; b++) {
        let index = (a+b*sketch.width) * 4;
        let rand = sketch.noise(xoff, yoff);
        
        // sets up vector field
        let angle = sketch.map(rand, 0, 1, 0, sketch.TWO_PI);
        //vectors[a][b] = createVector(resolution * sin(angle), resolution * cos(angle));
        vectors[a][b] = p5.Vector.fromAngle(angle + sketch.PI, resolution);


        xoff += 0.01
      }
      yoff += 0.01
      
    }
    
    // sets up balls
    for(let i = 0; i < numberOfBalls; i++) {
      let randX = Math.floor(sketch.random(0, sketch.width))
      let randY = Math.floor(sketch.random(0, sketch.height))
      balls[i] = new Particle(sketch.createVector(randX, randY));
    }
    
    sketch.updatePixels();
    // sketch.background(0,255)
  }



  sketch.draw=()=>{

    
    if(sketch.frameCount > 650) {
      sketch.noLoop();
    }
    // displays line
    for(let i = 0; i < balls.length; i++) {
      balls[i].update();
      
    }
  }

}