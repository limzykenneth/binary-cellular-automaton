var rule = 57;
//---------------------------------//
// 111 110 101 100 011 010 001 000 //
//  0   0   1   1   1   0   0   1  //
//---------------------------------//

// One peak
var seed = [{
	0: 49
}, {
	1: 1
}, {
	0: 50
}];

// Two peaks
// var seed = [{
// 	0: 33
// }, {
// 	1: 33
// }, {
// 	0: 34
// }];

// Three peaks
// var seed = [{
// 	0: 25
// }, {
// 	1: 25
// }, {
// 	0: 25
// }, {
// 	1: 25
// }];

var gridWidth = 100;
var gridHeight = 100;
var ruleStart = 24;


function parseSeed(seed){
	var finalSeed = "";
	for(var i=0; i<seed.length; i++){
		for(var key in seed[i]){
			for(var j=0; j<seed[i][key]; j++){
				finalSeed += key.toString();
			}
		}
	}

	return finalSeed;
}

var cellWidth = 10;
var cellHeight = 10;

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(255);

	var grid = new Grid(gridWidth, gridHeight, parseSeed(seed));
	grid.populate();
	grid.automaton();
	grid.draw();
}

function Cell(positionIndex){
	this.color = "#fff";
	this.state = 0;

	this.position = {
		x: positionIndex.x * cellWidth,
		y: positionIndex.y * cellHeight
	};
}

Cell.prototype.setState = function(newState){
	this.state = newState;

	if(this.state == 0){
		this.color = "#fff";
	}else{
		this.color = "#000";
	}
};

Cell.prototype.draw = function(){
	fill(this.color);
	rect(this.position.x, this.position.y, cellWidth, cellHeight);
};

function Grid(w, h, seed){
	this.w = w;
	this.h = h;
	this.cells = [];
	this.seed = seed;
}

Grid.prototype.draw = function(){
	fill("#fff");
	noStroke();
	rect(0, 0, this.w * cellWidth, this.h * cellHeight);

	for(var i=0; i<this.cells.length; i++){
		this.cells[i].draw();
	}
};

Grid.prototype.populate = function(){
	for(var y=0; y<this.h; y++){
		for(var x=0; x<this.w; x++){
			this.cells.push(new Cell({x: x, y: y}));

			if(y == ruleStart){
				this.cells[this.cells.length-1].setState(parseInt(this.seed[x]));
			}
		}
	}
};

Grid.prototype.automaton = function(){
	for(var y=0; y<this.h-1; y++){
		for(var x=-1; x<this.w-1; x++){
			var referencePointer = {
				x: x,
				y: y
			};
			var referenceIndex = this.h * referencePointer.y + referencePointer.x;
			if(x == -1){
				referenceIndex = this.h * referencePointer.y;
			}
			var referenceCells = [
				this.cells[referenceIndex],
				this.cells[referenceIndex + 1],
				this.cells[referenceIndex + 2],
			];

			if(x == this.w-2){
				referenceCells = [
					this.cells[referenceIndex],
					this.cells[referenceIndex],
					this.cells[referenceIndex]
				];
			}

			var affectedCellIndex = this.h * (referencePointer.y + 1) + (referencePointer.x + 1);
			var affectedCell = this.cells[affectedCellIndex];

			if(y+1 !== ruleStart){
				affectedCell.setState(matchRule(referenceCells));
			}
		}
	}

	function matchRule(cells){
		var patterns = [
			"111",
			"110",
			"101",
			"100",
			"011",
			"010",
			"001",
			"000"
		];

		var cellsPattern = cells[0].state.toString() + cells[1].state.toString() + cells[2].state.toString();

		for(var i=0; i<patterns.length; i++){
			if(cellsPattern == patterns[i]) {
				var lookup = rule.toString(2);
				var paddingLength = patterns.length-lookup.length;

				for(var j=0; j<paddingLength; j++){
					lookup = "0" + lookup;
				}

				return lookup[i];
			}
		}
	}
};


$(document).ready(function() {
    // insert your custom code here
});
