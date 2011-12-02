# Michelangeloader

## What it is
A jQuery plugin that uses RaphaelJS to create loading icons. 

## Requirements
- jQuery
- RaphaelJS

## Basic Example

````html
<div id="loader"></div>
````

````javascript
$('#loader').loader({
    type: "dots",
    width: 9,
    color: "#333333",
    start: true,
    sectors: 8,
    d: 30
});
````
## Event-Based Example

````html
<div id="loader"></div>
<a href="#" id="make-stuff">Make Stuff</a>
````

````javascript
$('#loader').loader({
	type: "dots",
	width: 9,
	color: "#333333",
	start: false,
	sectors: 8,
	d: 30
}).hide(); //chainable!

$('#make-stuff').click(function(e){
	e.preventDefault();
	
	$('#loader').loader('show');
	
	$.ajax({
		type: 'POST',
		url: '/somewhere/over/the/rainbow',
		success: function(data){
			$('#loader').loader('hide');
		}
	});
});
````

## Options

- start: bool
	o Tells the loader to begin spinning on init or to wait until 'start' is called
	
- type: string
	o Types allow for different visuals to be set for the loader, there are 2 types built in 
	  'dots' and 'lines'. Check out the demo to see the difference
	
- width: number
	o The width of the sectors, what this exactly means will vary based on type. For lines, it 
	  is the width of each line, for dots it is the radius of each dot.
	
- color: string
	o The color to use for the sectors
	
- sectors: number
	o The number of sectors to have
	
- r1: number
	o The inner circle radius (*used only for type 'lines')
	
- r2: number
	o The outer circle radius (*used only for type 'lines')
	
- d: number
	o The circle radius (*used only for type 'dots')


## Methods

- start
	o Call this method to start the spinning
	o $('#loader').loader('start')
	
- pause
	o Call this method to pause the spinning (useful when the loader is not visible so you aren't 
	  processing the animations)
	o $('#loader').loader('pause')

- show
	o This method is more of a helper than anything, it will call .show() on the element along 
	  with start.
	o $('#loader').loader('show')
	
- hide
	o Another helper, this calls .hide() and also pause
	o $('#loader').loader('hide')
	
# Some Example Settings

These are included in the resources folder in loaders.js so that you have somewhere to start

````javascript
var loaders = {
	circles: {
		//small
		small: {
			d: 9,
			width: 2.5,
			color:'#111',
			type: 'dots',
			start: true
		},
		//large
		large: {
			d: 20,
			width: 6,
			type: 'dots',
			color: '#888',
			start: true
		}
	},
	lines: {
		//small
		small: {
			r1: 7,
			r2: 12,
			width: 2,
			color:'#111',
			type: 'lines',
			start: true
		}
	}
};
````

Usage:
````javascript
$('#loader').loader( loaders.circles.large );
````


## Credit
This plugin was created by Luke Stebner and is available free for anyone to use and modify. The base 
logic was ported from the Raphael demo http://raphaeljs.com/spin-spin-spin.html and there is a live
demo available at http://lukestebner.com/michelangeloader/

