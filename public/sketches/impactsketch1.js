class Branch {
    constructor(parent, pos, dir) {
      this.pos = pos;
      this.parent = parent;
      this.dir = dir;
      this.origDir = dir.copy();
      this.count = 0;
      this.len = 5;
      
      this.ended = false;
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

class Leaf {
    constructor() {
      this.pos = p5.Vector.random3D();
      this.pos.mult(random(width/3));
      this.pos.y -= height/4
      this.reached = false;
    }
  
    show() {
      noStroke();
      fill(255);
      push();
      translate(this.pos.x, this.pos.y, this.pos.z);
      ellipse(0, 0, 4, 4);
      pop();
    }
}

class Tree {
    constructor(leafNum) {
      this.leaves = [];
      this.branches = [];
      for(let i = 0; i < leafNum; i++) {
        this.leaves.push(new Leaf())
      }
      
      let pos = createVector(0, height/2, 0);
      let dir = createVector(0, -1, 0);
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
          if(branch.ended) continue;
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
        } else {
          branch.ended = true;
        }
        branch.reset();
      }
        
    }
    
    show() {
    //   for(let i = 0; i < this.leaves.length; i++) {
    //     this.leaves[i].show()
    //   }
      
      for(let i = 0; i < this.branches.length; i++) {
        let branch = this.branches[i];
        if(branch.parent != null) {
          let weight = map(i, 0, this.branches.length, 10, 0);
          strokeWeight(weight)
          stroke(0,100,20);
          line(branch.pos.x, branch.pos.y, branch.pos.z, branch.parent.pos.x, branch.parent.pos.y, branch.parent.pos.z);
        }
      }
    }
}

let tree; 
let max_dist = 500;
let min_dist = 10;


function setup() {
  
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0)
  canvas.style('z-index','-1')
  tree = new Tree(500);
  frameRate(60)
  background(27, 15, 4)
}

function draw() {
  
  if(frameCount > 90) {
    camera(0, -200, 800, 0,0,0)
  
    tree.show();
    tree.grow();
    
    if(frameCount > 300)
      noLoop();
  }
  
  
}