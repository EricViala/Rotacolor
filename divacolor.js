/**
 * Yet another color wheel.
 * Based on the hue-saturation-value model.
 * For each hue, value is stepped from 0 to 100%, the saturation being a 
 * 100%, then the saturation is fadded to 0% while value remains at 100. 
 * 
 * Éric Viala - Paris - 2015
 */

var width=20,height=20;
var spacing = 2;
var π = Math.PI ;
var Ox,Oy;
var outerRadius , innerRadius;
var numberOfHues = 12;
var numberOfRings = 12;
var container;
var bubbles = [];
var kr = Math.sin(2*π/70);

function feedback(that){
	var fb = document.getElementById('feedback');
	if(fb){
		fb.style.display='block';
		fb.innerHTML = that + '<p/>' + fb.innerHTML;
	}
}

function initialization(){

	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		vw = w.innerWidth|| e.clientWidth || g.clientWidth ,
		vh = w.innerHeight|| e.clientHeight|| g.clientHeight;
	
	Ox=vw/2;Oy=vh/2;
	innerRadius = 0.5 * Math.min(Ox,Oy);
	container=d.getElementById('container');
	var first = container.firstChild;
	while(first){
		container.removeChild(first);
		first = container.firstChild;
	}
}

function paintNamedColors(){
	initialization();
	for(var name in tinycolor.names){
		var aColor=tinycolor(name);
		var hsv=aColor.toHsv();
		if (hsv['s']>0)
		bubbles[name] = polarColorSample(aColor)
	}
}

function polarColorSample(hsv){
	var α = (2*π/360)*hsv.toHsv()['h'];
	var s = hsv.toHsv()['s'];
	var r = innerRadius*hsv.toHsv()['v'];
	
	//desaturated colors painted on outer ring
	r=(s>0 && s<1)?innerRadius*(2-s):r;

	var rx= r* Math.cos(α);
	var ry= r* Math.sin(α);
	var x=Ox+rx;var y=Oy-ry;
	 
	return oneBubble(hsv,x,y,r*kr);
}

function oneBubble(hsv,x,y,r){
	var bubble = document.createElement('div');
	bubble.setAttribute('id',hsv.toName());
	container.appendChild(bubble);
	var sty=bubble.style;
	sty.height	=2*r+'px';
	sty.width	=2*r+'px';
	sty.borderRadius=r+'px';
	sty.backgroundColor=hsv.toHexString();
	sty.position='fixed';
	sty.left	=(x-r/2) +'px';
	sty.top		=(y-r/2) +'px';
	sty.zIndex	=Math.round(-10*hsv['h']);
	bubble.setAttribute('onmouseenter', 'bubblemouseenter(this)');
	bubble.setAttribute('onmouseleave', 'bubblemouseleave(this)');
	bubble.nominalX=x;
	bubble.nominalY=y;
	bubble.nominalR=r;
	return bubble;
}

function bubblemouseenter(bubble){
	var sty = bubble.style;
	sty.zIndex = 10;
	sty.paddingTop = '80px';
	sty.height = sty.width = '180px';
	sty.borderRadius = '60px';
	sty.borderTopLeftRadius='3px';
	//sty.left = (bubble.nominalX -20) + 'px';
	//sty.top = (bubble.nominalY -20) + 'px';
	sty.textAlign='center';
	var color = tinycolor(sty.backgroundColor);
	addCaption(color.toName());
	addCaption(color.toRgbString());
	addCaption(color.toHsvString());
	addCaption(color.toHexString(false));
	
	function addCaption(label){
		var caption = document.createElement('div');
		bubble.appendChild(caption);
		caption.style.backgroundColor='rgba(255,255,255,0.4)';
		caption.style.color='black';
		caption.style.width=bubble.style.width;
		caption.innerHTML = label;
	}
}

function bubblemouseleave(bubble){
	var sty = bubble.style;
	var color = tinycolor(sty.backgroundColor);
	sty.zIndex = Math.round( -10 * color.toHsv()['h'] );
	var name = color.toName();
	sty.borderRadius = bubble.nominalR +'px';
	sty.height = sty.width = 2 * bubble.nominalR +'px';
//	sty.left = (bubble.nominalX - bubble.nominalR/2) +'px';
//	sty.top = (bubble.nominalY - bubble.nominalR/2) +'px';
	sty.paddingTop = sty.paddingLeft = '0px';
	bubble.innerHTML = '';
}

function closefeedback(){
	var fb=document.getElementById('feedback');
	fb.style.display='none';
}