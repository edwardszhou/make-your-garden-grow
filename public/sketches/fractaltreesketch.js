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
      
      this.thickness = map(this.level, 0, 5, this.maxWidth, 1, true)
      
      this.randomOffset = random(1.5) + level*1000;
    }
    
    show() {
      stroke(120, 60, 60);
      strokeWeight(this.thickness);  
      line(this.begin.x, this.begin.y, this.begin.z, this.end.x, this.end.y, this.end.z)
    }
    
    branch(num, split, len) {
      let newBranches = [];
      
      // direction of current branch
      let dir = p5.Vector.sub(this.end, this.begin);
      // let initAxis = findPerpendicular(dir);
      
      // finds perpendicular axis to the branch
      let initAxis = p5.Vector.cross(createVector(1, 0, 0), dir);
      // rotates around perpendicular axis to get split angle via Rodrigues' formula
      let firstBranchDir = rotateAround(dir, initAxis, split); // PARAM split
      
      // sets number of branches
      let branchAngle = 2*PI/num // PARAM num
      
      for(let i = random(0, branchAngle); i < TWO_PI; i += branchAngle) { 
        
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
      let rootBegin = createVector(0, 0, 0);
      let rootEnd = createVector(0, -this.trunkLen, 0);
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
        fill(214, 255, 164);
        noStroke();
        push();
        translate(leaf.x, leaf.y, leaf.z);
        sphere(5, 5, 5);
        pop();
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
          
          let randNum = floor(random(this.minNumBranch, this.maxNumBranch+1));
          let randSplit = random(this.minSplitAngle, this.maxSplitAngle);
          let randLen = random(this.minSize, this.maxSize);
              
          let newBranches = branch.branch(randNum, randSplit, randLen);
      
          for(let newBranch of newBranches) {
            this.branches.push(newBranch);
          }
        } else {
          print("counted")
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
        let movementY = (noise(this.timeOffset*speed + branch.randomOffset)-0.5) * strength;
        let movementX = (noise(this.timeOffset*speed + branch.randomOffset + 100)-0.5) * strength;
        branch.end.y = branch.endStill.y + movementY * (branch.level+1);
        branch.end.x = branch.endWind.x + movementX * (branch.level+1);
      }
    }
    applyWind(strength, variation, chaos) {
      for(let branch of this.branches) {
        let movement = map(variation, 0, 1, 0.5, noise(this.timeOffset*chaos + branch.level/100), true) * strength;
        branch.end.x = branch.endStill.x + movement * (branch.level + 1);
        branch.endWind = branch.end.copy();
      }
      
      let referenceBranch = this.branches[this.branches.length-1];
      let distFromStill = referenceBranch.end.x - referenceBranch.endStill.x;
      
      let rustleValue = map(distFromStill, 0, 150, 0.5, 2, true);
      // print(distFromStill)
      this.rustle(rustleValue * (1+chaos), rustleValue*2);
    }
}
let tree;

let seed = 0;
let cameraZoom = 700;

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

function setup() {
  canvas = createCanvas(windowHeight, windowHeight, WEBGL);
  canvas.position(windowWidth-windowHeight, 0);
  canvas.style('z-index','-1')
  strokeCap(PROJECT);
  strokeJoin(BEVEL);
  
  trunkLen = 100;
  trunkWidth = 8;
  minBranchingSize = 0.5; 
  maxBranchingSize = 0.9;
  minNumBranch = 2;
  maxNumBranch = 4;
  minSplitAngle = PI/12;
  maxSplitAngle = PI/6;
  maxLevel = 6;
  
  windStrength = 25;
  windVariation = 1;
  windChaos = 1;
  
//   treeSliderSetup();
//   windSliderSetup();
//   cameraSliderSetup();
  
  generateTree();
  print(tree.branches.length)
}

function draw() {
  camera(0, -200, cameraZoom, 0, -200, 0);
  background(27, 15, 4);
//   translate(-100,0,0)
  // if(cameraSpin < 500) {
  //   // rotateY(frameCount/cameraSpin);
  // }

  
  tree.timeOffset += 0.01
  tree.applyWind(windStrength, windVariation, windChaos); // strength, var, chaos
  tree.show();
}

function mousePressed() {
    if(mouseX > 0) {
        generateTree();
    }
}

function generateTree() {
  // randomSeed(seed);
  
  tree = new Tree(trunkLen, trunkWidth, minBranchingSize, maxBranchingSize, minNumBranch, maxNumBranch, minSplitAngle, maxSplitAngle, maxLevel);
  
  while(!tree.hasLeaves) {
    tree.grow();
  }
}

// Rodrigues' rotation formula
// v_rot = v*cos(theta) + (axis x v) * sin(theta) + axis * (axis . v) * (1-cos(theta))
function rotateAround(vect, axis, angle) {
  
  axis = p5.Vector.normalize(axis);
  termOne = p5.Vector.mult(vect, cos(angle));
  termTwoPart = p5.Vector.cross(axis, vect)
  termTwo = p5.Vector.mult(termTwoPart, sin(angle));
  termThreePartOne = p5.Vector.dot(axis, vect);
  termThreePartTwo = termThreePartOne * (1-cos(angle));
  termThree = p5.Vector.mult(axis, termThreePartTwo);
  return p5.Vector.add(p5.Vector.add(termOne, termTwo), termThree);
}