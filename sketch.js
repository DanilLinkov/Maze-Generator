var rows,cols;

// Making the width smaller will make a bigger maze
var w = 20;

// Grid array containing the cells
var grid = [];

// Current cell that is being processed
var current;

// The stack of processed cells
var stack = [];

// Offset used to position the maze in the sketch
var offset = 50;

function setup() {
  createCanvas(600, 600);
  
  // Calculating the cols and rows 
  cols = floor((width-offset) / w);
  rows = floor((height-offset) / w);
  
  // un-commenting this line will make the simulation run
  // slower and increasing/decreasing the number will speed up
  // or slow down the simulation
  
  //frameRate(5);

  // Initialisation of the grid
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  // Pushing the first cell to the grid and removing some
  // of its walls for entry point
  current = grid[0];
  grid[0].walls=[false,true,true,false];
  grid[grid.length-1].walls=[true,false,false,true];
  

}

function draw() {
  background(220);
  // Displaying the grid
  drawGrid(); 
  
  // Setting the current cell as visited and highlighting it
  current.visited = true;
  current.highlight();
  
  // Choosing one of its neighbors randomly
  var neighbor = current.chooseNeighbor();
  
  // If the neighbor exists then push it to the stack
  // and set it as visited, also remove the wall
  // between the current cell and the neighbor and make
  // the neighbor the current cell
  // Else back track by popping the cell
  if(neighbor)
  {
    neighbor.visited = true;
    stack.push(current);
    removeWalls(current, neighbor);    
    current = neighbor;   
  } else if (stack.length>0){
    current = stack.pop();
  }
   
}

// Helper function to find the index of a 1D array
// that can be represented as a 2D array
function index(x,y){
  if (x<0 || y<0 || x > rows-1 || y>cols-1)
  {
    return -1;
  }
  
  return (x + y*cols);
}

function Cell (x,y) {
  // x, y position of the cell
  this.x = x;
  this.y = y;
  // Boolean variable for if the cell has been visited or not
  this.visited = false;
  // TOP RIGHT BOTTOM LEFT walls enabled if true
  this.walls = [true,true,true,true];
  
  // Finding and choosing the neighbors of the cell
  // randomly
  this.chooseNeighbor = function() {    
    var neighbors = [];
    
    var top = grid[index(x, y - 1)];
    var right = grid[index(x + 1, y)];
    var bottom = grid[index(x, y + 1)];
    var left = grid[index(x - 1, y)];
   
    // If the neighbor exists then push it to the array
    if(top && !top.visited)
    {
      neighbors.push(top);
    }      
    if(right && !right.visited)
    {
      neighbors.push(right);
    }     
    if(bottom && !bottom.visited)
    {
      neighbors.push(bottom);
    }    
    if(left && !left.visited)
    {
      neighbors.push(left);
    }
    
    // randomly pick a neighbor or return undefined
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    } 
  }
  
  // Highlights the current cell a different colour
  this.highlight = function() {
    var x = this.x * w + offset/2;
    var y = this.y * w + offset/2;
    noStroke();    
    fill(0, 0, 255, 100);
    rect(x, y, w, w);

  }

  // Draws the cell depending on its walls and position  
  this.draw = function () { 
    var x = this.x * w + offset/2;
    var y = this.y * w + offset/2;
    
    strokeWeight(4);
    stroke(51);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
    
    if(this.visited){
      noStroke();
      fill(100,100,100);
      rect(x,y,w,w);
    }   
  }
}

// Draws the grid
function drawGrid() {
  for(var i=0;i<grid.length;i++)
  {
    grid[i].draw();
  }
}

// Function that removes a wall between cell
// a and b by finding where they are positioned
// relative to each other
function removeWalls(a, b) {
  var x = a.x - b.x;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.y - b.y;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}