const rootsSpread = (sketch) => {
    class Tree {
        constructor() {
          this.leaves = [];
          this.branches = [];
          for(let i = 0; i < 300; i++) {
            this.leaves.push(new Leaf())
          }
          
          let pos = sketch.createVector(sketch.width/2, sketch.height/2);
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
        //   console.log(this.branches.length)
        }
        
        show() {
        //   for(let i = 0; i < this.leaves.length; i++) {
        //     this.leaves[i].show()
        //   }
          
          for(let i = 0; i < this.branches.length; i++) {
            let branch = this.branches[i];
            if(branch.parent != null) {
              let weight = sketch.map(i, 0, this.branches.length, 10, 0);
              sketch.strokeWeight(weight)
              sketch.stroke(col);
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
    let col;


    sketch.setup = () => {
        // let randCanvSize = 300 + Math.floor(Math.random()*4)*100
        // canvas = sketch.createCanvas(randCanvSize, randCanvSize);
        // let randCanvPosX = Math.floor(Math.random()*(sketch.windowWidth-randCanvSize))
        // let randCanvPosY = Math.floor(Math.random()*(sketch.windowHeight-randCanvSize))
        // console.log(globalCanvInc);
        // canvas.position(randCanvPosX, randCanvPosY + globalCanvInc * sketch.windowHeight);
        // canvas.style('z-index','5')
        let randHue = Math.floor(Math.random()*360);
        sketch.colorMode(sketch.HSB);
        col = sketch.color(randHue, 34, 58);
        sketch.frameRate(0);
        // tree = new Tree();
    }

    sketch.draw = () => {
        // background(0);
        if(sketch.frameRate() != 0 && !tree) {
            tree = new Tree();
        }
        if(tree) {
            tree.show();
            tree.grow();
        }
        
        if(sketch.frameCount > 200) {
            sketch.noLoop();
        }
    }   
};


const fractalTree = (sketch) => {
    class Branch {
  
        constructor(begin, end, level, maxWidth) {
          this.begin = begin;
          this.end = end;
          this.endStill = end.copy();
          this.endWind = end.copy();
          this.children = [];
          this.leaves = [];
          this.level = level;
          this.maxWidth = maxWidth;
          
          this.thickness = sketch.map(this.level, 0, 5, this.maxWidth, 1, true)
          
          this.randomOffset = sketch.random(1.5) + level*1000;
        }
        
        show() {
          sketch.stroke(120, 60, 60);
          sketch.strokeWeight(this.thickness);  
          sketch.line(this.begin.x, this.begin.y, this.begin.z, this.end.x, this.end.y, this.end.z)
        }
        
        branch(num, split, len) {
          let newBranches = [];
          
          // direction of current branch
          let dir = p5.Vector.sub(this.end, this.begin);
          // let initAxis = findPerpendicular(dir);
          
          // finds perpendicular axis to the branch
          let initAxis = p5.Vector.cross(sketch.createVector(1, 0, 0), dir);
          // rotates around perpendicular axis to get split angle via Rodrigues' formula
          let firstBranchDir = rotateAround(dir, initAxis, split); // PARAM split
          
          // sets number of branches
          let branchAngle = 2*sketch.PI/num // PARAM num
          
          for(let i = sketch.random(0, branchAngle); i < sketch.TWO_PI; i += branchAngle) { 
            
            // rotates around axis of current branch
            let branchDir = rotateAround(firstBranchDir, dir, i);
            branchDir.mult(len); // shortens branch PARAM len
            
            let newEnd = p5.Vector.add(this.end, branchDir)
            let newBranch = new Branch(this.end, newEnd, this.level + 1, this.maxWidth);
            newBranches.push(newBranch);
            this.children.push(newBranch);
          }
          
          return newBranches;
        }
        
        
    }
    class Tree {
        constructor(trunkLen, trunkWidth, minBranchingSize, maxBranchingSize, minNumBranch, maxNumBranch, minSplitAngle, maxSplitAngle, maxLevel) {
          this.trunkLen = trunkLen; // inital length of trunk
          this.trunkWidth = trunkWidth; // inital width of trunk
          this.minSize = minBranchingSize; // min/max branching size multiplier
          this.maxSize = maxBranchingSize;
          this.minNumBranch = minNumBranch; // min/max number of branches per
          this.maxNumBranch = maxNumBranch;
          this.minSplitAngle = minSplitAngle; // min/max angle of branch split
          this.maxSplitAngle = maxSplitAngle;
          this.maxLevel = maxLevel // max num of branches before no more growth
      
          
          this.branches = [];
          this.leaves = [];
          let rootBegin = sketch.createVector(0, 0, 0);
          let rootEnd = sketch.createVector(0, -this.trunkLen, 0);
          this.branches.push(new Branch(rootBegin, rootEnd, 0, trunkWidth));
          this.growthLevel = 0;
          this.hasLeaves = false;
          
          this.timeOffset = 0;
        }
        
        show() {
          for(let branch of this.branches) {
            branch.show();
      
          }
          
          for(let leaf of this.leaves) {
            sketch.fill(214, 255, 164);
            sketch.noStroke();
            sketch.push();
            sketch.translate(leaf.x, leaf.y, leaf.z);
            sketch.sphere(5, 5, 5);
            sketch.pop();
          }
        }
        
        grow() {
          if(this.leaves.length != 0) {
            return;
          }
          
          if(this.growthLevel == this.maxLevel) {
            this.growLeaves();
            this.hasLeaves = true;
            return;
          }
          
          for(let i = this.branches.length-1; i >= 0; i--) {
            let branch = this.branches[i];
            if(branch.children.length == 0) {
              
              let randNum = Math.floor(sketch.random(this.minNumBranch, this.maxNumBranch+1));
              let randSplit = sketch.random(this.minSplitAngle, this.maxSplitAngle);
              let randLen = sketch.random(this.minSize, this.maxSize);
                  
              let newBranches = branch.branch(randNum, randSplit, randLen);
          
              for(let newBranch of newBranches) {
                this.branches.push(newBranch);
              }
            }
          }
          this.growthLevel++;
        }
        
        growLeaves() {
          for(let branch of this.branches) {
            if(branch.children.length == 0) {
              let leaf = branch.end
              branch.leaves.push(leaf);
              this.leaves.push(leaf);
            }
          }
        }
        rustle(strength, speed) {
          for(let branch of this.branches) {
            let movementY = (sketch.noise(this.timeOffset*speed + branch.randomOffset)-0.5) * strength;
            let movementX = (sketch.noise(this.timeOffset*speed + branch.randomOffset + 100)-0.5) * strength;
            branch.end.y = branch.endStill.y + movementY * (branch.level+1);
            branch.end.x = branch.endWind.x + movementX * (branch.level+1);
          }
        }
        applyWind(strength, variation, chaos) {
          for(let branch of this.branches) {
            let movement = sketch.map(variation, 0, 1, 0.5, sketch.noise(this.timeOffset*chaos + branch.level/100), true) * strength;
            branch.end.x = branch.endStill.x + movement * (branch.level + 1);
            branch.endWind = branch.end.copy();
          }
          
          let referenceBranch = this.branches[this.branches.length-1];
          let distFromStill = referenceBranch.end.x - referenceBranch.endStill.x;
          
          let rustleValue = sketch.map(distFromStill, 0, 150, 0.5, 2, true);
          // print(distFromStill)
          this.rustle(rustleValue * (1+chaos), rustleValue*2);
        }
    }
    let tree;
    
    let seed = 0;
    let cameraZoom = 600;
    
    var trunkLen;
    var trunkWidth;
    var minBranchingSize;
    var maxBranchingSize;
    var minNumBranch;
    var maxNumBranch;
    var minSplitAngle;
    var maxSplitAngle;
    var maxLevel;
    var windStrength;
    var windVariation;
    var windChaos;
    
    sketch.setup=()=>{
      canvas = sketch.createCanvas(800, 800, sketch.WEBGL);
      canvas.position(0, sketch.windowHeight*1.25*2.2);
      canvas.style('z-index','-1')
      sketch.strokeCap(sketch.PROJECT);
      sketch.strokeJoin(sketch.BEVEL);
      
      seed = sketch.floor(sketch.random(100))
      trunkLen = 1;
      trunkWidth = 8;
      minBranchingSize = 0.5; 
      maxBranchingSize = 0.9;
      minNumBranch = 2;
      maxNumBranch = 4;
      minSplitAngle = sketch.PI/12;
      maxSplitAngle = sketch.PI/4;
      maxLevel = 6;
      windStrength = -30;
      windVariation = 0;
      windChaos = 1;
      
    //   treeSliderSetup();
    //   windSliderSetup();
    //   cameraSliderSetup();
      
      generateTree();
    }
    
    sketch.draw=()=>{
      sketch.camera(0, -200, cameraZoom, 0, -200, 0);
      sketch.background(2,27,12);
    //   translate(-100,0,0)
      // if(cameraSpin < 500) {
      //   // rotateY(frameCount/cameraSpin);
      // }
      if(trunkLen < 150) {
        trunkLen += 1;
        generateTree();
      } else {
        sketch.noLoop();
      }
      sketch.translate(-350,-100,0)
      sketch.rotateZ(sketch.PI/2)
      tree.timeOffset += 0.01
      tree.applyWind(windStrength, windVariation, windChaos); // strength, var, chaos
      tree.show();
    }
    
    function generateTree() {
      sketch.randomSeed(seed);
      
      tree = new Tree(trunkLen, trunkWidth, minBranchingSize, maxBranchingSize, minNumBranch, maxNumBranch, minSplitAngle, maxSplitAngle, maxLevel);
      
      while(!tree.hasLeaves) {
        tree.grow();
      }
    }
    
    // Rodrigues' rotation formula
    // v_rot = v*cos(theta) + (axis x v) * sin(theta) + axis * (axis . v) * (1-cos(theta))
    function rotateAround(vect, axis, angle) {
      
      axis = p5.Vector.normalize(axis);
      termOne = p5.Vector.mult(vect, sketch.cos(angle));
      termTwoPart = p5.Vector.cross(axis, vect)
      termTwo = p5.Vector.mult(termTwoPart, sketch.sin(angle));
      termThreePartOne = p5.Vector.dot(axis, vect);
      termThreePartTwo = termThreePartOne * (1-sketch.cos(angle));
      termThree = p5.Vector.mult(axis, termThreePartTwo);
      return p5.Vector.add(p5.Vector.add(termOne, termTwo), termThree);
    }
}