//these are predefined settings for various types of loaders
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


(function($){
	$.fn.loader = function(opts, args){
		if (!opts){ opts = {}; }
		var $self = this;
		var key = 'loader';
		
		var settings = this.data(key + '-settings');
		var data = this.data(key + '-data');
		
		//first time init
		if (!settings){
			data = {
				tickInterval: null,
				r: null,
				defaults: {
					start: false,
					type: 'dots',
					r1: 7,	//r1 & r2 are used for lines (start and end points)
					r2: 12,	
					d: 12,	//this is used for type 'dots' (distance from center)
					width: 2,
					color: '#111',
					sectors: 8
				},
				types: ['dots', 'lines'],
				cx: 0,
				cy: 0,
				beta: 0,
				sectors: [],
				opacity: [],
				params: {}
			};
		}
		
		var methods = {
			//initialize
			init: function(){
				if (!$self.attr('id')){ $self.attr('id', key + '-' + Math.random(10000)); }
				
				Raphael.getColor.reset();
				
				settings = data.defaults;
				methods.updateSettings(opts);
				
				if (settings.type == 'dots'){
					settings.r1 = settings.d;
					settings.r2 = settings.d;
				}
				
				methods._calc();
				//one tick makes sure all opacities are synced immediately
				methods.tick();
				
				if (settings.start){
					methods.start();
				}
			},
			//update settings data
			updateSettings: function(opts){
				if (opts){
					settings = $.extend(settings, opts);
					$self.data(key + '-settings', settings);
				}
			},
			saveData: function(){
				$self.data('loader-data', data);
			},
			_calc: function(opts){
				methods.updateSettings( opts );
				
				if (data.r){
					data.r.clear();
					data.r.setSize( settings.r2 * 2 + settings.width * 2, settings.r2 * 2 + settings.width * 2 );
				}
				else{
					data.r = Raphael($self.attr('id'), settings.r2 * 2 + settings.width * 2, settings.r2 * 2 + settings.width * 2);
				}
				
				data.cx = settings.r2 + settings.width;
				data.cy = settings.r2 + settings.width;
				data.sectors = [];
				data.opacity = [];
				data.beta = 2 * Math.PI / settings.sectors;
				
				if (settings.type == 'lines'){
					data.params = { stroke: settings.color, "stroke-width": settings.width, "stroke-linecap": "round" };
				}
				else if (settings.type == 'dots'){
					data.params = { fill: settings.color, stroke:'none' };
				}
				
				for (var i = 0; i < settings.sectors; i++) {
				    var alpha = data.beta * i - Math.PI / 2,
				        cos = Math.cos(alpha),
				        sin = Math.sin(alpha)
					;
					
					data.opacity[i] = 1 / settings.sectors * i;
					var newSector = null;
					
					if (settings.type == 'lines'){
						newSector = data.r.path([["M", data.cx + settings.r1 * cos, data.cy + settings.r1 * sin], ["L", data.cx + settings.r2 * cos, data.cy + settings.r2 * sin]]).attr(data.params);
					}
					else if (settings.type == 'dots'){
						newSector = data.r.circle(data.cx + settings.r2 * cos, data.cy + settings.r2 * sin, settings.width).attr(data.params);
					}
					
					data.sectors.push( newSector );
				}
				
				methods.saveData();
			},
			start: function(){
				//just incase start were to get called while it's already running, clear the old one
				if (data.tickInterval){ clearInterval(data.tickInterval); }
				
				data.tickInterval = setInterval(function(){
					methods.tick();
				}, 1000 / settings.sectors);
			},
			pause: function(){
				if (data.tickInterval){
					clearInterval(data.tickInterval);
				}
			},
			//this is more of a wrapper/helper to hide and stop at the same time
			hide: function(){
				methods.pause();
				$self.hide();
			},
			//this is also a wrapper/helper to start and show at the same time
			show: function(){
				methods.start();
				//manaully firing this first tick makes it looks smoother when it shows up instead of waiting
				//for the first interval to be called
				methods.tick();
				$self.show();
			},
			tick: function(){
				data.opacity.unshift( data.opacity.pop() );
			    for (var i = 0; i < settings.sectors; i++) {
			        data.sectors[i].attr("opacity", data.opacity[i]);
			    }
			    data.r.safari();
			
				methods.saveData();
			}
		};
		
		if (typeof(opts) == 'string'){
			if (opts in methods){
				var r = methods[opts](args);
				if (!r){ return $self; }
				else{ return r; }
			}
		}
		else{
			methods.init();
			return $self;
		}
	}
})( jQuery );