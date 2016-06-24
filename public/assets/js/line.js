"use strict";

var radians = function(x) { return x * Math.PI / 180 };
var degrees = function(x) { return x / Math.PI * 180 };

var Line = module.exports = function( x, y, direction ) {
	this.x = arguments[0] || this.x;
	this.y = arguments[1] || this.y;
	this.direction = arguments[2] || this.direction;
	this.initalDirection = this.direction;
	this.linesize = 0.2+Math.random()*2;
	this.speedn = Math.random()*3000 + 500;
};

Line.prototype = {
	x: 0,
	y: 0,
	direction: 90,
	variance: 30,
	constraints: [0, 360],
	speed: 2000,
	linesize: 1,
	cwidth: 300,
	cheight: 150,
	alive: true,
	// Changes the direction and step forward until life == 0
	moveRandom: function( delta ) {
		if ( this.alive ) {
			this.direction = Math.max( this.constraints[0], Math.min( this.constraints[1], this.direction - this.variance/2 + Math.random()*this.variance ) );
			this.x = this.x + this.speed*delta*Math.sin( radians( this.direction ) );
			this.y = this.y + this.speed*delta*Math.cos( radians( this.direction ) );
			this.alive = this.x>=0 && this.y>=0 && this.x<=this.cwidth && this.y<=this.cheight;
		}
	}
};
