"use strict";

var Line = require('./line.js');
var canvas = $('canvas');
var c = $('canvas')[0];
var ctx = c.getContext('2d');
ctx.globalCompositeOperation = "lighter";

c.width = canvas.width();
c.height = canvas.height();

if ( c.getContext ) {

	var lines = [];
	var renderTimeout = null;

	var spawnLine = function() {
		var xpos = Math.round( Math.random() ) * c.width;
		var line = new Line( xpos, c.height*0.4 + Math.random()*c.height*0.2 );
		line.cwidth = c.width;
		line.cheight = c.height;
		line.constraints = [ 30, 120 ];
		if ( xpos ) {
			line.direction = 270;
			line.constraints = [ 220, 320 ];
		}
		// console.log( line );
		lines.push( line );
	}

	var startRender = function() {
		// Do setup
		var rendering = false;
		if ( renderTimeout ) clearTimeout( renderTimeout );
		lines = [];
		c.width = canvas.width();
		c.height = canvas.height();
		ctx.clearRect(0, 0, c.width, c.height);
		// Spawn lines
		for ( var i = 0; i < 10; i++ ) {
			setTimeout( function() {
				spawnLine();
				if ( !rendering ) {
					render(0);
					rendering = true;
				}
			}, i );
		}
	}

	// convert 3 floats to an rgb string
	var floatToRgb = function( r, g, b ) {
		return 'rgba(' + Math.round(Math.max(0, Math.min(255, r * 255))) + ', ' + Math.round(Math.max(0, Math.min(255, g * 255))) + ', ' + Math.round(Math.max(0, Math.min(255, b * 255))) + ')';
	}
	var floatToRgba = function( r, g, b, a ) {
		return 'rgba(' + Math.round(Math.max(0, Math.min(255, r * 255))) + ', ' + Math.round(Math.max(0, Math.min(255, g * 255))) + ', ' + Math.round(Math.max(0, Math.min(255, b * 255))) + ', '+Math.max(0, Math.min(1, a))+')';
	}

	// console.log( floatToRgb(0.5, 1, 0.2) );
	
	// Async rendering
	var lastFrame = Date.now(), now, delta, line, colorMult, r, g, b;
	var render = function() {
		now = Date.now();
		delta = (now - lastFrame) / 1000;
		lastFrame = now;
		if ( lines.length ) {
			for ( var i = 0; i < lines.length; i++ ) {
				line = lines[i];
				ctx.beginPath();
				ctx.moveTo( line.x, line.y );
				colorMult = line.linesize / 3; //* ( Math.abs( c.width*0.5 - line.x ) / c.width );
				r = line.y / c.height;
				g = 0.2 + (0.8*line.x / c.width);
				b = 1;
				ctx.strokeStyle = floatToRgba(r, g, b, colorMult);
				ctx.lineWidth = line.linesize;
				line.moveRandom( delta );
				ctx.lineTo( line.x, line.y );
				ctx.stroke();
				if ( !line.alive ) {
					lines.splice( i, 1 );
					// Spawn lines forever when one dies
					// spawnLine();
				}
			}
			renderTimeout = setTimeout( function() {
				render();
			}, 0 );
		}
	}

	startRender();
	$(window).on("resize", function() {
		startRender();
	});

}

