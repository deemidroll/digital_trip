(function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length)throw Error(a.length+"/"+c);for(var d=0;d<a.length&&0==a[d];)d++;this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++)this.num[b]=a[b+d]}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},
write:function(a){for(var c=0;c<this.data.length;c++)a.put(this.data.charCodeAt(c),8)}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c)throw Error(a+","+c);return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++)b+=c[e].dataCount;
for(e=0;e<this.dataList.length;e++)c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d);if(d.getLengthInBits()<=8*b)break}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++)this.modules[d][b]=null}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-
7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++)if(!(-1>=a+d||this.moduleCount<=a+d))for(var b=-1;7>=b;b++)-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=
0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b)a=b,c=d}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++)for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}return a},
setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(a=8;a<this.moduleCount-8;a++)null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++)for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e])for(var f=-2;2>=f;f++)for(var i=-2;2>=i;i++)this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}},setupTypeNumber:function(a){for(var c=
j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++)b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++)e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-
b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e;this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2)for(6==i&&i--;;){for(var g=0;2>g;g++)if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--; -1==e&&(f++,e=7)}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,
c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++)a+=c[e].dataCount;if(b.getLengthInBits()>8*a)throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")");for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a)break;b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=
0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++)f[g][k]=255&a.buffer[k+d];d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++)h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}for(k=g=0;k<c.length;k++)g+=c[k].totalCount;d=Array(g);for(k=n=0;k<b;k++)for(g=0;g<c.length;g++)k<f[g].length&&
(d[n++]=f[g][k]);for(k=0;k<e;k++)for(g=0;g<c.length;g++)k<i[g].length&&(d[n++]=i[g][k]);return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,
78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);)c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15);return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-
j.getBCHDigit(j.G18);)c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18);return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;)c++,a>>>=1;return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+
a);}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++)c=c.multiply(new q([1,l.gexp(d)],0));return c},getLengthInBits:function(a,c){if(1<=c&&10>c)switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>c)switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>c)switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+
a);}else throw Error("type:"+c);},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++)for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++)if(!(0>b+g||c<=b+g))for(var h=-1;1>=h;h++)0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++;5<f&&(d+=3+f-5)}for(b=0;b<c-1;b++)for(e=0;e<c-1;e++)if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f)d+=3;for(b=0;b<c;b++)for(e=0;e<c-6;e++)a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+
2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40);for(e=0;e<c;e++)for(b=0;b<c-6;b++)a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40);for(e=f=0;e<c;e++)for(b=0;b<c;b++)a.isDark(b,e)&&f++;a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a)throw Error("glog("+a+")");return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return l.EXP_TABLE[a]},EXP_TABLE:Array(256),
LOG_TABLE:Array(256)},m=0;8>m;m++)l.EXP_TABLE[m]=1<<m;for(m=8;256>m;m++)l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8];for(m=0;255>m;m++)l.LOG_TABLE[l.EXP_TABLE[m]]=m;q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var b=0;b<a.getLength();b++)c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)));return new q(c,0)},mod:function(a){if(0>
this.getLength()-a.getLength())return this;for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++)d[b]=this.get(b);for(b=0;b<a.getLength();b++)d[b]^=l.gexp(l.glog(a.get(b))+c);return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],
[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,
116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,
43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,
3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,
55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,
45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c);for(var b=d.length/3,e=[],f=0;f<b;f++)for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++)e.push(new p(g,j));return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*
(a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++)this.putBit(1==(a>>>c-d-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,
correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++)for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),
j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++)r("<td></td>").css("width",
d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}a=c;jQuery(a).appendTo(this)})}})(jQuery);



/**
 * Global namespace for the whole library
 * @namespace Global namespace for the whole library
 * @type {Object}
 */
var Fireworks	= {};

/**
 * enable or disable debug in the library
 * @type {Boolean}
 */
Fireworks.debug	= true;//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.EffectsStackBuilder	= function(emitter){
	this._emitter	= emitter;
};

/**
 * Getter for the emitter 
*/
Fireworks.EffectsStackBuilder.prototype.emitter	= function(){
	return this._emitter;	
};

Fireworks.EffectsStackBuilder.prototype.back	= function(){
	return this._emitter;
}

Fireworks.EffectsStackBuilder.prototype.createEffect	= function(name, opts){
	var creator	= Fireworks.createEffect(name, opts).pushTo(this._emitter).back(this);
	creator.effect().emitter(this._emitter);
	return creator;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Basic Fireworks.Effect builder
*/
Fireworks.createEffect	= function(name, opts){
	// handle polymophism
	if( typeof(name) === 'object' ){
		opts	= name;
		name	= undefined;
	}
	
	var effect	= new Fireworks.Effect();
	effect.opts	= opts;
	effect.name	= name;
	effect.back	= null;
	var methods	= {
		onCreate: function(val){
			effect.onCreate	= val;
			return methods;
		},
		onBirth: function(val){
			effect.onBirth	= val;
			return methods;
		},
		onUpdate: function(val){
			effect.onUpdate	= val;
			return methods;
		},
		onDeath: function(val){
			effect.onDeath	= val;
			return methods;
		},
		onPreUpdate: function(val){
			effect.onPreUpdate	= val;
			return methods;
		},
		onPreRender: function(val){
			effect.onPreRender	= val;
			return methods;
		},
		onRender: function(val){
			effect.onRender	= val;
			return methods;
		},
		onPostRender: function(val){
			effect.onPostRender	= val;
			return methods;
		},
		onIntensityChange: function(val){
			effect.onIntensityChange= val;
			return methods;
		},
		pushTo	: function(emitter){
			emitter.effects().push(effect);
			return methods;	
		},
		back	: function(value){
			if( value === undefined )	return effect.back;	
			effect.back	= value;
			return methods;	
		},
		effect	: function(){
			return effect;
		}
	}
	return methods;
}

/**
 * An effect to apply on particles
*/
Fireworks.Effect	= function(){
	this._emitter	= null;
}

Fireworks.Effect.prototype.destroy	= function(){
}

/**
 * Getter/Setter for the emitter 
*/
Fireworks.Effect.prototype.emitter	= function(value){
	if( value === undefined )	return this._emitter;	
	this._emitter	= value;
	return this;	
};

/**
 * Callback called on particle creation
*/
//Fireworks.Effect.prototype.onCreate	= function(){
//}
//
/**
 * Callback called when a particle is spawning
 *
 * TODO to rename onSpawn
*/
//Fireworks.Effect.prototype.onBirth	= function(){
//}
//
//Fireworks.Effect.prototype.onDeath	= function(){
//}
//
//Fireworks.Effect.prototype.onUpdate	= function(){
//}

Fireworks.createEmitter	= function(opts){
	return new Fireworks.Emitter(opts);
}

/**
 * The emitter of particles
*/
Fireworks.Emitter	= function(opts){
	this._nParticles	= opts.nParticles !== undefined ? opts.nParticles : 100;
	this._particles		= [];
	this._effects		= [];
	this._started		= false;
	this._onUpdated		= null;
	this._intensity		= 0;
	this._maxDeltaTime	= 1/3;

	this._effectsStackBuilder	= new Fireworks.EffectsStackBuilder(this)
}

Fireworks.Emitter.prototype.destroy	= function()
{
	this._effects.forEach(function(effect){
		effect.destroy();
	});
	this._particles.forEach(function(particle){
		particle.destroy();
	});
}


//////////////////////////////////////////////////////////////////////////////////
//		Getters								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.effects	= function(){
	return this._effects;
}
Fireworks.Emitter.prototype.effect	= function(name){
	for(var i = 0; i < this._effects.length; i++){
		var effect	= this._effects[i];
		if( effect.name === name )	return effect;
	}
	return null;
}

Fireworks.Emitter.prototype.particles	= function(){
	return this._particles;
}
Fireworks.Emitter.prototype.liveParticles	= function(){
	return this._liveParticles;
}
Fireworks.Emitter.prototype.deadParticles	= function(){
	return this._deadParticles;
}
Fireworks.Emitter.prototype.nParticles	= function(){
	return this._nParticles;
}

Fireworks.Emitter.prototype.effectsStackBuilder	= function(){
	return this._effectsStackBuilder;
}


/**
 * Getter/setter for intensity
*/
Fireworks.Emitter.prototype.intensity	= function(value){
	// if it is a getter, return value
	if( value === undefined )	return this._intensity;
	// if the value didnt change, return for chained api
	if( value === this._intensity )	return this;
	// sanity check
	Fireworks.debug && console.assert( value >= 0, 'Fireworks.Emitter.intensity: invalid value.', value);
	Fireworks.debug && console.assert( value <= 1, 'Fireworks.Emitter.intensity: invalid value.', value);
	// backup the old value
	var oldValue	= this._intensity;
	// update the value
	this._intensity	= value;
	// notify all effects
	this._effects.forEach(function(effect){
		if( !effect.onIntensityChange )	return;
		effect.onIntensityChange(this._intensity, oldValue);			
	}.bind(this));
	return this;	// for chained API
}

/**
 * Getter/setter for intensity
*/
Fireworks.Emitter.prototype.maxDeltaTime	= function(value){
	if( value === undefined )	return this._maxDeltaTime;
	this._maxDeltaTime	= value;
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		backward compatibility						//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.setParticleData	= function(particle, namespace, value){
	particle[namespace] = value;
}

Fireworks.Emitter.prototype.getParticleData	= function(particle, namespace){
	return particle[namespace];
}

//////////////////////////////////////////////////////////////////////////////////
//		Start function							//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.start	= function()
{
	console.assert( this._effects.length > 0, "At least one effect MUST be set")
	console.assert( this._started === false );
	
	this._particles		= new Array(this._nParticles);
	for(var i = 0; i < this._nParticles; i++){
		this._particles[i]	= new Fireworks.Particle();
	}

	this._liveParticles	= [];
	this._deadParticles	= this._particles.slice(0);
	this._started		= true;

	// onCreate on all particles
	this._effects.forEach(function(effect){
		if( !effect.onCreate )	return;
		this._particles.forEach(function(particle, particleIdx){
			effect.onCreate(particle, particleIdx);			
		})
	}.bind(this));
	// set the intensity to 1
	this.intensity(1)

	return this;	// for chained API
}

Fireworks.Emitter.prototype.update	= function(deltaTime){
	// bound the deltaTime to this._maxDeltaTime
	deltaTime	= Math.min(this._maxDeltaTime, deltaTime)
	// honor effect.onPreUpdate
	this._effects.forEach(function(effect){
		if( !effect.onPreUpdate )	return;
		effect.onPreUpdate(deltaTime);			
	}.bind(this));
	// update each particles
	this._effects.forEach(function(effect){
		if( !effect.onUpdate )	return;
		this._liveParticles.forEach(function(particle){
			effect.onUpdate(particle, deltaTime);			
		})
	}.bind(this));
	return this;	// for chained API
}

Fireworks.Emitter.prototype.render	= function(){
	this._effects.forEach(function(effect){
		if( !effect.onPreRender )	return;
		effect.onPreRender();			
	}.bind(this));
	this._effects.forEach(function(effect){
		if( !effect.onRender )	return;
		this._liveParticles.forEach(function(particle){
			effect.onRender(particle);			
		})
	}.bind(this));
	this._effects.forEach(function(effect){
		if( !effect.onPostRender )	return;
		effect.onPostRender();			
	}.bind(this));
	return this;	// for chained API
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * kill this particle
*/
Fireworks.Emitter.prototype.killParticle	= function(particle)
{
	var idx	= this._liveParticles.indexOf(particle);
	// sanity check
	Fireworks.debug && console.assert( idx !== -1 );
	this._liveParticles.splice(idx, 1)
	this._deadParticles.push(particle);
	// do the death on all effects
	this.effects().forEach(function(effect){
		effect.onDeath && effect.onDeath(particle);			
	}.bind(this));
}

/**
 * Spawn a particle
*/
Fireworks.Emitter.prototype.spawnParticle	= function(){
	// sanity check
	Fireworks.debug && console.assert(this._deadParticles.length >= 1, 'no more particle available' );
	// change the particles 
	var particle	= this.deadParticles().pop();
	this.liveParticles().push(particle);
	// do the birth on all effects
	this.effects().forEach(function(effect){
		effect.onBirth && effect.onBirth(particle);			
	}.bind(this));
}
Fireworks.createLinearGradient	= function(opts){
	var LinearGradient	= new Fireworks.LinearGradient(opts);
	return LinearGradient;
}

/**
 * The emitter of particles
*/
Fireworks.LinearGradient	= function(opts){
	this._keyPoints	= [];
}

Fireworks.LinearGradient.prototype.push	= function(x, y){
	this._keyPoints.push({
		x	: x,
		y	: y
	});
	return this;
}

/**
 * Compute a value for this LinearGradient
*/
Fireworks.LinearGradient.prototype.get	= function(x){
	for( var i = 0; i < this._keyPoints.length; i++ ){
		var keyPoint	= this._keyPoints[i];
		if( x <= keyPoint.x )	break;
	}

	if( i === 0 )	return this._keyPoints[0].y;

	// sanity check
	Fireworks.debug && console.assert(i < this._keyPoints.length );

	var prev	= this._keyPoints[i-1];
	var next	= this._keyPoints[i];
	
	var ratio	= (x - prev.x) / (next.x - prev.x)
	var y		= prev.y + ratio * (next.y - prev.y)
	
	return y;
};
/**
 * The emitter of particles
*/
Fireworks.Particle	= function(){
}

Fireworks.Particle.prototype.set	= function(key, value){
	// sanity check
	Fireworks.debug && console.assert( this[key] === undefined, "key already defined: "+key );
	
	this[key]	= value;
	return this[key];
}

Fireworks.Particle.prototype.get	= function(key){
	Fireworks.debug && console.assert( this[key] !== undefined, "key undefined: "+key );
	return this[key];
}

Fireworks.Particle.prototype.has	= function(key){
	return this[key] !== undefined	? true : false;
}
Fireworks.Shape	= function(){
}

///**
// * @param {Fireworks.Vector} point the point coordinate to test
// * @returns {Boolean} true if point is inside the shape, false otherwise
//*/
//Fireworks.Shape.prototype.contains	= function(point){
//}
//
///**
// * generate a random point contained in this shape
// * @returns {Fireworks.Vector} the just generated random point
//*/
//Firefly.Shape.prototype.randomPoint	= function(vector){
//}
Fireworks.createVector = function(x, y, z){
	return new Fireworks.Vector(x,y,z);
};

/**
 * jme- copy of THREE.Vector3 https://github.com/mrdoob/three.js/blob/master/src/core/Vector3.js
 *
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

Fireworks.Vector = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


Fireworks.Vector.prototype = {

	constructor: Fireworks.Vector,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},
	
	random	: function( ) {
		this.x	= Math.random() - 0.5;
		this.y	= Math.random() - 0.5;
		this.z	= Math.random() - 0.5;
		return this;
	}, // jme - added
	
	toString	: function(){
		return JSON.stringify(this);
	}, // jme - added

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},
	
	cross: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function ( v ) {

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		return new Fireworks.Vector().sub( this, v ).lengthSq();

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	},

	clone: function () {

		return new Fireworks.Vector( this.x, this.y, this.z );

	}

};
/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.acceleration	= function(opts)
{
	opts		= opts		|| {};
	var effectId	= opts.effectId	|| 'acceleration';
	console.assert( opts.shape instanceof Fireworks.Shape );
	// create the effect itself
	Fireworks.createEffect(effectId, {
		shape	: opts.shape
	}).onCreate(function(particle){
		particle.acceleration = {
			vector	: new Fireworks.Vector()
		};
	}).onBirth(function(particle){
		var acceleration= particle.acceleration.vector;
		this.opts.shape.randomPoint(acceleration)
	}).onUpdate(function(particle, deltaTime){
		var velocity	= particle.velocity.vector;
		var acceleration= particle.acceleration.vector;
		velocity.x	+= acceleration.x * deltaTime;
		velocity.y	+= acceleration.y * deltaTime;
		velocity.z	+= acceleration.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
/**
 * Handle the friction - aka a value between 0 and 1 which multiply the velocity
 *
 * @param {Number} value the friction number between 0 and 1
*/
Fireworks.EffectsStackBuilder.prototype.friction = function(value)
{
	// handle parameter polymorphism
	value = value !== undefined ? value : 1;
	// sanity check
	console.assert( value >= 0 && value <= 1.0 );
	// create the effect itself
	Fireworks.createEffect('friction')
	.onCreate(function(particle, particleIdx){
		particle.friction = {
			value: value
		};
	})
	.onBirth(function(particle){
		var data = particle.friction;
		data.value = value
	})
	.onUpdate(function(particle){
		var friction = particle.friction.value;
		var velocity = particle.velocity.vector;
		velocity.multiplyScalar(friction);
	})
	.pushTo(this._emitter);
	// return this for chained API
	return this;
};
/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.lifeTime = function(minAge, maxAge)
{
	// sanity check
	console.assert( minAge !== undefined )
	// if maxAge isnt 
	if( maxAge === undefined )	maxAge	= minAge;
	console.assert( maxAge !== undefined )
	// create the effect itself
	var emitter	= this._emitter;
	Fireworks.createEffect('lifeTime', {
		minAge	: minAge,
		maxAge	: maxAge
	}).onCreate(function(particle){
		var data	= particle.lifeTime = {
			curAge	: 0,
			minAge	: 0,
			maxAge	: 0,
			normalizedAge	: function(){
				return (data.curAge - data.minAge) / (data.maxAge - data.minAge);
			}
		};
	}).onBirth(function(particle){
		var lifeTime	= particle.lifeTime;
		lifeTime.curAge	= 0;
		lifeTime.maxAge	= this.opts.minAge + Math.random() * (this.opts.maxAge - this.opts.minAge);
	}).onUpdate(function(particle, deltaTime){
		var lifeTime	= particle.lifeTime;
		lifeTime.curAge	+= deltaTime;
		if( lifeTime.curAge > lifeTime.maxAge )	emitter.killParticle(particle);
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.position = function(shape)
{
	console.assert( shape instanceof Fireworks.Shape );
	Fireworks.createEffect('position', {
		shape: shape
	}).onCreate(function(particle){
		particle.position = {
			vector: new Fireworks.Vector()
		};
	}).onBirth(function(particle){
		var position = particle.position.vector;
		this.opts.shape.randomPoint(position)
	}).pushTo(this._emitter);
	return this; // for chained API
};
/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.radialVelocity = function(minSpeed, maxSpeed)
{
	Fireworks.createEffect('radialVelocity', {
		minSpeed: minSpeed,
		maxSpeed: maxSpeed
	}).onCreate(function(particle){
		particle.velocity = {
			vector: new Fireworks.Vector()
		};
	}).onBirth(function(particle, deltaTime){
		var position = particle.position.vector;
		var velocity = particle.velocity.vector;
		var length = this.opts.minSpeed + (this.opts.maxSpeed - this.opts.minSpeed) * Math.random();
		velocity.copy(position).setLength(length);
	}).onUpdate(function(particle, deltaTime){
		var position = particle.position.vector;
		var velocity = particle.velocity.vector;
		position.x += velocity.x * deltaTime;
		position.y += velocity.y * deltaTime;
		position.z += velocity.z * deltaTime;
	}).pushTo(this._emitter);

	return this; // for chained API
};
/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.randomVelocityDrift	= function(drift)
{
	// create the effect itself
	Fireworks.createEffect('randomVelocityDrift', {
		drift	: drift
	}).onUpdate(function(particle, deltaTime){
		var velocity	= particle.velocity.vector;
		velocity.x	+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		velocity.y	+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		velocity.z	+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
	}).pushTo(this._emitter);
	// return for chained API
	return this;	// for chained API
};
/**
 * Create a velocity effect
 * @param {Fireworks.Shape}	shape	set the direction of the velocity by a randompoint in this shape
 * @param {Number?}		speed	set the speed itself. if undefined, keep randompoint length for speed
*/
Fireworks.EffectsStackBuilder.prototype.velocity	= function(shape, speed)
{
	Fireworks.createEffect('velocity', {
		shape	: shape, 
		speed	: speed !== undefined ? speed : -1
	}).onCreate(function(particle){
		particle.velocity = {
			vector	: new Fireworks.Vector()
		};
	}).onBirth(function(particle){
		var velocity	= particle.velocity.vector;
		this.opts.shape.randomPoint(velocity)
		if( this.opts.speed !== -1 )	velocity.setLength(this.opts.speed);
	}).onUpdate(function(particle, deltaTime){
		var position	= particle.position.vector;
		var velocity	= particle.velocity.vector;
		position.x	+= velocity.x * deltaTime;
		position.y	+= velocity.y * deltaTime;
		position.z	+= velocity.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createShapeBox	= function(positionX, positionY, positionZ, sizeX, sizeY, sizeZ){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	var size	= new Fireworks.Vector(sizeX, sizeY, sizeZ);
	return new Fireworks.Shape.Box(position, size);
};

/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} position the position of the sphape
 * @param {Fireworks.Vector} shape the size of the shape
*/
Fireworks.Shape.Box	= function(position, size)
{
	this.position	= position;
	this.size	= size;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Box.prototype = new Fireworks.Shape();
Fireworks.Shape.Box.prototype.constructor = Fireworks.Shape.Box;

Fireworks.Shape.Box.prototype.contains	= function(point){
	// compute delta between the point and the position
	var delta	= this._vector.sub(point, this.position);
	// test the delta is too far
	if( Math.abs(delta.x) > this.size.x/2 )	return false;
	if( Math.abs(delta.y) > this.size.y/2 )	return false;
	if( Math.abs(delta.z) > this.size.z/2 )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Box.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.x	= Math.random() * this.size.x - this.size.x/2;
	point.y	= Math.random() * this.size.y - this.size.y/2;
	point.z	= Math.random() * this.size.z - this.size.z/2;
	// add this.position
	point.addSelf(this.position);
	// return the point
	return point;
}
/**
 * Shortcut to create Fireworks.Shape.Point
*/
Fireworks.createShapePoint	= function(positionX, positionY, positionZ){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	return new Fireworks.Shape.Point(position);
};

/**
 * Handle a Firework.Shape forming a point
 *
 * @param {Fireworks.Vector} position the position of the point
*/
Fireworks.Shape.Point	= function(position)
{
	this.position	= position;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Point.prototype = new Fireworks.Shape();
Fireworks.Shape.Point.prototype.constructor = Fireworks.Shape.Point;

Fireworks.Shape.Point.prototype.contains	= function(point){
	if( point.x !== this.position.x )	return false;
	if( point.y !== this.position.y )	return false;
	if( point.z !== this.position.z )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Point.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.copy(this.position);
	// return the point
	return point;
}
/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createShapeSphere	= function(positionX, positionY, positionZ, radius, boundingbox){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	return new Fireworks.ShapeSphere(position, radius);
};


/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} position the position of the sphere
 * @param {Number} radius the radius of the sphere
*/
Fireworks.ShapeSphere	= function(position, radius)
{
	this.position	= position;
	this.radius	= radius;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.ShapeSphere.prototype = new Fireworks.Shape();
Fireworks.ShapeSphere.prototype.constructor = Fireworks.ShapeSphere;

Fireworks.ShapeSphere.prototype.contains	= function(point){
	// compute distance between the point and the position
	var distance	= this._vector.sub(point, this.position).length();
	// return true if this distance is <= than sphere radius
	return distance <= this.radius;
}

Fireworks.ShapeSphere.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.x	= Math.random()-0.5;
	point.y	= Math.random()-0.5;
	point.z	= Math.random()-0.5;
	// compute the length between the point 
	var length	= Math.random()*this.radius;
	// set the point at the proper distance;
	point.setLength( length );
	// add the position
	point.addSelf(this.position);
	// return the point
	return point;
}
/**
 * Spawner deliverying paricles in one shot
 * 
 * @param {Number?} the number of particle to emit
*/
Fireworks.EffectsStackBuilder.prototype.spawnerOneShot	= function(nParticles)
{
	// handle parameter polymorphism
	nParticles	= nParticles	|| this.emitter().nParticles();
	// define local variables
	var emitter	= this.emitter();
	var nSent	= 0;
	var spawning	= true;

	// create the effect itself
	Fireworks.createEffect('spawner', {
		reset	: function(){ nSent	= 0;	},
		start	: function(){ spawning	= true;	},
		stop	: function(){ spawning	= false;}
	}).onPreUpdate(function(deltaTime){
		// if spawning is false, do nothing
		if( spawning === false )	return;
		// if already completed, do nothing
		if( nParticles === nSent )	return;
		// spawn each particle
		var amount	= nParticles - nSent;
		amount		= Math.min(amount, emitter.deadParticles().length);
		for(var i = 0; i < amount; i++){
			emitter.spawnParticle();
		}
		// update the amount of sent particles
		nSent	+= amount;
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
/**
 * Spawner deliverying paricles at a steady rate
 * 
 * @param {Number?} rate the rate at which it gonna emit
*/
Fireworks.EffectsStackBuilder.prototype.spawnerSteadyRate	= function(rate)
{
	// handle parameter polymorphism
	rate	= rate !== undefined ? rate	: 1;
	// define local variables
	var emitter	= this.emitter();
	var nToCreate	= 1;
	var spawning	= true;
	
	// create the effect itself
	Fireworks.createEffect('spawner', {
		rate	: rate,
		start	: function(){ spawning = true;	},
		stop	: function(){ spawning = false;	}
	}).onPreUpdate(function(deltaTime){
		var rate	= this.opts.rate;
		// if spawning is false, do nothing
		if( spawning === false )	return;
		// update nToCreate
		nToCreate	+= rate * deltaTime;
		// nParticles is the interger part of nToCreate as you spawn them one by one
		var nParticles	= Math.floor(nToCreate);
		// dont spawn more particles than available
		// TODO here estimate how much more is needed to never lack of it
		nParticles	= Math.min(nParticles, emitter.deadParticles().length);
		// update nToCreate
		nToCreate	-= nParticles;
		// spawn each particle
		for(var i = 0; i < nParticles; i++){
			emitter.spawnParticle();
		}
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
/**
 * render to canvas
*/
Fireworks.EffectsStackBuilder.prototype.renderToCanvas	= function(opts)
{
	opts	= opts		|| {};
	var ctx	= opts.ctx	|| buildDefaultContext();
	// create the effect itself
	var effect	= Fireworks.createEffect('renderToCanvas', {
		ctx	: ctx
	}).pushTo(this._emitter);


	if( opts.type === 'arc' )		ctorTypeArc(effect);
	else if( opts.type === 'drawImage' )	ctorTypeDrawImage(effect);
	else{
		console.assert(false, 'renderToCanvas opts.type is invalid: ');
	}

	return this;	// for chained API
	

	function buildDefaultContext(){
		// build canvas element
		var canvas	= document.createElement('canvas');
		canvas.width	= window.innerWidth;
		canvas.height	= window.innerHeight;
		document.body.appendChild(canvas);
		// canvas.style
		canvas.style.position	= "absolute";
		canvas.style.left	= 0;
		canvas.style.top	= 0;
		// setup ctx
		var ctx		= canvas.getContext('2d');
		// return ctx
		return ctx;
	}

	function ctorTypeArc(){
		return effect.onCreate(function(particle, particleIdx){
			particle.renderToCanvas = {
				size	: 3
			};
		}).onRender(function(particle){
			var position	= particle.position.vector;
			var size	= particle.renderToCanvas.size;

			ctx.beginPath();
			ctx.arc(position.x + canvas.width /2, 
				position.y + canvas.height/2, size, 0, Math.PI*2, true); 
			ctx.fill();					
		});
	};
	function ctorTypeDrawImage(){
		// handle parameter polymorphism
		if( typeof(opts.image) === 'string' ){
			var images	= [new Image];
			images[0].src	= opts.image;
		}else if( opts.image instanceof Image ){
			var images	= [opts.image];
		}else if( opts.image instanceof Array ){
			var images	= opts.image;
		}else	console.assert(false, 'invalid .renderToCanvas() options')

		return effect.onCreate(function(particle, particleIdx){
			particle.renderToCanvas = {
				scale		: 1,	// should that be there ? or in its own effect ?
				opacity		: 1,	// should that be there ? or in its own effect ?
				rotation	: 0*Math.PI
			};
		}).onRender(function(particle){
			var position	= particle.position.vector;
			var data	= particle.renderToCanvas;
			var canonAge	= particle.lifeTime.normalizedAge();
			var imageIdx	= Math.floor(canonAge * images.length);
			var image	= images[imageIdx];
			// save the context
			ctx.save();
			// translate in canvas's center, and the particle position
			ctx.translate(position.x + canvas.width/2, position.y + canvas.height/2);
			// set the scale of this particles
			ctx.scale(data.scale, data.scale);
			// set the rotation
			ctx.rotate(data.rotation);
			// set ctx.globalAlpha
			ctx.globalAlpha	= data.opacity; 
			// draw the image itself
			if( image instanceof Image ){
				ctx.drawImage(image, -image.width/2, -image.height/2);			
			}else if( typeof(image) === 'object' ){
				ctx.drawImage(image.image
				 	,  image.offsetX,  image.offsetY , image.width, image.height
					, -image.width/2, -image.height/2, image.width, image.height);
			}else	console.assert(false);
			// restore the context
			ctx.restore();
		});
	};
};
/**
 * render to three.js THREE.Object3D
 * If i play with object3D.visible true/false instead of Object3D.add/remove
 * i got a lot of artefacts
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsObject3D	= function(opts)
{
	var effectId	= opts.effectId	|| 'renderToThreeParticleSystem';
	var container	= opts.container;


	// create the effect itself
	Fireworks.createEffect(effectId)
	.onCreate(function(particle, particleIdx){
		particle.threejsObject3D = {
			object3d	: opts.create()
		};
		Fireworks.debug && console.assert(particle.threejsObject3D.object3d instanceof THREE.Object3D);
		
		var object3d	= particle.threejsObject3D.object3d;

//		object3d.visible= false;
	}).onBirth(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
//		object3d.visible= true;
		container.add(object3d);
	}).onDeath(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
//		object3d.visible= false;
		container.remove(object3d);
	}).onRender(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
		var position	= particle.position.vector;
		object3d.position.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API
};
/**
 * render to three.js to THREE.ParticleSystem
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsParticleSystem	= function(opts)
{
	opts			= opts			|| {};
	var effectId		= opts.effectId		|| 'renderToThreejsParticleSystem';
	var particleSystem	= opts.particleSystem	|| defaultParticleSystem;
	// if opts.particleSystem is a function, call it to create the particleSystem
	if( typeof(particleSystem) === 'function' )	particleSystem	= particleSystem(this._emitter);
	// sanity check
	console.assert(particleSystem instanceof THREE.ParticleSystem, "particleSystem MUST be THREE.ParticleSystem");
	// some aliases
	var geometry	= particleSystem.geometry;
	console.assert(geometry.vertices.length >= this._emitter.nParticles())
	// create the effect itself
	Fireworks.createEffect(effectId, {
		particleSystem	: particleSystem
	}).onCreate(function(particle, particleIdx){
		particle.threejsParticle = {
			particleIdx	: particleIdx
		};
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(Infinity, Infinity, Infinity);
	}).onDeath(function(particle){
		var particleIdx	= particle.threejsParticle.particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(Infinity, Infinity, Infinity);
	}).onRender(function(particle){
		var particleIdx	= particle.threejsParticle.particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		var position	= particle.position.vector;
		vertex.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API

	//////////////////////////////////////////////////////////////////////////
	//		Internal Functions					//
	//////////////////////////////////////////////////////////////////////////

	function defaultParticleSystem(emitter){
		var geometry	= new THREE.Geometry();
		for( var i = 0; i < emitter.nParticles(); i++ ){
			geometry.vertices.push( new THREE.Vector3() );
		}
		var material	= new THREE.ParticleBasicMaterial({
			size		: 5,
			sizeAttenuation	: true,
			color		: 0xE01B6A,
			map		: generateTexture(),
			blending	: THREE.AdditiveBlending,
			depthWrite	: false,
			transparent	: true
		});
		var particleSystem		= new THREE.ParticleSystem(geometry, material);
		particleSystem.dynamic		= true;
		particleSystem.sortParticles	= true;
		return particleSystem;
	}

	function generateTexture(size){
		size		= size || 128;
		var canvas	= document.createElement( 'canvas' );
		var context	= canvas.getContext( '2d' );
		canvas.width	= canvas.height	= size;

		var gradient	= context.createRadialGradient( canvas.width/2, canvas.height /2, 0, canvas.width /2, canvas.height /2, canvas.width /2 );		
		gradient.addColorStop( 0  , 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.5, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.7, 'rgba(128,128,128,1)' );
		gradient.addColorStop( 1  , 'rgba(0,0,0,1)' );

		context.beginPath();
		context.arc(size/2, size/2, size/2, 0, Math.PI*2, false);
		context.closePath();

		context.fillStyle	= gradient;
		//context.fillStyle	= 'rgba(128,128,128,1)';
		context.fill();

		var texture	= new THREE.Texture( canvas );
		texture.needsUpdate = true;

		return texture;
	}
};

Fireworks.Emitter.prototype.bindTriggerDomEvents	= function(domElement){
	var tmp	= new Fireworks.BindTriggerDomEvents(this, domElement);
	return this;	// for chained API
}

Fireworks.BindTriggerDomEvents	= function(emitter, domElement){
	this._domElement= domElement	|| document.body;

	// bind mouse event
	this._onMouseDown	= function(){ emitter.effect('spawner').opts.start();	};
	this._onMouseUp		= function(){ emitter.effect('spawner').opts.stop();	};
	this._domElement.addEventListener('mousedown'	, this._onMouseDown	);
	this._domElement.addEventListener('mouseup'	, this._onMouseUp	);

	// change emitter intensity on mousewheel		
	this._onMouseWheel	= function(event){
		var intensity	= emitter.intensity();
		intensity	+= event.wheelDelta < 0 ? -0.05 : 0.05;
		intensity	= Math.max(intensity, 0);
		intensity	= Math.min(intensity, 1);
		emitter.intensity(intensity);
	};
	this._domElement.addEventListener('mousewheel'	, this._onMouseWheel	);
}


Fireworks.BindTriggerDomEvents.prototype.destroy	= function(){
	this._domElement.removeEventListener('mousedown'	, this._onMouseDown	);
	this._domElement.removeEventListener('mouseup'		, this._onMouseUp	);
	this._domElement.removeEventListener('mousewheel'	, this._onMouseWheel	);
};
Fireworks.DatGui4Emitter	= function(emitter){
	var gui		= new dat.GUI();
	var effects	= emitter.effects();
	effects.forEach(function(effect, idx){
		var effectName	= effect.name	|| "effect-"+idx;
		var opts	= effect.opts	|| {};
		var keys	= Object.keys(opts).filter(function(key){
			if( opts[key] instanceof Fireworks.Vector )	return true;
			if( typeof(opts[key]) === 'object' )		return false;
			return true;
		});
		if( keys.length ){
			var folder	= gui.addFolder('Effect: '+effectName);
			keys.forEach(function(key){
				if( opts[key] instanceof Fireworks.Vector ){
					folder.add(opts[key], 'x').name(key+"X");
					folder.add(opts[key], 'y').name(key+"Y");
					folder.add(opts[key], 'z').name(key+"Z");
				}else{
					folder.add(opts, key);
				}
			});
		}
	});
	// return the built gui
	return gui;
};Fireworks.ProceduralTextures	= {};

Fireworks.ProceduralTextures.buildTexture	= function(size)
{
	size		= size || 150;
	var canvas	= document.createElement( 'canvas' );
	var context	= canvas.getContext( '2d' );
	canvas.width	= canvas.height	= size;

	var gradient	= context.createRadialGradient( canvas.width/2, canvas.height /2, 0, canvas.width /2, canvas.height /2, canvas.width /2 );		
	gradient.addColorStop( 0  , 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.5, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.7, 'rgba(128,128,128,1)' );
	gradient.addColorStop( 1  , 'rgba(0,0,0,1)' );

	context.beginPath();
	context.arc(size/2, size/2, size/2, 0, Math.PI*2, false);
	context.closePath();

	context.fillStyle	= gradient;
	//context.fillStyle	= 'rgba(128,128,128,1)';
	context.fill();

	var texture	= new THREE.Texture( canvas );
	texture.needsUpdate = true;

	return texture;
}


/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = new THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: stop updating renderer and camera
//
// ```windowResize.destroy()```
// # Code

//

/** @namespace */
var THREEx	= THREEx || {}

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight )
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	}
	// bind the resize event
	window.addEventListener('resize', callback, false)
	// return .stop() the function to stop watching window resize
	return {
		trigger	: function(){
			callback()
		},
		/**
		 * Stop watching window resize
		*/
		destroy	: function(){
			window.removeEventListener('resize', callback)
		}
	}
}

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */
/** @namespace */
var THREEx	= THREEx || {}

/**
 * provide info on THREE.WebGLRenderer
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.RendererStats	= function (){

	var msMin	= 100;
	var msMax	= 0;

	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var msDiv	= document.createElement( 'div' );
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
	container.appendChild( msDiv );

	var msText	= document.createElement( 'div' );
	msText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML= 'WebGLRenderer';
	msDiv.appendChild( msText );
	
	var msTexts	= [];
	var nLines	= 9;
	for(var i = 0; i < nLines; i++){
		msTexts[i]	= document.createElement( 'div' );
		msTexts[i].style.cssText = 'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
		msDiv.appendChild( msTexts[i] );		
		msTexts[i].innerHTML= '-';
	}


	var lastTime	= Date.now();
	return {
		domElement: container,

		update: function(webGLRenderer){
			// sanity check
			console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/30 )	return;
			lastTime	= Date.now()

			var i	= 0;
			msTexts[i++].textContent = "== Memory =====";
			msTexts[i++].textContent = "Programs: "	+ webGLRenderer.info.memory.programs;
			msTexts[i++].textContent = "Geometries: "+webGLRenderer.info.memory.geometries;
			msTexts[i++].textContent = "Textures: "	+ webGLRenderer.info.memory.textures;

			msTexts[i++].textContent = "== Render =====";
			msTexts[i++].textContent = "Calls: "	+ webGLRenderer.info.render.calls;
			msTexts[i++].textContent = "Vertices: "	+ webGLRenderer.info.render.vertices;
			msTexts[i++].textContent = "Faces: "	+ webGLRenderer.info.render.faces;
			msTexts[i++].textContent = "Points: "	+ webGLRenderer.info.render.points;
		}
	}	
};
/*
 * A bunch of parametric curves
 * @author zz85
 *
 * Formulas collected from various sources
 *	http://mathworld.wolfram.com/HeartCurve.html
 *	http://mathdl.maa.org/images/upload_library/23/stemkoski/knots/page6.html
 *	http://en.wikipedia.org/wiki/Viviani%27s_curve
 *	http://mathdl.maa.org/images/upload_library/23/stemkoski/knots/page4.html
 *	http://www.mi.sanu.ac.rs/vismath/taylorapril2011/Taylor.pdf
 *	http://prideout.net/blog/?p=44
 */

// Lets define some curves
THREE.Curves = {};


 THREE.Curves.GrannyKnot = THREE.Curve.create( function(){},

	 function(t) {
	    t = 2 * Math.PI * t;

	    var x = -0.22 * Math.cos(t) - 1.28 * Math.sin(t) - 0.44 * Math.cos(3 * t) - 0.78 * Math.sin(3 * t);
	    var y = -0.1 * Math.cos(2 * t) - 0.27 * Math.sin(2 * t) + 0.38 * Math.cos(4 * t) + 0.46 * Math.sin(4 * t);
	    var z = 0.7 * Math.cos(3 * t) - 0.4 * Math.sin(3 * t);
	    return new THREE.Vector3(x, y, z).multiplyScalar(20);
	}
);

THREE.Curves.HeartCurve = THREE.Curve.create(

function(s) {

	this.scale = (s === undefined) ? 5 : s;

},

function(t) {

	t *= 2 * Math.PI;

	var tx = 16 * Math.pow(Math.sin(t), 3);
	var ty = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t), tz = 0;

	return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

}

);



// Viviani's Curve
THREE.Curves.VivianiCurve = THREE.Curve.create(

	function(radius) {

		this.radius = radius;
	},

	function(t) {

		t = t * 4 * Math.PI; // Normalized to 0..1
		var a = this.radius / 2;
		var tx = a * (1 + Math.cos(t)),
			ty = a * Math.sin(t),
			tz = 2 * a * Math.sin(t / 2);

		return new THREE.Vector3(tx, ty, tz);

	}

);


THREE.Curves.KnotCurve = THREE.Curve.create(

	function() {

	},

	function(t) {

		t *= 2 * Math.PI;

		var R = 10;
		var s = 50;
		var tx = s * Math.sin(t),
			ty = Math.cos(t) * (R + s * Math.cos(t)),
			tz = Math.sin(t) * (R + s * Math.cos(t));

		return new THREE.Vector3(tx, ty, tz);

	}

);

THREE.Curves.HelixCurve = THREE.Curve.create(

	function() {

	},

	function(t) {

		var a = 30; // radius
		var b = 150; //height
		var t2 = 2 * Math.PI * t * b / 30;
		var tx = Math.cos(t2) * a,
			ty = Math.sin(t2) * a,
			tz = b * t;

		return new THREE.Vector3(tx, ty, tz);

	}

);

THREE.Curves.TrefoilKnot = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 10 : s;

	},

	function(t) {

		t *= Math.PI * 2;
		var tx = (2 + Math.cos(3 * t)) * Math.cos(2 * t),
			ty = (2 + Math.cos(3 * t)) * Math.sin(2 * t),
			tz = Math.sin(3 * t);

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

	}

);

THREE.Curves.TorusKnot = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 10 : s;

	},

	function(t) {

		var p = 3,
			q = 4;
		t *= Math.PI * 2;
		var tx = (2 + Math.cos(q * t)) * Math.cos(p * t),
			ty = (2 + Math.cos(q * t)) * Math.sin(p * t),
			tz = Math.sin(q * t);

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

	}

);


THREE.Curves.CinquefoilKnot = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 10 : s;

	},

	function(t) {

		var p = 2,
			q = 5;
		t *= Math.PI * 2;
		var tx = (2 + Math.cos(q * t)) * Math.cos(p * t),
			ty = (2 + Math.cos(q * t)) * Math.sin(p * t),
			tz = Math.sin(q * t);

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

	}

);


THREE.Curves.TrefoilPolynomialKnot = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 10 : s;

	},

	function(t) {

		t = t * 4 - 2;
		var tx = Math.pow(t, 3) - 3 * t,
			ty = Math.pow(t, 4) - 4 * t * t,
			tz = 1 / 5 * Math.pow(t, 5) - 2 * t;

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

	}

);

// var scaleTo = function(x, y) {
//   var r = y - x;
//   return function(t) {
//     t * r + x;
//   };
// }
var scaleTo = function(x, y, t) {

		var r = y - x;
		return t * r + x;

	}

THREE.Curves.FigureEightPolynomialKnot = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 1 : s;

	},

	function(t) {

		t = scaleTo(-4, 4, t);
		var tx = 2 / 5 * t * (t * t - 7) * (t * t - 10),
			ty = Math.pow(t, 4) - 13 * t * t,
			tz = 1 / 10 * t * (t * t - 4) * (t * t - 9) * (t * t - 12);

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

	}

);

THREE.Curves.DecoratedTorusKnot4a = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 40 : s;

	},

	function(t) {

		t *= Math.PI * 2;
		var
		x = Math.cos(2 * t) * (1 + 0.6 * (Math.cos(5 * t) + 0.75 * Math.cos(10 * t))),
			y = Math.sin(2 * t) * (1 + 0.6 * (Math.cos(5 * t) + 0.75 * Math.cos(10 * t))),
			z = 0.35 * Math.sin(5 * t);

		return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);

	}

);


THREE.Curves.DecoratedTorusKnot4b = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 40 : s;

	},

	function(t) {
		var fi = t * Math.PI * 2;
		var x = Math.cos(2 * fi) * (1 + 0.45 * Math.cos(3 * fi) + 0.4 * Math.cos(9 * fi)),
			y = Math.sin(2 * fi) * (1 + 0.45 * Math.cos(3 * fi) + 0.4 * Math.cos(9 * fi)),
			z = 0.2 * Math.sin(9 * fi);

		return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);

	}

);


THREE.Curves.DecoratedTorusKnot5a = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 40 : s;

	},

	function(t) {

		var fi = t * Math.PI * 2;
		var x = Math.cos(3 * fi) * (1 + 0.3 * Math.cos(5 * fi) + 0.5 * Math.cos(10 * fi)),
			y = Math.sin(3 * fi) * (1 + 0.3 * Math.cos(5 * fi) + 0.5 * Math.cos(10 * fi)),
			z = 0.2 * Math.sin(20 * fi);

		return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);

	}

);

THREE.Curves.DecoratedTorusKnot5c = THREE.Curve.create(

	function(s) {

		this.scale = (s === undefined) ? 40 : s;

	},

	function(t) {

		var fi = t * Math.PI * 2;
		var x = Math.cos(4 * fi) * (1 + 0.5 * (Math.cos(5 * fi) + 0.4 * Math.cos(20 * fi))),
			y = Math.sin(4 * fi) * (1 + 0.5 * (Math.cos(5 * fi) + 0.4 * Math.cos(20 * fi))),
			z = 0.35 * Math.sin(15 * fi);

		return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);

	}

);
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define([],b):a.headtrackr=b()}(this,function(){function a(){return!!document.createElement("video").canPlayType}function c(){if(!a())return!1;var b=document.createElement("video");return b.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')}function d(){if(!a())return!1;var b=document.createElement("video");return b.canPlayType('video/ogg; codecs="theora, vorbis"')}function e(){if(!a())return!1;var b=document.createElement("video");return b.canPlayType('video/webm; codecs="vp8, vorbis"')}var headtrackr={};return headtrackr.rev=2,headtrackr.Tracker=function(b){if(b||(b={}),void 0===b.smoothing&&(b.smoothing=!0),void 0===b.retryDetection&&(b.retryDetection=!0),void 0===b.ui&&(b.ui=!0),void 0===b.debug)b.debug=!1;else if("CANVAS"!=b.debug.tagName)b.debug=!1;else var f=b.debug.getContext("2d");void 0===b.detectionInterval&&(b.detectionInterval=20),void 0===b.fadeVideo&&(b.fadeVideo=!1),void 0===b.cameraOffset&&(b.cameraOffset=11.5),void 0===b.calcAngles&&(b.calcAngles=!1),void 0===b.headPosition&&(b.headPosition=!0);var g,h,i,j,k,l,m,n,o=0,p=!1,q=!1,r=!0,s=!1,t=[];this.status="",this.stream=void 0;var u=document.createEvent("Event");u.initEvent("headtrackrStatus",!0,!0);var v=function(a){u.status=a,document.dispatchEvent(u),this.status=a}.bind(this),w=function(f){if(void 0===b.altVideo)return!1;if(a()){if(b.altVideo.ogv&&d())f.src=b.altVideo.ogv;else if(b.altVideo.mp4&&c())f.src=b.altVideo.mp4;else{if(!b.altVideo.webm||!e())return!1;f.src=b.altVideo.webm}return f.play(),!0}};this.init=function(a,c,d){if(void 0===d||1==d){if(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia,window.URL=window.URL||window.webkitURL||window.msURL||window.mozURL,navigator.getUserMedia){v("getUserMedia");var e={video:!0};if(window.navigator.appVersion.match(/Chrome\/(.*?) /)){var f=parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1],10);20>f&&(e="video")}window.opera&&(window.URL=window.URL||{},window.URL.createObjectURL||(window.URL.createObjectURL=function(a){return a})),navigator.getUserMedia(e,function(b){v("camera found"),this.stream=b,a.mozCaptureStream?a.mozSrcObject=b:a.src=window.URL&&window.URL.createObjectURL(b)||b,a.play()}.bind(this),function(){v("no camera"),w(a)})}else if(v("no getUserMedia"),!w(a))return!1;a.addEventListener("playing",function(){a.width>a.height?a.width=320:a.height=240},!1)}l=a,canvasElement=c,k=c.getContext("2d"),b.ui&&(g=new headtrackr.Ui),h=new headtrackr.Smoother(.35,b.detectionInterval+15),this.initialized=!0},track=function(){k.drawImage(l,0,0,canvasElement.width,canvasElement.height),void 0===i&&(i=new headtrackr.facetrackr.Tracker({debug:b.debug,calcAngles:b.calcAngles}),i.init(canvasElement)),i.track();var a=i.getTrackingObject({debug:b.debug});if("WB"==a.detection&&v("whitebalance"),r&&"VJ"==a.detection&&v("detecting"),0!=a.confidence){if("VJ"==a.detection){void 0===n&&(n=(new Date).getTime()),(new Date).getTime()-n>5e3&&v("hints");{a.x+a.width/2,a.y+a.height/2}b.debug&&(f.strokeStyle="#0000CC",f.strokeRect(a.x,a.y,a.width,a.height))}if("CS"==a.detection){{a.x,a.y}if(void 0!==n&&(n=void 0),b.debug&&(f.translate(a.x,a.y),f.rotate(a.angle-Math.PI/2),f.strokeStyle="#00CC00",f.strokeRect(-(a.width/2)>>0,-(a.height/2)>>0,a.width,a.height),f.rotate(Math.PI/2-a.angle),f.translate(-a.x,-a.y)),!s&&b.fadeVideo&&(y(),s=!0),this.status="tracking",0==a.width||0==a.height)b.retryDetection?(v("redetecting"),i=new headtrackr.facetrackr.Tracker({whitebalancing:!1,debug:b.debug,calcAngles:b.calcAngles}),i.init(canvasElement),q=!1,j=void 0,s&&(l.style.opacity=1,s=!1)):(v("lost"),this.stop());else if(q||(v("found"),q=!0),b.smoothing&&(h.initialized||h.init(a),a=h.smooth(a)),void 0===j&&b.headPosition){var c=!1,d=Math.sqrt(a.width*a.width+a.height*a.height);t.length<6?t.push(d):(t.splice(0,1),t.push(d),Math.max.apply(null,t)-Math.min.apply(null,t)<5&&(c=!0)),c&&(r?(j=void 0===b.fov?new headtrackr.headposition.Tracker(a,canvasElement.width,canvasElement.height,{distance_from_camera_to_screen:b.cameraOffset}):new headtrackr.headposition.Tracker(a,canvasElement.width,canvasElement.height,{fov:b.fov,distance_from_camera_to_screen:b.cameraOffset}),o=j.getFOV(),r=!1):j=new headtrackr.headposition.Tracker(a,canvasElement.width,canvasElement.height,{fov:o,distance_from_camera_to_screen:b.cameraOffset}),j.track(a))}else b.headPosition&&j.track(a)}}p&&(m=window.setTimeout(track,b.detectionInterval))}.bind(this);var x=function(){try{k.drawImage(l,0,0,canvasElement.width,canvasElement.height);var a=headtrackr.getWhitebalance(canvasElement);a>0?(p=!0,track()):window.setTimeout(x,100)}catch(b){window.setTimeout(x,100)}};this.start=function(){return this.initialized?l.currentTime>0&&!l.paused&&!l.ended?(x(),!0):(p=!0,l.addEventListener("playing",x,!1),!0):!1},this.stop=function(){return window.clearTimeout(m),p=!1,v("stopped"),i=void 0,q=!1,!0},this.stopStream=function(){void 0!==this.stream&&this.stream.stop()},this.getFOV=function(){return o};var y=function(){""==l.style.opacity?(l.style.opacity=.98,window.setTimeout(y,50)):l.style.opacity>.3?(l.style.opacity-=.02,window.setTimeout(y,50)):l.style.opacity=.3}},Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d?this:a||window,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),headtrackr.ccv={},headtrackr.ccv.grayscale=function(a){for(var b,c,d=a.getContext("2d"),e=d.getImageData(0,0,a.width,a.height),f=e.data,g=a.width*a.height*4;g>0;)f[g-=4]=f[b=g+1]=f[c=g+2]=.3*f[g]+.59*f[b]+.11*f[c];return d.putImageData(e,0,0),a},headtrackr.ccv.array_group=function(a,b){var c,d,e=new Array(a.length);for(c=0;c<a.length;c++)e[c]={parent:-1,element:a[c],rank:0};for(c=0;c<a.length;c++)if(e[c].element){for(var f=c;-1!=e[f].parent;)f=e[f].parent;for(d=0;d<a.length;d++)if(c!=d&&e[d].element&&b(e[c].element,e[d].element)){for(var g=d;-1!=e[g].parent;)g=e[g].parent;if(g!=f){e[f].rank>e[g].rank?e[g].parent=f:(e[f].parent=g,e[f].rank==e[g].rank&&e[g].rank++,f=g);for(var h,i=d;-1!=e[i].parent;)h=i,i=e[i].parent,e[h].parent=f;for(i=c;-1!=e[i].parent;)h=i,i=e[i].parent,e[h].parent=f}}}var j=new Array(a.length),k=0;for(c=0;c<a.length;c++){d=-1;var l=c;if(e[l].element){for(;-1!=e[l].parent;)l=e[l].parent;e[l].rank>=0&&(e[l].rank=~k++),d=~e[l].rank}j[c]=d}return{index:j,cat:k}},headtrackr.ccv.detect_objects=function(a,b,c,d){var e=Math.pow(2,1/(c+1)),f=c+1,g=Math.floor(Math.log(Math.min(b.width,b.height))/Math.log(e)),h=new Array(4*(g+2*f));h[0]=a,h[0].data=h[0].getContext("2d").getImageData(0,0,h[0].width,h[0].height).data;var i,j,k,l,m,n;for(i=1;c>=i;i++)h[4*i]=document.createElement("canvas"),h[4*i].width=Math.floor(h[0].width/Math.pow(e,i)),h[4*i].height=Math.floor(h[0].height/Math.pow(e,i)),h[4*i].getContext("2d").drawImage(h[0],0,0,h[0].width,h[0].height,0,0,h[4*i].width,h[4*i].height),h[4*i].data=h[4*i].getContext("2d").getImageData(0,0,h[4*i].width,h[4*i].height).data;for(i=f;g+2*f>i;i++)h[4*i]=document.createElement("canvas"),h[4*i].width=Math.floor(h[4*i-4*f].width/2),h[4*i].height=Math.floor(h[4*i-4*f].height/2),h[4*i].getContext("2d").drawImage(h[4*i-4*f],0,0,h[4*i-4*f].width,h[4*i-4*f].height,0,0,h[4*i].width,h[4*i].height),h[4*i].data=h[4*i].getContext("2d").getImageData(0,0,h[4*i].width,h[4*i].height).data;for(i=2*f;g+2*f>i;i++)h[4*i+1]=document.createElement("canvas"),h[4*i+1].width=Math.floor(h[4*i-4*f].width/2),h[4*i+1].height=Math.floor(h[4*i-4*f].height/2),h[4*i+1].getContext("2d").drawImage(h[4*i-4*f],1,0,h[4*i-4*f].width-1,h[4*i-4*f].height,0,0,h[4*i+1].width-2,h[4*i+1].height),h[4*i+1].data=h[4*i+1].getContext("2d").getImageData(0,0,h[4*i+1].width,h[4*i+1].height).data,h[4*i+2]=document.createElement("canvas"),h[4*i+2].width=Math.floor(h[4*i-4*f].width/2),h[4*i+2].height=Math.floor(h[4*i-4*f].height/2),h[4*i+2].getContext("2d").drawImage(h[4*i-4*f],0,1,h[4*i-4*f].width,h[4*i-4*f].height-1,0,0,h[4*i+2].width,h[4*i+2].height-2),h[4*i+2].data=h[4*i+2].getContext("2d").getImageData(0,0,h[4*i+2].width,h[4*i+2].height).data,h[4*i+3]=document.createElement("canvas"),h[4*i+3].width=Math.floor(h[4*i-4*f].width/2),h[4*i+3].height=Math.floor(h[4*i-4*f].height/2),h[4*i+3].getContext("2d").drawImage(h[4*i-4*f],1,1,h[4*i-4*f].width-1,h[4*i-4*f].height-1,0,0,h[4*i+3].width-2,h[4*i+3].height-2),h[4*i+3].data=h[4*i+3].getContext("2d").getImageData(0,0,h[4*i+3].width,h[4*i+3].height).data;for(j=0;j<b.stage_classifier.length;j++)b.stage_classifier[j].orig_feature=b.stage_classifier[j].feature;var o=1,p=1,q=[0,1,0,1],r=[0,0,1,1],s=[];for(i=0;g>i;i++){var t=h[4*i+8*f].width-Math.floor(b.width/4),u=h[4*i+8*f].height-Math.floor(b.height/4),v=[4*h[4*i].width,4*h[4*i+4*f].width,4*h[4*i+8*f].width],w=[16*h[4*i].width-16*t,8*h[4*i+4*f].width-8*t,4*h[4*i+8*f].width-4*t];for(j=0;j<b.stage_classifier.length;j++){var x=b.stage_classifier[j].orig_feature,y=b.stage_classifier[j].feature=new Array(b.stage_classifier[j].count);for(k=0;k<b.stage_classifier[j].count;k++)for(y[k]={size:x[k].size,px:new Array(x[k].size),pz:new Array(x[k].size),nx:new Array(x[k].size),nz:new Array(x[k].size)},n=0;n<x[k].size;n++)y[k].px[n]=4*x[k].px[n]+x[k].py[n]*v[x[k].pz[n]],y[k].pz[n]=x[k].pz[n],y[k].nx[n]=4*x[k].nx[n]+x[k].ny[n]*v[x[k].nz[n]],y[k].nz[n]=x[k].nz[n]}for(n=0;4>n;n++){var z=[h[4*i].data,h[4*i+4*f].data,h[4*i+8*f+n].data],A=[8*q[n]+r[n]*h[4*i].width*8,4*q[n]+r[n]*h[4*i+4*f].width*4,0];for(m=0;u>m;m++){for(l=0;t>l;l++){var B=0,C=!0;for(j=0;j<b.stage_classifier.length;j++){B=0;var D=b.stage_classifier[j].alpha,y=b.stage_classifier[j].feature;for(k=0;k<b.stage_classifier[j].count;k++){var E,F,G=y[k],H=z[G.pz[0]][A[G.pz[0]]+G.px[0]],I=z[G.nz[0]][A[G.nz[0]]+G.nx[0]];if(I>=H)B+=D[2*k];else{var J,K=!0;for(J=0;J<G.size;J++){if(G.pz[J]>=0&&(E=z[G.pz[J]][A[G.pz[J]]+G.px[J]],H>E)){if(I>=E){K=!1;break}H=E}if(G.nz[J]>=0&&(F=z[G.nz[J]][A[G.nz[J]]+G.nx[J]],F>I)){if(F>=H){K=!1;break}I=F}}B+=K?D[2*k+1]:D[2*k]}}if(B<b.stage_classifier[j].threshold){C=!1;break}}C&&s.push({x:(4*l+2*q[n])*o,y:(4*m+2*r[n])*p,width:b.width*o,height:b.height*p,neighbor:1,confidence:B}),A[0]+=16,A[1]+=8,A[2]+=4}A[0]+=w[0],A[1]+=w[1],A[2]+=w[2]}}o*=e,p*=e}for(j=0;j<b.stage_classifier.length;j++)b.stage_classifier[j].feature=b.stage_classifier[j].orig_feature;if(d>0){var L=headtrackr.ccv.array_group(s,function(a,b){var c=Math.floor(.25*a.width+.5);return b.x<=a.x+c&&b.x>=a.x-c&&b.y<=a.y+c&&b.y>=a.y-c&&b.width<=Math.floor(1.5*a.width+.5)&&Math.floor(1.5*b.width+.5)>=a.width}),M=L.cat,N=L.index,O=new Array(M+1);for(i=0;i<O.length;i++)O[i]={neighbors:0,x:0,y:0,width:0,height:0,confidence:0};for(i=0;i<s.length;i++){var P=s[i],Q=N[i];0==O[Q].neighbors&&(O[Q].confidence=P.confidence),++O[Q].neighbors,O[Q].x+=P.x,O[Q].y+=P.y,O[Q].width+=P.width,O[Q].height+=P.height,O[Q].confidence=Math.max(O[Q].confidence,P.confidence)}var R=[];for(i=0;M>i;i++){var F=O[i].neighbors;F>=d&&R.push({x:(2*O[i].x+F)/(2*F),y:(2*O[i].y+F)/(2*F),width:(2*O[i].width+F)/(2*F),height:(2*O[i].height+F)/(2*F),neighbors:O[i].neighbors,confidence:O[i].confidence})}var S=[];for(i=0;i<R.length;i++){var P=R[i],C=!0;for(j=0;j<R.length;j++){var T=R[j],U=Math.floor(.25*T.width+.5);if(i!=j&&P.x>=T.x-U&&P.y>=T.y-U&&P.x+P.width<=T.x+T.width+U&&P.y+P.height<=T.y+T.height+U&&(T.neighbors>Math.max(3,P.neighbors)||P.neighbors<3)){C=!1;break}}C&&S.push(P)}return S}return s},headtrackr.cascade={count:16,width:24,height:24,stage_classifier:[{count:4,threshold:-4.57753,feature:[{size:4,px:[3,5,8,11],py:[2,2,6,3],pz:[2,1,1,0],nx:[8,4,0,0],ny:[4,4,0,0],nz:[1,1,-1,-1]},{size:3,px:[3,6,7],py:[7,13,0],pz:[1,0,-1],nx:[2,3,4],ny:[5,4,4],nz:[2,1,1]},{size:5,px:[5,3,10,13,11],py:[1,0,3,2,2],pz:[1,2,0,0,0],nx:[0,11,0,11,11],ny:[0,2,3,1,1],nz:[1,1,0,1,-1]},{size:5,px:[6,12,12,9,12],py:[4,13,12,7,11],pz:[1,0,0,1,0],nx:[8,0,8,2,11],ny:[4,0,8,5,1],nz:[1,-1,-1,-1,-1]}],alpha:[-2.879683,2.879683,-1.569341,1.569341,-1.286131,1.286131,-1.157626,1.157626]},{count:4,threshold:-4.339908,feature:[{size:5,px:[13,12,3,11,17],py:[3,3,1,4,13],pz:[0,0,2,0,0],nx:[4,3,8,15,15],ny:[4,5,4,8,8],nz:[1,2,1,0,-1]},{size:5,px:[6,7,6,3,3],py:[13,13,4,2,7],pz:[0,0,1,2,1],nx:[4,8,3,0,15],ny:[4,4,4,3,8],nz:[1,1,-1,-1,-1]},{size:3,px:[2,2,11],py:[3,2,5],pz:[2,2,0],nx:[3,8,3],ny:[4,4,4],nz:[1,-1,-1]},{size:5,px:[15,13,9,11,7],py:[2,1,2,1,0],pz:[0,0,0,0,1],nx:[23,11,23,22,23],ny:[1,0,2,0,0],nz:[0,1,0,0,0]}],alpha:[-2.466029,2.466029,-1.83951,1.83951,-1.060559,1.060559,-1.094927,1.094927]},{count:7,threshold:-5.052474,feature:[{size:5,px:[17,13,3,11,10],py:[13,2,1,4,3],pz:[0,0,2,0,0],nx:[4,8,8,3,7],ny:[2,8,4,5,4],nz:[2,0,1,2,1]},{size:5,px:[6,7,3,6,6],py:[4,12,2,13,14],pz:[1,0,2,0,0],nx:[8,3,4,4,3],ny:[4,4,2,0,2],nz:[1,1,-1,-1,-1]},{size:5,px:[7,4,5,3,3],py:[2,1,3,1,1],pz:[0,1,0,1,-1],nx:[1,0,1,1,0],ny:[1,3,2,0,4],nz:[0,0,0,0,0]},{size:5,px:[11,11,11,3,2],py:[11,13,10,7,2],pz:[0,0,0,1,2],nx:[4,1,8,2,0],ny:[4,1,12,0,4],nz:[1,-1,-1,-1,-1]},{size:3,px:[9,13,1],py:[7,19,4],pz:[1,-1,-1],nx:[4,7,4],ny:[5,8,2],nz:[2,1,2]},{size:5,px:[12,8,16,4,4],py:[12,1,2,0,0],pz:[0,1,0,2,-1],nx:[11,22,11,23,23],ny:[2,0,1,1,5],nz:[1,0,1,0,0]},{size:3,px:[11,17,17],py:[6,11,12],pz:[0,0,0],nx:[15,1,11],ny:[9,1,1],nz:[0,-1,-1]}],alpha:[-2.15689,2.15689,-1.718246,1.718246,-.9651329,.9651329,-.994809,.994809,-.8802466,.8802466,-.8486741,.8486741,-.8141777,.8141777]},{count:13,threshold:-5.7744,feature:[{size:5,px:[6,10,3,12,14],py:[5,3,1,2,2],pz:[1,0,2,0,0],nx:[3,4,14,8,4],ny:[5,4,8,4,2],nz:[2,1,0,1,2]},{size:5,px:[10,6,11,5,12],py:[4,13,4,2,4],pz:[0,0,0,1,0],nx:[1,4,8,1,1],ny:[2,4,4,4,3],nz:[0,1,1,0,0]},{size:3,px:[18,6,12],py:[12,4,8],pz:[0,1,0],nx:[7,4,8],ny:[4,2,4],nz:[1,-1,-1]},{size:5,px:[7,5,6,3,17],py:[13,12,3,8,13],pz:[0,0,1,1,0],nx:[3,3,0,1,8],ny:[4,5,5,10,4],nz:[1,-1,-1,-1,-1]},{size:5,px:[16,7,16,7,7],py:[1,1,2,0,0],pz:[0,1,0,1,-1],nx:[23,23,23,11,5],ny:[2,14,1,2,1],nz:[0,0,0,1,2]},{size:3,px:[9,18,16],py:[7,14,2],pz:[1,0,-1],nx:[8,4,9],ny:[10,2,4],nz:[1,2,1]},{size:4,px:[3,16,1,22],py:[7,4,5,11],pz:[1,-1,-1,-1],nx:[3,9,4,2],ny:[4,9,7,5],nz:[1,0,1,2]},{size:5,px:[4,7,8,8,9],py:[0,2,2,1,1],pz:[1,0,0,0,0],nx:[0,0,1,0,0],ny:[15,16,19,0,14],nz:[0,0,0,1,0]},{size:5,px:[4,4,7,8,12],py:[2,5,6,7,10],pz:[2,2,1,1,0],nx:[8,5,10,0,0],ny:[4,2,5,3,14],nz:[1,-1,-1,-1,-1]},{size:2,px:[11,0],py:[13,4],pz:[0,-1],nx:[3,14],ny:[4,16],nz:[1,0]},{size:5,px:[17,8,18,4,4],py:[3,1,3,0,0],pz:[0,1,0,2,-1],nx:[21,22,5,11,22],ny:[0,1,0,1,2],nz:[0,0,2,1,0]},{size:4,px:[7,8,2,11],py:[13,12,2,7],pz:[0,0,2,0],nx:[4,0,23,3],ny:[4,1,1,11],nz:[1,-1,-1,-1]},{size:5,px:[4,18,8,9,15],py:[4,16,7,7,23],pz:[2,0,1,1,0],nx:[0,1,1,1,1],ny:[10,21,23,22,22],nz:[1,0,0,0,-1]}],alpha:[-1.956565,1.956565,-1.262438,1.262438,-1.056941,1.056941,-.9712509,.9712509,-.8261028,.8261028,-.8456506,.8456506,-.6652113,.6652113,-.6026287,.6026287,-.6915425,.6915425,-.5539286,.5539286,-.5515072,.5515072,-.6685884,.6685884,-.465607,.465607]},{count:20,threshold:-5.606853,feature:[{size:5,px:[17,11,6,14,9],py:[13,4,4,3,3],pz:[0,0,1,0,0],nx:[14,4,8,7,8],ny:[8,4,4,4,8],nz:[0,1,1,1,0]},{size:5,px:[3,9,10,11,11],py:[7,2,2,3,3],pz:[1,0,0,0,-1],nx:[3,8,4,2,5],ny:[4,4,10,2,8],nz:[1,1,1,2,1]},{size:5,px:[12,12,12,5,12],py:[12,9,10,12,11],pz:[0,0,0,0,0],nx:[0,0,0,0,0],ny:[2,1,3,0,0],nz:[0,0,0,0,-1]},{size:5,px:[9,18,9,9,12],py:[7,14,19,5,11],pz:[1,-1,-1,-1,-1],nx:[23,4,23,23,8],ny:[13,5,14,16,4],nz:[0,2,0,0,1]},{size:5,px:[12,12,12,6,1],py:[13,11,12,6,5],pz:[0,0,0,-1,-1],nx:[4,6,8,4,9],ny:[2,8,4,4,4],nz:[2,1,1,1,1]},{size:4,px:[12,11,11,6],py:[5,5,6,13],pz:[0,0,0,0],nx:[8,3,2,8],ny:[4,4,17,2],nz:[1,1,-1,-1]},{size:5,px:[3,14,12,15,13],py:[0,2,2,2,2],pz:[2,0,0,0,0],nx:[22,23,22,23,7],ny:[0,3,1,2,4],nz:[0,0,0,0,1]},{size:5,px:[16,15,18,19,9],py:[12,11,12,12,9],pz:[0,0,0,0,1],nx:[8,2,22,23,21],ny:[4,1,1,2,20],nz:[1,-1,-1,-1,-1]},{size:3,px:[4,7,7],py:[0,2,2],pz:[1,0,-1],nx:[1,2,2],ny:[2,0,2],nz:[1,0,0]},{size:3,px:[4,11,11],py:[6,9,8],pz:[1,0,0],nx:[9,2,8],ny:[9,4,5],nz:[0,-1,-1]},{size:4,px:[2,7,6,6],py:[4,23,21,22],pz:[2,0,0,0],nx:[9,3,8,17],ny:[21,2,5,1],nz:[0,-1,-1,-1]},{size:2,px:[2,8],py:[4,12],pz:[2,0],nx:[3,0],ny:[4,4],nz:[1,-1]},{size:5,px:[4,5,1,8,4],py:[15,12,3,23,12],pz:[0,0,2,0,0],nx:[0,0,0,0,0],ny:[23,10,22,21,11],nz:[0,1,0,0,-1]},{size:2,px:[21,5],py:[13,4],pz:[0,2],nx:[23,4],ny:[23,5],nz:[0,-1]},{size:2,px:[15,17],py:[2,3],pz:[0,0],nx:[19,20],ny:[2,1],nz:[0,0]},{size:5,px:[12,1,8,17,4],py:[14,2,13,6,12],pz:[0,-1,-1,-1,-1],nx:[8,13,15,15,7],ny:[10,9,15,14,8],nz:[1,0,0,0,1]},{size:2,px:[8,5],py:[7,4],pz:[1,-1],nx:[4,13],ny:[2,21],nz:[2,0]},{size:2,px:[3,4],py:[7,0],pz:[1,-1],nx:[4,2],ny:[7,5],nz:[1,2]},{size:4,px:[4,14,3,11],py:[3,23,2,5],pz:[2,0,2,0],nx:[7,8,2,16],ny:[8,0,1,15],nz:[0,-1,-1,-1]},{size:2,px:[9,8],py:[0,0],pz:[0,0],nx:[2,2],ny:[3,5],nz:[2,2]}],alpha:[-1.95797,1.95797,-1.225984,1.225984,-.8310246,.8310246,-.8315741,.8315741,-.7973616,.7973616,-.7661959,.7661959,-.6042118,.6042118,-.6506833,.6506833,-.4808219,.4808219,-.6079504,.6079504,-.5163994,.5163994,-.5268142,.5268142,-.4935685,.4935685,-.4427544,.4427544,-.4053949,.4053949,-.4701274,.4701274,-.4387648,.4387648,-.4305499,.4305499,-.4042607,.4042607,-.4372088,.4372088]},{count:22,threshold:-5.679317,feature:[{size:5,px:[11,3,17,14,13],py:[4,0,13,2,3],pz:[0,2,0,0,0],nx:[7,4,14,23,11],ny:[8,4,8,4,0],nz:[1,1,0,0,1]},{size:5,px:[7,12,6,12,12],py:[12,8,3,10,9],pz:[0,0,1,0,0],nx:[4,9,8,15,15],ny:[4,8,4,8,8],nz:[1,0,1,0,-1]},{size:3,px:[4,2,10],py:[1,4,1],pz:[1,2,0],nx:[2,3,8],ny:[5,4,4],nz:[2,1,-1]},{size:5,px:[3,17,6,6,16],py:[2,12,4,14,12],pz:[2,0,1,0,0],nx:[8,3,7,5,15],ny:[4,4,4,4,8],nz:[1,1,-1,-1,-1]},{size:5,px:[5,6,7,4,8],py:[3,3,3,1,3],pz:[0,0,0,1,0],nx:[0,0,0,0,1],ny:[5,4,3,2,0],nz:[0,0,0,0,0]},{size:3,px:[18,9,0],py:[14,7,0],pz:[0,1,-1],nx:[8,14,8],ny:[10,9,4],nz:[1,0,1]},{size:2,px:[9,5],py:[18,13],pz:[0,0],nx:[10,3],ny:[16,4],nz:[0,-1]},{size:5,px:[11,11,11,11,6],py:[10,12,11,13,6],pz:[0,0,0,0,-1],nx:[5,21,22,22,22],ny:[4,22,17,19,18],nz:[2,0,0,0,0]},{size:4,px:[8,9,15,4],py:[7,7,23,4],pz:[1,1,0,2],nx:[8,5,0,3],ny:[4,18,4,9],nz:[1,-1,-1,-1]},{size:5,px:[11,10,12,11,11],py:[4,4,4,5,5],pz:[0,0,0,0,-1],nx:[4,6,8,2,8],ny:[4,9,9,2,4],nz:[1,1,0,2,1]},{size:5,px:[2,2,3,3,4],py:[10,9,14,13,15],pz:[1,1,0,0,0],nx:[0,0,0,0,0],ny:[5,9,10,19,18],nz:[2,1,1,0,-1]},{size:2,px:[11,11],py:[13,12],pz:[0,0],nx:[9,2],ny:[15,2],nz:[0,-1]},{size:5,px:[2,4,3,3,4],py:[5,11,6,9,12],pz:[1,0,1,0,0],nx:[6,2,11,11,0],ny:[9,1,5,20,18],nz:[0,-1,-1,-1,-1]},{size:5,px:[18,9,17,19,16],py:[2,0,2,2,1],pz:[0,1,0,0,0],nx:[22,23,11,23,23],ny:[0,2,0,1,1],nz:[0,0,1,0,-1]},{size:5,px:[5,5,6,7,6],py:[17,16,15,23,22],pz:[0,0,0,0,0],nx:[7,6,2,5,23],ny:[8,1,2,3,1],nz:[0,-1,-1,-1,-1]},{size:5,px:[12,12,11,10,6],py:[14,13,18,4,22],pz:[0,-1,-1,-1,-1],nx:[3,2,4,1,2],ny:[19,4,23,13,16],nz:[0,0,0,0,0]},{size:4,px:[11,16,11,17],py:[7,11,8,12],pz:[0,0,0,0],nx:[7,14,10,4],ny:[4,7,10,4],nz:[1,0,-1,-1]},{size:2,px:[3,3],py:[8,7],pz:[1,1],nx:[4,2],ny:[10,2],nz:[1,-1]},{size:2,px:[3,9],py:[0,1],pz:[1,0],nx:[4,5],ny:[1,0],nz:[0,0]},{size:2,px:[14,16],py:[3,3],pz:[0,0],nx:[9,14],ny:[4,21],nz:[1,0]},{size:2,px:[9,1],py:[7,1],pz:[1,-1],nx:[8,9],ny:[7,4],nz:[1,1]},{size:2,px:[1,0],py:[8,3],pz:[0,2],nx:[20,0],ny:[3,3],nz:[0,-1]}],alpha:[-1.581077,1.581077,-1.389689,1.389689,-.8733094,.8733094,-.8525177,.8525177,-.7416304,.7416304,-.6609002,.6609002,-.7119043,.7119043,-.6204438,.6204438,-.6638519,.6638519,-.5518876,.5518876,-.4898991,.4898991,-.5508243,.5508243,-.4635525,.4635525,-.5163159,.5163159,-.4495338,.4495338,-.4515036,.4515036,-.5130473,.5130473,-.4694233,.4694233,-.4022514,.4022514,-.405569,.405569,-.4151817,.4151817,-.3352302,.3352302]},{count:32,threshold:-5.363782,feature:[{size:5,px:[12,9,6,8,14],py:[4,2,13,3,3],pz:[0,0,0,0,0],nx:[0,15,0,9,5],ny:[2,7,3,8,8],nz:[0,0,0,0,1]},{size:5,px:[13,16,3,6,11],py:[3,13,1,4,3],pz:[0,0,2,1,0],nx:[7,4,8,14,14],ny:[4,4,4,8,8],nz:[1,1,1,0,-1]},{size:5,px:[10,19,18,19,19],py:[6,13,13,12,12],pz:[1,0,0,0,-1],nx:[23,5,23,23,11],ny:[12,2,13,14,8],nz:[0,2,0,0,1]},{size:5,px:[12,12,12,12,6],py:[11,13,12,10,6],pz:[0,0,0,0,1],nx:[6,8,3,9,9],ny:[8,4,4,4,4],nz:[1,1,1,1,-1]},{size:5,px:[5,3,5,8,11],py:[12,8,3,11,8],pz:[0,1,1,0,0],nx:[4,0,1,1,9],ny:[4,3,4,3,4],nz:[1,-1,-1,-1,-1]},{size:5,px:[13,3,12,14,12],py:[1,0,1,2,3],pz:[0,2,0,0,0],nx:[7,9,8,4,4],ny:[5,4,10,2,2],nz:[1,1,1,2,-1]},{size:5,px:[18,16,12,15,8],py:[12,23,7,11,8],pz:[0,0,0,0,1],nx:[8,6,10,12,4],ny:[4,4,10,6,3],nz:[1,-1,-1,-1,-1]},{size:5,px:[4,4,5,2,2],py:[13,14,14,7,7],pz:[0,0,0,1,-1],nx:[0,0,0,0,1],ny:[15,4,14,13,17],nz:[0,2,0,0,0]},{size:2,px:[9,9],py:[7,7],pz:[1,-1],nx:[4,7],ny:[5,8],nz:[2,1]},{size:5,px:[3,4,6,5,4],py:[2,2,14,6,9],pz:[1,1,0,1,1],nx:[23,23,23,23,11],ny:[0,3,2,1,0],nz:[0,0,0,0,-1]},{size:3,px:[10,2,3],py:[23,4,7],pz:[0,2,1],nx:[10,21,23],ny:[21,9,2],nz:[0,-1,-1]},{size:5,px:[20,21,21,10,12],py:[13,12,8,8,12],pz:[0,0,0,1,0],nx:[8,16,3,3,11],ny:[4,8,4,3,0],nz:[1,-1,-1,-1,-1]},{size:2,px:[2,21],py:[4,12],pz:[2,-1],nx:[2,3],ny:[5,4],nz:[2,1]},{size:5,px:[8,5,6,8,7],py:[0,2,1,1,1],pz:[0,0,0,0,0],nx:[3,2,2,2,2],ny:[0,0,1,2,2],nz:[0,0,0,0,-1]},{size:5,px:[11,2,2,11,10],py:[10,12,8,11,12],pz:[0,0,0,0,0],nx:[3,5,2,4,2],ny:[4,1,4,2,2],nz:[1,-1,-1,-1,-1]},{size:4,px:[15,16,8,17],py:[2,1,0,2],pz:[0,0,1,0],nx:[19,20,0,8],ny:[1,2,11,10],nz:[0,0,-1,-1]},{size:2,px:[17,16],py:[12,12],pz:[0,0],nx:[8,9],ny:[5,1],nz:[1,-1]},{size:4,px:[11,11,0,0],py:[12,13,0,0],pz:[0,0,-1,-1],nx:[10,10,9,10],ny:[10,12,13,11],nz:[0,0,0,0]},{size:3,px:[11,10,8],py:[5,2,6],pz:[0,-1,-1],nx:[8,12,4],ny:[4,17,4],nz:[1,0,1]},{size:5,px:[10,21,10,20,20],py:[11,13,7,13,14],pz:[1,0,1,0,0],nx:[23,23,11,23,17],ny:[23,22,11,21,21],nz:[0,0,1,-1,-1]},{size:2,px:[4,7],py:[3,9],pz:[2,1],nx:[9,23],ny:[4,22],nz:[1,-1]},{size:4,px:[3,2,2,5],py:[11,5,4,20],pz:[1,2,2,0],nx:[4,23,11,23],ny:[10,22,11,21],nz:[1,-1,-1,-1]},{size:2,px:[7,5],py:[13,4],pz:[0,-1],nx:[4,4],ny:[8,6],nz:[1,1]},{size:2,px:[2,5],py:[4,9],pz:[2,1],nx:[10,10],ny:[16,16],nz:[0,-1]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,0],ny:[4,0],nz:[1,-1]},{size:5,px:[7,3,12,13,6],py:[11,5,23,23,7],pz:[1,2,0,0,1],nx:[1,0,0,0,0],ny:[23,20,19,21,21],nz:[0,0,0,0,-1]},{size:5,px:[0,0,0,0,0],py:[10,9,6,13,13],pz:[0,0,1,0,-1],nx:[8,8,4,4,9],ny:[4,11,5,4,5],nz:[1,1,2,2,1]},{size:2,px:[9,18],py:[8,15],pz:[1,0],nx:[15,4],ny:[15,2],nz:[0,-1]},{size:2,px:[5,13],py:[6,17],pz:[1,-1],nx:[1,2],ny:[2,4],nz:[2,1]},{size:5,px:[19,10,20,18,18],py:[2,0,2,2,2],pz:[0,1,0,0,-1],nx:[22,23,22,11,23],ny:[1,3,0,1,2],nz:[0,0,0,1,0]},{size:5,px:[4,2,2,2,6],py:[7,2,5,4,14],pz:[1,2,2,2,0],nx:[16,7,9,15,23],ny:[8,0,3,11,2],nz:[0,-1,-1,-1,-1]},{size:5,px:[10,10,9,9,5],py:[2,0,0,1,0],pz:[0,0,0,0,1],nx:[3,2,3,2,2],ny:[11,3,9,5,5],nz:[1,2,1,2,-1]}],alpha:[-1.490426,1.490426,-1.21428,1.21428,-.8124863,.8124863,-.7307594,.7307594,-.7377259,.7377259,-.5982859,.5982859,-.6451736,.6451736,-.6117417,.6117417,-.5438949,.5438949,-.4563701,.4563701,-.4975362,.4975362,-.4707373,.4707373,-.5013868,.5013868,-.5139018,.5139018,-.4728007,.4728007,-.4839748,.4839748,-.4852528,.4852528,-.5768956,.5768956,-.3635091,.3635091,-.419009,.419009,-.3854715,.3854715,-.3409591,.3409591,-.3440222,.3440222,-.3375895,.3375895,-.3367032,.3367032,-.3708106,.3708106,-.3260956,.3260956,-.3657681,.3657681,-.35188,.35188,-.3845758,.3845758,-.2832236,.2832236,-.2865156,.2865156]},{count:45,threshold:-5.479836,feature:[{size:5,px:[15,6,17,6,9],py:[2,13,13,4,3],pz:[0,0,0,1,0],nx:[3,9,4,8,14],ny:[5,8,4,4,8],nz:[2,0,1,1,0]},{size:5,px:[9,8,11,6,7],py:[1,2,3,14,2],pz:[0,0,0,0,0],nx:[0,0,4,0,0],ny:[4,2,4,1,0],nz:[0,0,1,0,0]},{size:5,px:[2,2,11,11,11],py:[2,4,10,8,6],pz:[2,2,0,0,0],nx:[8,4,3,23,23],ny:[4,4,4,16,18],nz:[1,1,-1,-1,-1]},{size:5,px:[18,16,17,15,9],py:[2,2,2,2,1],pz:[0,0,0,0,1],nx:[22,22,21,23,23],ny:[1,2,0,5,4],nz:[0,0,0,0,0]},{size:5,px:[15,3,17,18,6],py:[11,2,11,11,4],pz:[0,2,0,0,1],nx:[3,8,1,4,23],ny:[4,4,3,9,4],nz:[1,1,-1,-1,-1]},{size:2,px:[4,5],py:[4,0],pz:[2,-1],nx:[7,4],ny:[8,5],nz:[1,2]},{size:2,px:[11,5],py:[12,5],pz:[0,-1],nx:[4,9],ny:[10,15],nz:[1,0]},{size:4,px:[2,2,7,1],py:[7,7,3,4],pz:[1,-1,-1,-1],nx:[0,2,1,2],ny:[6,20,14,16],nz:[1,0,0,0]},{size:5,px:[14,12,12,13,9],py:[23,5,6,5,7],pz:[0,0,0,0,1],nx:[8,18,2,8,14],ny:[4,9,0,12,7],nz:[1,-1,-1,-1,-1]},{size:5,px:[3,10,13,11,9],py:[0,3,2,3,2],pz:[2,0,0,0,0],nx:[3,11,22,22,22],ny:[2,6,15,2,0],nz:[2,1,0,0,0]},{size:5,px:[8,7,5,8,5],py:[23,12,12,12,13],pz:[0,0,0,0,0],nx:[3,18,3,1,22],ny:[4,4,4,2,0],nz:[1,-1,-1,-1,-1]},{size:5,px:[22,22,22,21,22],py:[9,11,10,14,12],pz:[0,0,0,0,0],nx:[23,23,11,1,22],ny:[23,23,11,2,0],nz:[0,-1,-1,-1,-1]},{size:2,px:[9,3],py:[18,7],pz:[0,1],nx:[10,8],ny:[16,19],nz:[0,-1]},{size:5,px:[10,12,11,6,6],py:[4,4,4,2,2],pz:[0,0,0,1,-1],nx:[3,8,7,8,4],ny:[5,4,4,10,4],nz:[2,1,1,0,1]},{size:4,px:[12,12,4,15],py:[13,12,0,11],pz:[0,0,-1,-1],nx:[13,14,13,14],ny:[9,12,10,13],nz:[0,0,0,0]},{size:2,px:[4,4],py:[3,3],pz:[2,-1],nx:[9,4],ny:[4,2],nz:[1,2]},{size:3,px:[9,7,0],py:[7,5,5],pz:[1,-1,-1],nx:[4,15,9],ny:[5,14,9],nz:[2,0,1]},{size:5,px:[15,20,7,10,16],py:[17,12,6,4,23],pz:[0,0,1,1,0],nx:[1,2,2,1,1],ny:[3,0,1,2,2],nz:[0,0,0,0,-1]},{size:5,px:[2,1,1,11,2],py:[16,4,5,12,14],pz:[0,1,1,0,0],nx:[4,6,3,19,1],ny:[4,2,5,19,2],nz:[1,-1,-1,-1,-1]},{size:3,px:[15,14,14],py:[1,1,0],pz:[0,0,0],nx:[4,8,4],ny:[3,4,2],nz:[2,1,2]},{size:5,px:[2,3,1,2,7],py:[8,12,4,9,13],pz:[1,0,2,1,0],nx:[1,1,0,0,0],ny:[21,20,18,17,9],nz:[0,0,0,0,1]},{size:5,px:[17,15,17,16,16],py:[12,12,22,23,12],pz:[0,0,0,0,0],nx:[7,3,16,1,0],ny:[8,6,8,3,9],nz:[0,-1,-1,-1,-1]},{size:5,px:[9,17,18,18,18],py:[6,12,12,13,13],pz:[1,0,0,0,-1],nx:[23,23,20,11,11],ny:[12,13,23,7,8],nz:[0,0,0,1,1]},{size:2,px:[2,4],py:[4,7],pz:[2,1],nx:[4,4],ny:[10,5],nz:[1,-1]},{size:4,px:[4,22,19,12],py:[5,8,14,9],pz:[2,0,0,0],nx:[8,4,4,2],ny:[4,4,1,2],nz:[1,-1,-1,-1]},{size:2,px:[3,21],py:[7,14],pz:[1,-1],nx:[4,2],ny:[7,2],nz:[1,2]},{size:3,px:[7,4,17],py:[3,1,6],pz:[0,1,-1],nx:[3,4,5],ny:[0,2,1],nz:[1,0,0]},{size:4,px:[15,7,14,0],py:[3,1,3,7],pz:[0,1,0,-1],nx:[8,18,17,18],ny:[0,1,1,2],nz:[1,0,0,0]},{size:5,px:[12,12,12,12,6],py:[10,11,12,13,6],pz:[0,0,0,0,-1],nx:[8,15,15,4,8],ny:[10,10,9,2,4],nz:[0,0,0,2,1]},{size:2,px:[17,12],py:[13,11],pz:[0,-1],nx:[9,8],ny:[4,10],nz:[1,1]},{size:5,px:[0,0,0,0,0],py:[10,9,12,11,4],pz:[0,0,0,0,1],nx:[8,9,8,9,9],ny:[10,4,4,5,5],nz:[1,1,1,1,-1]},{size:3,px:[7,0,1],py:[1,9,8],pz:[0,-1,-1],nx:[4,3,3],ny:[7,15,16],nz:[0,0,0]},{size:2,px:[4,7],py:[15,23],pz:[0,0],nx:[9,18],ny:[21,3],nz:[0,-1]},{size:5,px:[17,4,19,18,8],py:[12,3,12,17,6],pz:[0,2,0,0,1],nx:[23,23,11,22,16],ny:[0,1,0,21,-1],nz:[0,0,-1,-1,-1]},{size:2,px:[7,4],py:[13,5],pz:[0,-1],nx:[4,2],ny:[4,2],nz:[1,2]},{size:5,px:[21,20,10,10,21],py:[13,14,10,7,11],pz:[0,0,1,1,0],nx:[4,4,4,5,5],ny:[18,17,19,20,20],nz:[0,0,0,0,-1]},{size:2,px:[2,3],py:[11,13],pz:[1,0],nx:[12,4],ny:[17,17],nz:[0,-1]},{size:2,px:[11,5],py:[13,1],pz:[0,-1],nx:[1,2],ny:[1,4],nz:[2,1]},{size:2,px:[15,7],py:[17,7],pz:[0,1],nx:[14,4],ny:[15,3],nz:[0,-1]},{size:2,px:[3,11],py:[3,8],pz:[2,0],nx:[13,13],ny:[9,8],nz:[0,0]},{size:2,px:[8,3],py:[11,2],pz:[0,-1],nx:[8,4],ny:[9,5],nz:[0,1]},{size:3,px:[12,6,9],py:[9,10,11],pz:[0,-1,-1],nx:[2,1,5],ny:[2,1,6],nz:[2,2,1]},{size:4,px:[4,5,5,1],py:[11,11,11,3],pz:[1,0,1,2],nx:[0,0,5,4],ny:[23,22,0,0],nz:[0,0,-1,-1]},{size:5,px:[15,7,17,15,16],py:[1,0,2,2,0],pz:[0,1,0,0,0],nx:[7,4,7,4,8],ny:[5,2,4,3,4],nz:[1,2,1,2,-1]},{size:2,px:[6,12],py:[11,23],pz:[1,0],nx:[12,4],ny:[21,2],nz:[0,-1]}],alpha:[-1.5358,1.5358,-.8580514,.8580514,-.862521,.862521,-.71775,.71775,-.6832222,.6832222,-.5736298,.5736298,-.5028217,.5028217,-.5091788,.5091788,-.579194,.579194,-.4924942,.4924942,-.5489055,.5489055,-.452819,.452819,-.4748324,.4748324,-.4150403,.4150403,-.4820464,.4820464,-.4840212,.4840212,-.3941872,.3941872,-.3663507,.3663507,-.3814835,.3814835,-.3936426,.3936426,-.304997,.304997,-.3604256,.3604256,-.3974041,.3974041,-.4203486,.4203486,-.3174435,.3174435,-.3426336,.3426336,-.449215,.449215,-.3538784,.3538784,-.3679703,.3679703,-.3985452,.3985452,-.2884028,.2884028,-.2797264,.2797264,-.2664214,.2664214,-.2484857,.2484857,-.2581492,.2581492,-.2943778,.2943778,-.2315507,.2315507,-.2979337,.2979337,-.2976173,.2976173,-.2847965,.2847965,-.2814763,.2814763,-.2489068,.2489068,-.2632427,.2632427,-.3308292,.3308292,-.279017,.279017]},{count:61,threshold:-5.239104,feature:[{size:5,px:[8,8,11,15,6],py:[3,6,5,3,4],pz:[0,1,0,0,1],nx:[3,9,14,8,4],ny:[4,8,8,7,2],nz:[1,0,0,0,2]},{size:5,px:[11,12,10,6,9],py:[3,3,2,13,2],pz:[0,0,0,0,0],nx:[0,0,5,2,2],ny:[13,1,8,5,2],nz:[0,1,1,2,2]},{size:5,px:[11,5,11,11,4],py:[9,13,10,11,6],pz:[0,0,0,0,1],nx:[4,15,9,3,3],ny:[5,8,9,4,4],nz:[1,0,0,1,-1]},{size:5,px:[15,16,8,17,17],py:[1,2,0,2,2],pz:[0,0,1,0,-1],nx:[23,23,23,23,23],ny:[4,0,2,3,1],nz:[0,0,0,0,0]},{size:4,px:[9,18,17,18],py:[7,13,13,14],pz:[1,0,0,0],nx:[9,7,4,8],ny:[4,10,2,4],nz:[1,1,2,1]},{size:5,px:[12,11,12,12,6],py:[6,5,14,5,3],pz:[0,0,0,0,1],nx:[13,8,14,7,7],ny:[16,4,7,4,4],nz:[0,1,0,1,-1]},{size:5,px:[12,6,3,7,12],py:[7,12,7,11,8],pz:[0,0,1,0,0],nx:[16,4,4,4,7],ny:[8,4,4,4,4],nz:[0,1,-1,-1,-1]},{size:5,px:[6,4,5,3,3],py:[2,3,2,0,0],pz:[0,0,0,1,-1],nx:[1,0,1,0,0],ny:[0,3,1,1,2],nz:[0,0,0,1,0]},{size:2,px:[15,9],py:[11,6],pz:[0,1],nx:[14,5],ny:[9,11],nz:[0,-1]},{size:5,px:[10,19,19,10,20],py:[7,20,14,6,12],pz:[1,0,0,1,0],nx:[23,22,11,23,23],ny:[21,23,9,20,20],nz:[0,0,1,0,-1]},{size:5,px:[1,1,5,1,1],py:[8,6,6,9,4],pz:[0,1,1,0,2],nx:[3,3,3,2,5],ny:[4,4,2,5,4],nz:[1,-1,-1,-1,-1]},{size:5,px:[13,12,3,11,11],py:[2,2,0,1,2],pz:[0,0,2,0,0],nx:[3,6,8,4,3],ny:[2,9,4,4,5],nz:[2,1,1,1,-1]},{size:3,px:[12,12,6],py:[11,12,9],pz:[0,0,-1],nx:[2,1,9],ny:[6,1,14],nz:[0,2,0]},{size:5,px:[6,3,17,16,16],py:[4,2,14,23,13],pz:[1,2,0,0,0],nx:[8,10,21,5,1],ny:[4,10,11,0,0],nz:[1,-1,-1,-1,-1]},{size:5,px:[5,6,1,3,3],py:[15,14,4,7,7],pz:[0,0,2,1,-1],nx:[1,0,0,1,1],ny:[5,8,7,18,17],nz:[2,1,1,0,0]},{size:4,px:[6,12,5,3],py:[6,12,2,7],pz:[1,-1,-1,-1],nx:[14,13,13,7],ny:[12,10,9,8],nz:[0,0,0,1]},{size:2,px:[3,6],py:[7,15],pz:[1,0],nx:[3,3],ny:[4,2],nz:[1,-1]},{size:4,px:[11,10,12,2],py:[18,18,18,3],pz:[0,0,0,2],nx:[11,17,4,16],ny:[16,4,4,21],nz:[0,-1,-1,-1]},{size:5,px:[9,8,8,5,2],py:[4,4,4,2,3],pz:[0,0,-1,-1,-1],nx:[2,2,4,4,2],ny:[1,2,10,5,4],nz:[2,2,1,1,2]},{size:4,px:[8,18,14,18],py:[7,16,23,15],pz:[1,0,0,0],nx:[14,3,1,0],ny:[21,1,9,3],nz:[0,-1,-1,-1]},{size:2,px:[12,3],py:[9,5],pz:[0,2],nx:[8,1],ny:[4,4],nz:[1,-1]},{size:2,px:[9,9],py:[1,1],pz:[1,-1],nx:[19,20],ny:[1,2],nz:[0,0]},{size:3,px:[10,10,10],py:[6,6,8],pz:[1,-1,-1],nx:[22,21,22],ny:[13,18,12],nz:[0,0,0]},{size:2,px:[2,2],py:[4,1],pz:[2,-1],nx:[2,4],ny:[5,4],nz:[2,1]},{size:5,px:[21,21,21,21,21],py:[19,17,18,15,16],pz:[0,0,0,0,0],nx:[11,21,6,1,21],ny:[17,1,10,0,2],nz:[0,-1,-1,-1,-1]},{size:5,px:[7,3,4,4,4],py:[23,13,14,16,13],pz:[0,0,0,0,0],nx:[21,22,22,22,22],ny:[23,21,20,19,19],nz:[0,0,0,0,-1]},{size:2,px:[11,8],py:[6,6],pz:[0,1],nx:[8,4],ny:[4,2],nz:[1,-1]},{size:5,px:[23,23,11,23,23],py:[8,12,6,11,10],pz:[0,0,1,0,0],nx:[4,4,3,8,8],ny:[3,8,4,4,4],nz:[1,1,1,1,-1]},{size:5,px:[8,9,4,7,10],py:[2,1,0,2,1],pz:[0,0,1,0,0],nx:[5,5,6,4,4],ny:[1,0,0,2,1],nz:[0,0,0,0,-1]},{size:2,px:[12,2],py:[13,6],pz:[0,-1],nx:[15,9],ny:[15,4],nz:[0,1]},{size:2,px:[2,4],py:[4,9],pz:[2,1],nx:[3,13],ny:[4,1],nz:[1,-1]},{size:3,px:[3,6,2],py:[10,22,4],pz:[1,0,2],nx:[4,2,1],ny:[10,4,3],nz:[1,-1,-1]},{size:2,px:[1,0],py:[9,7],pz:[0,1],nx:[0,0],ny:[23,22],nz:[0,0]},{size:2,px:[8,7],py:[0,1],pz:[0,0],nx:[4,4],ny:[8,8],nz:[1,-1]},{size:5,px:[7,4,4,6,3],py:[8,4,5,5,3],pz:[1,2,2,1,2],nx:[1,0,2,0,0],ny:[1,0,0,2,4],nz:[0,2,0,1,-1]},{size:3,px:[10,4,4],py:[6,1,5],pz:[1,-1,-1],nx:[5,23,22],ny:[4,13,7],nz:[2,0,0]},{size:2,px:[2,2],py:[6,5],pz:[1,1],nx:[6,0],ny:[9,2],nz:[0,-1]},{size:5,px:[0,1,1,0,0],py:[5,18,19,16,6],pz:[2,0,0,0,1],nx:[5,9,4,8,8],ny:[8,7,3,7,7],nz:[1,0,1,0,-1]},{size:2,px:[13,12],py:[23,23],pz:[0,0],nx:[7,6],ny:[8,10],nz:[0,-1]},{size:2,px:[14,19],py:[12,8],pz:[0,0],nx:[18,5],ny:[8,11],nz:[0,-1]},{size:5,px:[2,8,6,4,4],py:[3,23,14,6,9],pz:[2,0,0,1,1],nx:[0,0,0,0,1],ny:[21,20,5,19,23],nz:[0,0,2,0,0]},{size:2,px:[11,22],py:[4,14],pz:[0,-1],nx:[3,8],ny:[1,4],nz:[2,1]},{size:5,px:[1,1,0,1,1],py:[6,8,3,12,7],pz:[1,1,2,0,1],nx:[21,21,19,10,10],ny:[14,16,23,9,9],nz:[0,0,0,1,-1]},{size:2,px:[10,3],py:[23,2],pz:[0,2],nx:[10,3],ny:[21,5],nz:[0,-1]},{size:2,px:[9,9],py:[7,0],pz:[1,-1],nx:[9,9],ny:[11,10],nz:[1,1]},{size:5,px:[23,11,23,23,23],py:[18,10,19,20,16],pz:[0,1,0,0,0],nx:[3,3,2,3,2],ny:[15,16,10,17,9],nz:[0,0,1,0,-1]},{size:2,px:[9,14],py:[7,18],pz:[1,0],nx:[7,10],ny:[8,8],nz:[1,-1]},{size:2,px:[12,5],py:[6,4],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[4,5],py:[13,4],pz:[0,-1],nx:[4,4],ny:[17,19],nz:[0,0]},{size:3,px:[2,3,3],py:[11,17,19],pz:[1,0,0],nx:[7,7,4],ny:[8,8,5],nz:[1,-1,-1]},{size:2,px:[6,6],py:[6,5],pz:[1,-1],nx:[2,9],ny:[4,12],nz:[1,0]},{size:5,px:[8,8,9,2,2],py:[18,13,12,3,3],pz:[0,0,0,2,-1],nx:[23,11,23,11,11],ny:[13,6,14,7,8],nz:[0,1,0,1,1]},{size:2,px:[9,11],py:[6,13],pz:[1,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[8,10],py:[0,6],pz:[1,1],nx:[9,4],ny:[6,7],nz:[1,-1]},{size:3,px:[3,10,9],py:[8,6,0],pz:[1,-1,-1],nx:[2,2,2],ny:[15,16,9],nz:[0,0,1]},{size:3,px:[14,15,0],py:[2,2,5],pz:[0,0,-1],nx:[17,17,18],ny:[0,1,2],nz:[0,0,0]},{size:2,px:[11,5],py:[14,1],pz:[0,-1],nx:[10,9],ny:[12,14],nz:[0,0]},{size:2,px:[8,8],py:[7,8],pz:[1,1],nx:[8,4],ny:[4,4],nz:[1,-1]},{size:5,px:[0,0,0,0,0],py:[19,18,10,5,20],pz:[0,0,1,2,0],nx:[4,8,2,4,4],ny:[4,15,5,10,10],nz:[1,0,2,1,-1]},{size:2,px:[7,0],py:[13,18],pz:[0,-1],nx:[4,3],ny:[4,4],nz:[1,1]},{size:5,px:[23,22,22,11,22],py:[16,13,7,6,14],pz:[0,0,0,1,0],nx:[13,7,15,14,14],ny:[6,3,7,6,6],nz:[0,1,0,0,-1]}],alpha:[-1.428861,1.428861,-.8591837,.8591837,-.7734305,.7734305,-.653446,.653446,-.6262547,.6262547,-.5231782,.5231782,-.4984303,.4984303,-.4913187,.4913187,-.4852198,.4852198,-.4906681,.4906681,-.4126248,.4126248,-.4590814,.4590814,-.4653825,.4653825,-.41796,.41796,-.4357392,.4357392,-.4087982,.4087982,-.4594812,.4594812,-.4858794,.4858794,-.371358,.371358,-.3894534,.3894534,-.3127168,.3127168,-.4012654,.4012654,-.3370552,.3370552,-.3534712,.3534712,-.384345,.384345,-.2688805,.2688805,-.3500203,.3500203,-.282712,.282712,-.3742119,.3742119,-.3219074,.3219074,-.2544953,.2544953,-.3355513,.3355513,-.267267,.267267,-.2932047,.2932047,-.2404618,.2404618,-.2354372,.2354372,-.2657955,.2657955,-.2293701,.2293701,-.2708918,.2708918,-.2340181,.2340181,-.2464815,.2464815,-.2944239,.2944239,-.240796,.240796,-.3029642,.3029642,-.2684602,.2684602,-.2495078,.2495078,-.2539708,.2539708,-.2989293,.2989293,-.2391309,.2391309,-.2531372,.2531372,-.250039,.250039,-.2295077,.2295077,-.2526125,.2526125,-.2337182,.2337182,-.1984756,.1984756,-.3089996,.3089996,-.2589053,.2589053,-.296249,.296249,-.245866,.245866,-.2515206,.2515206,-.2637299,.2637299]},{count:80,threshold:-5.185898,feature:[{size:5,px:[12,17,13,10,15],py:[9,13,3,3,2],pz:[0,0,0,0,0],nx:[8,14,6,9,4],ny:[10,9,8,8,2],nz:[1,0,1,0,2]},{size:5,px:[3,11,8,10,9],py:[7,4,3,3,3],pz:[1,0,0,0,0],nx:[2,1,5,0,0],ny:[2,15,8,4,13],nz:[2,0,1,0,0]},{size:5,px:[11,11,11,4,17],py:[7,9,8,6,11],pz:[0,0,0,1,0],nx:[8,8,8,3,0],ny:[4,8,8,8,13],nz:[1,0,-1,-1,-1]},{size:5,px:[14,15,7,16,16],py:[3,3,1,3,3],pz:[0,0,1,0,-1],nx:[23,22,23,22,22],ny:[6,2,14,3,4],nz:[0,0,0,0,0]},{size:4,px:[6,4,7,15],py:[4,2,6,17],pz:[1,2,1,0],nx:[3,8,3,14],ny:[4,4,10,22],nz:[1,1,-1,-1]},{size:3,px:[3,5,22],py:[7,7,5],pz:[1,-1,-1],nx:[2,2,4],ny:[5,2,7],nz:[2,2,1]},{size:5,px:[7,6,5,6,3],py:[0,1,2,2,0],pz:[0,0,0,0,1],nx:[0,1,1,0,1],ny:[0,2,1,2,0],nz:[2,0,0,1,0]},{size:5,px:[11,11,11,11,5],py:[11,10,13,12,6],pz:[0,0,0,0,-1],nx:[15,14,5,2,8],ny:[9,8,10,2,10],nz:[0,0,1,2,0]},{size:5,px:[8,5,6,8,7],py:[12,12,12,23,12],pz:[0,0,0,0,0],nx:[3,17,5,2,8],ny:[4,0,10,2,10],nz:[1,-1,-1,-1,-1]},{size:5,px:[10,10,10,19,20],py:[8,10,9,15,13],pz:[1,1,1,0,0],nx:[23,11,5,23,23],ny:[20,10,5,19,19],nz:[0,1,2,0,-1]},{size:5,px:[9,13,3,10,12],py:[2,0,0,1,1],pz:[0,0,2,0,0],nx:[3,3,6,7,7],ny:[5,2,11,4,4],nz:[2,2,1,1,-1]},{size:2,px:[15,7],py:[17,6],pz:[0,1],nx:[14,0],ny:[16,10],nz:[0,-1]},{size:5,px:[17,15,18,12,19],py:[22,12,13,7,15],pz:[0,0,0,0,0],nx:[8,15,6,1,7],ny:[4,8,22,5,4],nz:[1,-1,-1,-1,-1]},{size:5,px:[10,9,18,19,8],py:[2,1,3,3,1],pz:[1,1,0,0,1],nx:[23,23,23,11,11],ny:[0,1,2,0,1],nz:[0,0,0,1,-1]},{size:5,px:[12,23,0,1,8],py:[14,5,0,17,1],pz:[0,-1,-1,-1,-1],nx:[8,14,15,18,14],ny:[10,11,14,19,10],nz:[1,0,0,0,0]},{size:2,px:[4,6],py:[6,13],pz:[1,0],nx:[4,12],ny:[10,14],nz:[1,-1]},{size:5,px:[5,23,11,23,13],py:[3,10,4,11,12],pz:[2,0,1,0,0],nx:[7,4,9,8,8],ny:[4,2,4,4,4],nz:[1,2,1,1,-1]},{size:3,px:[9,5,11],py:[4,2,4],pz:[0,1,-1],nx:[5,2,4],ny:[0,1,2],nz:[0,2,0]},{size:5,px:[5,2,2,5,8],py:[12,4,4,6,13],pz:[0,2,1,1,0],nx:[3,9,4,4,8],ny:[4,0,2,2,4],nz:[1,-1,-1,-1,-1]},{size:3,px:[9,5,22],py:[7,4,20],pz:[1,-1,-1],nx:[8,19,4],ny:[4,18,5],nz:[1,0,2]},{size:5,px:[2,3,3,3,3],py:[10,16,15,14,13],pz:[1,0,0,0,0],nx:[0,0,0,1,0],ny:[10,20,5,23,21],nz:[1,0,2,0,0]},{size:2,px:[12,11],py:[4,18],pz:[0,0],nx:[11,23],ny:[17,13],nz:[0,-1]},{size:2,px:[17,8],py:[16,7],pz:[0,1],nx:[8,3],ny:[4,6],nz:[1,-1]},{size:5,px:[13,5,14,12,3],py:[4,7,4,5,3],pz:[0,1,0,0,1],nx:[21,20,21,21,21],ny:[2,0,4,3,3],nz:[0,0,0,0,-1]},{size:4,px:[20,20,20,10],py:[21,19,20,8],pz:[0,0,0,1],nx:[8,11,0,2],ny:[10,8,1,3],nz:[1,-1,-1,-1]},{size:4,px:[6,7,12,8],py:[12,12,8,11],pz:[0,0,0,0],nx:[9,5,5,18],ny:[9,2,0,20],nz:[0,-1,-1,-1]},{size:3,px:[11,5,9],py:[0,0,0],pz:[0,1,0],nx:[2,6,3],ny:[3,7,4],nz:[2,0,1]},{size:5,px:[18,18,9,17,17],py:[15,14,7,14,14],pz:[0,0,1,0,-1],nx:[21,21,21,22,20],ny:[15,21,17,14,23],nz:[0,0,0,0,0]},{size:5,px:[9,12,12,7,4],py:[4,11,12,6,5],pz:[1,0,0,1,2],nx:[16,11,9,6,20],ny:[8,4,11,10,23],nz:[0,-1,-1,-1,-1]},{size:5,px:[12,11,10,11,11],py:[23,4,4,5,23],pz:[0,0,0,0,0],nx:[11,11,7,3,20],ny:[21,21,11,1,23],nz:[0,-1,-1,-1,-1]},{size:2,px:[12,1],py:[12,3],pz:[0,-1],nx:[10,10],ny:[3,2],nz:[1,1]},{size:5,px:[9,4,15,9,9],py:[8,4,23,7,7],pz:[1,2,0,1,-1],nx:[5,3,3,3,2],ny:[23,19,17,18,15],nz:[0,0,0,0,0]},{size:2,px:[2,0],py:[16,3],pz:[0,2],nx:[9,4],ny:[15,2],nz:[0,-1]},{size:2,px:[2,3],py:[3,7],pz:[2,1],nx:[3,8],ny:[4,10],nz:[1,-1]},{size:3,px:[9,4,3],py:[18,0,14],pz:[0,-1,-1],nx:[3,5,2],ny:[5,8,5],nz:[2,1,2]},{size:3,px:[1,1,10],py:[2,1,7],pz:[1,-1,-1],nx:[0,0,0],ny:[3,5,1],nz:[0,0,1]},{size:4,px:[11,11,5,2],py:[12,13,7,3],pz:[0,0,-1,-1],nx:[5,10,10,9],ny:[6,9,10,13],nz:[1,0,0,0]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[9,1],ny:[4,3],nz:[1,-1]},{size:5,px:[0,0,1,1,0],py:[4,10,12,13,5],pz:[1,0,0,0,1],nx:[4,4,8,7,7],ny:[3,2,10,4,4],nz:[2,2,1,1,-1]},{size:3,px:[3,4,3],py:[1,1,2],pz:[1,-1,-1],nx:[4,5,3],ny:[1,0,2],nz:[0,0,0]},{size:2,px:[9,2],py:[6,4],pz:[1,-1],nx:[8,4],ny:[6,2],nz:[1,2]},{size:5,px:[12,13,15,16,7],py:[1,1,2,2,1],pz:[0,0,0,0,1],nx:[4,4,4,3,7],ny:[2,2,4,2,4],nz:[2,-1,-1,-1,-1]},{size:5,px:[9,3,2,11,5],py:[23,7,4,10,6],pz:[0,1,2,0,1],nx:[21,20,11,21,21],ny:[21,23,8,20,20],nz:[0,0,1,0,-1]},{size:4,px:[12,6,13,12],py:[7,3,5,6],pz:[0,1,0,0],nx:[3,0,5,10],ny:[4,6,5,1],nz:[1,-1,-1,-1]},{size:2,px:[10,4],py:[4,0],pz:[0,-1],nx:[12,11],ny:[2,1],nz:[0,0]},{size:4,px:[2,3,22,5],py:[6,1,18,5],pz:[1,-1,-1,-1],nx:[0,0,0,3],ny:[14,3,12,18],nz:[0,2,0,0]},{size:3,px:[10,20,21],py:[10,18,15],pz:[1,0,0],nx:[15,1,2],ny:[7,0,8],nz:[0,-1,-1]},{size:5,px:[0,0,0,0,0],py:[4,7,13,4,6],pz:[1,1,0,2,1],nx:[5,9,8,4,4],ny:[3,7,7,3,3],nz:[1,0,0,1,-1]},{size:3,px:[13,12,14],py:[2,2,2],pz:[0,0,0],nx:[4,4,4],ny:[2,2,5],nz:[2,-1,-1]},{size:5,px:[5,4,6,2,12],py:[7,9,7,4,10],pz:[0,1,0,2,0],nx:[6,1,2,5,2],ny:[9,2,4,13,4],nz:[0,-1,-1,-1,-1]},{size:2,px:[11,1],py:[12,5],pz:[0,-1],nx:[1,0],ny:[7,2],nz:[0,2]},{size:5,px:[8,8,1,16,6],py:[6,6,4,8,11],pz:[1,-1,-1,-1,-1],nx:[13,5,4,4,13],ny:[12,1,2,5,11],nz:[0,2,2,2,0]},{size:2,px:[5,6],py:[4,14],pz:[1,0],nx:[9,5],ny:[7,1],nz:[0,-1]},{size:2,px:[2,6],py:[4,14],pz:[2,0],nx:[9,2],ny:[15,1],nz:[0,-1]},{size:5,px:[10,19,20,10,9],py:[1,2,3,0,0],pz:[1,0,0,1,-1],nx:[11,23,23,11,23],ny:[0,3,1,1,2],nz:[1,0,0,1,0]},{size:2,px:[2,9],py:[3,12],pz:[2,0],nx:[2,6],ny:[4,6],nz:[1,-1]},{size:5,px:[0,0,0,0,0],py:[4,10,11,9,9],pz:[1,0,0,0,-1],nx:[16,2,17,8,4],ny:[10,2,9,4,4],nz:[0,2,0,1,1]},{size:2,px:[12,0],py:[5,4],pz:[0,-1],nx:[7,8],ny:[4,8],nz:[1,1]},{size:2,px:[21,21],py:[9,10],pz:[0,0],nx:[11,8],ny:[18,8],nz:[0,-1]},{size:2,px:[14,7],py:[23,9],pz:[0,1],nx:[7,13],ny:[10,4],nz:[1,-1]},{size:5,px:[12,12,12,6,2],py:[11,13,12,6,4],pz:[0,0,0,-1,-1],nx:[0,0,0,0,0],ny:[14,13,6,12,11],nz:[0,0,1,0,0]},{size:2,px:[8,9],py:[6,11],pz:[1,-1],nx:[15,15],ny:[11,10],nz:[0,0]},{size:4,px:[4,6,7,2],py:[8,4,23,7],pz:[1,-1,-1,-1],nx:[4,20,19,17],ny:[0,3,1,1],nz:[2,0,0,0]},{size:2,px:[7,0],py:[6,0],pz:[1,-1],nx:[7,4],ny:[8,2],nz:[1,2]},{size:2,px:[10,0],py:[7,0],pz:[1,-1],nx:[15,15],ny:[15,14],nz:[0,0]},{size:5,px:[6,2,5,2,4],py:[23,7,21,8,16],pz:[0,1,0,1,0],nx:[18,2,10,0,11],ny:[9,3,23,5,3],nz:[0,-1,-1,-1,-1]},{size:5,px:[9,9,8,10,4],py:[0,2,2,1,1],pz:[0,0,0,0,1],nx:[4,3,2,2,5],ny:[7,3,4,2,17],nz:[0,1,2,2,0]},{size:2,px:[10,7],py:[5,6],pz:[1,-1],nx:[11,11],ny:[6,5],nz:[1,1]},{size:5,px:[11,11,5,6,11],py:[8,10,5,5,9],pz:[0,0,1,1,0],nx:[13,16,11,14,4],ny:[9,13,11,20,23],nz:[0,-1,-1,-1,-1]},{size:2,px:[7,14],py:[14,22],pz:[0,-1],nx:[3,4],ny:[4,4],nz:[1,1]},{size:2,px:[4,11],py:[4,5],pz:[2,-1],nx:[2,4],ny:[5,7],nz:[2,1]},{size:2,px:[1,0],py:[0,0],pz:[0,1],nx:[0,4],ny:[0,2],nz:[0,-1]},{size:5,px:[11,11,11,4,9],py:[5,5,2,9,23],pz:[0,-1,-1,-1,-1],nx:[11,12,10,9,5],ny:[2,2,2,2,1],nz:[0,0,0,0,1]},{size:3,px:[16,14,15],py:[1,1,0],pz:[0,0,0],nx:[4,7,4],ny:[2,4,4],nz:[2,1,-1]},{size:2,px:[5,0],py:[14,5],pz:[0,-1],nx:[2,4],ny:[5,17],nz:[2,0]},{size:5,px:[18,7,16,19,4],py:[13,6,23,13,3],pz:[0,1,0,0,2],nx:[5,2,3,4,4],ny:[1,1,4,1,3],nz:[0,1,0,0,0]},{size:2,px:[8,8],py:[7,6],pz:[1,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[2,1],py:[10,4],pz:[1,2],nx:[4,4],ny:[3,3],nz:[2,-1]},{size:2,px:[10,5],py:[19,1],pz:[0,-1],nx:[4,12],ny:[10,17],nz:[1,0]},{size:5,px:[12,6,2,4,11],py:[14,4,2,1,5],pz:[0,-1,-1,-1,-1],nx:[3,4,3,4,3],ny:[13,17,14,16,15],nz:[0,0,0,0,0]}],alpha:[-1.368326,1.368326,-.7706897,.7706897,-.8378147,.8378147,-.6120624,.6120624,-.5139189,.5139189,-.475913,.475913,-.5161374,.5161374,-.5407743,.5407743,-.4216105,.4216105,-.4418693,.4418693,-.4435335,.4435335,-.4052076,.4052076,-.429305,.429305,-.3431154,.3431154,-.4231203,.4231203,-.39171,.39171,-.362345,.362345,-.320267,.320267,-.3331602,.3331602,-.3552034,.3552034,-.3784556,.3784556,-.3295428,.3295428,-.3587038,.3587038,-.2861332,.2861332,-.3403258,.3403258,-.3989002,.3989002,-.2631159,.2631159,-.3272156,.3272156,-.2816567,.2816567,-.3125926,.3125926,-.3146982,.3146982,-.2521825,.2521825,-.2434554,.2434554,-.3435378,.3435378,-.3161172,.3161172,-.2805027,.2805027,-.3303579,.3303579,-.2725089,.2725089,-.2575051,.2575051,-.3210646,.3210646,-.2986997,.2986997,-.2408925,.2408925,-.2456291,.2456291,-.283655,.283655,-.246986,.246986,-.29159,.29159,-.2513559,.2513559,-.2433728,.2433728,-.2377905,.2377905,-.2089327,.2089327,-.1978434,.1978434,-.3017699,.3017699,-.2339661,.2339661,-.193256,.193256,-.2278285,.2278285,-.24382,.24382,-.2216769,.2216769,-.1941995,.1941995,-.2129081,.2129081,-.2270319,.2270319,-.2393942,.2393942,-.2132518,.2132518,-.1867741,.1867741,-.2394237,.2394237,-.2005917,.2005917,-.2445217,.2445217,-.2229078,.2229078,-.2342967,.2342967,-.2481784,.2481784,-.2735603,.2735603,-.2187604,.2187604,-.1677239,.1677239,-.2248867,.2248867,-.2505358,.2505358,-.1867706,.1867706,-.1904305,.1904305,-.1939881,.1939881,-.2249474,.2249474,-.1762483,.1762483,-.2299974,.2299974]},{count:115,threshold:-5.15192,feature:[{size:5,px:[7,14,7,10,6],py:[3,3,12,4,4],pz:[0,0,0,0,1],nx:[14,3,14,9,3],ny:[7,4,8,8,5],nz:[0,1,0,0,2]},{size:5,px:[13,18,16,17,15],py:[1,13,1,2,0],pz:[0,0,0,0,0],nx:[23,23,8,11,22],ny:[3,4,4,8,0],nz:[0,0,1,1,0]},{size:5,px:[16,6,6,7,12],py:[12,13,4,12,5],pz:[0,0,1,0,0],nx:[0,0,8,4,0],ny:[0,2,4,4,2],nz:[0,0,1,1,-1]},{size:3,px:[12,13,7],py:[13,18,6],pz:[0,0,1],nx:[13,5,6],ny:[16,3,8],nz:[0,-1,-1]},{size:5,px:[10,12,9,13,11],py:[3,3,3,3,3],pz:[0,0,0,0,0],nx:[3,4,15,4,4],ny:[2,5,10,4,4],nz:[2,1,0,1,-1]},{size:5,px:[12,12,12,3,12],py:[7,9,8,3,10],pz:[0,0,0,2,0],nx:[4,8,15,9,9],ny:[4,4,8,8,8],nz:[1,1,0,0,-1]},{size:5,px:[6,3,4,4,2],py:[22,12,13,14,7],pz:[0,0,0,0,1],nx:[2,0,1,1,1],ny:[23,5,22,21,21],nz:[0,2,0,0,-1]},{size:2,px:[3,3],py:[8,8],pz:[1,-1],nx:[3,4],ny:[4,10],nz:[1,1]},{size:5,px:[11,11,11,11,0],py:[10,12,11,13,2],pz:[0,0,0,-1,-1],nx:[8,13,13,13,13],ny:[10,8,9,11,10],nz:[1,0,0,0,0]},{size:5,px:[16,16,15,17,18],py:[12,23,11,12,12],pz:[0,0,0,0,0],nx:[8,8,9,3,13],ny:[4,4,12,3,10],nz:[1,-1,-1,-1,-1]},{size:4,px:[17,16,6,5],py:[14,13,4,5],pz:[0,0,-1,-1],nx:[8,15,4,7],ny:[10,14,4,8],nz:[1,0,2,1]},{size:5,px:[20,10,20,21,19],py:[14,7,13,12,22],pz:[0,1,0,0,0],nx:[22,23,11,23,23],ny:[23,22,11,21,20],nz:[0,0,1,0,-1]},{size:4,px:[12,13,1,18],py:[14,23,3,5],pz:[0,-1,-1,-1],nx:[2,10,5,9],ny:[2,9,8,14],nz:[2,0,1,0]},{size:5,px:[10,4,7,9,8],py:[1,0,2,0,1],pz:[0,1,0,0,0],nx:[2,3,5,3,3],ny:[2,4,8,3,3],nz:[2,1,1,1,-1]},{size:4,px:[11,2,2,11],py:[6,4,5,7],pz:[0,2,2,0],nx:[3,0,5,3],ny:[4,9,8,3],nz:[1,-1,-1,-1]},{size:5,px:[12,10,9,12,12],py:[11,2,1,10,10],pz:[0,1,1,0,-1],nx:[22,11,5,22,23],ny:[1,1,0,0,3],nz:[0,1,2,0,0]},{size:4,px:[5,10,7,11],py:[14,3,0,4],pz:[0,-1,-1,-1],nx:[4,4,4,4],ny:[17,18,15,16],nz:[0,0,0,0]},{size:5,px:[2,2,3,2,2],py:[16,12,20,15,17],pz:[0,0,0,0,0],nx:[12,8,4,15,15],ny:[17,4,4,8,8],nz:[0,1,1,0,-1]},{size:5,px:[12,12,1,6,12],py:[11,10,3,6,10],pz:[0,0,-1,-1,-1],nx:[0,0,1,0,2],ny:[4,0,2,1,0],nz:[0,2,0,1,0]},{size:5,px:[21,20,21,21,14],py:[9,16,11,8,12],pz:[0,0,0,0,0],nx:[17,6,15,0,2],ny:[8,23,13,2,0],nz:[0,-1,-1,-1,-1]},{size:4,px:[6,9,9,5],py:[14,18,23,14],pz:[0,0,0,0],nx:[9,5,5,12],ny:[21,5,3,1],nz:[0,-1,-1,-1]},{size:2,px:[12,13],py:[4,4],pz:[0,0],nx:[4,3],ny:[4,1],nz:[1,2]},{size:5,px:[7,8,11,4,10],py:[3,3,2,1,2],pz:[0,0,0,1,0],nx:[19,20,19,20,20],ny:[0,3,1,2,2],nz:[0,0,0,0,-1]},{size:2,px:[9,1],py:[7,4],pz:[1,-1],nx:[4,7],ny:[5,9],nz:[2,1]},{size:5,px:[11,10,1,5,1],py:[10,12,6,6,5],pz:[0,0,1,1,1],nx:[16,3,2,4,4],ny:[10,4,2,4,4],nz:[0,1,2,1,-1]},{size:2,px:[15,0],py:[17,0],pz:[0,-1],nx:[7,4],ny:[8,5],nz:[1,2]},{size:5,px:[8,10,9,9,9],py:[2,2,2,1,1],pz:[0,0,0,0,-1],nx:[4,2,3,3,2],ny:[0,3,2,1,4],nz:[0,0,0,0,0]},{size:4,px:[11,15,17,16],py:[8,10,11,11],pz:[0,0,0,0],nx:[14,1,1,2],ny:[9,5,7,0],nz:[0,-1,-1,-1]},{size:3,px:[3,5,9],py:[8,6,12],pz:[0,1,0],nx:[3,4,18],ny:[4,2,22],nz:[1,-1,-1]},{size:5,px:[6,1,7,3,3],py:[13,4,13,7,7],pz:[0,2,0,1,-1],nx:[0,0,0,0,0],ny:[16,15,8,13,14],nz:[0,0,1,0,0]},{size:2,px:[5,16],py:[13,10],pz:[0,-1],nx:[3,4],ny:[4,5],nz:[1,1]},{size:5,px:[5,23,11,23,23],py:[5,12,4,16,15],pz:[2,0,1,0,0],nx:[3,2,4,5,5],ny:[4,2,4,11,11],nz:[1,2,1,1,-1]},{size:4,px:[10,10,3,23],py:[7,7,3,16],pz:[1,-1,-1,-1],nx:[5,23,11,22],ny:[4,13,7,16],nz:[2,0,1,0]},{size:5,px:[15,14,13,15,16],py:[1,0,0,0,1],pz:[0,0,0,0,0],nx:[4,9,8,8,8],ny:[2,4,9,4,4],nz:[2,1,1,1,-1]},{size:2,px:[10,4],py:[5,5],pz:[0,-1],nx:[3,15],ny:[1,8],nz:[2,0]},{size:2,px:[6,12],py:[6,9],pz:[1,0],nx:[10,10],ny:[10,10],nz:[0,-1]},{size:5,px:[1,0,0,0,0],py:[5,4,11,9,12],pz:[0,1,0,0,0],nx:[9,8,2,4,7],ny:[7,7,2,4,7],nz:[0,0,2,1,0]},{size:2,px:[4,8],py:[4,7],pz:[2,1],nx:[9,8],ny:[4,7],nz:[1,-1]},{size:2,px:[5,6],py:[4,1],pz:[2,-1],nx:[8,6],ny:[7,3],nz:[1,1]},{size:5,px:[8,5,7,6,11],py:[12,5,13,13,22],pz:[0,1,0,0,0],nx:[23,23,23,22,22],ny:[20,19,21,23,23],nz:[0,0,0,0,-1]},{size:2,px:[3,17],py:[6,9],pz:[1,-1],nx:[3,3],ny:[10,9],nz:[1,1]},{size:2,px:[14,11],py:[23,5],pz:[0,0],nx:[7,3],ny:[10,20],nz:[1,-1]},{size:2,px:[3,4],py:[8,8],pz:[1,1],nx:[9,4],ny:[15,4],nz:[0,-1]},{size:2,px:[2,4],py:[4,7],pz:[2,1],nx:[2,4],ny:[4,4],nz:[1,-1]},{size:2,px:[23,11],py:[21,10],pz:[0,1],nx:[2,3],ny:[11,14],nz:[1,0]},{size:4,px:[11,11,11,3],py:[13,12,11,4],pz:[0,0,0,-1],nx:[14,13,13,6],ny:[13,11,10,5],nz:[0,0,0,1]},{size:2,px:[4,7],py:[3,6],pz:[2,1],nx:[9,19],ny:[4,14],nz:[1,-1]},{size:3,px:[10,5,7],py:[5,0,6],pz:[1,-1,-1],nx:[10,21,5],ny:[0,5,3],nz:[1,0,2]},{size:2,px:[16,13],py:[3,15],pz:[0,-1],nx:[17,7],ny:[23,8],nz:[0,1]},{size:3,px:[4,2,2],py:[15,7,19],pz:[0,1,-1],nx:[2,8,4],ny:[5,14,9],nz:[2,0,1]},{size:3,px:[8,3,6],py:[10,2,4],pz:[0,2,1],nx:[3,8,4],ny:[4,14,9],nz:[1,-1,-1]},{size:2,px:[14,3],py:[18,3],pz:[0,-1],nx:[12,14],ny:[17,9],nz:[0,0]},{size:3,px:[7,1,10],py:[14,10,10],pz:[0,-1,-1],nx:[9,6,2],ny:[13,18,2],nz:[0,0,2]},{size:2,px:[11,8],py:[13,11],pz:[0,-1],nx:[2,4],ny:[7,18],nz:[1,0]},{size:2,px:[5,4],py:[21,17],pz:[0,0],nx:[9,3],ny:[5,1],nz:[1,-1]},{size:2,px:[6,6],py:[4,0],pz:[0,-1],nx:[4,3],ny:[2,0],nz:[0,1]},{size:2,px:[2,1],py:[1,5],pz:[0,-1],nx:[0,1],ny:[1,0],nz:[1,0]},{size:2,px:[18,1],py:[13,5],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:5,px:[0,0,0,0,1],py:[4,3,2,12,15],pz:[1,1,2,0,0],nx:[5,9,4,8,8],ny:[3,6,3,6,6],nz:[1,0,1,0,-1]},{size:2,px:[2,5],py:[0,2],pz:[1,-1],nx:[2,1],ny:[0,1],nz:[0,1]},{size:4,px:[7,15,4,20],py:[8,23,4,8],pz:[1,0,2,0],nx:[6,0,3,4],ny:[9,2,13,6],nz:[0,-1,-1,-1]},{size:4,px:[11,11,10,20],py:[10,9,11,8],pz:[0,0,0,-1],nx:[21,20,21,21],ny:[18,23,19,17],nz:[0,0,0,0]},{size:2,px:[3,8],py:[7,5],pz:[1,-1],nx:[3,4],ny:[4,4],nz:[1,1]},{size:2,px:[5,11],py:[3,4],pz:[2,1],nx:[8,7],ny:[5,12],nz:[1,0]},{size:2,px:[4,1],py:[1,3],pz:[1,-1],nx:[3,6],ny:[0,0],nz:[1,0]},{size:2,px:[19,9],py:[16,8],pz:[0,1],nx:[14,6],ny:[15,1],nz:[0,-1]},{size:2,px:[12,6],py:[13,5],pz:[0,-1],nx:[5,5],ny:[1,2],nz:[2,2]},{size:5,px:[16,14,4,15,12],py:[1,1,1,2,1],pz:[0,0,2,0,0],nx:[6,4,3,2,10],ny:[22,8,2,1,7],nz:[0,1,1,2,0]},{size:5,px:[6,8,6,5,5],py:[1,0,0,1,0],pz:[0,0,0,0,0],nx:[4,4,4,4,8],ny:[4,3,2,5,10],nz:[2,2,2,2,1]},{size:2,px:[9,8],py:[17,0],pz:[0,-1],nx:[2,5],ny:[5,8],nz:[2,1]},{size:2,px:[8,0],py:[7,3],pz:[1,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[10,21],py:[11,20],pz:[1,0],nx:[11,4],ny:[17,1],nz:[0,-1]},{size:5,px:[5,10,4,17,10],py:[3,6,3,11,5],pz:[1,0,1,0,0],nx:[21,20,9,19,10],ny:[4,3,0,2,1],nz:[0,0,1,0,-1]},{size:2,px:[23,23],py:[10,10],pz:[0,-1],nx:[23,23],ny:[21,22],nz:[0,0]},{size:5,px:[9,20,19,20,20],py:[0,3,1,2,2],pz:[1,0,0,0,-1],nx:[11,23,11,23,5],ny:[1,2,0,1,0],nz:[1,0,1,0,2]},{size:3,px:[6,8,7],py:[4,10,11],pz:[1,0,0],nx:[8,3,4],ny:[9,4,4],nz:[0,-1,-1]},{size:4,px:[13,13,10,4],py:[14,23,1,5],pz:[0,-1,-1,-1],nx:[15,14,8,8],ny:[13,12,8,9],nz:[0,0,1,1]},{size:2,px:[11,9],py:[5,8],pz:[0,-1],nx:[7,8],ny:[7,4],nz:[0,1]},{size:5,px:[4,8,4,7,7],py:[2,3,3,11,11],pz:[2,1,2,1,-1],nx:[0,0,1,0,0],ny:[4,6,15,3,2],nz:[1,1,0,2,2]},{size:2,px:[6,1],py:[12,1],pz:[0,-1],nx:[1,10],ny:[2,11],nz:[2,0]},{size:5,px:[0,0,2,3,7],py:[0,1,4,3,11],pz:[0,-1,-1,-1,-1],nx:[9,11,9,6,12],ny:[2,1,1,0,2],nz:[0,0,0,1,0]},{size:2,px:[10,11],py:[4,4],pz:[0,0],nx:[8,4],ny:[4,2],nz:[1,-1]},{size:5,px:[1,1,1,1,1],py:[15,10,19,16,18],pz:[0,1,0,0,0],nx:[4,5,3,5,6],ny:[4,19,9,18,19],nz:[1,0,1,0,-1]},{size:5,px:[12,12,12,12,20],py:[11,12,13,13,18],pz:[0,0,0,-1,-1],nx:[0,0,0,0,0],ny:[4,2,7,6,12],nz:[1,2,1,1,0]},{size:2,px:[0,0],py:[9,11],pz:[0,0],nx:[10,4],ny:[5,3],nz:[1,-1]},{size:2,px:[11,8],py:[9,6],pz:[0,1],nx:[13,13],ny:[10,10],nz:[0,-1]},{size:2,px:[6,3],py:[5,3],pz:[1,2],nx:[3,3],ny:[5,5],nz:[2,-1]},{size:2,px:[19,9],py:[10,6],pz:[0,1],nx:[4,1],ny:[2,2],nz:[2,-1]},{size:2,px:[14,4],py:[19,12],pz:[0,-1],nx:[14,8],ny:[17,10],nz:[0,1]},{size:4,px:[4,2,13,2],py:[12,6,9,3],pz:[0,1,-1,-1],nx:[1,0,1,0],ny:[16,14,11,15],nz:[0,0,1,0]},{size:2,px:[3,3],py:[8,7],pz:[1,1],nx:[4,4],ny:[4,8],nz:[1,-1]},{size:5,px:[9,11,12,6,10],py:[2,1,2,1,2],pz:[0,0,0,1,0],nx:[4,6,4,6,2],ny:[4,0,9,1,8],nz:[0,0,1,0,1]},{size:5,px:[4,4,7,2,2],py:[19,20,23,8,9],pz:[0,0,0,1,1],nx:[7,0,5,6,2],ny:[10,5,4,1,8],nz:[1,-1,-1,-1,-1]},{size:5,px:[18,18,17,18,18],py:[15,16,14,20,17],pz:[0,0,0,0,0],nx:[15,2,2,5,2],ny:[8,0,2,9,4],nz:[0,-1,-1,-1,-1]},{size:4,px:[13,13,13,18],py:[11,12,12,20],pz:[0,0,-1,-1],nx:[1,3,10,10],ny:[1,6,12,11],nz:[2,0,0,0]},{size:2,px:[8,9],py:[0,1],pz:[1,1],nx:[19,4],ny:[2,2],nz:[0,-1]},{size:2,px:[6,3],py:[4,2],pz:[1,2],nx:[8,4],ny:[4,0],nz:[1,-1]},{size:5,px:[23,11,22,13,13],py:[8,3,3,12,12],pz:[0,1,0,0,-1],nx:[15,7,14,13,8],ny:[7,3,6,6,3],nz:[0,1,0,0,1]},{size:3,px:[9,11,19],py:[7,3,0],pz:[1,-1,-1],nx:[23,23,11],ny:[16,12,7],nz:[0,0,1]},{size:2,px:[15,8],py:[23,7],pz:[0,-1],nx:[4,3],ny:[5,4],nz:[2,2]},{size:2,px:[4,10],py:[6,13],pz:[1,-1],nx:[2,3],ny:[4,10],nz:[2,1]},{size:2,px:[4,1],py:[11,2],pz:[1,2],nx:[9,2],ny:[5,2],nz:[1,-1]},{size:2,px:[22,22],py:[22,21],pz:[0,0],nx:[3,0],ny:[5,3],nz:[1,-1]},{size:2,px:[20,10],py:[12,6],pz:[0,1],nx:[20,10],ny:[23,11],nz:[0,-1]},{size:4,px:[10,3,3,4],py:[5,3,4,9],pz:[0,-1,-1,-1],nx:[14,4,3,11],ny:[2,1,1,3],nz:[0,2,2,0]},{size:3,px:[15,15,3],py:[1,1,4],pz:[0,-1,-1],nx:[7,4,4],ny:[8,2,3],nz:[1,2,2]},{size:3,px:[0,0,0],py:[3,4,6],pz:[2,2,1],nx:[0,21,4],ny:[23,14,3],nz:[0,-1,-1]},{size:5,px:[4,4,5,3,4],py:[9,11,8,4,8],pz:[1,1,1,2,1],nx:[21,21,10,19,19],ny:[3,4,1,0,0],nz:[0,0,1,0,-1]},{size:4,px:[21,20,20,21],py:[18,21,20,17],pz:[0,0,0,0],nx:[8,1,4,2],ny:[10,0,2,4],nz:[1,-1,-1,-1]},{size:2,px:[3,6],py:[7,14],pz:[1,0],nx:[3,5],ny:[4,5],nz:[1,-1]},{size:3,px:[12,0,23],py:[20,2,13],pz:[0,-1,-1],nx:[12,2,9],ny:[19,2,7],nz:[0,2,0]},{size:2,px:[0,6],py:[22,11],pz:[0,-1],nx:[20,18],ny:[12,23],nz:[0,0]},{size:5,px:[9,15,15,16,8],py:[2,1,2,2,1],pz:[1,0,0,0,1],nx:[1,1,1,1,1],ny:[16,10,17,18,18],nz:[0,1,0,0,-1]},{size:5,px:[10,5,3,5,8],py:[14,2,1,4,1],pz:[0,-1,-1,-1,-1],nx:[23,23,23,23,23],ny:[18,15,16,14,17],nz:[0,0,0,0,0]},{size:5,px:[2,2,2,3,2],py:[16,17,15,20,11],pz:[0,0,0,0,1],nx:[8,22,2,1,23],ny:[20,11,5,0,17],nz:[0,-1,-1,-1,-1]}],alpha:[-1.299972,1.299972,-.7630804,.7630804,-.5530378,.5530378,-.5444703,.5444703,-.5207701,.5207701,-.5035143,.5035143,-.4514416,.4514416,-.4897723,.4897723,-.5006264,.5006264,-.4626049,.4626049,-.4375402,.4375402,-.3742565,.3742565,-.3873996,.3873996,-.3715484,.3715484,-.356248,.356248,-.3216189,.3216189,-.3983409,.3983409,-.3191891,.3191891,-.3242173,.3242173,-.352804,.352804,-.3562318,.3562318,-.3592398,.3592398,-.2557584,.2557584,-.2747951,.2747951,-.2747554,.2747554,-.2980481,.2980481,-.288767,.288767,-.3895318,.3895318,-.2786896,.2786896,-.2763841,.2763841,-.2704816,.2704816,-.2075489,.2075489,-.3104773,.3104773,-.2580337,.2580337,-.2448334,.2448334,-.3054279,.3054279,-.2335804,.2335804,-.2972322,.2972322,-.2270521,.2270521,-.2134621,.2134621,-.2261655,.2261655,-.2091024,.2091024,-.2478928,.2478928,-.2468972,.2468972,-.1919746,.1919746,-.2756623,.2756623,-.2629717,.2629717,-.2198653,.2198653,-.2174434,.2174434,-.2193626,.2193626,-.1956262,.1956262,-.1720459,.1720459,-.1781067,.1781067,-.1773484,.1773484,-.1793871,.1793871,-.1973396,.1973396,-.2397262,.2397262,-.2164685,.2164685,-.2214348,.2214348,-.2265941,.2265941,-.2075436,.2075436,-.224407,.224407,-.2291992,.2291992,-.2223506,.2223506,-.1639398,.1639398,-.1732374,.1732374,-.1808631,.1808631,-.1860962,.1860962,-.1781604,.1781604,-.2108322,.2108322,-.238639,.238639,-.1942083,.1942083,-.1949161,.1949161,-.1953729,.1953729,-.2317591,.2317591,-.2335136,.2335136,-.2282835,.2282835,-.2148716,.2148716,-.1588127,.1588127,-.1566765,.1566765,-.1644839,.1644839,-.2386947,.2386947,-.1704126,.1704126,-.2213945,.2213945,-.1740398,.1740398,-.2451678,.2451678,-.2120524,.2120524,-.1886646,.1886646,-.2824447,.2824447,-.1900364,.1900364,-.2179183,.2179183,-.2257696,.2257696,-.2023404,.2023404,-.1886901,.1886901,-.1850663,.1850663,-.2035414,.2035414,-.1930174,.1930174,-.1898282,.1898282,-.166664,.166664,-.1646143,.1646143,-.1543475,.1543475,-.1366289,.1366289,-.1636837,.1636837,-.2547716,.2547716,-.1281869,.1281869,-.1509159,.1509159,-.1447827,.1447827,-.1626126,.1626126,-.2387014,.2387014,-.257116,.257116,-.1719175,.1719175,-.1646742,.1646742,-.1717041,.1717041,-.2039217,.2039217,-.1796907,.1796907]},{count:153,threshold:-4.971032,feature:[{size:5,px:[14,13,18,10,16],py:[2,2,13,3,12],pz:[0,0,0,0,0],nx:[21,7,14,23,23],ny:[16,7,8,3,13],nz:[0,1,0,0,0]},{size:5,px:[12,12,12,15,14],py:[9,10,11,3,3],pz:[0,0,0,0,0],nx:[9,9,8,14,3],ny:[9,8,5,9,5],nz:[0,0,1,0,2]},{size:5,px:[5,11,7,6,8],py:[12,8,12,12,11],pz:[0,0,0,0,0],nx:[8,4,3,9,9],ny:[4,4,4,9,9],nz:[1,1,1,0,-1]},{size:5,px:[9,8,4,10,6],py:[2,2,1,3,13],pz:[0,0,1,0,0],nx:[1,1,5,1,1],ny:[2,3,8,4,16],nz:[0,0,1,0,0]},{size:5,px:[3,16,6,17,15],py:[2,17,4,12,12],pz:[2,0,1,0,0],nx:[4,8,15,1,1],ny:[4,4,8,16,16],nz:[1,1,-1,-1,-1]},{size:4,px:[18,15,8,17],py:[12,23,6,12],pz:[0,0,1,0],nx:[15,4,10,5],ny:[21,8,14,3],nz:[0,-1,-1,-1]},{size:5,px:[18,17,9,19,19],py:[3,1,0,3,3],pz:[0,0,1,0,-1],nx:[22,11,23,23,23],ny:[0,1,2,3,4],nz:[0,1,0,0,0]},{size:4,px:[9,5,5,10],py:[18,15,14,18],pz:[0,0,0,0],nx:[10,11,2,0],ny:[16,7,12,7],nz:[0,-1,-1,-1]},{size:2,px:[2,12],py:[4,6],pz:[2,0],nx:[3,12],ny:[4,19],nz:[1,-1]},{size:5,px:[3,4,5,2,2],py:[3,3,3,1,1],pz:[0,0,0,1,-1],nx:[0,0,1,0,0],ny:[3,4,0,1,2],nz:[0,0,0,1,0]},{size:5,px:[12,12,12,8,10],py:[13,12,12,1,18],pz:[0,0,-1,-1,-1],nx:[13,8,7,14,9],ny:[10,10,7,13,4],nz:[0,1,1,0,1]},{size:5,px:[15,4,12,14,12],py:[12,3,9,10,8],pz:[0,2,0,0,0],nx:[14,7,11,2,9],ny:[8,4,7,5,4],nz:[0,1,-1,-1,-1]},{size:3,px:[3,9,7],py:[7,23,15],pz:[1,-1,-1],nx:[4,4,2],ny:[9,7,5],nz:[1,1,2]},{size:3,px:[5,17,5],py:[3,23,4],pz:[2,0,2],nx:[23,2,4],ny:[23,16,4],nz:[0,-1,-1]},{size:5,px:[4,9,9,10,8],py:[1,0,1,0,2],pz:[1,0,0,0,0],nx:[2,5,4,2,2],ny:[2,19,11,4,1],nz:[2,0,1,2,2]},{size:5,px:[8,3,8,4,7],py:[23,9,13,8,16],pz:[0,1,0,1,0],nx:[8,2,5,3,2],ny:[8,15,1,1,1],nz:[0,-1,-1,-1,-1]},{size:2,px:[11,5],py:[14,5],pz:[0,-1],nx:[1,9],ny:[3,13],nz:[2,0]},{size:5,px:[5,8,1,8,6],py:[12,12,3,23,12],pz:[0,0,2,0,0],nx:[1,1,2,1,1],ny:[22,21,23,20,20],nz:[0,0,0,0,-1]},{size:5,px:[14,21,19,21,20],py:[13,8,20,10,7],pz:[0,0,0,0,0],nx:[16,0,14,23,1],ny:[8,1,23,10,20],nz:[0,-1,-1,-1,-1]},{size:5,px:[15,16,13,14,14],py:[3,3,3,3,3],pz:[0,0,0,0,-1],nx:[18,19,18,9,17],ny:[2,2,1,1,0],nz:[0,0,0,1,0]},{size:2,px:[17,9],py:[14,4],pz:[0,-1],nx:[9,18],ny:[4,18],nz:[1,0]},{size:2,px:[21,20],py:[17,21],pz:[0,0],nx:[12,3],ny:[17,10],nz:[0,-1]},{size:2,px:[2,1],py:[10,4],pz:[1,2],nx:[4,1],ny:[10,5],nz:[1,-1]},{size:5,px:[7,8,4,9,9],py:[2,2,0,2,2],pz:[0,0,1,0,-1],nx:[5,5,4,6,3],ny:[0,1,2,0,0],nz:[0,0,0,0,1]},{size:2,px:[2,5],py:[3,5],pz:[2,-1],nx:[3,2],ny:[4,2],nz:[1,2]},{size:5,px:[0,0,0,0,0],py:[0,1,3,4,4],pz:[2,2,1,1,-1],nx:[20,20,19,20,19],ny:[21,20,23,19,22],nz:[0,0,0,0,0]},{size:2,px:[9,18],py:[8,16],pz:[1,0],nx:[14,6],ny:[15,16],nz:[0,-1]},{size:3,px:[3,4,7],py:[3,3,9],pz:[2,2,1],nx:[8,9,7],ny:[4,11,4],nz:[1,-1,-1]},{size:5,px:[6,14,4,7,7],py:[4,23,3,6,6],pz:[1,0,2,1,-1],nx:[2,0,2,1,3],ny:[20,4,21,10,23],nz:[0,2,0,1,0]},{size:5,px:[2,4,8,9,10],py:[3,8,13,23,23],pz:[2,1,0,0,0],nx:[10,4,0,3,3],ny:[21,3,0,3,23],nz:[0,-1,-1,-1,-1]},{size:3,px:[11,10,11],py:[6,5,5],pz:[0,0,0],nx:[14,6,1],ny:[7,9,5],nz:[0,1,-1]},{size:5,px:[11,11,11,11,6],py:[11,12,10,13,6],pz:[0,0,0,0,1],nx:[9,13,13,13,4],ny:[4,9,10,11,2],nz:[1,0,0,0,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,11],ny:[4,7],nz:[1,-1]},{size:2,px:[1,2],py:[4,11],pz:[2,0],nx:[8,8],ny:[15,15],nz:[0,-1]},{size:5,px:[12,12,13,12,12],py:[10,11,13,12,12],pz:[0,0,0,0,-1],nx:[0,0,0,1,0],ny:[13,2,12,5,14],nz:[0,2,0,0,0]},{size:5,px:[0,0,0,1,1],py:[4,3,11,15,13],pz:[1,2,0,0,0],nx:[2,3,3,1,0],ny:[2,4,4,5,14],nz:[2,1,-1,-1,-1]},{size:2,px:[4,11],py:[12,10],pz:[0,-1],nx:[1,2],ny:[2,4],nz:[2,1]},{size:5,px:[18,8,9,9,9],py:[15,7,8,10,7],pz:[0,1,1,1,1],nx:[22,23,21,22,11],ny:[20,16,23,19,9],nz:[0,0,0,0,1]},{size:5,px:[14,12,13,14,15],py:[1,0,0,0,1],pz:[0,0,0,0,0],nx:[4,9,4,7,7],ny:[2,3,1,8,8],nz:[2,1,2,1,-1]},{size:2,px:[13,9],py:[14,19],pz:[0,-1],nx:[6,10],ny:[0,2],nz:[1,0]},{size:2,px:[13,12],py:[4,4],pz:[0,0],nx:[3,3],ny:[1,1],nz:[2,-1]},{size:3,px:[14,5,5],py:[18,3,4],pz:[0,-1,-1],nx:[8,7,8],ny:[4,8,10],nz:[1,1,1]},{size:2,px:[8,18],py:[6,11],pz:[1,0],nx:[9,1],ny:[4,0],nz:[1,-1]},{size:2,px:[16,11],py:[9,7],pz:[0,0],nx:[7,7],ny:[4,4],nz:[1,-1]},{size:5,px:[23,11,23,11,23],py:[13,4,12,7,10],pz:[0,1,0,1,0],nx:[7,4,8,15,15],ny:[9,2,4,8,8],nz:[0,2,1,0,-1]},{size:2,px:[6,3],py:[1,0],pz:[0,1],nx:[4,1],ny:[1,2],nz:[0,-1]},{size:2,px:[5,5],py:[7,6],pz:[0,1],nx:[6,4],ny:[9,11],nz:[0,-1]},{size:4,px:[5,6,5,5],py:[8,6,11,6],pz:[1,1,1,0],nx:[23,0,4,5],ny:[0,2,2,1],nz:[0,-1,-1,-1]},{size:2,px:[18,4],py:[13,3],pz:[0,-1],nx:[15,4],ny:[11,2],nz:[0,2]},{size:2,px:[4,0],py:[8,0],pz:[1,-1],nx:[9,2],ny:[15,5],nz:[0,2]},{size:5,px:[15,15,16,14,14],py:[0,1,1,0,0],pz:[0,0,0,0,-1],nx:[4,4,8,8,15],ny:[4,5,4,11,23],nz:[2,2,1,1,0]},{size:4,px:[12,11,3,14],py:[14,22,1,0],pz:[0,-1,-1,-1],nx:[8,15,7,16],ny:[2,3,1,3],nz:[1,0,1,0]},{size:2,px:[5,12],py:[6,17],pz:[1,-1],nx:[2,1],ny:[4,2],nz:[1,2]},{size:5,px:[13,12,12,7,7],py:[5,6,5,14,14],pz:[0,0,0,0,-1],nx:[10,3,10,1,10],ny:[13,8,11,3,10],nz:[0,0,0,1,0]},{size:2,px:[4,4],py:[15,0],pz:[0,-1],nx:[4,4],ny:[16,17],nz:[0,0]},{size:5,px:[1,4,2,1,2],py:[4,0,1,1,0],pz:[1,1,1,2,1],nx:[4,9,1,5,1],ny:[3,4,4,5,5],nz:[1,-1,-1,-1,-1]},{size:2,px:[10,3],py:[3,1],pz:[0,2],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[16,0],py:[21,0],pz:[0,-1],nx:[6,8],ny:[8,4],nz:[1,1]},{size:2,px:[7,11],py:[4,18],pz:[0,-1],nx:[5,7],ny:[0,2],nz:[2,0]},{size:2,px:[9,7],py:[0,3],pz:[1,-1],nx:[20,10],ny:[0,1],nz:[0,1]},{size:4,px:[10,4,1,5],py:[0,6,8,4],pz:[1,-1,-1,-1],nx:[6,15,4,14],ny:[3,5,1,5],nz:[1,0,2,0]},{size:2,px:[4,4],py:[3,4],pz:[2,2],nx:[9,2],ny:[4,0],nz:[1,-1]},{size:2,px:[8,4],py:[3,4],pz:[0,-1],nx:[8,6],ny:[2,1],nz:[0,0]},{size:2,px:[2,0],py:[6,3],pz:[1,2],nx:[0,7],ny:[7,8],nz:[1,-1]},{size:2,px:[10,0],py:[7,3],pz:[1,-1],nx:[15,4],ny:[14,4],nz:[0,2]},{size:4,px:[3,1,2,2],py:[20,7,18,17],pz:[0,1,0,0],nx:[9,5,5,4],ny:[5,4,18,4],nz:[1,-1,-1,-1]},{size:2,px:[5,4],py:[3,1],pz:[2,-1],nx:[23,23],ny:[14,13],nz:[0,0]},{size:2,px:[12,4],py:[6,1],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:5,px:[22,22,11,11,11],py:[12,13,4,6,6],pz:[0,0,1,1,-1],nx:[4,4,4,4,3],ny:[16,15,18,14,11],nz:[0,0,0,0,1]},{size:2,px:[4,10],py:[0,1],pz:[1,0],nx:[2,2],ny:[2,2],nz:[2,-1]},{size:2,px:[15,6],py:[4,4],pz:[0,-1],nx:[15,4],ny:[2,1],nz:[0,2]},{size:2,px:[11,2],py:[10,20],pz:[0,-1],nx:[4,9],ny:[1,2],nz:[2,1]},{size:2,px:[4,19],py:[3,8],pz:[2,0],nx:[8,21],ny:[4,20],nz:[1,-1]},{size:5,px:[4,6,7,6,2],py:[6,15,13,14,3],pz:[1,0,0,0,-1],nx:[21,22,19,21,10],ny:[6,12,0,3,2],nz:[0,0,0,0,1]},{size:5,px:[8,12,15,14,13],py:[0,0,0,0,0],pz:[1,0,0,0,0],nx:[4,3,1,3,4],ny:[19,16,3,15,4],nz:[0,0,2,0,1]},{size:2,px:[3,3],py:[2,3],pz:[2,2],nx:[8,4],ny:[4,1],nz:[1,-1]},{size:4,px:[0,0,0,5],py:[10,9,11,21],pz:[1,1,-1,-1],nx:[12,4,3,11],ny:[3,1,1,3],nz:[0,2,2,0]},{size:2,px:[3,1],py:[0,0],pz:[1,2],nx:[1,4],ny:[2,1],nz:[1,-1]},{size:5,px:[2,5,1,0,1],py:[14,23,7,5,9],pz:[0,0,1,1,1],nx:[0,0,7,9,11],ny:[23,22,4,9,3],nz:[0,-1,-1,-1,-1]},{size:2,px:[8,9],py:[7,1],pz:[1,-1],nx:[8,8],ny:[8,9],nz:[1,1]},{size:2,px:[11,9],py:[11,3],pz:[1,-1],nx:[3,2],ny:[14,10],nz:[0,1]},{size:4,px:[2,4,5,4],py:[8,20,22,16],pz:[1,0,0,0],nx:[8,2,11,3],ny:[7,4,15,4],nz:[0,-1,-1,-1]},{size:3,px:[1,2,3],py:[2,1,0],pz:[0,0,0],nx:[0,0,15],ny:[1,0,11],nz:[0,0,-1]},{size:2,px:[12,22],py:[6,7],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:3,px:[13,0,5],py:[19,10,2],pz:[0,-1,-1],nx:[3,4,6],ny:[5,5,9],nz:[2,2,1]},{size:2,px:[8,15],py:[8,22],pz:[1,0],nx:[7,4],ny:[10,7],nz:[1,-1]},{size:2,px:[10,10],py:[7,6],pz:[1,1],nx:[10,1],ny:[9,0],nz:[1,-1]},{size:2,px:[9,11],py:[4,3],pz:[0,-1],nx:[5,9],ny:[0,1],nz:[1,0]},{size:5,px:[14,13,14,12,15],py:[1,2,2,2,2],pz:[0,0,0,0,0],nx:[4,8,4,7,4],ny:[2,4,3,4,4],nz:[2,1,2,1,-1]},{size:3,px:[13,8,2],py:[14,5,8],pz:[0,-1,-1],nx:[6,8,9],ny:[3,2,2],nz:[0,0,0]},{size:3,px:[3,6,8],py:[7,4,12],pz:[1,1,0],nx:[3,8,9],ny:[5,2,2],nz:[1,-1,-1]},{size:2,px:[13,4],py:[16,3],pz:[0,2],nx:[13,7],ny:[15,5],nz:[0,-1]},{size:2,px:[3,0],py:[7,9],pz:[1,-1],nx:[2,8],ny:[2,4],nz:[2,1]},{size:5,px:[3,6,8,7,7],py:[0,1,0,0,0],pz:[1,0,0,0,-1],nx:[7,9,4,3,4],ny:[9,7,4,2,2],nz:[1,1,1,2,2]},{size:3,px:[3,4,16],py:[4,4,6],pz:[1,2,0],nx:[2,2,2],ny:[0,0,1],nz:[0,-1,-1]},{size:2,px:[0,0],py:[1,0],pz:[2,2],nx:[5,5],ny:[2,2],nz:[1,-1]},{size:2,px:[9,3],py:[7,20],pz:[1,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[8,21],py:[10,18],pz:[0,-1],nx:[9,4],ny:[10,4],nz:[0,1]},{size:2,px:[6,13],py:[6,23],pz:[1,-1],nx:[10,10],ny:[11,12],nz:[0,0]},{size:5,px:[10,9,5,10,10],py:[9,13,6,10,10],pz:[0,0,1,0,-1],nx:[21,21,21,10,21],ny:[18,20,19,11,17],nz:[0,0,0,1,0]},{size:2,px:[8,8],py:[7,6],pz:[1,1],nx:[8,1],ny:[4,4],nz:[1,-1]},{size:2,px:[11,4],py:[14,7],pz:[0,-1],nx:[13,13],ny:[13,11],nz:[0,0]},{size:2,px:[4,4],py:[4,5],pz:[2,2],nx:[12,5],ny:[16,2],nz:[0,-1]},{size:3,px:[1,3,20],py:[3,9,2],pz:[2,-1,-1],nx:[0,0,0],ny:[7,4,13],nz:[1,2,0]},{size:2,px:[0,0],py:[4,2],pz:[1,2],nx:[1,0],ny:[4,4],nz:[1,-1]},{size:3,px:[8,9,11],py:[2,1,2],pz:[0,0,0],nx:[2,2,0],ny:[2,2,13],nz:[2,-1,-1]},{size:2,px:[1,10],py:[23,5],pz:[0,-1],nx:[3,6],ny:[1,1],nz:[2,1]},{size:4,px:[13,6,3,4],py:[8,6,4,2],pz:[0,-1,-1,-1],nx:[1,1,1,4],ny:[9,7,8,20],nz:[1,1,1,0]},{size:5,px:[11,4,4,10,3],py:[9,16,13,12,7],pz:[0,0,0,0,0],nx:[7,11,3,17,4],ny:[8,11,9,0,4],nz:[0,-1,-1,-1,-1]},{size:2,px:[6,6],py:[6,8],pz:[1,-1],nx:[0,0],ny:[1,2],nz:[2,2]},{size:2,px:[10,5],py:[7,2],pz:[0,-1],nx:[4,13],ny:[5,9],nz:[2,0]},{size:2,px:[10,5],py:[8,2],pz:[1,-1],nx:[16,4],ny:[14,5],nz:[0,2]},{size:2,px:[1,1],py:[16,15],pz:[0,0],nx:[1,20],ny:[23,1],nz:[0,-1]},{size:2,px:[2,3],py:[4,7],pz:[2,1],nx:[2,3],ny:[5,4],nz:[2,-1]},{size:2,px:[19,8],py:[5,4],pz:[0,-1],nx:[10,10],ny:[1,3],nz:[1,1]},{size:2,px:[21,21],py:[18,16],pz:[0,0],nx:[10,3],ny:[17,5],nz:[0,-1]},{size:2,px:[9,2],py:[23,4],pz:[0,2],nx:[5,11],ny:[3,7],nz:[2,1]},{size:2,px:[7,0],py:[3,2],pz:[0,-1],nx:[3,6],ny:[1,1],nz:[1,0]},{size:4,px:[5,9,8,9],py:[8,12,13,18],pz:[0,0,0,0],nx:[6,5,2,5],ny:[8,4,7,11],nz:[0,-1,-1,-1]},{size:2,px:[7,2],py:[0,0],pz:[0,2],nx:[5,5],ny:[3,4],nz:[1,-1]},{size:2,px:[11,11],py:[12,13],pz:[0,0],nx:[9,1],ny:[14,3],nz:[0,-1]},{size:5,px:[8,16,9,4,15],py:[11,13,8,4,12],pz:[1,0,1,2,0],nx:[3,3,3,3,4],ny:[4,2,1,3,0],nz:[0,0,0,0,0]},{size:2,px:[9,5],py:[7,6],pz:[1,-1],nx:[19,8],ny:[17,11],nz:[0,1]},{size:5,px:[14,15,12,13,13],py:[2,2,2,2,2],pz:[0,0,0,0,-1],nx:[20,9,19,20,4],ny:[14,2,5,15,1],nz:[0,1,0,0,2]},{size:2,px:[18,8],py:[20,7],pz:[0,1],nx:[4,9],ny:[2,2],nz:[2,-1]},{size:2,px:[6,3],py:[11,5],pz:[1,2],nx:[13,19],ny:[20,20],nz:[0,-1]},{size:3,px:[12,11,3],py:[20,20,5],pz:[0,0,-1],nx:[11,12,6],ny:[21,21,10],nz:[0,0,1]},{size:2,px:[3,6],py:[7,14],pz:[1,0],nx:[3,13],ny:[4,8],nz:[1,-1]},{size:2,px:[0,0],py:[5,9],pz:[2,1],nx:[2,11],ny:[8,6],nz:[1,-1]},{size:2,px:[2,2],py:[5,5],pz:[1,-1],nx:[0,0],ny:[6,3],nz:[1,2]},{size:2,px:[11,23],py:[5,9],pz:[1,0],nx:[8,2],ny:[11,0],nz:[0,-1]},{size:2,px:[11,23],py:[12,9],pz:[0,-1],nx:[11,22],ny:[10,21],nz:[1,0]},{size:2,px:[12,12],py:[7,7],pz:[0,-1],nx:[5,4],ny:[7,10],nz:[1,1]},{size:2,px:[9,8],py:[18,1],pz:[0,-1],nx:[5,4],ny:[8,10],nz:[1,1]},{size:2,px:[16,17],py:[11,11],pz:[0,0],nx:[15,2],ny:[9,4],nz:[0,-1]},{size:2,px:[0,1],py:[3,0],pz:[2,-1],nx:[9,10],ny:[6,5],nz:[1,1]},{size:2,px:[13,13],py:[20,21],pz:[0,-1],nx:[2,2],ny:[6,5],nz:[1,1]},{size:5,px:[20,20,4,18,19],py:[17,16,5,22,20],pz:[0,0,2,0,0],nx:[8,11,5,6,2],ny:[10,15,11,10,1],nz:[1,-1,-1,-1,-1]},{size:2,px:[11,11],py:[4,4],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:3,px:[6,5,6],py:[8,10,10],pz:[1,1,1],nx:[11,8,22],ny:[19,2,15],nz:[0,-1,-1]},{size:3,px:[5,2,13],py:[7,10,10],pz:[1,-1,-1],nx:[11,11,23],ny:[8,9,14],nz:[1,1,0]},{size:5,px:[3,6,1,5,10],py:[7,14,1,9,2],pz:[1,-1,-1,-1,-1],nx:[11,0,1,5,1],ny:[14,12,18,5,19],nz:[0,0,0,1,0]},{size:3,px:[21,21,10],py:[16,17,10],pz:[0,0,1],nx:[5,5,1],ny:[9,9,18],nz:[1,-1,-1]},{size:2,px:[6,21],py:[6,17],pz:[1,-1],nx:[20,10],ny:[7,4],nz:[0,1]},{size:2,px:[10,11],py:[0,0],pz:[1,-1],nx:[6,13],ny:[2,4],nz:[1,0]},{size:4,px:[4,4,7,9],py:[3,4,10,3],pz:[2,2,1,1],nx:[21,2,15,5],ny:[0,0,0,2],nz:[0,-1,-1,-1]},{size:3,px:[11,11,11],py:[7,6,9],pz:[1,1,1],nx:[23,4,9],ny:[23,5,6],nz:[0,-1,-1]},{size:2,px:[14,15],py:[1,1],pz:[0,0],nx:[8,4],ny:[4,2],nz:[1,2]},{size:5,px:[11,23,11,23,23],py:[11,22,10,21,20],pz:[1,0,1,0,0],nx:[10,9,19,10,10],ny:[10,11,20,9,9],nz:[1,1,0,1,-1]},{size:2,px:[7,23],py:[13,22],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:2,px:[12,1],py:[19,0],pz:[0,-1],nx:[11,12],ny:[22,17],nz:[0,0]},{size:2,px:[10,8],py:[4,3],pz:[1,-1],nx:[5,23],ny:[2,7],nz:[2,0]},{size:2,px:[9,10],py:[6,20],pz:[1,-1],nx:[8,8],ny:[4,6],nz:[1,1]}],alpha:[-1.135386,1.135386,-.90908,.90908,-.591378,.591378,-.5556534,.5556534,-.508415,.508415,-.4464489,.4464489,-.4463241,.4463241,-.4985226,.4985226,-.4424638,.4424638,-.4300093,.4300093,-.4231341,.4231341,-.4087428,.4087428,-.337448,.337448,-.3230151,.3230151,-.3084427,.3084427,-.3235494,.3235494,-.2589281,.2589281,-.2970292,.2970292,-.2957065,.2957065,-.3997619,.3997619,-.3535901,.3535901,-.2725396,.2725396,-.2649725,.2649725,-.3103888,.3103888,-.3117775,.3117775,-.258962,.258962,-.2689202,.2689202,-.2127024,.2127024,-.2436322,.2436322,-.3120574,.3120574,-.278601,.278601,-.2649072,.2649072,-.2766509,.2766509,-.2367237,.2367237,-.2658049,.2658049,-.2103463,.2103463,-.1911522,.1911522,-.2535425,.2535425,-.2434696,.2434696,-.2180788,.2180788,-.2496873,.2496873,-.2700969,.2700969,-.2565479,.2565479,-.2737741,.2737741,-.1675507,.1675507,-.2551417,.2551417,-.2067648,.2067648,-.1636834,.1636834,-.2129306,.2129306,-.1656758,.1656758,-.1919369,.1919369,-.2031763,.2031763,-.2062327,.2062327,-.257795,.257795,-.2951823,.2951823,-.202316,.202316,-.2022234,.2022234,-.2132906,.2132906,-.1653278,.1653278,-.1648474,.1648474,-.1593352,.1593352,-.173565,.173565,-.1688778,.1688778,-.1519705,.1519705,-.1812202,.1812202,-.1967481,.1967481,-.1852954,.1852954,-.231778,.231778,-.2036251,.2036251,-.1609324,.1609324,-.2160205,.2160205,-.202619,.202619,-.1854761,.1854761,-.1832038,.1832038,-.2001141,.2001141,-.1418333,.1418333,-.1704773,.1704773,-.1586261,.1586261,-.1587582,.1587582,-.1899489,.1899489,-.147716,.147716,-.2260467,.2260467,-.2393598,.2393598,-.1582373,.1582373,-.1702498,.1702498,-.1737398,.1737398,-.1462529,.1462529,-.1396517,.1396517,-.1629625,.1629625,-.1446933,.1446933,-.1811657,.1811657,-.1336427,.1336427,-.1924813,.1924813,-.145752,.145752,-.1600259,.1600259,-.1297,.1297,-.2076199,.2076199,-.151006,.151006,-.1914568,.1914568,-.2138162,.2138162,-.1856916,.1856916,-.1843047,.1843047,-.1526846,.1526846,-.132832,.132832,-.1751311,.1751311,-.1643908,.1643908,-.1482706,.1482706,-.1622298,.1622298,-.1884979,.1884979,-.1633604,.1633604,-.1554166,.1554166,-.1405332,.1405332,-.1772398,.1772398,-.1410008,.1410008,-.1362301,.1362301,-.1709087,.1709087,-.1584613,.1584613,-.1188814,.1188814,-.1423888,.1423888,-.1345565,.1345565,-.1835986,.1835986,-.1445329,.1445329,-.1385826,.1385826,-.1558917,.1558917,-.1476053,.1476053,-.1370722,.1370722,-.2362666,.2362666,-.2907774,.2907774,-.165636,.165636,-.1644407,.1644407,-.1443394,.1443394,-.1438823,.1438823,-.1476964,.1476964,-.1956593,.1956593,-.2417519,.2417519,-.1659315,.1659315,-.1466254,.1466254,-.2034909,.2034909,-.2128771,.2128771,-.1665429,.1665429,-.1387131,.1387131,-.1298823,.1298823,-.1329495,.1329495,-.1769587,.1769587,-.136653,.136653,-.1254359,.1254359,-.1673022,.1673022,-.1602519,.1602519,-.1897245,.1897245,-.1893579,.1893579,-.157935,.157935,-.1472589,.1472589,-.1614193,.1614193]},{count:203,threshold:-4.769677,feature:[{size:5,px:[12,5,14,9,7],py:[9,13,3,1,3],pz:[0,0,0,0,0],nx:[1,0,5,14,9],ny:[5,3,8,8,9],nz:[2,0,1,0,0]},{size:5,px:[14,13,11,17,12],py:[2,2,4,13,3],pz:[0,0,0,0,0],nx:[7,22,8,23,22],ny:[8,15,11,12,3],nz:[1,0,1,0,0]},{size:5,px:[9,11,11,11,16],py:[4,8,7,9,12],pz:[0,0,0,0,0],nx:[4,8,14,9,9],ny:[4,4,8,8,8],nz:[1,1,0,0,-1]},{size:5,px:[6,12,12,8,3],py:[11,7,8,10,2],pz:[0,0,0,0,2],nx:[8,4,4,4,0],ny:[4,4,4,11,0],nz:[1,1,-1,-1,-1]},{size:5,px:[19,17,18,9,9],py:[3,2,3,1,1],pz:[0,0,0,1,-1],nx:[21,21,10,22,22],ny:[1,2,0,4,3],nz:[0,0,1,0,0]},{size:2,px:[4,7],py:[4,6],pz:[2,1],nx:[8,7],ny:[4,10],nz:[1,1]},{size:5,px:[14,17,17,13,12],py:[18,15,16,18,18],pz:[0,0,0,0,0],nx:[13,19,5,20,6],ny:[16,4,1,19,0],nz:[0,-1,-1,-1,-1]},{size:5,px:[6,7,4,5,5],py:[15,23,6,12,16],pz:[0,0,1,0,0],nx:[3,14,14,6,6],ny:[4,11,11,9,0],nz:[1,-1,-1,-1,-1]},{size:5,px:[16,9,6,3,11],py:[2,2,5,3,2],pz:[0,0,1,2,0],nx:[3,4,2,5,5],ny:[4,11,2,8,8],nz:[1,1,2,1,-1]},{size:5,px:[6,1,5,3,3],py:[14,4,15,7,7],pz:[0,2,0,1,-1],nx:[0,0,1,1,1],ny:[7,8,18,17,5],nz:[1,1,0,0,2]},{size:5,px:[12,12,9,5,3],py:[14,14,0,3,7],pz:[0,-1,-1,-1,-1],nx:[7,7,14,8,13],ny:[7,8,13,10,10],nz:[1,1,0,1,0]},{size:2,px:[3,4],py:[7,9],pz:[1,-1],nx:[2,4],ny:[5,4],nz:[2,1]},{size:3,px:[10,21,17],py:[7,11,23],pz:[1,0,0],nx:[21,9,3],ny:[23,5,5],nz:[0,-1,-1]},{size:5,px:[8,11,9,10,11],py:[2,0,1,1,2],pz:[0,0,0,0,0],nx:[4,5,6,4,3],ny:[8,4,18,7,4],nz:[1,1,0,1,-1]},{size:5,px:[20,22,3,19,10],py:[20,9,4,22,3],pz:[0,0,2,0,1],nx:[8,20,8,3,2],ny:[4,3,6,4,3],nz:[1,-1,-1,-1,-1]},{size:2,px:[4,4],py:[8,7],pz:[1,1],nx:[9,2],ny:[15,5],nz:[0,-1]},{size:2,px:[11,13],py:[13,4],pz:[0,-1],nx:[20,21],ny:[1,4],nz:[0,0]},{size:5,px:[1,2,7,6,8],py:[0,2,3,3,3],pz:[2,1,0,0,0],nx:[1,2,1,1,1],ny:[0,0,4,3,3],nz:[1,0,0,0,-1]},{size:2,px:[3,10],py:[9,11],pz:[0,0],nx:[6,3],ny:[9,2],nz:[0,-1]},{size:5,px:[12,12,12,12,6],py:[10,11,13,12,6],pz:[0,0,0,0,-1],nx:[10,2,1,10,10],ny:[10,4,2,11,9],nz:[0,1,2,0,0]},{size:5,px:[16,18,11,17,15],py:[11,12,8,12,11],pz:[0,0,0,0,0],nx:[14,0,19,0,10],ny:[9,3,14,8,9],nz:[0,-1,-1,-1,-1]},{size:4,px:[5,9,5,8],py:[21,18,20,23],pz:[0,0,0,0],nx:[8,4,3,1],ny:[20,3,4,3],nz:[0,-1,-1,-1]},{size:2,px:[2,3],py:[3,2],pz:[2,2],nx:[3,12],ny:[4,23],nz:[1,-1]},{size:5,px:[0,1,1,1,1],py:[2,16,14,13,12],pz:[2,0,0,0,0],nx:[8,4,9,4,7],ny:[9,3,4,2,9],nz:[1,2,1,2,1]},{size:2,px:[4,9],py:[3,7],pz:[2,-1],nx:[4,9],ny:[2,4],nz:[2,1]},{size:5,px:[15,16,17,15,8],py:[3,3,3,18,1],pz:[0,0,0,0,1],nx:[1,2,2,1,3],ny:[5,3,2,6,0],nz:[0,0,0,0,0]},{size:2,px:[4,17],py:[4,14],pz:[2,0],nx:[15,7],ny:[15,10],nz:[0,-1]},{size:3,px:[14,12,3],py:[3,13,3],pz:[0,-1,-1],nx:[4,17,4],ny:[3,19,4],nz:[2,0,2]},{size:4,px:[4,5,12,2],py:[9,6,19,4],pz:[1,1,0,2],nx:[12,17,4,4],ny:[18,19,4,4],nz:[0,-1,-1,-1]},{size:5,px:[10,19,20,20,19],py:[7,14,13,14,13],pz:[1,0,0,0,-1],nx:[11,23,23,23,23],ny:[9,15,13,16,14],nz:[1,0,0,0,0]},{size:4,px:[0,0,0,2],py:[5,6,5,14],pz:[1,1,2,0],nx:[0,3,3,17],ny:[23,5,5,9],nz:[0,-1,-1,-1]},{size:2,px:[15,4],py:[23,5],pz:[0,2],nx:[9,3],ny:[4,4],nz:[1,-1]},{size:4,px:[6,5,10,12],py:[3,3,23,23],pz:[1,1,0,0],nx:[11,1,1,4],ny:[21,3,5,5],nz:[0,-1,-1,-1]},{size:2,px:[5,2],py:[9,4],pz:[1,2],nx:[4,9],ny:[4,2],nz:[1,-1]},{size:5,px:[23,23,23,23,23],py:[14,9,13,11,12],pz:[0,0,0,0,0],nx:[6,13,7,8,8],ny:[9,6,3,3,3],nz:[1,0,1,1,-1]},{size:2,px:[10,3],py:[4,5],pz:[0,-1],nx:[3,8],ny:[1,3],nz:[2,1]},{size:2,px:[3,12],py:[4,18],pz:[2,0],nx:[12,0],ny:[16,3],nz:[0,-1]},{size:2,px:[16,2],py:[4,4],pz:[0,-1],nx:[16,4],ny:[1,0],nz:[0,2]},{size:2,px:[3,4],py:[7,1],pz:[1,-1],nx:[5,3],ny:[19,9],nz:[0,1]},{size:4,px:[20,19,20,21],py:[2,0,1,3],pz:[0,0,0,0],nx:[11,5,23,11],ny:[0,0,1,1],nz:[1,2,0,1]},{size:2,px:[12,13],py:[7,5],pz:[0,0],nx:[8,5],ny:[3,5],nz:[1,-1]},{size:5,px:[22,21,22,22,22],py:[20,22,18,19,16],pz:[0,0,0,0,0],nx:[2,3,3,15,15],ny:[4,5,4,7,7],nz:[1,2,1,0,-1]},{size:3,px:[15,14,14],py:[1,1,1],pz:[0,0,-1],nx:[17,18,16],ny:[1,2,1],nz:[0,0,0]},{size:4,px:[17,16,16,15],py:[2,1,0,0],pz:[0,0,0,0],nx:[7,4,2,11],ny:[11,2,1,4],nz:[1,2,-1,-1]},{size:4,px:[18,0,0,0],py:[14,6,5,4],pz:[0,-1,-1,-1],nx:[19,19,19,19],ny:[16,19,17,18],nz:[0,0,0,0]},{size:4,px:[11,5,5,0],py:[14,1,4,4],pz:[0,-1,-1,-1],nx:[11,8,2,15],ny:[17,14,1,9],nz:[0,0,2,0]},{size:2,px:[4,5],py:[19,21],pz:[0,0],nx:[10,2],ny:[15,4],nz:[0,-1]},{size:2,px:[6,4],py:[4,6],pz:[1,1],nx:[3,3],ny:[4,5],nz:[1,-1]},{size:2,px:[2,7],py:[1,13],pz:[2,0],nx:[7,2],ny:[1,4],nz:[1,-1]},{size:4,px:[15,10,4,7],py:[23,3,1,7],pz:[0,1,2,1],nx:[0,4,1,1],ny:[0,2,0,-1900147915],nz:[0,-1,-1,-1]},{size:2,px:[7,2],py:[12,11],pz:[0,-1],nx:[2,4],ny:[2,5],nz:[2,1]},{size:5,px:[0,0,0,1,0],py:[9,4,3,2,6],pz:[0,1,2,1,1],nx:[9,4,2,16,16],ny:[7,4,2,8,8],nz:[0,1,2,0,-1]},{size:5,px:[18,4,9,4,4],py:[12,5,6,3,4],pz:[0,2,1,2,-1],nx:[4,3,3,2,3],ny:[23,19,21,16,18],nz:[0,0,0,0,0]},{size:2,px:[6,6],py:[14,13],pz:[0,0],nx:[3,10],ny:[4,7],nz:[1,-1]},{size:5,px:[3,4,4,2,2],py:[8,11,7,4,4],pz:[1,1,1,2,-1],nx:[20,18,19,20,19],ny:[4,0,2,3,1],nz:[0,0,0,0,0]},{size:5,px:[17,12,14,8,16],py:[2,0,0,0,0],pz:[0,0,0,1,0],nx:[3,15,3,2,2],ny:[2,9,7,2,2],nz:[2,0,1,2,-1]},{size:5,px:[11,10,11,11,11],py:[10,12,11,12,12],pz:[0,0,0,0,-1],nx:[13,13,20,10,13],ny:[9,11,8,4,10],nz:[0,0,0,1,0]},{size:2,px:[8,16],py:[7,13],pz:[1,0],nx:[8,13],ny:[4,11],nz:[1,-1]},{size:2,px:[6,7],py:[20,3],pz:[0,-1],nx:[3,4],ny:[10,10],nz:[1,1]},{size:3,px:[13,10,17],py:[9,3,5],pz:[0,-1,-1],nx:[1,3,1],ny:[5,16,6],nz:[2,0,1]},{size:2,px:[0,0],py:[5,5],pz:[2,-1],nx:[8,3],ny:[14,10],nz:[0,1]},{size:4,px:[11,9,12,10],py:[2,2,2,2],pz:[0,0,0,0],nx:[4,4,4,10],ny:[5,5,0,16],nz:[1,-1,-1,-1]},{size:3,px:[7,9,12],py:[2,2,2],pz:[1,-1,-1],nx:[4,7,2],ny:[3,1,0],nz:[0,0,2]},{size:2,px:[2,4],py:[3,12],pz:[2,0],nx:[7,4],ny:[6,5],nz:[1,2]},{size:4,px:[12,12,6,3],py:[12,11,21,7],pz:[0,0,-1,-1],nx:[1,0,0,0],ny:[13,3,6,5],nz:[0,2,1,1]},{size:3,px:[3,1,3],py:[21,8,18],pz:[0,1,0],nx:[11,20,0],ny:[17,17,6],nz:[0,-1,-1]},{size:2,px:[2,8],py:[3,12],pz:[2,0],nx:[2,20],ny:[4,17],nz:[1,-1]},{size:5,px:[2,3,4,3,2],py:[10,14,14,15,13],pz:[1,0,0,0,0],nx:[0,0,1,0,0],ny:[21,20,23,19,19],nz:[0,0,0,0,-1]},{size:2,px:[2,15],py:[7,4],pz:[1,-1],nx:[3,8],ny:[4,14],nz:[1,0]},{size:5,px:[19,14,12,15,4],py:[8,12,10,16,2],pz:[0,0,0,0,2],nx:[8,0,12,4,0],ny:[4,1,12,2,19],nz:[1,-1,-1,-1,-1]},{size:2,px:[18,9],py:[15,3],pz:[0,-1],nx:[8,15],ny:[9,14],nz:[1,0]},{size:5,px:[4,2,3,4,9],py:[9,4,3,8,23],pz:[1,2,1,1,0],nx:[11,23,23,11,11],ny:[0,2,3,1,1],nz:[1,0,0,1,-1]},{size:2,px:[6,7],py:[1,1],pz:[0,0],nx:[3,4],ny:[10,5],nz:[1,-1]},{size:4,px:[11,9,8,5],py:[12,15,13,3],pz:[0,-1,-1,-1],nx:[3,12,14,13],ny:[0,3,3,3],nz:[2,0,0,0]},{size:2,px:[11,11],py:[6,5],pz:[0,0],nx:[8,11],ny:[4,20],nz:[1,-1]},{size:5,px:[21,20,21,21,21],py:[18,21,17,19,19],pz:[0,0,0,0,-1],nx:[2,5,4,4,5],ny:[5,12,11,10,10],nz:[1,0,0,0,0]},{size:5,px:[1,1,1,1,1],py:[10,11,7,9,8],pz:[0,0,0,0,0],nx:[11,23,23,23,23],ny:[10,20,21,19,19],nz:[1,0,0,0,-1]},{size:5,px:[7,8,7,3,1],py:[14,13,13,2,2],pz:[0,0,-1,-1,-1],nx:[1,10,2,2,10],ny:[2,13,4,16,12],nz:[2,0,1,0,0]},{size:2,px:[17,18],py:[12,12],pz:[0,0],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[17,0],py:[5,20],pz:[0,-1],nx:[4,9],ny:[0,2],nz:[2,1]},{size:5,px:[22,22,22,11,23],py:[16,15,14,6,13],pz:[0,0,0,1,0],nx:[16,15,7,9,9],ny:[15,8,4,10,10],nz:[0,0,1,1,-1]},{size:2,px:[13,3],py:[3,1],pz:[0,2],nx:[8,3],ny:[4,2],nz:[1,-1]},{size:2,px:[5,6],py:[4,1],pz:[1,-1],nx:[6,3],ny:[4,2],nz:[1,2]},{size:3,px:[4,2,6],py:[6,3,4],pz:[1,2,1],nx:[10,0,4],ny:[9,4,3],nz:[0,-1,-1]},{size:4,px:[2,8,4,10],py:[4,23,7,23],pz:[2,0,1,0],nx:[9,4,11,9],ny:[21,5,16,0],nz:[0,-1,-1,-1]},{size:2,px:[6,3],py:[13,0],pz:[0,-1],nx:[8,2],ny:[11,2],nz:[0,2]},{size:2,px:[3,3],py:[1,4],pz:[1,-1],nx:[3,5],ny:[0,1],nz:[1,0]},{size:2,px:[7,2],py:[0,0],pz:[0,2],nx:[2,10],ny:[1,6],nz:[2,0]},{size:2,px:[10,2],py:[7,0],pz:[1,-1],nx:[21,5],ny:[15,4],nz:[0,2]},{size:2,px:[1,1],py:[10,9],pz:[0,0],nx:[0,3],ny:[13,11],nz:[0,-1]},{size:2,px:[11,9],py:[13,0],pz:[0,-1],nx:[3,3],ny:[4,3],nz:[1,1]},{size:5,px:[14,13,13,14,14],py:[12,10,11,13,13],pz:[0,0,0,0,-1],nx:[9,8,4,5,7],ny:[4,4,2,2,4],nz:[0,0,1,1,0]},{size:3,px:[2,4,1],py:[2,0,0],pz:[0,0,1],nx:[0,7,4],ny:[0,3,2],nz:[1,-1,-1]},{size:2,px:[11,4],py:[5,0],pz:[0,-1],nx:[8,6],ny:[4,9],nz:[1,1]},{size:3,px:[0,0,0],py:[20,2,4],pz:[0,-1,-1],nx:[12,3,10],ny:[3,1,3],nz:[0,2,0]},{size:5,px:[5,11,10,13,13],py:[0,0,0,2,2],pz:[1,0,0,0,-1],nx:[4,5,5,4,5],ny:[14,0,2,6,1],nz:[0,0,0,0,0]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,11],ny:[4,1],nz:[1,-1]},{size:2,px:[14,-1715597992],py:[19,9],pz:[0,-1],nx:[7,14],ny:[10,17],nz:[1,0]},{size:2,px:[11,1],py:[9,0],pz:[0,-1],nx:[1,12],ny:[2,10],nz:[2,0]},{size:2,px:[17,9],py:[13,17],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:2,px:[0,7],py:[1,9],pz:[1,-1],nx:[18,4],ny:[14,2],nz:[0,2]},{size:2,px:[14,7],py:[23,9],pz:[0,-1],nx:[4,8],ny:[5,10],nz:[2,1]},{size:2,px:[8,7],py:[17,9],pz:[0,-1],nx:[3,2],ny:[0,3],nz:[0,0]},{size:2,px:[13,4],py:[20,1],pz:[0,-1],nx:[5,3],ny:[21,17],nz:[0,0]},{size:3,px:[0,0,1],py:[3,6,15],pz:[2,1,0],nx:[10,8,3],ny:[6,4,2],nz:[0,-1,-1]},{size:2,px:[8,8],py:[18,8],pz:[0,-1],nx:[5,4],ny:[8,10],nz:[1,1]},{size:2,px:[6,5],py:[2,2],pz:[1,1],nx:[8,9],ny:[4,3],nz:[1,-1]},{size:2,px:[6,3],py:[11,5],pz:[1,2],nx:[13,3],ny:[19,2],nz:[0,-1]},{size:2,px:[4,6],py:[1,11],pz:[2,-1],nx:[3,2],ny:[1,0],nz:[1,2]},{size:2,px:[9,4],py:[10,5],pz:[1,2],nx:[8,4],ny:[10,4],nz:[1,-1]},{size:2,px:[12,12],py:[11,20],pz:[0,-1],nx:[0,0],ny:[6,10],nz:[1,0]},{size:2,px:[7,12],py:[2,20],pz:[0,-1],nx:[2,2],ny:[2,3],nz:[2,2]},{size:2,px:[0,15],py:[5,21],pz:[1,-1],nx:[10,9],ny:[3,3],nz:[0,1]},{size:2,px:[15,9],py:[1,0],pz:[0,1],nx:[19,3],ny:[0,3],nz:[0,-1]},{size:2,px:[21,5],py:[13,5],pz:[0,2],nx:[23,6],ny:[23,5],nz:[0,-1]},{size:2,px:[5,8],py:[3,1],pz:[2,-1],nx:[9,9],ny:[6,5],nz:[1,1]},{size:2,px:[2,2],py:[7,7],pz:[1,-1],nx:[5,3],ny:[23,17],nz:[0,0]},{size:2,px:[11,3],py:[6,4],pz:[0,-1],nx:[2,4],ny:[2,4],nz:[2,1]},{size:3,px:[14,0,17],py:[20,3,21],pz:[0,-1,-1],nx:[11,11,11],ny:[7,9,10],nz:[1,1,1]},{size:5,px:[11,11,23,23,12],py:[10,11,21,20,12],pz:[1,1,0,0,0],nx:[8,3,6,7,7],ny:[4,5,11,11,11],nz:[1,2,1,1,-1]},{size:2,px:[11,11],py:[11,10],pz:[0,0],nx:[9,3],ny:[2,5],nz:[1,-1]},{size:2,px:[12,14],py:[19,19],pz:[0,0],nx:[12,13],ny:[18,17],nz:[0,-1]},{size:5,px:[13,14,12,15,14],py:[0,0,1,1,1],pz:[0,0,0,0,0],nx:[4,8,4,7,7],ny:[3,4,2,5,5],nz:[2,1,2,1,-1]},{size:2,px:[17,5],py:[10,2],pz:[0,-1],nx:[4,9],ny:[2,3],nz:[2,1]},{size:2,px:[18,10],py:[6,10],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:5,px:[8,18,8,4,16],py:[6,12,9,4,13],pz:[1,0,1,2,0],nx:[3,4,3,5,5],ny:[0,2,3,1,1],nz:[1,0,0,0,-1]},{size:2,px:[3,6],py:[2,4],pz:[2,1],nx:[8,0],ny:[4,0],nz:[1,-1]},{size:2,px:[0,0],py:[4,5],pz:[2,-1],nx:[4,2],ny:[14,7],nz:[0,1]},{size:4,px:[3,4,4,3],py:[11,12,12,2],pz:[0,0,-1,-1],nx:[1,2,1,2],ny:[11,14,12,16],nz:[0,0,0,0]},{size:2,px:[6,0],py:[11,0],pz:[0,-1],nx:[3,4],ny:[4,5],nz:[1,1]},{size:2,px:[3,2],py:[21,11],pz:[0,1],nx:[3,2],ny:[10,0],nz:[1,-1]},{size:3,px:[10,3,13],py:[2,0,2],pz:[0,2,0],nx:[7,16,1],ny:[10,4,1],nz:[0,-1,-1]},{size:2,px:[6,12],py:[2,5],pz:[1,0],nx:[6,18],ny:[1,19],nz:[1,-1]},{size:2,px:[3,16],py:[0,16],pz:[1,-1],nx:[11,2],ny:[5,1],nz:[0,2]},{size:2,px:[11,10],py:[13,1],pz:[0,-1],nx:[1,1],ny:[22,21],nz:[0,0]},{size:2,px:[11,10],py:[18,18],pz:[0,0],nx:[5,8],ny:[9,0],nz:[1,-1]},{size:2,px:[3,2],py:[20,18],pz:[0,0],nx:[8,3],ny:[5,1],nz:[1,-1]},{size:2,px:[14,2],py:[17,1],pz:[0,-1],nx:[14,13],ny:[15,15],nz:[0,0]},{size:2,px:[3,4],py:[2,3],pz:[2,2],nx:[8,3],ny:[4,0],nz:[1,-1]},{size:5,px:[8,18,18,8,7],py:[6,11,11,7,9],pz:[1,0,-1,-1,-1],nx:[5,13,5,11,5],ny:[3,11,0,8,2],nz:[2,0,2,1,2]},{size:5,px:[12,0,5,4,7],py:[15,0,4,0,9],pz:[0,-1,-1,-1,-1],nx:[8,7,4,16,6],ny:[17,12,9,10,12],nz:[0,0,1,0,0]},{size:2,px:[6,7],py:[14,1],pz:[0,-1],nx:[5,4],ny:[9,4],nz:[1,1]},{size:4,px:[8,0,22,4],py:[4,4,23,0],pz:[0,-1,-1,-1],nx:[2,4,2,5],ny:[0,1,2,9],nz:[2,1,2,1]},{size:5,px:[9,9,10,10,8],py:[0,1,1,2,0],pz:[1,1,1,1,1],nx:[4,16,16,16,6],ny:[2,11,11,11,12],nz:[2,0,-1,-1,-1]},{size:2,px:[6,6],py:[6,5],pz:[1,1],nx:[0,4],ny:[3,2],nz:[1,-1]},{size:3,px:[10,3,4],py:[5,9,8],pz:[1,-1,-1],nx:[11,23,23],ny:[7,12,11],nz:[1,0,0]},{size:3,px:[13,12,7],py:[19,19,10],pz:[0,0,1],nx:[13,5,19],ny:[20,15,22],nz:[0,-1,-1]},{size:2,px:[12,12],py:[12,13],pz:[0,0],nx:[9,10],ny:[4,4],nz:[1,-1]},{size:2,px:[0,12],py:[1,13],pz:[2,-1],nx:[2,7],ny:[2,13],nz:[2,0]},{size:2,px:[10,10],py:[8,9],pz:[1,1],nx:[19,7],ny:[23,13],nz:[0,-1]},{size:4,px:[8,7,23,15],py:[11,12,4,21],pz:[0,0,-1,-1],nx:[2,5,1,10],ny:[6,6,2,13],nz:[0,1,1,0]},{size:2,px:[10,9],py:[3,3],pz:[0,0],nx:[2,3],ny:[2,4],nz:[2,-1]},{size:2,px:[5,2],py:[3,4],pz:[2,-1],nx:[3,6],ny:[1,2],nz:[2,1]},{size:2,px:[7,11],py:[20,16],pz:[0,-1],nx:[2,4],ny:[5,20],nz:[2,0]},{size:2,px:[9,7],py:[7,5],pz:[1,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[4,2],py:[11,3],pz:[1,2],nx:[5,5],ny:[3,5],nz:[2,-1]},{size:2,px:[11,3],py:[11,5],pz:[1,-1],nx:[4,1],ny:[12,3],nz:[0,2]},{size:2,px:[9,11],py:[6,4],pz:[1,-1],nx:[10,20],ny:[9,18],nz:[1,0]},{size:5,px:[2,2,2,2,1],py:[15,13,16,14,7],pz:[0,0,0,0,1],nx:[15,8,9,8,4],ny:[11,6,5,5,4],nz:[0,1,1,1,-1]},{size:2,px:[12,2],py:[5,5],pz:[0,-1],nx:[3,2],ny:[7,2],nz:[1,2]},{size:2,px:[5,11],py:[1,3],pz:[2,1],nx:[10,10],ny:[3,3],nz:[1,-1]},{size:2,px:[17,11],py:[13,18],pz:[0,-1],nx:[6,9],ny:[9,4],nz:[1,1]},{size:5,px:[5,1,2,5,6],py:[14,4,9,15,23],pz:[0,2,1,0,0],nx:[4,9,18,16,17],ny:[0,1,1,0,0],nz:[2,1,0,0,0]},{size:2,px:[16,17],py:[0,0],pz:[0,0],nx:[23,23],ny:[5,4],nz:[0,-1]},{size:2,px:[13,8],py:[20,6],pz:[0,-1],nx:[5,6],ny:[12,10],nz:[0,1]},{size:2,px:[6,15],py:[15,0],pz:[0,-1],nx:[6,3],ny:[16,4],nz:[0,1]},{size:2,px:[18,20],py:[7,8],pz:[0,0],nx:[18,11],ny:[9,14],nz:[0,-1]},{size:2,px:[9,4],py:[12,6],pz:[0,1],nx:[3,15],ny:[4,4],nz:[1,-1]},{size:2,px:[0,0],py:[5,2],pz:[1,2],nx:[5,5],ny:[2,2],nz:[1,-1]},{size:2,px:[5,20],py:[1,20],pz:[1,-1],nx:[15,17],ny:[1,2],nz:[0,0]},{size:2,px:[7,2],py:[16,4],pz:[0,2],nx:[4,0],ny:[10,6],nz:[1,-1]},{size:2,px:[3,8],py:[5,0],pz:[1,-1],nx:[1,1],ny:[10,18],nz:[1,0]},{size:2,px:[22,0],py:[3,0],pz:[0,-1],nx:[23,11],ny:[4,1],nz:[0,1]},{size:3,px:[19,10,20],py:[21,8,18],pz:[0,1,0],nx:[3,6,20],ny:[5,11,14],nz:[2,-1,-1]},{size:4,px:[2,1,6,5],py:[7,4,23,22],pz:[1,2,0,0],nx:[9,19,20,4],ny:[8,11,9,2],nz:[0,-1,-1,-1]},{size:2,px:[3,6],py:[2,11],pz:[2,1],nx:[12,10],ny:[21,9],nz:[0,-1]},{size:4,px:[6,0,2,2],py:[6,1,4,1],pz:[1,-1,-1,-1],nx:[0,0,0,0],ny:[5,8,9,4],nz:[1,0,0,1]},{size:5,px:[3,13,6,11,9],py:[0,3,1,1,2],pz:[2,0,1,0,0],nx:[7,20,16,4,7],ny:[7,2,19,2,6],nz:[1,0,0,2,1]},{size:4,px:[7,5,2,6],py:[7,7,4,11],pz:[0,0,2,1],nx:[7,1,21,0],ny:[8,4,11,3],nz:[0,-1,-1,-1]},{size:2,px:[2,2],py:[3,2],pz:[2,2],nx:[8,9],ny:[3,11],nz:[1,-1]},{size:2,px:[7,13],py:[3,5],pz:[1,0],nx:[4,3],ny:[2,2],nz:[1,-1]},{size:4,px:[3,12,13,11],py:[0,1,1,1],pz:[2,0,0,0],nx:[8,9,13,0],ny:[4,1,16,3],nz:[1,-1,-1,-1]},{size:2,px:[10,1],py:[4,14],pz:[0,-1],nx:[5,10],ny:[1,2],nz:[1,0]},{size:2,px:[11,12],py:[21,21],pz:[0,0],nx:[10,11],ny:[19,19],nz:[0,0]},{size:2,px:[8,12],py:[6,21],pz:[1,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[11,7],py:[19,0],pz:[0,-1],nx:[6,5],ny:[9,11],nz:[1,1]},{size:5,px:[11,11,11,10,10],py:[10,12,11,13,13],pz:[0,0,0,0,-1],nx:[7,13,6,12,7],ny:[10,6,3,6,11],nz:[0,0,1,0,0]},{size:2,px:[12,11],py:[6,12],pz:[0,-1],nx:[4,8],ny:[4,4],nz:[1,1]},{size:5,px:[16,15,16,15,17],py:[1,0,0,1,1],pz:[0,0,0,0,0],nx:[13,7,6,12,12],ny:[5,4,3,6,6],nz:[0,1,1,0,-1]},{size:2,px:[2,3],py:[1,3],pz:[2,1],nx:[1,5],ny:[1,3],nz:[2,-1]},{size:2,px:[6,3],py:[13,6],pz:[0,1],nx:[4,9],ny:[4,4],nz:[1,-1]},{size:2,px:[0,3],py:[4,3],pz:[1,-1],nx:[4,8],ny:[3,6],nz:[2,1]},{size:2,px:[6,3],py:[2,1],pz:[0,1],nx:[5,5],ny:[7,21],nz:[1,-1]},{size:2,px:[8,4],py:[0,0],pz:[1,-1],nx:[19,17],ny:[1,0],nz:[0,0]},{size:4,px:[8,11,5,0],py:[6,1,1,22],pz:[1,-1,-1,-1],nx:[0,10,10,1],ny:[6,12,13,4],nz:[1,0,0,1]},{size:2,px:[8,17],py:[6,13],pz:[1,0],nx:[14,17],ny:[9,3],nz:[0,-1]},{size:2,px:[5,8],py:[0,4],pz:[2,-1],nx:[9,8],ny:[1,1],nz:[0,0]},{size:2,px:[11,14],py:[13,9],pz:[0,-1],nx:[23,23],ny:[21,19],nz:[0,0]},{size:2,px:[10,9],py:[9,3],pz:[0,-1],nx:[6,3],ny:[2,1],nz:[1,2]},{size:2,px:[11,1],py:[4,4],pz:[0,-1],nx:[2,4],ny:[2,4],nz:[2,1]},{size:2,px:[5,9],py:[3,3],pz:[2,-1],nx:[17,9],ny:[12,5],nz:[0,1]},{size:2,px:[9,7],py:[18,16],pz:[0,-1],nx:[5,2],ny:[9,5],nz:[1,2]},{size:2,px:[3,6],py:[0,1],pz:[1,-1],nx:[4,5],ny:[1,0],nz:[0,0]}],alpha:[-1.149973,1.149973,-.6844773,.6844773,-.6635048,.6635048,-.4888349,.4888349,-.4267976,.4267976,-.42581,.42581,-.4815853,.4815853,-.4091859,.4091859,-.3137414,.3137414,-.333986,.333986,-.3891196,.3891196,-.4167691,.4167691,-.3186609,.3186609,-.2957171,.2957171,-.3210062,.3210062,-.2725684,.2725684,-.2452176,.2452176,-.2812662,.2812662,-.3029622,.3029622,-.3293745,.3293745,-.3441536,.3441536,-.2946918,.2946918,-.2890545,.2890545,-.1949205,.1949205,-.2176102,.2176102,-.259519,.259519,-.2690931,.2690931,-.2130294,.2130294,-.2316308,.2316308,-.2798562,.2798562,-.2146988,.2146988,-.2332089,.2332089,-.2470614,.2470614,-.22043,.22043,-.2272045,.2272045,-.2583686,.2583686,-.2072299,.2072299,-.1834971,.1834971,-.2332656,.2332656,-.3271297,.3271297,-.2401937,.2401937,-.2006316,.2006316,-.2401947,.2401947,-.2475346,.2475346,-.2579532,.2579532,-.2466235,.2466235,-.1787582,.1787582,-.2036892,.2036892,-.1665028,.1665028,-.157651,.157651,-.2036997,.2036997,-.2040734,.2040734,-.1792532,.1792532,-.2174767,.2174767,-.1876948,.1876948,-.1883137,.1883137,-.1923872,.1923872,-.2620218,.2620218,-.1659873,.1659873,-.1475948,.1475948,-.1731607,.1731607,-.2059256,.2059256,-.1586309,.1586309,-.1607668,.1607668,-.1975101,.1975101,-.2130745,.2130745,-.1898872,.1898872,-.2052598,.2052598,-.1599397,.1599397,-.1770134,.1770134,-.1888249,.1888249,-.1515406,.1515406,-.1907771,.1907771,-.1698406,.1698406,-.2079535,.2079535,-.1966967,.1966967,-.1631391,.1631391,-.2158666,.2158666,-.2891774,.2891774,-.1581556,.1581556,-.1475359,.1475359,-.1806169,.1806169,-.1782238,.1782238,-.166044,.166044,-.1576919,.1576919,-.1741775,.1741775,-.1427265,.1427265,-.169588,.169588,-.1486712,.1486712,-.1533565,.1533565,-.1601464,.1601464,-.1978414,.1978414,-.1746566,.1746566,-.1794736,.1794736,-.1896567,.1896567,-.1666197,.1666197,-.1969351,.1969351,-.2321735,.2321735,-.1592485,.1592485,-.1671464,.1671464,-.1688885,.1688885,-.1868042,.1868042,-.1301138,.1301138,-.1330094,.1330094,-.1268423,.1268423,-.1820868,.1820868,-.188102,.188102,-.1580814,.1580814,-.1302653,.1302653,-.1787262,.1787262,-.1658453,.1658453,-.1240772,.1240772,-.1315621,.1315621,-.1756341,.1756341,-.1429438,.1429438,-.1351775,.1351775,-.2035692,.2035692,-.126767,.126767,-.128847,.128847,-.1393648,.1393648,-.1755962,.1755962,-.1308445,.1308445,-.1703894,.1703894,-.1461334,.1461334,-.1368683,.1368683,-.1244085,.1244085,-.1718163,.1718163,-.1415624,.1415624,-.1752024,.1752024,-.1666463,.1666463,-.1407325,.1407325,-.1258317,.1258317,-.1416511,.1416511,-.1420816,.1420816,-.1562547,.1562547,-.1542952,.1542952,-.1158829,.1158829,-.1392875,.1392875,-.1610095,.1610095,-.154644,.154644,-.1416235,.1416235,-.2028817,.2028817,-.1106779,.1106779,-.0923166,.0923166,-.116446,.116446,-.1701578,.1701578,-.1277995,.1277995,-.1946177,.1946177,-.1394509,.1394509,-.1370145,.1370145,-.1446031,.1446031,-.1665215,.1665215,-.1435822,.1435822,-.1559354,.1559354,-.159186,.159186,-.1193338,.1193338,-.1236954,.1236954,-.1209139,.1209139,-.1267385,.1267385,-.1232397,.1232397,-.1299632,.1299632,-.130202,.130202,-.1202975,.1202975,-.1525378,.1525378,-.1123073,.1123073,-.1605678,.1605678,-.1406867,.1406867,-.1354273,.1354273,-.1393192,.1393192,-.1278263,.1278263,-.1172073,.1172073,-.1153493,.1153493,-.1356318,.1356318,-.1316614,.1316614,-.1374489,.1374489,-.1018254,.1018254,-.1473336,.1473336,-.1289687,.1289687,-.1299183,.1299183,-.1178391,.1178391,-.1619059,.1619059,-.1842569,.1842569,-.1829095,.1829095,-.1939918,.1939918,-.1395362,.1395362,-.1774673,.1774673,-.1688216,.1688216,-.1671747,.1671747,-.1850178,.1850178,-.1106695,.1106695,-.1258323,.1258323,-.1246819,.1246819,-.09892193,.09892193,-.1399638,.1399638,-.1228375,.1228375,-.1756236,.1756236,-.1360307,.1360307,-.1266574,.1266574,-.1372135,.1372135,-.1175947,.1175947,-.1330075,.1330075,-.1396152,.1396152,-.2088443,.2088443]},{count:301,threshold:-4.887516,feature:[{size:5,px:[8,11,8,14,10],py:[6,9,3,3,4],pz:[1,0,0,0,0],nx:[8,7,19,7,13],ny:[11,8,8,5,8],nz:[1,1,0,1,0]},{size:5,px:[14,3,13,12,12],py:[4,6,4,4,8],pz:[0,1,0,0,0],nx:[2,5,2,10,10],ny:[2,8,5,8,8],nz:[2,1,2,0,-1]},{size:5,px:[6,5,3,7,7],py:[2,3,1,2,2],pz:[0,0,1,0,-1],nx:[2,2,1,2,1],ny:[3,1,2,2,2],nz:[0,0,2,0,1]},{size:5,px:[3,3,6,12,8],py:[4,2,4,10,17],pz:[2,2,1,0,0],nx:[4,8,8,2,1],ny:[4,4,4,2,2],nz:[1,1,-1,-1,-1]},{size:5,px:[18,19,17,9,16],py:[1,2,2,0,2],pz:[0,0,0,1,0],nx:[23,23,22,22,22],ny:[4,3,1,0,2],nz:[0,0,0,0,0]},{size:3,px:[15,4,14],py:[23,4,18],pz:[0,2,0],nx:[7,0,5],ny:[10,4,9],nz:[1,-1,-1]},{size:5,px:[11,11,16,11,17],py:[8,6,11,7,11],pz:[0,0,0,0,0],nx:[8,4,14,14,1],ny:[4,4,8,8,5],nz:[1,1,0,-1,-1]},{size:5,px:[12,12,12,12,12],py:[13,10,11,12,12],pz:[0,0,0,0,-1],nx:[4,4,1,2,9],ny:[8,10,2,4,15],nz:[0,1,2,1,0]},{size:2,px:[19,0],py:[14,17],pz:[0,-1],nx:[20,19],ny:[15,22],nz:[0,0]},{size:5,px:[3,3,1,3,5],py:[13,15,6,14,22],pz:[0,0,1,0,0],nx:[0,0,1,0,0],ny:[11,21,23,5,5],nz:[1,0,0,2,-1]},{size:5,px:[4,2,10,4,3],py:[19,4,13,16,13],pz:[0,1,0,0,0],nx:[3,20,7,4,0],ny:[4,19,5,1,5],nz:[1,-1,-1,-1,-1]},{size:2,px:[11,5],py:[4,4],pz:[0,-1],nx:[15,3],ny:[15,1],nz:[0,2]},{size:4,px:[17,17,12,11],py:[14,15,18,18],pz:[0,0,0,0],nx:[11,4,1,0],ny:[17,20,8,5],nz:[0,-1,-1,-1]},{size:5,px:[6,2,1,2,11],py:[14,4,1,1,18],pz:[0,-1,-1,-1,-1],nx:[5,5,3,5,2],ny:[18,17,7,9,2],nz:[0,0,1,1,2]},{size:5,px:[20,19,20,15,20],py:[17,20,12,12,8],pz:[0,0,0,0,0],nx:[17,0,5,2,2],ny:[8,4,9,2,2],nz:[0,-1,-1,-1,-1]},{size:2,px:[6,8],py:[7,11],pz:[1,-1],nx:[7,8],ny:[7,10],nz:[1,1]},{size:5,px:[15,16,14,8,8],py:[2,2,2,0,0],pz:[0,0,0,1,-1],nx:[20,11,21,18,19],ny:[3,6,5,1,2],nz:[0,1,0,0,0]},{size:4,px:[17,18,9,8],py:[23,21,7,8],pz:[0,0,1,1],nx:[8,17,10,18],ny:[4,12,2,1],nz:[1,-1,-1,-1]},{size:5,px:[2,2,9,4,8],py:[7,3,12,12,23],pz:[1,1,0,0,0],nx:[0,0,0,0,0],ny:[3,1,2,4,4],nz:[0,0,0,0,-1]},{size:3,px:[7,8,5],py:[22,23,9],pz:[0,0,1],nx:[9,4,2],ny:[21,4,0],nz:[0,-1,-1]},{size:2,px:[3,3],py:[7,7],pz:[1,-1],nx:[3,2],ny:[4,2],nz:[1,2]},{size:5,px:[15,11,10,3,17],py:[0,1,2,3,1],pz:[0,0,0,2,0],nx:[5,8,4,3,3],ny:[9,4,7,10,10],nz:[1,1,1,1,-1]},{size:3,px:[22,11,22],py:[12,5,14],pz:[0,1,0],nx:[23,23,3],ny:[22,23,8],nz:[0,0,-1]},{size:2,px:[3,11],py:[7,5],pz:[1,-1],nx:[8,2],ny:[14,5],nz:[0,2]},{size:4,px:[17,16,2,4],py:[14,13,5,0],pz:[0,0,-1,-1],nx:[8,9,15,8],ny:[8,9,14,7],nz:[1,1,0,1]},{size:2,px:[5,16],py:[6,13],pz:[1,-1],nx:[2,1],ny:[4,2],nz:[1,2]},{size:5,px:[1,0,1,2,1],py:[15,2,16,19,12],pz:[0,2,0,0,0],nx:[8,7,4,9,9],ny:[5,11,4,5,5],nz:[1,1,1,1,-1]},{size:2,px:[8,7],py:[11,12],pz:[0,0],nx:[9,1],ny:[10,16],nz:[0,-1]},{size:2,px:[15,13],py:[17,10],pz:[0,-1],nx:[7,4],ny:[8,4],nz:[1,2]},{size:5,px:[11,10,7,8,9],py:[0,0,1,1,1],pz:[0,0,0,0,0],nx:[4,5,4,5,6],ny:[1,0,2,1,0],nz:[0,0,0,0,-1]},{size:2,px:[2,2],py:[4,3],pz:[2,2],nx:[3,21],ny:[4,20],nz:[1,-1]},{size:5,px:[10,11,5,2,11],py:[12,10,6,11,11],pz:[0,0,1,0,0],nx:[4,15,16,7,7],ny:[5,10,11,10,10],nz:[1,0,0,0,-1]},{size:5,px:[13,14,1,11,11],py:[2,2,3,2,2],pz:[0,0,2,0,-1],nx:[3,0,0,1,0],ny:[23,15,14,9,8],nz:[0,0,0,1,1]},{size:2,px:[17,2],py:[13,5],pz:[0,-1],nx:[4,9],ny:[2,4],nz:[2,1]},{size:2,px:[10,5],py:[4,1],pz:[0,-1],nx:[11,3],ny:[3,0],nz:[0,2]},{size:2,px:[5,3],py:[3,3],pz:[2,-1],nx:[11,23],ny:[8,14],nz:[1,0]},{size:3,px:[22,22,22],py:[16,18,9],pz:[0,0,0],nx:[13,2,0],ny:[17,3,5],nz:[0,-1,-1]},{size:5,px:[13,10,13,14,11],py:[2,2,1,2,1],pz:[0,0,0,0,0],nx:[3,3,8,6,6],ny:[2,5,4,11,11],nz:[2,2,1,1,-1]},{size:3,px:[12,1,1],py:[14,0,1],pz:[0,-1,-1],nx:[8,15,7],ny:[1,2,0],nz:[1,0,1]},{size:2,px:[4,5],py:[20,23],pz:[0,0],nx:[3,3],ny:[10,2],nz:[1,-1]},{size:2,px:[2,4],py:[7,2],pz:[1,-1],nx:[4,3],ny:[23,16],nz:[0,0]},{size:3,px:[3,3,6],py:[5,2,4],pz:[2,2,1],nx:[3,1,2],ny:[5,17,0],nz:[1,-1,-1]},{size:2,px:[14,8],py:[17,6],pz:[0,1],nx:[13,10],ny:[16,9],nz:[0,-1]},{size:5,px:[15,7,14,13,14],py:[1,0,0,0,1],pz:[0,1,0,0,0],nx:[4,4,4,8,8],ny:[5,3,2,10,10],nz:[2,2,2,1,-1]},{size:5,px:[8,9,4,5,4],py:[13,12,9,5,7],pz:[0,0,1,1,1],nx:[22,21,22,22,22],ny:[4,0,3,2,2],nz:[0,0,0,0,-1]},{size:2,px:[17,17],py:[16,13],pz:[0,0],nx:[14,21],ny:[8,0],nz:[0,-1]},{size:2,px:[16,10],py:[4,9],pz:[0,-1],nx:[16,10],ny:[3,3],nz:[0,1]},{size:5,px:[1,1,0,1,0],py:[17,16,7,15,8],pz:[0,0,1,0,0],nx:[4,3,8,9,7],ny:[3,3,6,6,6],nz:[1,1,0,0,-1]},{size:2,px:[3,3],py:[2,3],pz:[2,2],nx:[8,3],ny:[4,3],nz:[1,-1]},{size:2,px:[10,2],py:[17,4],pz:[0,2],nx:[10,12],ny:[15,14],nz:[0,-1]},{size:2,px:[11,11],py:[14,12],pz:[0,0],nx:[9,10],ny:[13,11],nz:[0,0]},{size:2,px:[12,13],py:[5,5],pz:[0,0],nx:[3,4],ny:[4,1],nz:[1,-1]},{size:5,px:[7,10,8,11,11],py:[13,2,12,2,2],pz:[0,0,0,0,-1],nx:[10,1,1,10,1],ny:[12,5,3,13,1],nz:[0,1,1,0,2]},{size:2,px:[6,10],py:[4,2],pz:[1,-1],nx:[4,6],ny:[4,9],nz:[1,1]},{size:2,px:[20,20],py:[21,22],pz:[0,0],nx:[15,8],ny:[5,5],nz:[0,-1]},{size:2,px:[4,3],py:[3,3],pz:[2,2],nx:[9,17],ny:[4,15],nz:[1,-1]},{size:3,px:[2,2,4],py:[3,3,7],pz:[2,-1,-1],nx:[7,4,4],ny:[6,5,4],nz:[1,2,2]},{size:5,px:[8,9,16,17,17],py:[1,2,1,1,1],pz:[1,1,0,0,-1],nx:[2,2,4,2,4],ny:[16,14,22,15,21],nz:[0,0,0,0,0]},{size:2,px:[9,9],py:[18,0],pz:[0,-1],nx:[2,5],ny:[5,8],nz:[2,1]},{size:2,px:[7,8],py:[11,11],pz:[0,0],nx:[15,5],ny:[8,8],nz:[0,-1]},{size:2,px:[0,3],py:[4,3],pz:[2,-1],nx:[1,6],ny:[4,14],nz:[2,0]},{size:2,px:[6,12],py:[7,11],pz:[1,-1],nx:[0,0],ny:[7,12],nz:[1,0]},{size:2,px:[3,7],py:[10,22],pz:[1,0],nx:[4,3],ny:[10,0],nz:[1,-1]},{size:2,px:[5,19],py:[4,21],pz:[2,-1],nx:[11,11],ny:[8,9],nz:[1,1]},{size:2,px:[3,3],py:[8,7],pz:[1,1],nx:[4,20],ny:[4,5],nz:[1,-1]},{size:5,px:[11,23,23,23,23],py:[7,13,19,20,21],pz:[1,0,0,0,0],nx:[4,3,2,8,8],ny:[11,5,5,23,23],nz:[1,1,2,0,-1]},{size:2,px:[4,1],py:[0,2],pz:[0,0],nx:[0,6],ny:[0,11],nz:[0,-1]},{size:2,px:[11,8],py:[12,1],pz:[0,-1],nx:[23,23],ny:[13,12],nz:[0,0]},{size:5,px:[23,11,23,11,11],py:[13,7,12,5,6],pz:[0,1,0,1,1],nx:[6,3,8,7,7],ny:[12,4,4,11,11],nz:[0,1,1,0,-1]},{size:2,px:[20,5],py:[15,5],pz:[0,-1],nx:[10,10],ny:[11,10],nz:[1,1]},{size:2,px:[11,4],py:[19,8],pz:[0,1],nx:[11,19],ny:[18,2],nz:[0,-1]},{size:2,px:[14,6],py:[3,4],pz:[0,-1],nx:[8,15],ny:[1,0],nz:[1,0]},{size:4,px:[14,5,13,12],py:[23,3,23,23],pz:[0,1,0,0],nx:[12,0,1,4],ny:[21,3,2,4],nz:[0,-1,-1,-1]},{size:2,px:[19,5],py:[12,2],pz:[0,-1],nx:[4,7],ny:[3,5],nz:[2,1]},{size:2,px:[0,8],py:[5,3],pz:[2,-1],nx:[5,22],ny:[3,11],nz:[2,0]},{size:2,px:[2,6],py:[3,12],pz:[2,0],nx:[3,5],ny:[4,2],nz:[1,-1]},{size:2,px:[5,5],py:[0,6],pz:[2,-1],nx:[14,6],ny:[4,2],nz:[0,1]},{size:2,px:[16,11],py:[1,0],pz:[0,-1],nx:[4,8],ny:[4,10],nz:[2,1]},{size:2,px:[9,4],py:[4,3],pz:[1,1],nx:[5,8],ny:[0,10],nz:[2,-1]},{size:2,px:[16,1],py:[22,1],pz:[0,-1],nx:[2,2],ny:[4,2],nz:[2,2]},{size:2,px:[12,2],py:[11,2],pz:[0,-1],nx:[5,5],ny:[1,0],nz:[2,2]},{size:2,px:[11,11],py:[4,3],pz:[1,1],nx:[7,5],ny:[4,0],nz:[1,-1]},{size:2,px:[9,2],py:[22,3],pz:[0,2],nx:[4,9],ny:[10,11],nz:[1,-1]},{size:2,px:[2,4],py:[8,10],pz:[1,-1],nx:[5,3],ny:[23,18],nz:[0,0]},{size:2,px:[12,6],py:[21,9],pz:[0,-1],nx:[11,23],ny:[6,10],nz:[1,0]},{size:2,px:[9,9],py:[8,7],pz:[1,1],nx:[18,8],ny:[18,6],nz:[0,-1]},{size:2,px:[13,3],py:[19,0],pz:[0,-1],nx:[6,5],ny:[9,11],nz:[1,1]},{size:5,px:[2,10,9,7,8],py:[0,1,0,1,0],pz:[2,0,0,0,0],nx:[3,4,6,8,8],ny:[2,4,9,4,4],nz:[2,1,1,1,-1]},{size:2,px:[8,4],py:[6,3],pz:[1,2],nx:[9,4],ny:[4,2],nz:[1,-1]},{size:2,px:[0,4],py:[23,3],pz:[0,-1],nx:[12,9],ny:[2,2],nz:[0,0]},{size:2,px:[4,2],py:[10,3],pz:[1,2],nx:[0,2],ny:[23,5],nz:[0,-1]},{size:2,px:[12,14],py:[18,0],pz:[0,-1],nx:[12,8],ny:[16,10],nz:[0,1]},{size:4,px:[10,18,7,5],py:[14,8,0,3],pz:[0,-1,-1,-1],nx:[8,6,8,5],ny:[11,12,5,5],nz:[0,0,1,1]},{size:2,px:[6,5],py:[2,2],pz:[1,1],nx:[8,8],ny:[4,2],nz:[1,-1]},{size:2,px:[12,10],py:[20,20],pz:[0,0],nx:[11,10],ny:[19,19],nz:[0,0]},{size:2,px:[17,10],py:[16,20],pz:[0,-1],nx:[8,7],ny:[4,8],nz:[1,1]},{size:3,px:[2,1,3],py:[20,4,21],pz:[0,2,0],nx:[3,4,0],ny:[10,1,0],nz:[1,-1,-1]},{size:5,px:[6,7,3,6,6],py:[15,14,7,16,19],pz:[0,0,1,0,0],nx:[0,0,0,0,0],ny:[18,19,16,17,17],nz:[0,0,0,0,-1]},{size:2,px:[8,16],py:[6,12],pz:[1,0],nx:[8,15],ny:[4,10],nz:[1,-1]},{size:5,px:[0,0,0,0,0],py:[1,3,2,0,4],pz:[2,2,2,2,1],nx:[13,8,14,4,7],ny:[23,6,23,3,9],nz:[0,1,0,2,-1]},{size:2,px:[3,6],py:[3,5],pz:[2,1],nx:[10,8],ny:[11,6],nz:[0,-1]},{size:2,px:[11,10],py:[4,4],pz:[0,0],nx:[8,5],ny:[4,9],nz:[1,-1]},{size:5,px:[15,18,9,16,4],py:[12,13,6,23,3],pz:[0,0,1,0,2],nx:[6,3,6,2,7],ny:[2,3,0,1,0],nz:[0,0,0,1,0]},{size:2,px:[4,18],py:[12,13],pz:[0,-1],nx:[2,8],ny:[3,4],nz:[2,1]},{size:2,px:[4,2],py:[10,4],pz:[1,2],nx:[3,3],ny:[5,0],nz:[2,-1]},{size:2,px:[9,19],py:[7,8],pz:[1,0],nx:[8,3],ny:[4,0],nz:[1,-1]},{size:2,px:[6,0],py:[6,0],pz:[0,-1],nx:[0,0],ny:[7,2],nz:[1,2]},{size:2,px:[8,8],py:[0,0],pz:[1,-1],nx:[17,18],ny:[0,2],nz:[0,0]},{size:4,px:[13,4,4,1],py:[14,7,3,5],pz:[0,-1,-1,-1],nx:[3,16,3,7],ny:[1,15,5,13],nz:[2,0,2,0]},{size:2,px:[4,9],py:[6,11],pz:[1,0],nx:[3,23],ny:[4,8],nz:[1,-1]},{size:5,px:[9,17,4,16,16],py:[2,3,1,3,3],pz:[1,0,2,0,-1],nx:[2,3,3,2,3],ny:[1,7,2,3,3],nz:[2,1,1,1,1]},{size:2,px:[10,5],py:[22,9],pz:[0,1],nx:[10,3],ny:[21,2],nz:[0,-1]},{size:2,px:[11,11],py:[6,3],pz:[0,-1],nx:[8,5],ny:[4,3],nz:[1,1]},{size:2,px:[10,5],py:[8,3],pz:[0,-1],nx:[14,5],ny:[14,2],nz:[0,2]},{size:2,px:[7,8],py:[3,2],pz:[0,-1],nx:[8,2],ny:[18,2],nz:[0,2]},{size:2,px:[1,1],py:[19,11],pz:[0,1],nx:[9,4],ny:[5,1],nz:[0,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,3],ny:[4,4],nz:[1,-1]},{size:5,px:[7,15,13,14,4],py:[6,12,9,11,4],pz:[1,0,0,0,2],nx:[7,3,8,4,5],ny:[0,3,0,2,1],nz:[0,0,0,0,0]},{size:5,px:[10,13,7,8,9],py:[0,1,1,0,1],pz:[0,0,0,0,0],nx:[7,4,4,4,8],ny:[8,3,4,2,4],nz:[1,2,2,2,1]},{size:2,px:[6,1],py:[6,0],pz:[1,-1],nx:[11,7],ny:[3,2],nz:[0,1]},{size:2,px:[13,0],py:[13,2],pz:[0,-1],nx:[0,1],ny:[13,16],nz:[0,0]},{size:2,px:[8,17],py:[6,13],pz:[1,0],nx:[8,1],ny:[4,16],nz:[1,-1]},{size:5,px:[12,11,3,6,17],py:[4,4,1,2,14],pz:[0,0,2,1,0],nx:[6,23,23,6,23],ny:[5,7,6,6,14],nz:[1,0,0,1,0]},{size:2,px:[5,22],py:[4,17],pz:[2,-1],nx:[4,8],ny:[5,7],nz:[2,1]},{size:2,px:[15,14],py:[1,1],pz:[0,0],nx:[4,7],ny:[2,4],nz:[2,-1]},{size:2,px:[15,17],py:[12,7],pz:[0,-1],nx:[14,10],ny:[11,4],nz:[0,1]},{size:4,px:[10,2,9,15],py:[5,11,1,13],pz:[0,-1,-1,-1],nx:[11,3,3,13],ny:[1,1,0,1],nz:[0,2,2,0]},{size:2,px:[7,21],py:[15,22],pz:[0,-1],nx:[4,9],ny:[8,14],nz:[1,0]},{size:2,px:[6,5],py:[21,2],pz:[0,-1],nx:[3,5],ny:[11,21],nz:[1,0]},{size:2,px:[17,7],py:[2,0],pz:[0,-1],nx:[4,8],ny:[5,11],nz:[2,1]},{size:2,px:[11,8],py:[10,4],pz:[0,-1],nx:[13,12],ny:[3,3],nz:[0,0]},{size:2,px:[6,5],py:[2,2],pz:[1,1],nx:[7,1],ny:[8,2],nz:[0,-1]},{size:5,px:[0,0,1,0,0],py:[12,4,14,0,2],pz:[0,1,0,2,2],nx:[9,5,8,4,4],ny:[6,3,6,3,3],nz:[0,1,0,1,-1]},{size:5,px:[8,0,0,3,2],py:[6,5,0,8,2],pz:[1,-1,-1,-1,-1],nx:[23,7,22,11,4],ny:[12,6,14,4,3],nz:[0,1,0,1,2]},{size:4,px:[12,12,4,8],py:[12,11,3,10],pz:[0,0,-1,-1],nx:[0,0,0,0],ny:[2,1,0,3],nz:[1,2,2,1]},{size:2,px:[10,6],py:[7,6],pz:[1,-1],nx:[16,4],ny:[12,2],nz:[0,2]},{size:5,px:[2,1,3,3,3],py:[14,8,20,21,21],pz:[0,1,0,0,-1],nx:[20,10,21,21,21],ny:[23,11,21,23,20],nz:[0,1,0,0,0]},{size:2,px:[6,13],py:[2,4],pz:[1,0],nx:[7,21],ny:[8,0],nz:[0,-1]},{size:2,px:[12,3],py:[17,4],pz:[0,2],nx:[11,10],ny:[15,7],nz:[0,-1]},{size:4,px:[11,0,19,2],py:[15,2,23,10],pz:[0,-1,-1,-1],nx:[6,8,16,2],ny:[13,11,10,2],nz:[0,0,0,2]},{size:2,px:[6,3],py:[14,7],pz:[0,1],nx:[3,1],ny:[4,1],nz:[1,-1]},{size:4,px:[12,17,5,10],py:[19,15,14,3],pz:[0,-1,-1,-1],nx:[4,12,6,12],ny:[4,18,9,22],nz:[1,0,1,0]},{size:2,px:[8,3],py:[13,5],pz:[0,-1],nx:[3,4],ny:[4,9],nz:[1,1]},{size:5,px:[6,5,4,5,3],py:[2,1,2,2,0],pz:[0,0,0,0,1],nx:[7,4,9,18,18],ny:[4,4,7,14,14],nz:[1,1,1,0,-1]},{size:4,px:[8,3,20,1],py:[6,3,18,0],pz:[1,-1,-1,-1],nx:[13,11,5,22],ny:[12,6,2,17],nz:[0,1,2,0]},{size:2,px:[6,3],py:[6,3],pz:[1,2],nx:[8,5],ny:[4,2],nz:[1,-1]},{size:2,px:[21,7],py:[14,7],pz:[0,1],nx:[16,11],ny:[14,6],nz:[0,-1]},{size:2,px:[10,4],py:[3,1],pz:[0,-1],nx:[9,5],ny:[0,0],nz:[0,1]},{size:2,px:[4,10],py:[5,8],pz:[2,1],nx:[5,14],ny:[9,7],nz:[1,-1]},{size:2,px:[9,2],py:[23,4],pz:[0,2],nx:[2,2],ny:[5,5],nz:[2,-1]},{size:5,px:[10,9,11,10,10],py:[2,2,1,1,1],pz:[0,0,0,0,-1],nx:[2,3,2,4,5],ny:[4,10,2,4,3],nz:[2,1,1,0,0]},{size:2,px:[11,4],py:[13,4],pz:[0,-1],nx:[8,4],ny:[4,1],nz:[1,2]},{size:2,px:[17,5],py:[15,1],pz:[0,-1],nx:[20,19],ny:[14,14],nz:[0,0]},{size:2,px:[2,2],py:[20,18],pz:[0,0],nx:[2,1],ny:[23,5],nz:[0,-1]},{size:2,px:[10,1],py:[18,3],pz:[0,2],nx:[11,3],ny:[16,5],nz:[0,-1]},{size:2,px:[3,8],py:[6,10],pz:[1,0],nx:[9,0],ny:[9,3],nz:[0,-1]},{size:2,px:[20,10],py:[21,7],pz:[0,1],nx:[7,2],ny:[3,5],nz:[1,-1]},{size:2,px:[10,6],py:[4,7],pz:[1,-1],nx:[23,5],ny:[9,2],nz:[0,2]},{size:5,px:[2,4,5,3,4],py:[0,1,1,2,2],pz:[1,0,0,0,0],nx:[1,0,1,1,1],ny:[2,1,0,1,1],nz:[0,1,0,0,-1]},{size:2,px:[8,16],py:[7,13],pz:[1,0],nx:[8,3],ny:[4,16],nz:[1,-1]},{size:2,px:[17,15],py:[7,19],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[4,3],py:[11,5],pz:[1,2],nx:[7,8],ny:[9,4],nz:[1,-1]},{size:2,px:[23,11],py:[9,6],pz:[0,1],nx:[22,22],ny:[23,23],nz:[0,-1]},{size:2,px:[23,23],py:[21,20],pz:[0,0],nx:[2,2],ny:[5,4],nz:[1,-1]},{size:2,px:[17,4],py:[12,2],pz:[0,-1],nx:[9,8],ny:[4,5],nz:[1,1]},{size:2,px:[6,14],py:[2,4],pz:[1,0],nx:[7,18],ny:[1,1],nz:[1,-1]},{size:2,px:[20,22],py:[1,2],pz:[0,0],nx:[23,23],ny:[1,1],nz:[0,-1]},{size:2,px:[0,1],py:[9,10],pz:[1,1],nx:[8,0],ny:[15,0],nz:[0,-1]},{size:3,px:[11,11,6],py:[10,11,11],pz:[0,0,-1],nx:[23,23,23],ny:[19,21,20],nz:[0,0,0]},{size:5,px:[23,23,23,6,6],py:[21,22,22,3,6],pz:[0,0,-1,-1,-1],nx:[8,8,8,17,4],ny:[7,10,8,16,5],nz:[1,1,1,0,2]},{size:2,px:[10,23],py:[1,22],pz:[0,-1],nx:[7,2],ny:[11,2],nz:[0,2]},{size:2,px:[7,14],py:[3,10],pz:[1,-1],nx:[5,3],ny:[2,1],nz:[0,1]},{size:2,px:[5,3],py:[13,7],pz:[0,1],nx:[4,10],ny:[4,0],nz:[1,-1]},{size:2,px:[10,0],py:[15,6],pz:[0,-1],nx:[3,6],ny:[1,2],nz:[2,1]},{size:2,px:[13,4],py:[18,17],pz:[0,-1],nx:[7,6],ny:[10,7],nz:[1,1]},{size:2,px:[12,11],py:[3,8],pz:[0,-1],nx:[7,8],ny:[4,4],nz:[1,1]},{size:2,px:[17,4],py:[5,7],pz:[0,1],nx:[17,10],ny:[4,0],nz:[0,-1]},{size:5,px:[16,8,16,15,15],py:[0,0,1,0,1],pz:[0,1,0,0,0],nx:[7,4,7,4,4],ny:[7,5,8,1,1],nz:[1,2,1,2,-1]},{size:2,px:[13,11],py:[5,6],pz:[0,-1],nx:[4,5],ny:[2,2],nz:[1,1]},{size:2,px:[3,6],py:[3,6],pz:[2,1],nx:[8,4],ny:[4,3],nz:[1,-1]},{size:2,px:[10,16],py:[8,10],pz:[0,0],nx:[7,2],ny:[3,3],nz:[1,-1]},{size:2,px:[6,8],py:[4,11],pz:[1,0],nx:[10,1],ny:[9,20],nz:[0,-1]},{size:2,px:[5,1],py:[4,2],pz:[2,-1],nx:[23,23],ny:[15,16],nz:[0,0]},{size:5,px:[9,8,2,4,9],py:[1,1,0,1,2],pz:[0,0,2,1,0],nx:[8,3,8,4,4],ny:[6,2,4,2,2],nz:[1,2,1,2,-1]},{size:2,px:[13,6],py:[10,5],pz:[0,-1],nx:[13,7],ny:[6,3],nz:[0,1]},{size:2,px:[11,5],py:[10,5],pz:[1,2],nx:[10,8],ny:[10,9],nz:[1,-1]},{size:2,px:[7,4],py:[6,3],pz:[1,2],nx:[9,14],ny:[4,9],nz:[1,-1]},{size:3,px:[5,2,15],py:[3,1,22],pz:[1,-1,-1],nx:[15,9,4],ny:[0,1,0],nz:[0,1,2]},{size:2,px:[10,19],py:[9,21],pz:[1,0],nx:[2,17],ny:[5,14],nz:[2,-1]},{size:3,px:[16,2,1],py:[2,10,4],pz:[0,-1,-1],nx:[4,4,9],ny:[3,2,6],nz:[2,2,1]},{size:2,px:[10,2],py:[6,10],pz:[1,-1],nx:[21,22],ny:[16,12],nz:[0,0]},{size:2,px:[7,16],py:[4,23],pz:[0,-1],nx:[7,3],ny:[3,3],nz:[0,1]},{size:2,px:[1,1],py:[13,14],pz:[0,0],nx:[1,2],ny:[18,3],nz:[0,-1]},{size:2,px:[18,5],py:[13,4],pz:[0,-1],nx:[4,13],ny:[2,11],nz:[2,0]},{size:2,px:[18,17],py:[3,3],pz:[0,0],nx:[19,19],ny:[1,1],nz:[0,-1]},{size:2,px:[9,5],py:[0,5],pz:[1,-1],nx:[12,3],ny:[5,1],nz:[0,2]},{size:2,px:[5,3],py:[2,1],pz:[1,2],nx:[18,4],ny:[4,1],nz:[0,-1]},{size:5,px:[13,13,2,10,15],py:[11,12,13,17,23],pz:[0,-1,-1,-1,-1],nx:[12,13,4,3,8],ny:[4,4,1,0,3],nz:[0,0,2,2,1]},{size:2,px:[9,3],py:[2,2],pz:[0,-1],nx:[4,2],ny:[7,2],nz:[1,2]},{size:2,px:[13,4],py:[5,1],pz:[0,-1],nx:[18,4],ny:[12,2],nz:[0,2]},{size:2,px:[19,4],py:[11,1],pz:[0,-1],nx:[4,7],ny:[2,2],nz:[2,1]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,2],ny:[4,5],nz:[1,-1]},{size:2,px:[4,0],py:[7,7],pz:[0,-1],nx:[4,9],ny:[0,2],nz:[2,1]},{size:2,px:[4,9],py:[0,2],pz:[2,1],nx:[6,4],ny:[3,4],nz:[0,-1]},{size:2,px:[4,2],py:[9,4],pz:[1,2],nx:[13,5],ny:[18,2],nz:[0,-1]},{size:3,px:[5,23,23],py:[2,8,7],pz:[2,0,0],nx:[10,12,1],ny:[4,1,0],nz:[1,-1,-1]},{size:2,px:[13,0],py:[3,3],pz:[0,-1],nx:[4,4],ny:[2,3],nz:[2,2]},{size:2,px:[6,5],py:[10,5],pz:[0,-1],nx:[0,0],ny:[4,11],nz:[1,0]},{size:2,px:[11,2],py:[14,11],pz:[0,-1],nx:[10,11],ny:[4,13],nz:[1,0]},{size:2,px:[5,6],py:[21,23],pz:[0,0],nx:[7,0],ny:[21,3],nz:[0,-1]},{size:2,px:[8,4],py:[6,3],pz:[1,2],nx:[8,5],ny:[4,2],nz:[1,-1]},{size:2,px:[7,6],py:[8,8],pz:[0,0],nx:[6,14],ny:[9,15],nz:[0,-1]},{size:2,px:[16,6],py:[4,8],pz:[0,-1],nx:[16,8],ny:[0,1],nz:[0,1]},{size:4,px:[3,6,0,9],py:[0,8,5,23],pz:[1,-1,-1,-1],nx:[12,2,6,10],ny:[5,0,3,5],nz:[0,2,1,0]},{size:2,px:[3,6],py:[7,13],pz:[1,0],nx:[3,9],ny:[4,9],nz:[1,-1]},{size:2,px:[2,5],py:[8,23],pz:[1,0],nx:[8,9],ny:[15,0],nz:[0,-1]},{size:2,px:[13,18],py:[8,0],pz:[0,-1],nx:[1,1],ny:[9,8],nz:[1,1]},{size:2,px:[2,7],py:[4,21],pz:[2,0],nx:[13,11],ny:[8,9],nz:[0,-1]},{size:2,px:[5,4],py:[8,8],pz:[0,0],nx:[6,1],ny:[8,5],nz:[0,-1]},{size:2,px:[7,3],py:[20,7],pz:[0,-1],nx:[4,3],ny:[10,4],nz:[1,1]},{size:2,px:[9,9],py:[8,7],pz:[1,-1],nx:[1,2],ny:[4,9],nz:[2,1]},{size:2,px:[5,10],py:[5,13],pz:[1,-1],nx:[3,6],ny:[1,2],nz:[2,1]},{size:2,px:[12,5],py:[6,3],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:2,px:[10,10],py:[4,4],pz:[1,-1],nx:[5,11],ny:[2,5],nz:[2,1]},{size:5,px:[11,23,11,23,11],py:[4,9,5,10,6],pz:[1,0,1,0,1],nx:[7,14,13,7,3],ny:[9,5,6,4,4],nz:[0,0,0,1,-1]},{size:2,px:[8,5],py:[0,0],pz:[1,-1],nx:[9,20],ny:[1,4],nz:[1,0]},{size:2,px:[19,20],py:[0,3],pz:[0,0],nx:[4,6],ny:[11,3],nz:[1,-1]},{size:4,px:[13,5,20,5],py:[14,3,23,4],pz:[0,-1,-1,-1],nx:[8,15,7,16],ny:[8,14,6,15],nz:[1,0,1,0]},{size:2,px:[10,20],py:[5,17],pz:[0,-1],nx:[7,3],ny:[10,1],nz:[0,2]},{size:3,px:[1,12,7],py:[3,7,10],pz:[2,0,0],nx:[2,2,3],ny:[3,2,2],nz:[1,-1,-1]},{size:3,px:[10,5,7],py:[7,10,10],pz:[1,-1,-1],nx:[10,10,18],ny:[10,9,23],nz:[1,1,0]},{size:3,px:[14,14,4],py:[3,3,4],pz:[0,-1,-1],nx:[4,4,8],ny:[3,2,6],nz:[2,2,1]},{size:2,px:[4,12],py:[4,17],pz:[2,0],nx:[13,1],ny:[15,4],nz:[0,-1]},{size:2,px:[10,20],py:[9,22],pz:[0,-1],nx:[9,4],ny:[2,0],nz:[1,2]},{size:2,px:[11,2],py:[3,6],pz:[0,-1],nx:[2,4],ny:[2,4],nz:[2,1]},{size:3,px:[15,10,1],py:[12,2,3],pz:[0,-1,-1],nx:[7,5,10],ny:[2,1,1],nz:[0,1,0]},{size:5,px:[9,11,10,12,12],py:[0,0,0,0,0],pz:[0,0,0,0,-1],nx:[8,4,16,5,10],ny:[4,4,10,3,6],nz:[1,1,0,1,0]},{size:2,px:[0,10],py:[3,5],pz:[2,-1],nx:[3,6],ny:[0,1],nz:[2,1]},{size:5,px:[7,8,7,2,12],py:[14,13,13,16,0],pz:[0,0,-1,-1,-1],nx:[10,1,10,1,1],ny:[13,2,12,4,9],nz:[0,2,0,1,0]},{size:3,px:[6,14,13],py:[1,2,1],pz:[1,0,0],nx:[8,21,10],ny:[4,23,12],nz:[1,-1,-1]},{size:2,px:[19,19],py:[22,21],pz:[0,0],nx:[20,1],ny:[22,5],nz:[0,-1]},{size:2,px:[13,12],py:[19,22],pz:[0,-1],nx:[2,3],ny:[0,1],nz:[2,1]},{size:4,px:[11,9,21,4],py:[13,3,19,5],pz:[0,-1,-1,-1],nx:[9,9,9,5],ny:[13,14,12,6],nz:[0,0,0,1]},{size:4,px:[11,12,13,14],py:[22,22,22,22],pz:[0,0,0,0],nx:[13,2,4,5],ny:[20,0,0,6],nz:[0,-1,-1,-1]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,1],ny:[4,3],nz:[1,-1]},{size:2,px:[0,0],py:[0,1],pz:[2,2],nx:[9,4],ny:[6,5],nz:[1,-1]},{size:2,px:[17,0],py:[10,1],pz:[0,-1],nx:[9,4],ny:[3,2],nz:[1,2]},{size:2,px:[10,4],py:[3,1],pz:[1,2],nx:[12,18],ny:[17,4],nz:[0,-1]},{size:3,px:[2,3,4],py:[4,3,9],pz:[2,2,1],nx:[0,3,17],ny:[0,1,18],nz:[0,-1,-1]},{size:2,px:[7,3],py:[12,6],pz:[0,1],nx:[5,1],ny:[11,1],nz:[1,-1]},{size:2,px:[10,17],py:[20,6],pz:[0,-1],nx:[5,2],ny:[9,5],nz:[1,2]},{size:2,px:[8,11],py:[18,2],pz:[0,-1],nx:[5,4],ny:[9,9],nz:[1,1]},{size:2,px:[16,15],py:[2,2],pz:[0,0],nx:[17,12],ny:[2,2],nz:[0,-1]},{size:2,px:[18,4],py:[5,5],pz:[0,-1],nx:[7,5],ny:[23,19],nz:[0,0]},{size:2,px:[12,13],py:[23,23],pz:[0,0],nx:[7,11],ny:[10,20],nz:[1,-1]},{size:2,px:[5,10],py:[3,18],pz:[2,-1],nx:[9,9],ny:[5,6],nz:[1,1]},{size:2,px:[5,10],py:[2,4],pz:[1,0],nx:[4,23],ny:[4,20],nz:[1,-1]},{size:2,px:[2,3],py:[8,1],pz:[1,-1],nx:[15,12],ny:[2,1],nz:[0,0]},{size:2,px:[4,7],py:[3,10],pz:[2,1],nx:[10,1],ny:[20,4],nz:[0,-1]},{size:2,px:[11,11],py:[10,11],pz:[0,0],nx:[22,3],ny:[5,4],nz:[0,-1]},{size:5,px:[8,17,17,9,18],py:[0,1,0,1,0],pz:[1,0,0,1,0],nx:[11,8,9,4,4],ny:[23,4,6,2,2],nz:[0,1,0,2,-1]},{size:2,px:[5,5],py:[4,4],pz:[1,-1],nx:[13,4],ny:[9,2],nz:[0,2]},{size:5,px:[9,4,8,7,7],py:[3,1,3,3,3],pz:[0,1,0,0,-1],nx:[4,2,5,3,2],ny:[1,15,1,4,13],nz:[0,0,0,0,0]},{size:2,px:[17,7],py:[13,7],pz:[0,-1],nx:[4,8],ny:[4,4],nz:[1,1]},{size:2,px:[1,2],py:[1,12],pz:[2,0],nx:[9,21],ny:[5,4],nz:[0,-1]},{size:2,px:[12,0],py:[14,1],pz:[0,-1],nx:[1,1],ny:[19,10],nz:[0,1]},{size:2,px:[16,1],py:[5,9],pz:[0,-1],nx:[16,15],ny:[3,3],nz:[0,0]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[8,4],ny:[4,0],nz:[1,-1]},{size:2,px:[11,6],py:[17,15],pz:[0,0],nx:[11,0],ny:[16,4],nz:[0,-1]},{size:4,px:[12,11,0,3],py:[16,8,7,1],pz:[0,-1,-1,-1],nx:[10,5,10,5],ny:[11,9,10,8],nz:[0,1,0,1]},{size:2,px:[3,6],py:[7,13],pz:[1,0],nx:[4,14],ny:[4,16],nz:[1,-1]},{size:2,px:[7,17],py:[6,13],pz:[0,-1],nx:[4,8],ny:[4,9],nz:[2,1]},{size:2,px:[15,11],py:[3,2],pz:[0,-1],nx:[4,15],ny:[1,2],nz:[2,0]},{size:2,px:[10,11],py:[18,4],pz:[0,-1],nx:[5,5],ny:[8,9],nz:[1,1]},{size:2,px:[8,4],py:[7,4],pz:[1,2],nx:[4,3],ny:[5,7],nz:[2,-1]},{size:2,px:[12,4],py:[15,4],pz:[0,-1],nx:[11,8],ny:[14,19],nz:[0,0]},{size:2,px:[18,13],py:[13,20],pz:[0,0],nx:[13,4],ny:[18,2],nz:[0,-1]},{size:2,px:[12,4],py:[6,3],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:5,px:[21,5,11,5,10],py:[1,1,3,0,0],pz:[0,2,1,2,1],nx:[7,14,15,4,8],ny:[3,6,11,3,4],nz:[1,-1,-1,-1,-1]},{size:2,px:[10,6],py:[15,10],pz:[0,-1],nx:[21,22],ny:[14,12],nz:[0,0]},{size:2,px:[18,0],py:[20,0],pz:[0,-1],nx:[2,3],ny:[2,4],nz:[2,1]},{size:5,px:[12,6,13,11,7],py:[1,1,1,2,1],pz:[0,1,0,0,1],nx:[7,6,8,5,5],ny:[4,15,4,16,16],nz:[1,0,1,0,-1]},{size:3,px:[22,21,21],py:[14,15,17],pz:[0,0,0],nx:[5,9,4],ny:[0,5,0],nz:[2,-1,-1]},{size:2,px:[10,2],py:[14,1],pz:[0,-1],nx:[23,11],ny:[16,8],nz:[0,1]},{size:4,px:[21,21,0,18],py:[14,15,5,4],pz:[0,0,-1,-1],nx:[8,8,9,4],ny:[7,8,10,5],nz:[1,1,1,2]},{size:2,px:[15,5],py:[18,1],pz:[0,-1],nx:[23,23],ny:[16,18],nz:[0,0]},{size:2,px:[15,14],py:[1,1],pz:[0,0],nx:[4,4],ny:[2,3],nz:[2,-1]},{size:2,px:[2,6],py:[6,5],pz:[1,-1],nx:[14,11],ny:[1,1],nz:[0,0]},{size:2,px:[3,17],py:[2,8],pz:[2,0],nx:[8,3],ny:[4,9],nz:[1,-1]},{size:2,px:[17,8],py:[13,10],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[0,0],py:[8,3],pz:[0,1],nx:[1,11],ny:[4,7],nz:[1,-1]},{size:2,px:[6,8],py:[5,0],pz:[1,-1],nx:[0,0],ny:[3,1],nz:[1,2]},{size:2,px:[0,0],py:[5,3],pz:[1,2],nx:[1,18],ny:[5,7],nz:[1,-1]},{size:2,px:[7,3],py:[6,6],pz:[0,1],nx:[7,12],ny:[5,20],nz:[0,-1]},{size:2,px:[8,1],py:[0,5],pz:[0,-1],nx:[4,2],ny:[9,3],nz:[1,2]},{size:2,px:[0,0],py:[10,11],pz:[0,0],nx:[0,5],ny:[5,9],nz:[0,-1]},{size:2,px:[8,1],py:[23,4],pz:[0,2],nx:[0,0],ny:[13,2],nz:[0,-1]},{size:2,px:[4,1],py:[6,4],pz:[0,-1],nx:[4,4],ny:[4,5],nz:[2,2]},{size:2,px:[7,6],py:[6,5],pz:[1,1],nx:[3,9],ny:[4,16],nz:[1,-1]},{size:2,px:[5,3],py:[9,13],pz:[0,-1],nx:[4,10],ny:[3,7],nz:[1,0]},{size:5,px:[13,9,6,10,10],py:[2,2,1,2,2],pz:[0,0,1,0,-1],nx:[7,5,6,5,6],ny:[0,2,2,1,1],nz:[0,0,0,0,0]}],alpha:[-1.119615,1.119615,-.8169953,.8169953,-.5291213,.5291213,-.4904488,.4904488,-.4930982,.4930982,-.4106179,.4106179,-.4246842,.4246842,-.3802383,.3802383,-.3364358,.3364358,-.3214186,.3214186,-.3210798,.3210798,-.2993167,.2993167,-.3426336,.3426336,-.3199184,.3199184,-.3061071,.3061071,-.2758972,.2758972,-.307559,.307559,-.3009565,.3009565,-.2015739,.2015739,-.2603266,.2603266,-.2772993,.2772993,-.2184913,.2184913,-.2306681,.2306681,-.1983223,.1983223,-.219476,.219476,-.2528421,.2528421,-.2436416,.2436416,-.3032886,.3032886,-.2556071,.2556071,-.256217,.256217,-.1930298,.1930298,-.2735898,.2735898,-.1814703,.1814703,-.2054824,.2054824,-.1986146,.1986146,-.1769226,.1769226,-.1775257,.1775257,-.2167927,.2167927,-.1823633,.1823633,-.158428,.158428,-.1778321,.1778321,-.1826777,.1826777,-.1979903,.1979903,-.1898326,.1898326,-.1835506,.1835506,-.196786,.196786,-.1871528,.1871528,-.1772414,.1772414,-.1985514,.1985514,-.2144078,.2144078,-.2742303,.2742303,-.224055,.224055,-.2132534,.2132534,-.1552127,.1552127,-.1568276,.1568276,-.1630086,.1630086,-.1458232,.1458232,-.1559541,.1559541,-.1720131,.1720131,-.1708434,.1708434,-.1624431,.1624431,-.1814161,.1814161,-.1552639,.1552639,-.1242354,.1242354,-.1552139,.1552139,-.1694359,.1694359,-.1801481,.1801481,-.1387182,.1387182,-.1409679,.1409679,-.1486724,.1486724,-.1779553,.1779553,-.1524595,.1524595,-.1788086,.1788086,-.1671479,.1671479,-.1376197,.1376197,-.1511808,.1511808,-.1524632,.1524632,-.1198986,.1198986,-.1382641,.1382641,-.1148901,.1148901,-.1131803,.1131803,-.1273508,.1273508,-.1405125,.1405125,-.1322132,.1322132,-.1386966,.1386966,-.1275621,.1275621,-.1180573,.1180573,-.1238803,.1238803,-.1428389,.1428389,-.1694437,.1694437,-.1290855,.1290855,-.152026,.152026,-.1398282,.1398282,-.1890736,.1890736,-.2280428,.2280428,-.1325099,.1325099,-.1342873,.1342873,-.1463841,.1463841,-.1983567,.1983567,-.1585711,.1585711,-.1260154,.1260154,-.1426774,.1426774,-.1554278,.1554278,-.1361201,.1361201,-.1181856,.1181856,-.1255941,.1255941,-.1113275,.1113275,-.1506576,.1506576,-.1202859,.1202859,-.2159751,.2159751,-.144315,.144315,-.1379194,.1379194,-.1805758,.1805758,-.1465612,.1465612,-.1328856,.1328856,-.1532173,.1532173,-.1590635,.1590635,-.1462229,.1462229,-.1350012,.1350012,-.1195634,.1195634,-.1173221,.1173221,-.1192867,.1192867,-.1595013,.1595013,-.1209751,.1209751,-.157129,.157129,-.1527274,.1527274,-.1373708,.1373708,-.1318313,.1318313,-.1273391,.1273391,-.1271365,.1271365,-.1528693,.1528693,-.1590476,.1590476,-.1581911,.1581911,-.1183023,.1183023,-.1559822,.1559822,-.1214999,.1214999,-.1283378,.1283378,-.1542583,.1542583,-.1336377,.1336377,-.1800416,.1800416,-.1710931,.1710931,-.1621737,.1621737,-.1239002,.1239002,-.1432928,.1432928,-.1392447,.1392447,-.1383938,.1383938,-.1357633,.1357633,-.1175842,.1175842,-.1085318,.1085318,-.1148885,.1148885,-.1320396,.1320396,-.1351204,.1351204,-.1581518,.1581518,-.1459574,.1459574,-.1180068,.1180068,-.1464196,.1464196,-.1179543,.1179543,-.1004204,.1004204,-.129466,.129466,-.1534244,.1534244,-.137897,.137897,-.1226545,.1226545,-.1281182,.1281182,-.1201471,.1201471,-.1448701,.1448701,-.129098,.129098,-.1388764,.1388764,-.09605773,.09605773,-.1411021,.1411021,-.1295693,.1295693,-.1371739,.1371739,-.1167579,.1167579,-.1400486,.1400486,-.1214224,.1214224,-.1287835,.1287835,-.1197646,.1197646,-.1192358,.1192358,-.1218651,.1218651,-.1564816,.1564816,-.1172391,.1172391,-.1342268,.1342268,-.1492471,.1492471,-.1157299,.1157299,-.1046703,.1046703,-.1255571,.1255571,-.1100135,.1100135,-.1501592,.1501592,-.1155712,.1155712,-.1145563,.1145563,-.1013425,.1013425,-.1145783,.1145783,-.1328031,.1328031,-.1077413,.1077413,-.1064996,.1064996,-.119117,.119117,-.1213217,.1213217,-.1260969,.1260969,-.1156494,.1156494,-.1268126,.1268126,-.1070999,.1070999,-.1112365,.1112365,-.1243916,.1243916,-.1283152,.1283152,-.1166925,.1166925,-.08997633,.08997633,-.158384,.158384,-.1211178,.1211178,-.109083,.109083,-.1030818,.1030818,-.14406,.14406,-.1458713,.1458713,-.1559082,.1559082,-.1058868,.1058868,-.101013,.101013,-.1642301,.1642301,-.123685,.123685,-.1467589,.1467589,-.1109359,.1109359,-.1673655,.1673655,-.1239984,.1239984,-.1039509,.1039509,-.1089378,.1089378,-.1545085,.1545085,-.1200862,.1200862,-.1105608,.1105608,-.1235262,.1235262,-.08496153,.08496153,-.1181372,.1181372,-.1139467,.1139467,-.1189317,.1189317,-.1266519,.1266519,-.09470736,.09470736,-.1336735,.1336735,-.08726601,.08726601,-.1304782,.1304782,-.1186529,.1186529,-.1355944,.1355944,-.09568801,.09568801,-.1282618,.1282618,-.1625632,.1625632,-.1167652,.1167652,-.1001301,.1001301,-.1292419,.1292419,-.1904213,.1904213,-.1511542,.1511542,-.09814394,.09814394,-.1171564,.1171564,-.09806486,.09806486,-.09217615,.09217615,-.08505645,.08505645,-.1573637,.1573637,-.1419174,.1419174,-.1298601,.1298601,-.1120613,.1120613,-.1158363,.1158363,-.1090957,.1090957,-.1204516,.1204516,-.1139852,.1139852,-.09642479,.09642479,-.1410872,.1410872,-.1142779,.1142779,-.1043991,.1043991,-.09736463,.09736463,-.1451046,.1451046,-.1205668,.1205668,-.09881445,.09881445,-.1612822,.1612822,-.1175681,.1175681,-.1522528,.1522528,-.161752,.161752,-.1582938,.1582938,-.1208202,.1208202,-.1016003,.1016003,-.1232059,.1232059,-.09583025,.09583025,-.101399,.101399,-.1178752,.1178752,-.1215972,.1215972,-.1294932,.1294932,-.115827,.115827,-.1008645,.1008645,-.0969919,.0969919,-.1022144,.1022144,-.09878768,.09878768,-.1339052,.1339052,-.09279961,.09279961,-.1047606,.1047606,-.1141163,.1141163,-.12676,.12676,-.1252763,.1252763,-.09775003,.09775003,-.09169116,.09169116,-.1006496,.1006496,-.09493293,.09493293,-.1213694,.1213694,-.1109243,.1109243,-.1115973,.1115973,-.07979327,.07979327,-.09220953,.09220953,-.1028913,.1028913,-.125351,.125351]},{count:391,threshold:-4.665692,feature:[{size:5,px:[14,9,11,17,12],py:[2,3,9,13,3],pz:[0,0,0,0,0],nx:[21,8,7,20,13],ny:[16,10,7,7,9],nz:[0,1,1,0,0]},{size:5,px:[12,10,6,11,13],py:[9,3,13,3,4],pz:[0,0,0,0,0],nx:[10,4,5,10,2],ny:[9,10,8,8,2],nz:[0,1,1,0,2]},{size:5,px:[6,9,7,8,8],py:[3,3,3,3,3],pz:[0,0,0,0,-1],nx:[0,0,0,4,9],ny:[4,2,3,10,8],nz:[0,0,0,1,0]},{size:5,px:[6,2,16,6,8],py:[16,2,11,4,11],pz:[0,2,0,1,0],nx:[3,8,4,1,1],ny:[4,4,4,5,13],nz:[1,1,-1,-1,-1]},{size:3,px:[16,13,9],py:[23,18,10],pz:[0,0,1],nx:[14,15,8],ny:[21,22,3],nz:[0,-1,-1]},{size:5,px:[9,16,19,17,17],py:[1,2,3,2,2],pz:[1,0,0,0,-1],nx:[23,23,23,23,23],ny:[6,2,1,3,5],nz:[0,0,0,0,0]},{size:5,px:[12,12,12,12,12],py:[10,11,12,13,13],pz:[0,0,0,0,-1],nx:[4,8,14,4,6],ny:[2,4,7,4,8],nz:[2,1,0,1,1]},{size:5,px:[1,2,3,6,4],py:[6,10,12,23,13],pz:[1,1,0,0,0],nx:[2,0,0,1,1],ny:[23,5,10,21,21],nz:[0,2,1,0,-1]},{size:5,px:[12,16,12,4,12],py:[6,17,7,2,8],pz:[0,0,0,2,0],nx:[8,8,12,0,6],ny:[4,4,16,0,8],nz:[1,-1,-1,-1,-1]},{size:2,px:[9,2],py:[18,4],pz:[0,-1],nx:[4,9],ny:[10,16],nz:[1,0]},{size:5,px:[9,9,2,0,12],py:[6,6,21,4,8],pz:[1,-1,-1,-1,-1],nx:[8,4,9,7,7],ny:[10,2,4,5,8],nz:[1,2,1,1,1]},{size:5,px:[10,10,10,18,19],py:[10,8,7,14,14],pz:[1,1,1,0,0],nx:[21,23,22,22,11],ny:[23,19,21,22,10],nz:[0,0,0,0,-1]},{size:5,px:[12,3,15,4,19],py:[14,0,5,5,14],pz:[0,-1,-1,-1,-1],nx:[12,17,15,3,8],ny:[18,18,14,2,10],nz:[0,0,0,2,0]},{size:5,px:[8,11,3,11,4],py:[23,7,9,8,8],pz:[0,0,1,0,1],nx:[8,0,10,0,8],ny:[8,2,8,4,10],nz:[0,-1,-1,-1,-1]},{size:5,px:[10,11,12,8,4],py:[3,0,0,1,1],pz:[0,0,0,0,1],nx:[2,3,4,3,3],ny:[14,5,0,1,2],nz:[0,0,0,0,0]},{size:2,px:[3,11],py:[7,0],pz:[1,-1],nx:[5,2],ny:[9,5],nz:[1,2]},{size:5,px:[7,1,0,10,1],py:[0,0,2,12,6],pz:[0,2,2,0,1],nx:[4,6,2,8,8],ny:[4,11,2,4,4],nz:[1,1,2,1,-1]},{size:2,px:[4,15],py:[4,12],pz:[2,0],nx:[4,6],ny:[5,11],nz:[2,-1]},{size:5,px:[9,4,16,14,14],py:[8,4,23,18,18],pz:[1,2,0,0,-1],nx:[0,2,1,1,0],ny:[2,0,3,2,3],nz:[1,0,0,0,1]},{size:5,px:[17,7,7,18,19],py:[7,11,8,7,7],pz:[0,1,1,0,0],nx:[17,5,8,2,0],ny:[8,0,7,5,3],nz:[0,-1,-1,-1,-1]},{size:2,px:[5,14],py:[12,3],pz:[0,-1],nx:[4,3],ny:[5,4],nz:[1,1]},{size:5,px:[10,8,16,11,11],py:[5,6,12,4,4],pz:[0,1,0,0,-1],nx:[14,13,5,9,5],ny:[13,10,1,4,2],nz:[0,0,2,1,2]},{size:5,px:[15,14,16,8,8],py:[2,2,2,0,0],pz:[0,0,0,1,-1],nx:[9,18,19,18,17],ny:[0,0,2,1,0],nz:[1,0,0,0,0]},{size:2,px:[17,15],py:[12,11],pz:[0,0],nx:[14,4],ny:[9,15],nz:[0,-1]},{size:3,px:[5,11,11],py:[3,4,5],pz:[2,1,1],nx:[14,3,18],ny:[6,5,0],nz:[0,1,-1]},{size:5,px:[16,14,17,15,9],py:[2,2,2,2,1],pz:[0,0,0,0,1],nx:[21,20,11,21,21],ny:[2,0,7,3,3],nz:[0,0,1,0,-1]},{size:5,px:[2,1,1,1,5],py:[12,9,7,3,6],pz:[0,0,1,1,1],nx:[4,8,3,4,17],ny:[4,4,0,8,0],nz:[1,-1,-1,-1,-1]},{size:2,px:[8,4],py:[6,3],pz:[1,2],nx:[9,2],ny:[4,17],nz:[1,-1]},{size:2,px:[8,5],py:[16,9],pz:[0,1],nx:[10,17],ny:[16,8],nz:[0,-1]},{size:4,px:[11,5,9,15],py:[14,9,11,5],pz:[0,-1,-1,-1],nx:[10,1,9,4],ny:[9,2,13,7],nz:[0,2,0,1]},{size:5,px:[2,5,10,7,10],py:[7,12,2,13,3],pz:[1,-1,-1,-1,-1],nx:[5,2,3,3,2],ny:[23,15,17,16,14],nz:[0,0,0,0,0]},{size:2,px:[11,7],py:[8,10],pz:[0,-1],nx:[7,14],ny:[5,8],nz:[1,0]},{size:2,px:[9,16],py:[7,23],pz:[1,0],nx:[4,4],ny:[2,1],nz:[2,-1]},{size:5,px:[16,14,18,4,17],py:[0,0,4,0,1],pz:[0,0,0,2,0],nx:[8,8,16,9,9],ny:[5,4,11,7,7],nz:[1,1,0,0,-1]},{size:5,px:[12,13,7,8,4],py:[9,12,6,11,5],pz:[0,0,1,1,2],nx:[23,23,16,9,9],ny:[0,1,11,7,7],nz:[0,-1,-1,-1,-1]},{size:3,px:[6,7,2],py:[21,23,4],pz:[0,0,2],nx:[4,1,16],ny:[10,5,11],nz:[1,-1,-1]},{size:2,px:[2,2],py:[3,4],pz:[2,2],nx:[3,1],ny:[4,5],nz:[1,-1]},{size:5,px:[1,2,1,0,1],py:[7,13,12,4,13],pz:[0,0,0,2,0],nx:[18,9,9,19,19],ny:[23,5,11,19,19],nz:[0,1,1,0,-1]},{size:3,px:[4,10,12],py:[6,2,5],pz:[1,-1,-1],nx:[10,0,0],ny:[12,1,3],nz:[0,2,2]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,0],ny:[4,3],nz:[1,-1]},{size:5,px:[19,17,10,14,18],py:[2,1,7,0,1],pz:[0,0,1,0,0],nx:[3,3,3,7,5],ny:[9,10,7,23,18],nz:[1,1,1,0,0]},{size:2,px:[10,10],py:[8,7],pz:[1,1],nx:[14,4],ny:[15,6],nz:[0,-1]},{size:2,px:[7,15],py:[1,3],pz:[1,0],nx:[16,19],ny:[1,3],nz:[0,-1]},{size:5,px:[11,11,1,2,11],py:[11,12,1,13,12],pz:[0,0,-1,-1,-1],nx:[12,17,8,16,8],ny:[7,12,11,16,6],nz:[0,0,0,0,1]},{size:5,px:[13,11,10,12,5],py:[0,0,0,0,0],pz:[0,0,0,0,1],nx:[8,4,3,4,4],ny:[4,5,2,4,4],nz:[1,1,2,1,-1]},{size:5,px:[6,1,3,2,3],py:[13,3,3,4,10],pz:[0,2,1,1,1],nx:[0,1,0,0,0],ny:[2,0,5,4,4],nz:[0,0,0,0,-1]},{size:2,px:[15,1],py:[4,3],pz:[0,-1],nx:[16,15],ny:[2,2],nz:[0,0]},{size:2,px:[3,7],py:[7,13],pz:[1,0],nx:[3,0],ny:[4,2],nz:[1,-1]},{size:2,px:[14,15],py:[18,14],pz:[0,-1],nx:[4,14],ny:[4,16],nz:[1,0]},{size:2,px:[4,6],py:[3,4],pz:[2,1],nx:[9,5],ny:[14,2],nz:[0,-1]},{size:2,px:[16,6],py:[1,5],pz:[0,-1],nx:[4,9],ny:[0,4],nz:[2,1]},{size:2,px:[9,0],py:[4,2],pz:[0,-1],nx:[5,3],ny:[1,0],nz:[1,2]},{size:5,px:[1,1,1,0,0],py:[16,15,17,6,9],pz:[0,0,0,1,0],nx:[9,5,4,9,8],ny:[7,3,3,6,7],nz:[0,1,1,0,-1]},{size:2,px:[9,1],py:[8,15],pz:[1,-1],nx:[9,8],ny:[9,4],nz:[1,1]},{size:2,px:[20,19],py:[19,22],pz:[0,0],nx:[7,0],ny:[3,0],nz:[1,-1]},{size:5,px:[8,4,2,5,5],py:[12,6,3,5,5],pz:[0,1,2,1,-1],nx:[22,21,20,21,22],ny:[17,20,22,19,16],nz:[0,0,0,0,0]},{size:2,px:[6,12],py:[2,6],pz:[1,0],nx:[8,3],ny:[3,2],nz:[1,-1]},{size:2,px:[11,11],py:[9,4],pz:[1,1],nx:[12,4],ny:[17,5],nz:[0,-1]},{size:3,px:[0,1,0],py:[5,13,3],pz:[2,0,2],nx:[0,4,11],ny:[23,5,1],nz:[0,-1,-1]},{size:2,px:[10,5],py:[6,3],pz:[0,1],nx:[4,4],ny:[3,0],nz:[1,-1]},{size:2,px:[6,5],py:[7,3],pz:[0,-1],nx:[0,1],ny:[4,10],nz:[2,1]},{size:5,px:[12,13,12,12,12],py:[12,13,11,10,10],pz:[0,0,0,0,-1],nx:[10,8,8,16,15],ny:[7,4,10,11,10],nz:[0,1,0,0,0]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[4,2],ny:[5,5],nz:[2,-1]},{size:2,px:[9,17],py:[17,7],pz:[0,-1],nx:[5,2],ny:[9,4],nz:[1,2]},{size:2,px:[4,4],py:[3,5],pz:[2,2],nx:[12,8],ny:[16,2],nz:[0,-1]},{size:2,px:[1,1],py:[2,0],pz:[1,1],nx:[0,4],ny:[0,1],nz:[2,-1]},{size:2,px:[11,1],py:[5,0],pz:[0,-1],nx:[2,3],ny:[2,4],nz:[2,1]},{size:4,px:[0,6,4,22],py:[23,2,4,12],pz:[0,-1,-1,-1],nx:[7,6,8,5],ny:[1,1,2,1],nz:[1,1,1,1]},{size:2,px:[4,10],py:[0,9],pz:[1,-1],nx:[2,4],ny:[3,10],nz:[2,1]},{size:2,px:[11,8],py:[15,13],pz:[0,-1],nx:[23,11],ny:[13,5],nz:[0,1]},{size:2,px:[18,4],py:[5,4],pz:[0,-1],nx:[18,20],ny:[4,7],nz:[0,0]},{size:5,px:[21,20,20,10,20],py:[17,22,19,10,21],pz:[0,0,0,1,0],nx:[5,5,3,14,7],ny:[9,9,0,8,4],nz:[0,-1,-1,-1,-1]},{size:5,px:[3,7,13,7,3],py:[6,12,3,0,3],pz:[1,-1,-1,-1,-1],nx:[1,5,0,0,2],ny:[16,6,13,5,4],nz:[0,1,0,1,0]},{size:2,px:[7,4],py:[6,3],pz:[1,2],nx:[9,5],ny:[4,6],nz:[1,-1]},{size:3,px:[14,9,13],py:[19,22,8],pz:[0,-1,-1],nx:[13,4,4],ny:[17,2,5],nz:[0,2,2]},{size:2,px:[16,4],py:[9,3],pz:[0,2],nx:[7,4],ny:[4,5],nz:[1,-1]},{size:4,px:[10,2,4,2],py:[23,4,8,3],pz:[0,2,1,2],nx:[14,0,4,11],ny:[19,3,5,3],nz:[0,-1,-1,-1]},{size:5,px:[9,10,8,7,11],py:[2,2,2,2,2],pz:[0,0,0,0,0],nx:[6,5,3,4,4],ny:[0,1,0,2,2],nz:[0,0,1,0,-1]},{size:2,px:[6,4],py:[13,6],pz:[0,-1],nx:[15,4],ny:[8,4],nz:[0,1]},{size:2,px:[0,8],py:[1,2],pz:[2,-1],nx:[5,4],ny:[2,2],nz:[1,1]},{size:5,px:[16,13,14,15,15],py:[1,0,0,0,0],pz:[0,0,0,0,-1],nx:[4,9,4,18,8],ny:[5,9,4,18,11],nz:[2,1,2,0,1]},{size:2,px:[5,6],py:[2,6],pz:[2,1],nx:[22,9],ny:[23,9],nz:[0,-1]},{size:2,px:[19,19],py:[5,5],pz:[0,-1],nx:[21,22],ny:[2,4],nz:[0,0]},{size:2,px:[2,5],py:[8,6],pz:[0,1],nx:[3,4],ny:[4,9],nz:[1,-1]},{size:2,px:[18,14],py:[13,17],pz:[0,0],nx:[14,4],ny:[16,3],nz:[0,-1]},{size:2,px:[6,6],py:[6,3],pz:[1,-1],nx:[1,0],ny:[2,2],nz:[1,2]},{size:2,px:[23,21],py:[21,14],pz:[0,-1],nx:[7,5],ny:[0,0],nz:[0,1]},{size:2,px:[15,10],py:[23,7],pz:[0,-1],nx:[9,4],ny:[4,5],nz:[1,2]},{size:2,px:[4,18],py:[3,8],pz:[2,0],nx:[8,4],ny:[4,5],nz:[1,-1]},{size:2,px:[13,7],py:[2,11],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:5,px:[2,3,5,6,1],py:[7,14,2,2,4],pz:[1,0,0,0,2],nx:[8,4,4,7,7],ny:[7,5,4,9,9],nz:[1,2,2,1,-1]},{size:2,px:[5,3],py:[6,3],pz:[1,-1],nx:[1,2],ny:[2,4],nz:[2,1]},{size:5,px:[7,20,4,10,10],py:[9,16,4,10,8],pz:[1,0,2,1,1],nx:[4,2,3,5,3],ny:[11,5,6,12,5],nz:[0,1,1,0,-1]},{size:2,px:[6,11],py:[4,18],pz:[1,-1],nx:[8,6],ny:[4,9],nz:[1,1]},{size:2,px:[2,8],py:[5,23],pz:[2,0],nx:[9,4],ny:[0,2],nz:[1,-1]},{size:5,px:[3,1,2,2,2],py:[12,6,12,11,11],pz:[0,1,0,0,-1],nx:[0,0,0,0,0],ny:[13,12,11,14,7],nz:[0,0,0,0,1]},{size:2,px:[3,6],py:[1,2],pz:[2,1],nx:[8,4],ny:[4,14],nz:[1,-1]},{size:5,px:[11,23,23,22,22],py:[8,12,6,13,14],pz:[1,0,0,0,0],nx:[13,8,7,6,6],ny:[6,3,3,9,9],nz:[0,1,1,0,-1]},{size:4,px:[9,23,23,22],py:[7,12,6,13],pz:[1,-1,-1,-1],nx:[11,23,23,23],ny:[6,13,17,10],nz:[1,0,0,0]},{size:5,px:[0,0,0,0,0],py:[19,5,9,16,10],pz:[0,2,1,0,1],nx:[5,2,1,2,2],ny:[18,10,5,9,9],nz:[0,1,2,1,-1]},{size:2,px:[11,5],py:[10,4],pz:[1,2],nx:[23,14],ny:[23,3],nz:[0,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,1],ny:[4,4],nz:[1,-1]},{size:2,px:[8,10],py:[4,8],pz:[0,-1],nx:[8,8],ny:[2,3],nz:[0,0]},{size:3,px:[7,10,11],py:[1,6,13],pz:[0,-1,-1],nx:[4,4,2],ny:[3,8,2],nz:[1,1,2]},{size:2,px:[8,4],py:[8,2],pz:[1,2],nx:[10,5],ny:[10,0],nz:[0,-1]},{size:2,px:[7,16],py:[20,21],pz:[0,-1],nx:[2,4],ny:[5,10],nz:[2,1]},{size:2,px:[3,10],py:[7,8],pz:[1,-1],nx:[7,4],ny:[20,7],nz:[0,1]},{size:5,px:[11,11,11,11,11],py:[10,12,13,11,11],pz:[0,0,0,0,-1],nx:[11,12,16,3,8],ny:[6,6,10,1,8],nz:[0,0,0,2,0]},{size:2,px:[12,6],py:[4,2],pz:[0,1],nx:[7,7],ny:[8,1],nz:[0,-1]},{size:5,px:[23,23,23,23,23],py:[22,20,21,19,19],pz:[0,0,0,0,-1],nx:[4,6,3,4,3],ny:[19,23,15,20,16],nz:[0,0,0,0,0]},{size:3,px:[8,4,14],py:[12,3,8],pz:[0,-1,-1],nx:[4,2,10],ny:[10,3,13],nz:[1,2,0]},{size:2,px:[11,18],py:[13,23],pz:[0,-1],nx:[5,5],ny:[1,2],nz:[2,2]},{size:3,px:[11,2,10],py:[17,4,17],pz:[0,2,0],nx:[11,0,22],ny:[15,2,4],nz:[0,-1,-1]},{size:3,px:[11,3,0],py:[15,4,8],pz:[0,-1,-1],nx:[14,11,4],ny:[9,17,7],nz:[0,0,1]},{size:2,px:[17,16],py:[2,1],pz:[0,0],nx:[9,11],ny:[4,6],nz:[1,-1]},{size:2,px:[3,4],py:[21,23],pz:[0,0],nx:[4,0],ny:[3,3],nz:[1,-1]},{size:2,px:[18,2],py:[20,0],pz:[0,-1],nx:[4,9],ny:[5,10],nz:[2,1]},{size:2,px:[9,1],py:[19,3],pz:[0,-1],nx:[0,0],ny:[9,21],nz:[1,0]},{size:2,px:[19,19],py:[21,22],pz:[0,0],nx:[19,0],ny:[23,0],nz:[0,-1]},{size:4,px:[11,2,3,2],py:[6,6,9,4],pz:[0,-1,-1,-1],nx:[4,9,19,19],ny:[5,10,17,18],nz:[2,1,0,0]},{size:2,px:[2,4],py:[4,8],pz:[2,1],nx:[4,9],ny:[10,10],nz:[1,-1]},{size:2,px:[23,22],py:[8,12],pz:[0,-1],nx:[7,4],ny:[11,2],nz:[0,2]},{size:2,px:[12,1],py:[5,2],pz:[0,-1],nx:[9,11],ny:[2,1],nz:[0,0]},{size:2,px:[4,4],py:[2,2],pz:[0,-1],nx:[3,2],ny:[1,2],nz:[0,0]},{size:2,px:[17,9],py:[13,7],pz:[0,1],nx:[9,5],ny:[4,0],nz:[1,-1]},{size:4,px:[0,0,9,13],py:[3,3,7,3],pz:[2,-1,-1,-1],nx:[2,4,4,11],ny:[1,2,8,5],nz:[2,1,1,0]},{size:5,px:[3,6,5,6,6],py:[0,0,2,1,1],pz:[1,0,0,0,-1],nx:[2,2,2,1,1],ny:[21,19,20,16,17],nz:[0,0,0,0,0]},{size:2,px:[13,3],py:[22,10],pz:[0,-1],nx:[7,4],ny:[10,5],nz:[1,2]},{size:2,px:[3,2],py:[7,3],pz:[1,2],nx:[8,4],ny:[4,5],nz:[1,-1]},{size:5,px:[17,8,15,7,15],py:[13,6,16,5,12],pz:[0,1,0,1,0],nx:[5,4,6,3,4],ny:[1,2,1,0,3],nz:[0,0,0,1,-1]},{size:5,px:[12,9,11,12,10],py:[0,1,2,2,0],pz:[0,0,0,0,0],nx:[8,16,7,4,4],ny:[9,23,9,3,2],nz:[1,0,1,2,-1]},{size:2,px:[4,11],py:[1,4],pz:[2,-1],nx:[8,7],ny:[4,4],nz:[0,0]},{size:4,px:[7,4,5,8],py:[13,2,1,3],pz:[0,-1,-1,-1],nx:[9,4,9,9],ny:[9,5,10,11],nz:[0,1,0,0]},{size:2,px:[10,11],py:[10,11],pz:[0,-1],nx:[2,6],ny:[2,2],nz:[2,1]},{size:2,px:[21,3],py:[11,2],pz:[0,-1],nx:[22,22],ny:[20,18],nz:[0,0]},{size:2,px:[7,6],py:[1,2],pz:[0,0],nx:[5,10],ny:[1,0],nz:[0,-1]},{size:2,px:[21,3],py:[18,1],pz:[0,-1],nx:[16,15],ny:[4,4],nz:[0,0]},{size:2,px:[12,7],py:[4,1],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[13,11],py:[23,17],pz:[0,0],nx:[11,21],ny:[16,0],nz:[0,-1]},{size:2,px:[1,2],py:[0,6],pz:[1,-1],nx:[16,16],ny:[9,11],nz:[0,0]},{size:2,px:[12,13],py:[20,20],pz:[0,0],nx:[11,3],ny:[21,7],nz:[0,-1]},{size:3,px:[19,20,9],py:[21,18,11],pz:[0,0,1],nx:[17,4,11],ny:[19,2,0],nz:[0,-1,-1]},{size:2,px:[12,5],py:[5,2],pz:[0,1],nx:[7,9],ny:[7,8],nz:[0,-1]},{size:5,px:[8,4,4,8,4],py:[4,4,5,10,3],pz:[1,1,2,0,2],nx:[11,22,11,23,23],ny:[0,0,1,3,3],nz:[1,0,1,0,-1]},{size:2,px:[8,14],py:[10,23],pz:[1,0],nx:[7,2],ny:[10,9],nz:[1,-1]},{size:2,px:[5,14],py:[6,23],pz:[1,-1],nx:[1,2],ny:[2,4],nz:[2,1]},{size:2,px:[11,2],py:[19,3],pz:[0,-1],nx:[10,12],ny:[18,18],nz:[0,0]},{size:2,px:[12,3],py:[4,1],pz:[0,2],nx:[6,6],ny:[11,11],nz:[1,-1]},{size:5,px:[0,0,0,0,0],py:[18,10,20,19,19],pz:[0,1,0,0,-1],nx:[11,10,14,12,13],ny:[2,2,2,2,2],nz:[0,0,0,0,0]},{size:3,px:[12,2,9],py:[14,5,10],pz:[0,-1,-1],nx:[11,10,5],ny:[10,13,5],nz:[0,0,1]},{size:2,px:[2,3],py:[3,7],pz:[2,1],nx:[3,10],ny:[4,13],nz:[1,-1]},{size:2,px:[9,3],py:[21,7],pz:[0,-1],nx:[10,21],ny:[7,15],nz:[1,0]},{size:2,px:[21,10],py:[16,8],pz:[0,1],nx:[8,2],ny:[10,8],nz:[1,-1]},{size:2,px:[8,8],py:[6,7],pz:[1,-1],nx:[12,11],ny:[11,7],nz:[0,1]},{size:2,px:[3,11],py:[4,20],pz:[2,0],nx:[11,10],ny:[19,1],nz:[0,-1]},{size:2,px:[17,5],py:[13,3],pz:[0,-1],nx:[7,8],ny:[4,4],nz:[1,1]},{size:2,px:[7,1],py:[23,3],pz:[0,2],nx:[14,6],ny:[12,9],nz:[0,-1]},{size:2,px:[12,5],py:[11,2],pz:[0,-1],nx:[11,7],ny:[3,1],nz:[0,1]},{size:2,px:[9,6],py:[2,17],pz:[0,-1],nx:[4,6],ny:[4,12],nz:[1,0]},{size:2,px:[14,19],py:[5,6],pz:[0,-1],nx:[9,3],ny:[9,1],nz:[0,2]},{size:5,px:[12,13,13,13,12],py:[9,11,12,13,10],pz:[0,0,0,0,0],nx:[2,4,4,4,4],ny:[7,18,17,14,14],nz:[1,0,0,0,-1]},{size:2,px:[10,10],py:[6,6],pz:[1,-1],nx:[20,18],ny:[18,23],nz:[0,0]},{size:2,px:[5,6],py:[4,14],pz:[1,-1],nx:[9,4],ny:[2,1],nz:[1,2]},{size:2,px:[11,9],py:[4,18],pz:[0,-1],nx:[4,8],ny:[4,4],nz:[1,1]},{size:2,px:[15,0],py:[18,4],pz:[0,-1],nx:[3,4],ny:[5,4],nz:[2,2]},{size:4,px:[7,3,6,6],py:[8,4,6,5],pz:[1,2,1,1],nx:[10,4,13,0],ny:[10,4,9,22],nz:[0,-1,-1,-1]},{size:2,px:[10,8],py:[18,11],pz:[0,-1],nx:[5,4],ny:[8,10],nz:[1,1]},{size:4,px:[17,2,10,2],py:[14,1,10,3],pz:[0,-1,-1,-1],nx:[8,8,17,8],ny:[4,5,12,6],nz:[1,1,0,1]},{size:5,px:[9,11,9,4,10],py:[1,1,0,0,1],pz:[0,0,0,1,0],nx:[8,4,7,15,15],ny:[7,2,4,17,17],nz:[1,2,1,0,-1]},{size:2,px:[4,3],py:[11,8],pz:[0,-1],nx:[2,2],ny:[1,2],nz:[2,2]},{size:2,px:[11,3],py:[13,8],pz:[0,-1],nx:[1,1],ny:[5,2],nz:[1,2]},{size:2,px:[6,2],py:[8,3],pz:[0,2],nx:[3,1],ny:[5,2],nz:[1,-1]},{size:5,px:[10,5,7,8,6],py:[9,7,7,7,7],pz:[0,0,0,0,0],nx:[7,3,0,2,15],ny:[8,0,1,18,17],nz:[0,-1,-1,-1,-1]},{size:2,px:[17,8],py:[12,6],pz:[0,1],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:5,px:[3,11,8,10,12],py:[0,2,10,2,3],pz:[2,0,0,0,0],nx:[3,2,10,2,2],ny:[6,4,11,3,3],nz:[0,1,0,1,-1]},{size:2,px:[3,6],py:[2,4],pz:[2,1],nx:[8,19],ny:[4,16],nz:[1,-1]},{size:2,px:[2,2],py:[1,1],pz:[2,-1],nx:[7,17],ny:[1,2],nz:[1,0]},{size:5,px:[16,15,14,13,7],py:[0,0,0,0,0],pz:[0,0,0,0,-1],nx:[6,4,8,3,11],ny:[3,4,4,1,6],nz:[1,1,1,2,0]},{size:2,px:[11,1],py:[8,5],pz:[0,-1],nx:[13,4],ny:[10,2],nz:[0,2]},{size:2,px:[4,9],py:[0,2],pz:[2,1],nx:[4,11],ny:[0,2],nz:[0,-1]},{size:2,px:[15,15],py:[2,2],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[8,17],py:[9,22],pz:[1,0],nx:[8,20],ny:[10,2],nz:[1,-1]},{size:2,px:[10,10],py:[14,22],pz:[0,-1],nx:[3,11],ny:[3,3],nz:[1,0]},{size:2,px:[4,2],py:[1,0],pz:[1,2],nx:[5,8],ny:[3,9],nz:[0,-1]},{size:2,px:[2,3],py:[4,8],pz:[2,1],nx:[9,5],ny:[15,19],nz:[0,-1]},{size:2,px:[5,2],py:[1,1],pz:[0,1],nx:[10,10],ny:[6,6],nz:[0,-1]},{size:2,px:[17,6],py:[10,2],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:3,px:[13,7,3],py:[5,2,6],pz:[0,1,-1],nx:[17,16,17],ny:[1,1,2],nz:[0,0,0]},{size:2,px:[11,10],py:[3,3],pz:[0,0],nx:[8,4],ny:[4,4],nz:[1,-1]},{size:2,px:[4,8],py:[0,8],pz:[2,-1],nx:[3,4],ny:[0,0],nz:[1,1]},{size:5,px:[9,2,4,1,2],py:[13,3,9,2,5],pz:[0,2,1,2,2],nx:[9,5,10,4,10],ny:[5,1,3,0,0],nz:[1,-1,-1,-1,-1]},{size:2,px:[6,12],py:[5,9],pz:[1,0],nx:[0,2],ny:[23,9],nz:[0,-1]},{size:2,px:[22,11],py:[21,8],pz:[0,1],nx:[10,0],ny:[17,2],nz:[0,-1]},{size:2,px:[3,1],py:[22,9],pz:[0,1],nx:[22,5],ny:[11,2],nz:[0,2]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[5,6],ny:[10,9],nz:[1,-1]},{size:4,px:[7,3,17,7],py:[8,2,10,11],pz:[0,2,0,1],nx:[6,10,5,23],ny:[9,21,1,23],nz:[0,-1,-1,-1]},{size:2,px:[8,3],py:[7,2],pz:[1,2],nx:[8,9],ny:[4,9],nz:[1,-1]},{size:2,px:[9,5],py:[14,6],pz:[0,1],nx:[8,8],ny:[13,13],nz:[0,-1]},{size:3,px:[11,6,8],py:[20,3,20],pz:[0,-1,-1],nx:[5,3,12],ny:[9,5,18],nz:[1,2,0]},{size:2,px:[3,9],py:[1,3],pz:[1,0],nx:[2,8],ny:[5,8],nz:[0,-1]},{size:2,px:[15,9],py:[21,3],pz:[0,-1],nx:[3,4],ny:[5,5],nz:[2,2]},{size:2,px:[2,9],py:[7,11],pz:[1,-1],nx:[2,2],ny:[8,9],nz:[1,1]},{size:4,px:[3,4,3,1],py:[14,21,19,6],pz:[0,0,0,1],nx:[10,16,4,5],ny:[8,1,7,6],nz:[0,-1,-1,-1]},{size:4,px:[10,4,3,1],py:[5,21,19,6],pz:[1,-1,-1,-1],nx:[21,10,5,11],ny:[4,2,3,4],nz:[0,1,2,1]},{size:2,px:[4,17],py:[3,8],pz:[2,0],nx:[17,2],ny:[9,22],nz:[0,-1]},{size:2,px:[17,12],py:[14,20],pz:[0,-1],nx:[7,8],ny:[4,4],nz:[1,1]},{size:2,px:[10,12],py:[9,20],pz:[0,-1],nx:[11,23],ny:[8,18],nz:[1,0]},{size:2,px:[5,11],py:[4,7],pz:[2,1],nx:[8,15],ny:[7,5],nz:[1,-1]},{size:2,px:[11,15],py:[13,8],pz:[0,-1],nx:[11,11],ny:[6,7],nz:[1,1]},{size:2,px:[6,15],py:[14,8],pz:[0,-1],nx:[4,4],ny:[12,13],nz:[0,0]},{size:2,px:[5,5],py:[0,1],pz:[2,2],nx:[15,4],ny:[5,5],nz:[0,-1]},{size:2,px:[16,17],py:[2,2],pz:[0,0],nx:[20,8],ny:[3,7],nz:[0,-1]},{size:3,px:[6,3,2],py:[10,6,1],pz:[0,-1,-1],nx:[4,3,2],ny:[3,4,2],nz:[1,1,2]},{size:2,px:[10,6],py:[4,6],pz:[0,-1],nx:[6,13],ny:[0,1],nz:[1,0]},{size:2,px:[10,10],py:[8,7],pz:[1,1],nx:[8,2],ny:[7,2],nz:[1,-1]},{size:2,px:[7,1],py:[12,4],pz:[0,-1],nx:[3,4],ny:[5,5],nz:[1,1]},{size:2,px:[11,15],py:[15,14],pz:[0,-1],nx:[3,11],ny:[4,13],nz:[1,0]},{size:5,px:[13,9,11,14,12],py:[0,2,0,0,2],pz:[0,0,0,0,0],nx:[5,4,4,3,4],ny:[4,4,18,7,17],nz:[1,1,0,1,0]},{size:3,px:[13,12,11],py:[22,22,22],pz:[0,0,0],nx:[11,12,13],ny:[20,20,20],nz:[0,0,0]},{size:2,px:[6,13],py:[2,4],pz:[1,0],nx:[7,6],ny:[8,9],nz:[0,-1]},{size:2,px:[0,0],py:[23,4],pz:[0,-1],nx:[5,9],ny:[1,1],nz:[1,0]},{size:2,px:[14,14],py:[19,19],pz:[0,-1],nx:[11,11],ny:[10,9],nz:[1,1]},{size:2,px:[23,23],py:[11,9],pz:[0,0],nx:[23,23],ny:[0,11],nz:[0,-1]},{size:2,px:[23,3],py:[23,5],pz:[0,-1],nx:[4,1],ny:[23,10],nz:[0,1]},{size:2,px:[9,1],py:[7,4],pz:[1,-1],nx:[19,10],ny:[20,9],nz:[0,1]},{size:2,px:[16,1],py:[9,4],pz:[0,-1],nx:[7,8],ny:[3,3],nz:[1,1]},{size:2,px:[7,6],py:[13,13],pz:[0,0],nx:[4,5],ny:[4,11],nz:[1,-1]},{size:5,px:[19,20,20,10,10],py:[0,0,2,0,1],pz:[0,0,0,1,1],nx:[7,7,15,4,4],ny:[4,13,7,4,4],nz:[1,0,0,1,-1]},{size:2,px:[12,23],py:[6,5],pz:[0,-1],nx:[18,18],ny:[17,16],nz:[0,0]},{size:2,px:[6,3],py:[9,2],pz:[1,2],nx:[14,18],ny:[9,1],nz:[0,-1]},{size:2,px:[9,13],py:[16,5],pz:[0,-1],nx:[5,4],ny:[7,9],nz:[1,1]},{size:2,px:[10,10],py:[8,10],pz:[1,1],nx:[4,1],ny:[5,3],nz:[2,-1]},{size:2,px:[12,11],py:[13,4],pz:[0,-1],nx:[0,0],ny:[14,15],nz:[0,0]},{size:2,px:[2,1],py:[20,17],pz:[0,0],nx:[12,12],ny:[22,2],nz:[0,-1]},{size:2,px:[2,3],py:[6,7],pz:[1,-1],nx:[21,21],ny:[13,12],nz:[0,0]},{size:2,px:[3,10],py:[4,23],pz:[2,0],nx:[10,2],ny:[21,5],nz:[0,-1]},{size:2,px:[6,12],py:[3,6],pz:[1,0],nx:[11,0],ny:[17,1],nz:[0,-1]},{size:2,px:[11,4],py:[21,9],pz:[0,-1],nx:[2,3],ny:[18,22],nz:[0,0]},{size:2,px:[13,5],py:[18,9],pz:[0,-1],nx:[6,7],ny:[8,9],nz:[1,1]},{size:2,px:[21,4],py:[16,3],pz:[0,-1],nx:[23,23],ny:[16,15],nz:[0,0]},{size:2,px:[2,0],py:[7,4],pz:[1,-1],nx:[3,8],ny:[7,4],nz:[1,1]},{size:2,px:[15,16],py:[11,12],pz:[0,0],nx:[8,5],ny:[4,5],nz:[1,-1]},{size:2,px:[0,0],py:[7,5],pz:[0,0],nx:[17,17],ny:[11,10],nz:[0,-1]},{size:5,px:[8,13,12,3,3],py:[6,23,23,3,3],pz:[1,0,0,2,-1],nx:[0,1,0,0,0],ny:[2,13,4,5,6],nz:[2,0,1,1,1]},{size:2,px:[0,1],py:[7,8],pz:[1,-1],nx:[0,0],ny:[1,0],nz:[2,2]},{size:2,px:[2,12],py:[1,7],pz:[1,-1],nx:[0,0],ny:[12,14],nz:[0,0]},{size:2,px:[5,1],py:[7,4],pz:[1,2],nx:[8,0],ny:[15,14],nz:[0,-1]},{size:2,px:[7,4],py:[14,8],pz:[0,-1],nx:[2,4],ny:[1,4],nz:[2,1]},{size:2,px:[5,3],py:[3,1],pz:[2,-1],nx:[9,9],ny:[5,6],nz:[1,1]},{size:2,px:[4,5],py:[2,3],pz:[1,-1],nx:[11,12],ny:[23,23],nz:[0,0]},{size:2,px:[10,5],py:[7,0],pz:[1,-1],nx:[22,22],ny:[19,18],nz:[0,0]},{size:3,px:[10,2,9],py:[20,9,4],pz:[0,-1,-1],nx:[1,10,11],ny:[2,11,9],nz:[2,0,0]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[9,3],ny:[4,2],nz:[1,-1]},{size:2,px:[17,6],py:[7,16],pz:[0,-1],nx:[17,17],ny:[9,6],nz:[0,0]},{size:3,px:[8,1,9],py:[6,3,4],pz:[1,-1,-1],nx:[2,9,2],ny:[5,13,3],nz:[2,0,2]},{size:4,px:[10,10,9,2],py:[12,11,2,10],pz:[0,0,-1,-1],nx:[6,11,3,13],ny:[2,4,1,4],nz:[1,0,2,0]},{size:2,px:[3,3],py:[7,1],pz:[1,-1],nx:[4,3],ny:[4,4],nz:[1,1]},{size:2,px:[0,0],py:[4,8],pz:[2,1],nx:[4,4],ny:[15,5],nz:[0,-1]},{size:2,px:[5,0],py:[4,8],pz:[1,-1],nx:[13,13],ny:[9,10],nz:[0,0]},{size:2,px:[6,3],py:[2,1],pz:[1,2],nx:[8,17],ny:[4,12],nz:[1,-1]},{size:2,px:[15,16],py:[11,6],pz:[0,0],nx:[16,17],ny:[5,12],nz:[0,-1]},{size:2,px:[13,11],py:[9,7],pz:[0,-1],nx:[0,1],ny:[9,20],nz:[1,0]},{size:3,px:[16,11,20],py:[4,7,23],pz:[0,-1,-1],nx:[8,9,4],ny:[4,6,4],nz:[1,1,2]},{size:2,px:[1,1],py:[18,17],pz:[0,0],nx:[9,6],ny:[7,11],nz:[0,-1]},{size:3,px:[4,4,19],py:[3,2,9],pz:[2,2,0],nx:[2,14,11],ny:[5,3,9],nz:[1,-1,-1]},{size:2,px:[11,19],py:[13,9],pz:[0,-1],nx:[11,11],ny:[4,5],nz:[1,1]},{size:2,px:[13,7],py:[19,2],pz:[0,-1],nx:[3,5],ny:[6,12],nz:[1,0]},{size:4,px:[9,4,4,2],py:[13,9,8,4],pz:[0,1,1,2],nx:[13,0,0,14],ny:[18,11,6,1],nz:[0,-1,-1,-1]},{size:2,px:[11,15],py:[8,10],pz:[0,0],nx:[14,11],ny:[9,2],nz:[0,-1]},{size:2,px:[3,2],py:[8,5],pz:[1,2],nx:[4,4],ny:[10,10],nz:[1,-1]},{size:4,px:[4,6,16,14],py:[1,1,1,7],pz:[2,1,0,0],nx:[10,1,1,2],ny:[8,5,10,3],nz:[0,-1,-1,-1]},{size:4,px:[2,3,1,2],py:[3,1,0,2],pz:[0,0,1,0],nx:[0,0,0,0],ny:[1,1,2,0],nz:[0,1,0,1]},{size:2,px:[8,8],py:[6,7],pz:[1,1],nx:[8,0],ny:[4,1],nz:[1,-1]},{size:2,px:[0,0],py:[3,0],pz:[0,1],nx:[2,2],ny:[1,16],nz:[1,-1]},{size:2,px:[6,6],py:[19,18],pz:[0,0],nx:[2,10],ny:[5,8],nz:[2,-1]},{size:2,px:[8,5],py:[21,11],pz:[0,-1],nx:[3,2],ny:[11,5],nz:[1,2]},{size:2,px:[4,9],py:[4,7],pz:[2,1],nx:[8,7],ny:[10,4],nz:[1,-1]},{size:5,px:[4,18,19,16,19],py:[3,12,12,23,13],pz:[2,0,0,0,0],nx:[2,8,3,2,2],ny:[4,23,10,5,5],nz:[2,0,1,2,-1]},{size:2,px:[4,8],py:[6,11],pz:[1,0],nx:[8,3],ny:[4,7],nz:[1,-1]},{size:2,px:[3,12],py:[4,13],pz:[2,0],nx:[10,5],ny:[15,21],nz:[0,-1]},{size:2,px:[2,9],py:[4,23],pz:[2,0],nx:[19,4],ny:[9,3],nz:[0,2]},{size:2,px:[3,6],py:[8,15],pz:[1,0],nx:[6,1],ny:[18,5],nz:[0,-1]},{size:2,px:[9,0],py:[20,3],pz:[0,-1],nx:[2,10],ny:[5,17],nz:[2,0]},{size:3,px:[10,6,3],py:[2,7,3],pz:[0,-1,-1],nx:[5,4,2],ny:[9,7,2],nz:[1,1,2]},{size:2,px:[14,6],py:[12,7],pz:[0,-1],nx:[2,10],ny:[0,1],nz:[2,0]},{size:3,px:[10,5,1],py:[15,5,4],pz:[0,-1,-1],nx:[9,4,18],ny:[2,0,4],nz:[1,2,0]},{size:2,px:[17,2],py:[12,6],pz:[0,-1],nx:[8,16],ny:[4,11],nz:[1,0]},{size:3,px:[7,13,4],py:[0,0,1],pz:[1,0,-1],nx:[18,4,4],ny:[13,2,3],nz:[0,2,2]},{size:2,px:[1,11],py:[10,6],pz:[0,-1],nx:[0,1],ny:[15,17],nz:[0,0]},{size:3,px:[9,12,8],py:[8,17,11],pz:[1,0,1],nx:[12,0,20],ny:[16,9,13],nz:[0,-1,-1]},{size:2,px:[11,4],py:[5,8],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[16,3],py:[9,8],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[6,3],py:[11,5],pz:[1,2],nx:[11,5],ny:[21,5],nz:[0,-1]},{size:2,px:[11,13],py:[1,1],pz:[0,0],nx:[4,4],ny:[5,5],nz:[1,-1]},{size:2,px:[14,4],py:[4,3],pz:[0,-1],nx:[12,10],ny:[2,2],nz:[0,0]},{size:2,px:[3,6],py:[2,4],pz:[2,1],nx:[9,7],ny:[9,7],nz:[0,-1]},{size:3,px:[5,6,6],py:[4,4,4],pz:[1,-1,-1],nx:[13,8,7],ny:[8,3,4],nz:[0,1,1]},{size:2,px:[5,5],py:[2,11],pz:[1,1],nx:[10,11],ny:[22,22],nz:[0,0]},{size:2,px:[16,9],py:[13,7],pz:[0,1],nx:[8,14],ny:[4,12],nz:[1,-1]},{size:2,px:[13,5],py:[13,3],pz:[0,2],nx:[16,22],ny:[13,6],nz:[0,-1]},{size:4,px:[4,4,3,4],py:[4,3,4,5],pz:[2,2,2,2],nx:[21,5,17,7],ny:[0,2,5,23],nz:[0,-1,-1,-1]},{size:2,px:[4,16],py:[0,1],pz:[2,0],nx:[15,1],ny:[23,10],nz:[0,-1]},{size:2,px:[4,6],py:[11,2],pz:[0,-1],nx:[15,6],ny:[2,1],nz:[0,1]},{size:2,px:[6,3],py:[2,1],pz:[1,2],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:3,px:[13,14,5],py:[9,15,2],pz:[0,-1,-1],nx:[11,1,11],ny:[10,3,11],nz:[0,1,0]},{size:2,px:[5,1],py:[6,2],pz:[1,-1],nx:[1,1],ny:[2,5],nz:[2,1]},{size:2,px:[11,5],py:[1,0],pz:[1,2],nx:[10,4],ny:[2,3],nz:[1,-1]},{size:2,px:[11,11],py:[8,9],pz:[1,1],nx:[23,4],ny:[23,2],nz:[0,-1]},{size:2,px:[5,2],py:[10,2],pz:[0,-1],nx:[18,10],ny:[0,1],nz:[0,1]},{size:2,px:[20,4],py:[7,3],pz:[0,2],nx:[8,4],ny:[4,0],nz:[1,-1]},{size:2,px:[10,4],py:[5,4],pz:[1,-1],nx:[11,11],ny:[5,6],nz:[1,1]},{size:3,px:[14,15,16],py:[0,0,1],pz:[0,0,0],nx:[8,5,15],ny:[7,2,10],nz:[1,-1,-1]},{size:2,px:[2,2],py:[1,1],pz:[2,-1],nx:[17,18],ny:[2,2],nz:[0,0]},{size:2,px:[13,8],py:[15,7],pz:[0,-1],nx:[9,4],ny:[5,2],nz:[0,1]},{size:2,px:[4,0],py:[6,17],pz:[1,-1],nx:[3,2],ny:[4,2],nz:[1,2]},{size:2,px:[14,8],py:[17,9],pz:[0,-1],nx:[7,6],ny:[8,8],nz:[1,1]},{size:2,px:[10,4],py:[7,1],pz:[1,-1],nx:[15,6],ny:[14,4],nz:[0,1]},{size:2,px:[3,12],py:[8,19],pz:[1,0],nx:[13,10],ny:[17,9],nz:[0,-1]},{size:2,px:[7,12],py:[2,4],pz:[1,0],nx:[6,11],ny:[3,2],nz:[0,-1]},{size:4,px:[2,1,6,1],py:[10,3,23,8],pz:[1,2,0,1],nx:[17,10,23,0],ny:[9,2,20,3],nz:[0,-1,-1,-1]},{size:2,px:[9,9],py:[2,8],pz:[0,-1],nx:[2,2],ny:[4,2],nz:[2,2]},{size:2,px:[3,16],py:[1,6],pz:[2,0],nx:[8,4],ny:[2,5],nz:[1,-1]},{size:2,px:[3,6],py:[1,2],pz:[2,1],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[5,6],py:[3,0],pz:[2,-1],nx:[9,5],ny:[2,1],nz:[0,1]},{size:2,px:[3,16],py:[5,23],pz:[1,-1],nx:[0,0],ny:[6,3],nz:[1,2]},{size:4,px:[0,0,0,0],py:[3,2,12,5],pz:[2,2,0,1],nx:[2,3,2,13],ny:[5,5,2,19],nz:[1,-1,-1,-1]},{size:2,px:[11,11],py:[10,11],pz:[0,0],nx:[5,5],ny:[1,1],nz:[2,-1]},{size:2,px:[5,2],py:[0,4],pz:[2,-1],nx:[2,2],ny:[10,8],nz:[1,1]},{size:4,px:[16,2,8,4],py:[14,0,11,5],pz:[0,-1,-1,-1],nx:[18,14,7,7],ny:[13,14,8,6],nz:[0,0,1,1]},{size:2,px:[8,9],py:[2,2],pz:[0,0],nx:[5,14],ny:[4,14],nz:[1,-1]},{size:2,px:[3,5],py:[11,20],pz:[1,0],nx:[11,4],ny:[0,2],nz:[0,-1]},{size:2,px:[2,2],py:[3,4],pz:[2,2],nx:[3,4],ny:[4,2],nz:[1,-1]},{size:3,px:[10,4,3],py:[5,5,3],pz:[0,-1,-1],nx:[11,3,10],ny:[2,0,2],nz:[0,2,0]},{size:2,px:[15,15],py:[1,1],pz:[0,-1],nx:[7,4],ny:[5,2],nz:[1,2]},{size:4,px:[9,5,2,6],py:[22,8,4,19],pz:[0,1,2,0],nx:[9,5,0,3],ny:[20,5,22,4],nz:[0,-1,-1,-1]},{size:3,px:[1,4,10],py:[3,9,12],pz:[2,1,0],nx:[0,10,0],ny:[0,5,0],nz:[0,-1,-1]},{size:2,px:[1,6],py:[0,7],pz:[0,-1],nx:[20,19],ny:[14,14],nz:[0,0]},{size:2,px:[13,4],py:[14,15],pz:[0,-1],nx:[2,1],ny:[5,7],nz:[0,0]},{size:2,px:[17,7],py:[9,11],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[17,9],py:[12,6],pz:[0,1],nx:[15,10],ny:[9,8],nz:[0,-1]},{size:2,px:[0,0],py:[0,1],pz:[2,2],nx:[9,7],ny:[6,17],nz:[1,-1]},{size:3,px:[3,3,15],py:[3,4,6],pz:[2,1,0],nx:[0,2,22],ny:[5,8,9],nz:[0,-1,-1]},{size:4,px:[15,15,15,1],py:[12,6,6,1],pz:[0,-1,-1,-1],nx:[4,7,13,4],ny:[4,7,12,2],nz:[2,1,0,2]},{size:2,px:[3,15],py:[12,6],pz:[0,-1],nx:[9,1],ny:[14,2],nz:[0,2]},{size:2,px:[12,12],py:[11,12],pz:[0,0],nx:[9,5],ny:[4,4],nz:[1,-1]},{size:3,px:[23,6,7],py:[23,3,4],pz:[0,-1,-1],nx:[19,16,17],ny:[17,14,15],nz:[0,0,0]},{size:2,px:[9,5],py:[2,7],pz:[1,-1],nx:[11,23],ny:[10,18],nz:[1,0]},{size:3,px:[0,0,0],py:[4,9,2],pz:[1,0,2],nx:[2,0,0],ny:[9,2,1],nz:[0,-1,-1]},{size:2,px:[12,0],py:[11,9],pz:[0,-1],nx:[1,0],ny:[18,5],nz:[0,2]},{size:2,px:[5,4],py:[10,6],pz:[0,1],nx:[10,6],ny:[10,18],nz:[0,-1]},{size:2,px:[13,12],py:[13,13],pz:[0,-1],nx:[5,11],ny:[1,3],nz:[2,1]},{size:2,px:[10,19],py:[5,22],pz:[1,-1],nx:[4,12],ny:[1,5],nz:[2,0]},{size:2,px:[8,6],py:[0,0],pz:[0,0],nx:[3,12],ny:[0,3],nz:[0,-1]},{size:2,px:[9,6],py:[7,0],pz:[1,-1],nx:[12,12],ny:[10,11],nz:[0,0]},{size:4,px:[3,1,3,2],py:[20,9,21,19],pz:[0,1,0,0],nx:[20,20,5,12],ny:[10,15,2,10],nz:[0,-1,-1,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,1],ny:[4,6],nz:[1,-1]},{size:3,px:[5,11,11],py:[1,3,4],pz:[2,1,1],nx:[3,3,7],ny:[5,5,0],nz:[1,-1,-1]},{size:3,px:[8,6,7],py:[10,5,6],pz:[1,1,1],nx:[23,3,7],ny:[0,5,0],nz:[0,-1,-1]},{size:2,px:[2,7],py:[2,14],pz:[1,-1],nx:[7,3],ny:[12,4],nz:[0,1]},{size:2,px:[5,3],py:[6,3],pz:[1,2],nx:[13,3],ny:[12,4],nz:[0,-1]},{size:2,px:[11,18],py:[11,4],pz:[0,-1],nx:[23,11],ny:[19,10],nz:[0,1]},{size:2,px:[7,2],py:[12,3],pz:[0,-1],nx:[8,4],ny:[11,5],nz:[0,1]},{size:2,px:[11,11],py:[0,11],pz:[1,-1],nx:[3,3],ny:[19,18],nz:[0,0]},{size:2,px:[11,1],py:[11,11],pz:[1,-1],nx:[13,15],ny:[6,5],nz:[0,0]},{size:2,px:[8,8],py:[9,9],pz:[0,-1],nx:[5,11],ny:[1,3],nz:[2,1]},{size:4,px:[6,4,8,3],py:[6,2,4,3],pz:[0,2,1,2],nx:[7,0,15,8],ny:[8,8,16,7],nz:[0,-1,-1,-1]},{size:2,px:[4,3],py:[22,20],pz:[0,0],nx:[2,8],ny:[5,4],nz:[2,-1]},{size:2,px:[12,6],py:[11,0],pz:[0,-1],nx:[0,0],ny:[3,1],nz:[1,2]},{size:2,px:[0,0],py:[12,7],pz:[0,1],nx:[3,1],ny:[23,9],nz:[0,-1]},{size:2,px:[7,0],py:[11,5],pz:[1,-1],nx:[0,0],ny:[2,3],nz:[2,2]},{size:2,px:[8,8],py:[10,10],pz:[0,-1],nx:[4,3],ny:[5,4],nz:[2,2]},{size:2,px:[13,3],py:[2,4],pz:[0,-1],nx:[4,3],ny:[3,5],nz:[2,2]},{size:2,px:[1,1],py:[23,22],pz:[0,0],nx:[9,0],ny:[7,3],nz:[0,-1]},{size:2,px:[1,0],py:[16,15],pz:[0,0],nx:[0,14],ny:[23,12],nz:[0,-1]},{size:2,px:[13,8],py:[22,0],pz:[0,-1],nx:[5,3],ny:[0,1],nz:[1,1]},{size:2,px:[13,13],py:[7,7],pz:[0,-1],nx:[3,2],ny:[17,10],nz:[0,1]},{size:2,px:[20,20],py:[15,16],pz:[0,0],nx:[7,3],ny:[9,17],nz:[1,-1]},{size:5,px:[10,12,11,13,11],py:[2,2,1,2,2],pz:[0,0,0,0,0],nx:[10,18,21,21,19],ny:[3,1,13,11,2],nz:[1,0,0,0,0]},{size:2,px:[16,3],py:[6,1],pz:[0,2],nx:[15,18],ny:[8,1],nz:[0,-1]},{size:2,px:[19,3],py:[8,1],pz:[0,-1],nx:[9,8],ny:[4,4],nz:[1,1]},{size:2,px:[10,3],py:[15,18],pz:[0,-1],nx:[3,3],ny:[0,1],nz:[2,2]},{size:2,px:[3,3],py:[2,3],pz:[2,2],nx:[7,3],ny:[11,1],nz:[1,-1]},{size:2,px:[11,10],py:[17,9],pz:[0,-1],nx:[11,10],ny:[15,15],nz:[0,0]},{size:2,px:[5,10],py:[2,4],pz:[1,0],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[9,10],py:[3,4],pz:[0,-1],nx:[9,10],ny:[2,1],nz:[0,0]},{size:2,px:[23,11],py:[13,10],pz:[0,1],nx:[14,7],ny:[5,14],nz:[0,-1]},{size:2,px:[4,4],py:[5,4],pz:[2,2],nx:[9,8],ny:[3,3],nz:[1,-1]},{size:3,px:[12,4,15],py:[5,4,7],pz:[0,-1,-1],nx:[3,4,2],ny:[7,11,5],nz:[1,1,2]},{size:2,px:[11,4],py:[15,4],pz:[0,-1],nx:[5,9],ny:[7,15],nz:[1,0]},{size:2,px:[9,7],py:[0,1],pz:[1,-1],nx:[11,11],ny:[8,7],nz:[1,1]},{size:5,px:[1,1,1,1,1],py:[11,12,10,9,9],pz:[0,0,0,0,-1],nx:[4,5,8,16,11],ny:[4,3,8,8,6],nz:[1,1,0,0,0]}],alpha:[-1.059083,1.059083,-.7846122,.7846122,-.445116,.445116,-.4483277,.4483277,-.3905999,.3905999,-.378925,.378925,-.387461,.387461,-.3110541,.3110541,-.3565056,.3565056,-.3812617,.3812617,-.3325142,.3325142,-.2787282,.2787282,-.3238869,.3238869,-.2993499,.2993499,-.2807737,.2807737,-.2855285,.2855285,-.227755,.227755,-.2031261,.2031261,-.2071574,.2071574,-.2534142,.2534142,-.2266871,.2266871,-.2229078,.2229078,-.2716325,.2716325,-.3046938,.3046938,-.2271601,.2271601,-.1987651,.1987651,-.1953664,.1953664,-.2178737,.2178737,-.2285148,.2285148,-.1891073,.1891073,-.2926469,.2926469,-.2094783,.2094783,-.1478037,.1478037,-.1707579,.1707579,-.146439,.146439,-.2462321,.2462321,-.2319978,.2319978,-.1781651,.1781651,-.1471349,.1471349,-.1953006,.1953006,-.2145108,.2145108,-.1567881,.1567881,-.2024617,.2024617,-.1883198,.1883198,-.1996976,.1996976,-.129233,.129233,-.2142242,.2142242,-.2473748,.2473748,-.1880902,.1880902,-.1874572,.1874572,-.1495984,.1495984,-.1608525,.1608525,-.1698402,.1698402,-.1898871,.1898871,-.1350238,.1350238,-.1727032,.1727032,-.1593352,.1593352,-.1476968,.1476968,-.1428431,.1428431,-.1766261,.1766261,-.1453226,.1453226,-.1929885,.1929885,-.1337582,.1337582,-.1629078,.1629078,-.09973085,.09973085,-.117276,.117276,-.1399242,.1399242,-.1613189,.1613189,-.1145695,.1145695,-.1191093,.1191093,-.12259,.12259,-.1641114,.1641114,-.1419878,.1419878,-.2183465,.2183465,-.1566968,.1566968,-.1288216,.1288216,-.1422831,.1422831,-.2000107,.2000107,-.1817265,.1817265,-.1793796,.1793796,-.1428926,.1428926,-.1182032,.1182032,-.1150421,.1150421,-.1336584,.1336584,-.1656178,.1656178,-.1386549,.1386549,-.1387461,.1387461,-.1313023,.1313023,-.1360391,.1360391,-.1305505,.1305505,-.1323399,.1323399,-.1502891,.1502891,-.1488859,.1488859,-.1126628,.1126628,-.1233623,.1233623,-.1702106,.1702106,-.1629639,.1629639,-.1337706,.1337706,-.1290384,.1290384,-.1165519,.1165519,-.1412778,.1412778,-.1470204,.1470204,-.221378,.221378,-.1472619,.1472619,-.1357071,.1357071,-.1416513,.1416513,-.1050208,.1050208,-.1480033,.1480033,-.1899871,.1899871,-.1466249,.1466249,-.1076952,.1076952,-.1035096,.1035096,-.156697,.156697,-.1364115,.1364115,-.1512889,.1512889,-.1252851,.1252851,-.12063,.12063,-.1059134,.1059134,-.1140398,.1140398,-.1359912,.1359912,-.1231201,.1231201,-.1231867,.1231867,-.09789923,.09789923,-.1590213,.1590213,-.1002206,.1002206,-.1518339,.1518339,-.1055203,.1055203,-.1012579,.1012579,-.1094956,.1094956,-.1429592,.1429592,-.1108838,.1108838,-.1116475,.1116475,-.1735371,.1735371,-.1067758,.1067758,-.1290406,.1290406,-.1156822,.1156822,-.09668217,.09668217,-.1170053,.1170053,-.1252092,.1252092,-.1135158,.1135158,-.1105896,.1105896,-.1038175,.1038175,-.1210459,.1210459,-.1078878,.1078878,-.1050808,.1050808,-.1428227,.1428227,-.16646,.16646,-.1013508,.1013508,-.120693,.120693,-.1088972,.1088972,-.1381026,.1381026,-.1109115,.1109115,-.07921549,.07921549,-.1057832,.1057832,-.09385827,.09385827,-.1486035,.1486035,-.1247401,.1247401,-.09451327,.09451327,-.1272805,.1272805,-.09616206,.09616206,-.09051084,.09051084,-.1138458,.1138458,-.1047581,.1047581,-.1382394,.1382394,-.1122203,.1122203,-.1052936,.1052936,-.1239318,.1239318,-.1241439,.1241439,-.1259012,.1259012,-.1211701,.1211701,-.1344131,.1344131,-.1127778,.1127778,-.1609745,.1609745,-.1901382,.1901382,-.1618962,.1618962,-.1230398,.1230398,-.1319311,.1319311,-.143141,.143141,-.1143306,.1143306,-.09390938,.09390938,-.1154161,.1154161,-.1141205,.1141205,-.1098048,.1098048,-.08870072,.08870072,-.1122444,.1122444,-.1114147,.1114147,-.118571,.118571,-.1107775,.1107775,-.1259167,.1259167,-.1105176,.1105176,-.1020691,.1020691,-.09607863,.09607863,-.095737,.095737,-.1054349,.1054349,-.1137856,.1137856,-.1192043,.1192043,-.1113264,.1113264,-.1093137,.1093137,-.1010919,.1010919,-.09625901,.09625901,-.09338459,.09338459,-.1142944,.1142944,-.1038877,.1038877,-.09772862,.09772862,-.1375298,.1375298,-.1394776,.1394776,-.09454765,.09454765,-.1203246,.1203246,-.08684943,.08684943,-.1135622,.1135622,-.1058181,.1058181,-.1082152,.1082152,-.1411355,.1411355,-.09978846,.09978846,-.1057874,.1057874,-.1415366,.1415366,-.09981014,.09981014,-.09261151,.09261151,-.1737173,.1737173,-.1580335,.1580335,-.09594668,.09594668,-.09336013,.09336013,-.1102373,.1102373,-.08546557,.08546557,-.09945057,.09945057,-.1146358,.1146358,-.1324734,.1324734,-.1422296,.1422296,-.0993799,.0993799,-.08381049,.08381049,-.1270714,.1270714,-.1091738,.1091738,-.1314881,.1314881,-.1085159,.1085159,-.09247554,.09247554,-.08121645,.08121645,-.1059589,.1059589,-.08307793,.08307793,-.1033103,.1033103,-.1056706,.1056706,-.1032803,.1032803,-.126684,.126684,-.09341601,.09341601,-.0768357,.0768357,-.103053,.103053,-.1051872,.1051872,-.09114946,.09114946,-.1329341,.1329341,-.0927083,.0927083,-.114175,.114175,-.09889318,.09889318,-.08856485,.08856485,-.105421,.105421,-.1092704,.1092704,-.08729085,.08729085,-.1141057,.1141057,-.1530774,.1530774,-.0812972,.0812972,-.1143335,.1143335,-.1175777,.1175777,-.1371729,.1371729,-.1394356,.1394356,-.1016308,.1016308,-.1125547,.1125547,-.096726,.096726,-.1036631,.1036631,-.08702514,.08702514,-.1264807,.1264807,-.1465688,.1465688,-.08781464,.08781464,-.08552605,.08552605,-.1145072,.1145072,-.1378489,.1378489,-.1013312,.1013312,-.1020083,.1020083,-.1015816,.1015816,-.08407101,.08407101,-.08296485,.08296485,-.08033655,.08033655,-.09003615,.09003615,-.07504954,.07504954,-.1224941,.1224941,-.09347814,.09347814,-.09555575,.09555575,-.09810025,.09810025,-.1237068,.1237068,-.1283586,.1283586,-.1082763,.1082763,-.1018145,.1018145,-.1175161,.1175161,-.1252279,.1252279,-.1370559,.1370559,-.09941339,.09941339,-.08506938,.08506938,-.1260902,.1260902,-.1014152,.1014152,-.09728694,.09728694,-.0937491,.0937491,-.09587429,.09587429,-.09516036,.09516036,-.07375173,.07375173,-.09332487,.09332487,-.09020733,.09020733,-.1133381,.1133381,-.154218,.154218,-.09692168,.09692168,-.07960904,.07960904,-.08947089,.08947089,-.07830286,.07830286,-.0990005,.0990005,-.1041293,.1041293,-.09572501,.09572501,-.08230575,.08230575,-.09194901,.09194901,-.1076971,.1076971,-.1027782,.1027782,-.1028538,.1028538,-.1013992,.1013992,-.09087585,.09087585,-.1100706,.1100706,-.1094934,.1094934,-.1107879,.1107879,-.1026915,.1026915,-.1017572,.1017572,-.07984776,.07984776,-.09015413,.09015413,-.129987,.129987,-.09164982,.09164982,-.1062788,.1062788,-.1160203,.1160203,-.08858603,.08858603,-.09762964,.09762964,-.1070694,.1070694,-.09549046,.09549046,-.1533034,.1533034,-.08663316,.08663316,-.09303018,.09303018,-.09853582,.09853582,-.09733371,.09733371,-.1048555,.1048555,-.09056041,.09056041,-.07552283,.07552283,-.08780631,.08780631,-.1123953,.1123953,-.1452948,.1452948,-.1156423,.1156423,-.08701142,.08701142,-.09713334,.09713334,-.09970888,.09970888,-.08614129,.08614129,-.07459861,.07459861,-.09253517,.09253517,-.09570092,.09570092,-.09485535,.09485535,-.1148365,.1148365,-.1063193,.1063193,-.09986686,.09986686,-.07523412,.07523412,-.1005881,.1005881,-.08249716,.08249716,-.1055866,.1055866,-.134305,.134305,-.1371056,.1371056,-.09604689,.09604689,-.1224268,.1224268,-.09211478,.09211478,-.1108371,.1108371,-.1100547,.1100547,-.0893897,.0893897,-.08655951,.08655951,-.07085816,.07085816,-.08101028,.08101028,-.08338046,.08338046,-.08309588,.08309588,-.09090584,.09090584,-.08124564,.08124564,-.09367843,.09367843,-.1011747,.1011747,-.09885045,.09885045,-.08944266,.08944266,-.08453859,.08453859,-.08308847,.08308847,-.136728,.136728,-.1295144,.1295144,-.1063965,.1063965,-.07752328,.07752328,-.09681524,.09681524,-.07862345,.07862345,-.08767746,.08767746,-.09198041,.09198041,-.09686489,.09686489]},{count:564,threshold:-4.517456,feature:[{size:5,px:[15,9,8,12,11],py:[3,6,3,0,8],pz:[0,1,0,0,0],nx:[6,14,9,22,23],ny:[8,7,8,17,3],nz:[1,0,0,0,0]},{size:5,px:[12,13,11,14,12],py:[9,4,4,4,5],pz:[0,0,0,0,0],nx:[4,6,10,4,15],ny:[3,8,7,10,9],nz:[1,1,0,1,0]},{size:5,px:[7,5,6,8,8],py:[2,13,2,1,1],pz:[0,0,0,0,-1],nx:[3,0,4,1,0],ny:[4,3,10,3,13],nz:[1,1,1,0,0]},{size:5,px:[11,2,2,11,16],py:[9,4,2,7,11],pz:[0,2,2,0,0],nx:[8,4,1,14,0],ny:[4,4,16,5,13],nz:[1,1,-1,-1,-1]},{size:2,px:[14,14],py:[18,18],pz:[0,-1],nx:[8,13],ny:[10,16],nz:[1,0]},{size:5,px:[15,17,16,8,18],py:[1,2,1,0,2],pz:[0,0,0,1,0],nx:[21,22,22,22,22],ny:[1,5,3,4,2],nz:[0,0,0,0,-1]},{size:2,px:[15,4],py:[23,3],pz:[0,2],nx:[7,3],ny:[10,6],nz:[1,-1]},{size:5,px:[3,6,4,3,11],py:[10,11,8,3,8],pz:[1,0,1,1,0],nx:[3,5,6,3,0],ny:[4,9,9,9,0],nz:[1,-1,-1,-1,-1]},{size:3,px:[11,11,2],py:[11,13,16],pz:[0,0,-1],nx:[10,10,9],ny:[10,11,14],nz:[0,0,0]},{size:2,px:[8,4],py:[12,6],pz:[0,1],nx:[4,5],ny:[11,11],nz:[1,-1]},{size:5,px:[10,11,13,3,12],py:[3,4,3,0,1],pz:[0,0,0,2,0],nx:[14,18,20,19,15],ny:[13,1,15,2,18],nz:[0,0,0,0,0]},{size:5,px:[20,14,10,12,12],py:[12,12,4,10,11],pz:[0,0,1,0,0],nx:[9,2,9,9,9],ny:[4,12,5,9,14],nz:[1,-1,-1,-1,-1]},{size:5,px:[3,3,3,4,2],py:[15,16,14,21,12],pz:[0,0,0,0,0],nx:[0,0,0,0,0],ny:[20,10,5,21,21],nz:[0,1,2,0,-1]},{size:2,px:[18,8],py:[16,7],pz:[0,1],nx:[14,0],ny:[8,10],nz:[0,-1]},{size:4,px:[12,4,16,1],py:[14,3,8,3],pz:[0,-1,-1,-1],nx:[14,10,20,13],ny:[13,5,16,9],nz:[0,1,0,0]},{size:5,px:[3,8,2,3,3],py:[7,2,1,2,4],pz:[1,-1,-1,-1,-1],nx:[1,9,2,1,1],ny:[3,14,9,7,2],nz:[1,0,1,1,1]},{size:5,px:[4,1,3,2,3],py:[2,1,2,4,3],pz:[0,1,0,0,0],nx:[0,0,0,0,0],ny:[3,1,2,0,0],nz:[0,1,0,2,-1]},{size:4,px:[4,8,7,9],py:[6,11,11,10],pz:[1,0,0,0],nx:[3,10,2,20],ny:[4,4,4,8],nz:[1,-1,-1,-1]},{size:2,px:[1,8],py:[3,11],pz:[2,-1],nx:[8,2],ny:[15,5],nz:[0,2]},{size:2,px:[17,0],py:[13,10],pz:[0,-1],nx:[14,14],ny:[11,10],nz:[0,0]},{size:5,px:[22,22,22,5,22],py:[16,18,17,2,15],pz:[0,0,0,2,0],nx:[8,4,15,6,6],ny:[4,2,7,11,11],nz:[1,2,0,1,-1]},{size:5,px:[16,9,8,17,15],py:[12,6,6,22,12],pz:[0,1,1,0,0],nx:[11,23,23,23,22],ny:[11,23,22,21,23],nz:[1,0,0,0,-1]},{size:5,px:[5,2,4,4,9],py:[22,3,15,20,18],pz:[0,2,0,0,0],nx:[9,4,23,7,22],ny:[8,4,22,19,23],nz:[0,-1,-1,-1,-1]},{size:5,px:[8,6,9,7,3],py:[3,3,3,3,1],pz:[0,0,0,0,1],nx:[5,5,4,4,4],ny:[0,1,1,2,0],nz:[0,0,0,0,-1]},{size:2,px:[2,3],py:[3,3],pz:[2,2],nx:[3,6],ny:[4,6],nz:[1,-1]},{size:5,px:[1,1,0,1,0],py:[17,15,6,16,10],pz:[0,0,1,0,0],nx:[4,4,7,4,8],ny:[2,5,9,4,4],nz:[2,2,1,2,-1]},{size:5,px:[12,12,12,13,13],py:[10,9,11,13,13],pz:[0,0,0,0,-1],nx:[4,3,3,5,3],ny:[21,18,17,23,16],nz:[0,0,0,0,0]},{size:4,px:[5,6,5,9],py:[13,7,9,23],pz:[0,0,1,0],nx:[6,15,7,5],ny:[9,20,7,23],nz:[0,-1,-1,-1]},{size:2,px:[6,3],py:[4,2],pz:[1,2],nx:[8,23],ny:[4,2],nz:[1,-1]},{size:2,px:[9,7],py:[18,0],pz:[0,0],nx:[5,7],ny:[8,10],nz:[1,1]},{size:2,px:[4,6],py:[11,16],pz:[1,0],nx:[10,9],ny:[16,7],nz:[0,-1]},{size:4,px:[11,11,11,11],py:[11,10,12,13],pz:[0,0,0,0],nx:[13,13,13,9],ny:[11,9,10,4],nz:[0,0,0,1]},{size:4,px:[12,6,7,6],py:[7,11,8,4],pz:[0,1,1,1],nx:[10,0,19,7],ny:[21,3,12,11],nz:[0,-1,-1,-1]},{size:2,px:[4,4],py:[3,4],pz:[2,2],nx:[9,1],ny:[4,7],nz:[1,-1]},{size:2,px:[19,19],py:[21,20],pz:[0,0],nx:[7,7],ny:[3,13],nz:[1,-1]},{size:5,px:[12,9,13,11,5],py:[0,2,2,0,0],pz:[0,0,0,0,1],nx:[6,4,5,5,5],ny:[1,3,5,2,6],nz:[0,0,1,0,1]},{size:5,px:[4,3,2,5,7],py:[11,3,3,7,17],pz:[1,2,2,0,0],nx:[23,5,11,5,5],ny:[0,4,10,2,6],nz:[0,-1,-1,-1,-1]},{size:2,px:[20,17],py:[12,3],pz:[0,-1],nx:[20,19],ny:[21,23],nz:[0,0]},{size:2,px:[2,1],py:[12,8],pz:[0,0],nx:[2,8],ny:[2,16],nz:[2,-1]},{size:2,px:[16,5],py:[4,5],pz:[0,-1],nx:[7,8],ny:[9,1],nz:[1,1]},{size:2,px:[2,2],py:[0,1],pz:[1,1],nx:[1,8],ny:[5,1],nz:[0,-1]},{size:2,px:[1,1],py:[12,10],pz:[0,1],nx:[2,20],ny:[23,9],nz:[0,-1]},{size:4,px:[11,0,0,2],py:[14,3,9,22],pz:[0,-1,-1,-1],nx:[13,14,7,3],ny:[6,7,11,1],nz:[0,0,0,2]},{size:2,px:[14,0],py:[2,3],pz:[0,-1],nx:[4,4],ny:[4,3],nz:[2,2]},{size:2,px:[23,11],py:[18,11],pz:[0,1],nx:[3,2],ny:[1,21],nz:[1,-1]},{size:2,px:[9,9],py:[17,14],pz:[0,-1],nx:[4,5],ny:[10,8],nz:[1,1]},{size:2,px:[9,18],py:[7,14],pz:[1,0],nx:[18,9],ny:[17,8],nz:[0,-1]},{size:2,px:[2,8],py:[4,22],pz:[2,0],nx:[4,3],ny:[10,1],nz:[1,-1]},{size:2,px:[5,22],py:[4,9],pz:[2,-1],nx:[11,23],ny:[8,14],nz:[1,0]},{size:3,px:[23,5,5],py:[8,2,1],pz:[0,2,2],nx:[10,10,2],ny:[4,4,2],nz:[1,-1,-1]},{size:2,px:[11,11],py:[14,23],pz:[0,-1],nx:[3,11],ny:[4,13],nz:[1,0]},{size:2,px:[3,2],py:[7,0],pz:[1,-1],nx:[4,3],ny:[4,4],nz:[1,1]},{size:2,px:[12,1],py:[19,13],pz:[0,-1],nx:[9,12],ny:[10,18],nz:[1,0]},{size:2,px:[10,10],py:[11,10],pz:[1,1],nx:[4,1],ny:[5,11],nz:[2,-1]},{size:5,px:[9,12,4,8,8],py:[3,5,2,9,8],pz:[1,0,2,1,1],nx:[23,23,23,23,23],ny:[3,4,6,5,5],nz:[0,0,0,0,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,9],ny:[4,6],nz:[1,-1]},{size:5,px:[13,13,13,7,7],py:[11,10,9,6,6],pz:[0,0,0,1,-1],nx:[5,5,15,5,2],ny:[5,15,9,9,1],nz:[0,0,0,1,2]},{size:2,px:[19,7],py:[21,7],pz:[0,1],nx:[14,10],ny:[15,4],nz:[0,-1]},{size:2,px:[5,5],py:[3,4],pz:[2,2],nx:[21,0],ny:[23,5],nz:[0,-1]},{size:2,px:[2,0],py:[0,0],pz:[1,-1],nx:[3,2],ny:[1,2],nz:[0,0]},{size:2,px:[9,0],py:[4,0],pz:[0,-1],nx:[5,12],ny:[0,1],nz:[1,0]},{size:5,px:[14,16,12,15,13],py:[0,1,0,0,0],pz:[0,0,0,0,0],nx:[4,8,8,4,9],ny:[2,3,4,1,3],nz:[2,1,1,2,-1]},{size:3,px:[4,17,2],py:[11,14,1],pz:[1,-1,-1],nx:[9,8,17],ny:[1,4,0],nz:[1,1,0]},{size:2,px:[18,9],py:[17,7],pz:[0,1],nx:[8,4],ny:[4,7],nz:[1,-1]},{size:2,px:[0,0],py:[3,0],pz:[1,2],nx:[10,11],ny:[6,5],nz:[1,-1]},{size:5,px:[21,21,21,21,20],py:[17,16,19,18,21],pz:[0,0,0,0,0],nx:[0,0,0,0,0],ny:[4,9,11,6,6],nz:[1,0,0,1,-1]},{size:2,px:[12,0],py:[7,1],pz:[0,-1],nx:[8,11],ny:[4,17],nz:[1,0]},{size:4,px:[13,0,0,0],py:[15,0,0,0],pz:[0,-1,-1,-1],nx:[3,7,4,6],ny:[2,7,5,9],nz:[2,1,2,1]},{size:2,px:[2,9],py:[3,12],pz:[2,0],nx:[2,0],ny:[4,0],nz:[1,-1]},{size:2,px:[10,3],py:[6,1],pz:[1,-1],nx:[20,21],ny:[19,14],nz:[0,0]},{size:5,px:[5,22,22,11,22],py:[1,4,3,3,2],pz:[2,0,0,1,-1],nx:[7,13,14,8,15],ny:[3,6,6,3,7],nz:[1,0,0,1,0]},{size:2,px:[12,19],py:[5,15],pz:[0,-1],nx:[16,4],ny:[8,2],nz:[0,2]},{size:2,px:[1,0],py:[11,9],pz:[1,1],nx:[5,0],ny:[3,3],nz:[1,-1]},{size:4,px:[8,3,4,2],py:[6,7,5,3],pz:[1,-1,-1,-1],nx:[13,14,11,11],ny:[11,13,3,5],nz:[0,0,1,1]},{size:2,px:[11,11],py:[5,6],pz:[0,0],nx:[8,4],ny:[4,2],nz:[1,-1]},{size:2,px:[5,9],py:[6,17],pz:[1,0],nx:[9,4],ny:[15,11],nz:[0,-1]},{size:3,px:[6,3,6],py:[6,3,5],pz:[1,2,1],nx:[11,10,4],ny:[8,11,5],nz:[0,0,-1]},{size:2,px:[8,16],py:[0,1],pz:[1,-1],nx:[19,17],ny:[1,0],nz:[0,0]},{size:2,px:[21,20],py:[4,1],pz:[0,0],nx:[11,5],ny:[0,0],nz:[1,2]},{size:2,px:[8,4],py:[6,3],pz:[1,2],nx:[8,9],ny:[4,10],nz:[1,-1]},{size:2,px:[10,1],py:[0,0],pz:[1,-1],nx:[13,12],ny:[6,5],nz:[0,0]},{size:2,px:[5,4],py:[3,11],pz:[1,-1],nx:[3,17],ny:[1,3],nz:[2,0]},{size:2,px:[12,13],py:[4,4],pz:[0,0],nx:[3,3],ny:[1,1],nz:[2,-1]},{size:2,px:[3,18],py:[2,7],pz:[2,0],nx:[8,1],ny:[4,4],nz:[1,-1]},{size:2,px:[16,6],py:[8,2],pz:[0,1],nx:[8,9],ny:[4,19],nz:[1,-1]},{size:3,px:[12,3,14],py:[13,3,15],pz:[0,-1,-1],nx:[0,1,0],ny:[16,18,15],nz:[0,0,0]},{size:2,px:[3,1],py:[3,4],pz:[2,-1],nx:[7,14],ny:[10,14],nz:[1,0]},{size:2,px:[9,16],py:[6,10],pz:[1,0],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[7,11],py:[4,4],pz:[0,0],nx:[7,23],ny:[3,11],nz:[0,-1]},{size:5,px:[2,4,3,4,4],py:[1,2,0,1,1],pz:[1,0,1,0,-1],nx:[11,9,4,9,5],ny:[6,5,3,6,3],nz:[0,0,1,0,1]},{size:2,px:[6,0],py:[14,1],pz:[0,-1],nx:[2,5],ny:[2,9],nz:[2,1]},{size:2,px:[6,7],py:[7,12],pz:[0,0],nx:[3,22],ny:[3,16],nz:[1,-1]},{size:2,px:[10,4],py:[1,1],pz:[0,1],nx:[2,6],ny:[2,21],nz:[2,-1]},{size:2,px:[13,1],py:[11,6],pz:[0,-1],nx:[12,6],ny:[5,2],nz:[0,1]},{size:5,px:[10,5,11,10,10],py:[4,3,4,6,5],pz:[0,1,0,0,0],nx:[4,7,13,8,4],ny:[2,8,9,4,4],nz:[2,1,0,1,-1]},{size:4,px:[7,8,7,8],py:[11,3,4,7],pz:[1,1,1,1],nx:[0,7,3,8],ny:[0,12,2,4],nz:[0,-1,-1,-1]},{size:2,px:[0,0],py:[4,7],pz:[2,1],nx:[10,1],ny:[7,0],nz:[0,-1]},{size:2,px:[11,5],py:[19,5],pz:[0,-1],nx:[11,5],ny:[17,10],nz:[0,1]},{size:2,px:[11,12],py:[4,4],pz:[0,0],nx:[7,5],ny:[8,3],nz:[0,-1]},{size:3,px:[4,8,4],py:[2,9,4],pz:[2,1,2],nx:[3,19,3],ny:[1,16,5],nz:[1,-1,-1]},{size:2,px:[3,7],py:[0,1],pz:[1,0],nx:[2,3],ny:[15,2],nz:[0,-1]},{size:2,px:[0,4],py:[2,0],pz:[2,-1],nx:[9,16],ny:[5,11],nz:[1,0]},{size:2,px:[14,15],py:[23,16],pz:[0,0],nx:[13,3],ny:[15,1],nz:[0,-1]},{size:2,px:[4,3],py:[0,1],pz:[1,-1],nx:[3,7],ny:[0,0],nz:[1,0]},{size:2,px:[7,6],py:[12,12],pz:[0,0],nx:[4,8],ny:[5,4],nz:[1,-1]},{size:5,px:[4,1,2,4,5],py:[1,0,0,0,6],pz:[0,2,1,0,1],nx:[4,8,7,8,6],ny:[4,10,11,4,4],nz:[1,0,0,1,1]},{size:2,px:[12,12],py:[15,8],pz:[0,-1],nx:[7,15],ny:[16,14],nz:[0,0]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[4,6],ny:[2,8],nz:[2,-1]},{size:2,px:[14,4],py:[19,23],pz:[0,-1],nx:[7,14],ny:[11,18],nz:[1,0]},{size:2,px:[4,2],py:[7,4],pz:[1,2],nx:[2,22],ny:[5,19],nz:[2,-1]},{size:2,px:[8,15],py:[7,17],pz:[1,0],nx:[14,4],ny:[15,5],nz:[0,2]},{size:2,px:[10,11],py:[9,8],pz:[1,-1],nx:[23,5],ny:[19,4],nz:[0,2]},{size:2,px:[11,1],py:[7,9],pz:[0,-1],nx:[4,4],ny:[4,5],nz:[1,1]},{size:2,px:[14,7],py:[6,9],pz:[0,0],nx:[4,11],ny:[4,0],nz:[1,-1]},{size:2,px:[5,4],py:[0,5],pz:[0,-1],nx:[2,2],ny:[0,4],nz:[1,0]},{size:2,px:[10,22],py:[5,20],pz:[0,-1],nx:[3,4],ny:[1,2],nz:[2,2]},{size:3,px:[23,11,11],py:[17,9,8],pz:[0,1,1],nx:[13,8,8],ny:[5,3,3],nz:[0,1,-1]},{size:2,px:[18,9],py:[0,21],pz:[0,-1],nx:[10,10],ny:[2,1],nz:[1,1]},{size:5,px:[11,10,11,11,11],py:[11,13,10,12,12],pz:[0,0,0,0,-1],nx:[11,13,12,3,8],ny:[5,5,5,1,10],nz:[0,0,0,2,0]},{size:2,px:[7,8],py:[11,11],pz:[0,0],nx:[9,16],ny:[9,19],nz:[0,-1]},{size:2,px:[9,18],py:[23,7],pz:[0,-1],nx:[21,21],ny:[7,13],nz:[0,0]},{size:2,px:[8,8],py:[7,8],pz:[1,1],nx:[5,21],ny:[9,13],nz:[1,-1]},{size:2,px:[17,8],py:[22,8],pz:[0,-1],nx:[4,8],ny:[5,10],nz:[2,1]},{size:5,px:[2,5,8,8,4],py:[3,9,13,23,7],pz:[2,1,0,0,1],nx:[9,17,18,19,20],ny:[0,0,0,2,3],nz:[1,0,0,0,0]},{size:3,px:[16,15,2],py:[3,3,13],pz:[0,0,-1],nx:[4,8,4],ny:[3,6,2],nz:[2,1,2]},{size:2,px:[4,7],py:[3,7],pz:[2,1],nx:[15,1],ny:[15,0],nz:[0,-1]},{size:2,px:[3,6],py:[2,3],pz:[2,1],nx:[3,18],ny:[4,2],nz:[1,-1]},{size:2,px:[2,4],py:[2,4],pz:[2,1],nx:[3,0],ny:[5,0],nz:[1,-1]},{size:2,px:[10,0],py:[10,0],pz:[0,-1],nx:[9,4],ny:[2,0],nz:[1,2]},{size:2,px:[2,0],py:[8,3],pz:[1,-1],nx:[4,8],ny:[4,14],nz:[1,0]},{size:2,px:[13,18],py:[14,14],pz:[0,-1],nx:[1,1],ny:[15,13],nz:[0,0]},{size:3,px:[3,2,2],py:[17,10,15],pz:[0,1,0],nx:[13,2,7],ny:[19,11,0],nz:[0,-1,-1]},{size:2,px:[4,17],py:[0,2],pz:[2,0],nx:[8,5],ny:[11,3],nz:[1,-1]},{size:2,px:[15,21],py:[5,4],pz:[0,-1],nx:[15,10],ny:[3,0],nz:[0,1]},{size:2,px:[7,3],py:[13,8],pz:[0,-1],nx:[8,4],ny:[4,4],nz:[1,1]},{size:2,px:[7,22],py:[3,4],pz:[1,-1],nx:[4,2],ny:[2,3],nz:[1,1]},{size:4,px:[6,2,6,5],py:[21,10,22,20],pz:[0,1,0,0],nx:[2,3,4,4],ny:[11,21,23,23],nz:[1,0,0,-1]},{size:2,px:[7,2],py:[6,8],pz:[1,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:4,px:[11,11,5,11],py:[6,5,2,4],pz:[1,1,2,1],nx:[13,7,8,3],ny:[7,3,5,2],nz:[0,1,-1,-1]},{size:2,px:[3,3],py:[7,8],pz:[1,0],nx:[3,11],ny:[4,2],nz:[1,-1]},{size:3,px:[16,1,5],py:[3,3,11],pz:[0,-1,-1],nx:[16,4,8],ny:[2,0,1],nz:[0,2,1]},{size:2,px:[10,0],py:[8,1],pz:[0,-1],nx:[19,18],ny:[20,23],nz:[0,0]},{size:2,px:[17,4],py:[10,4],pz:[0,-1],nx:[4,14],ny:[2,9],nz:[2,0]},{size:5,px:[11,12,9,10,11],py:[2,3,2,2,3],pz:[0,0,0,0,0],nx:[6,4,2,2,2],ny:[18,9,3,2,2],nz:[0,1,2,2,-1]},{size:2,px:[0,1],py:[6,16],pz:[1,0],nx:[8,16],ny:[5,16],nz:[0,-1]},{size:2,px:[3,3],py:[2,3],pz:[2,2],nx:[8,17],ny:[4,9],nz:[1,-1]},{size:3,px:[2,5,2],py:[5,6,4],pz:[1,-1,-1],nx:[0,0,0],ny:[3,5,6],nz:[2,1,1]},{size:5,px:[0,0,0,0,0],py:[6,15,16,13,14],pz:[1,0,0,0,0],nx:[4,5,8,6,8],ny:[4,16,8,15,4],nz:[1,0,0,0,-1]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,5],ny:[4,16],nz:[1,-1]},{size:5,px:[21,19,21,21,21],py:[17,23,18,19,20],pz:[0,0,0,0,0],nx:[5,2,3,6,6],ny:[12,5,5,12,12],nz:[0,1,1,0,-1]},{size:2,px:[5,2],py:[11,1],pz:[1,-1],nx:[5,11],ny:[3,5],nz:[2,1]},{size:2,px:[10,5],py:[5,3],pz:[0,1],nx:[6,15],ny:[11,5],nz:[1,-1]},{size:2,px:[6,2],py:[4,2],pz:[1,-1],nx:[4,3],ny:[4,2],nz:[1,2]},{size:2,px:[10,6],py:[20,6],pz:[0,-1],nx:[5,10],ny:[11,17],nz:[1,0]},{size:4,px:[8,4,7,11],py:[7,4,5,8],pz:[1,2,1,0],nx:[13,10,5,21],ny:[9,3,5,4],nz:[0,-1,-1,-1]},{size:2,px:[7,13],py:[10,7],pz:[0,0],nx:[10,8],ny:[9,18],nz:[0,-1]},{size:2,px:[3,3],py:[1,0],pz:[2,2],nx:[8,5],ny:[4,2],nz:[1,-1]},{size:5,px:[5,2,5,8,4],py:[8,4,14,23,7],pz:[1,2,0,0,1],nx:[18,4,16,17,17],ny:[1,0,0,1,1],nz:[0,2,0,0,-1]},{size:2,px:[6,2],py:[2,4],pz:[1,-1],nx:[8,8],ny:[4,3],nz:[1,1]},{size:2,px:[6,1],py:[8,15],pz:[0,-1],nx:[8,3],ny:[4,4],nz:[1,1]},{size:2,px:[10,1],py:[7,2],pz:[1,-1],nx:[6,6],ny:[9,4],nz:[1,1]},{size:2,px:[4,1],py:[6,2],pz:[1,-1],nx:[1,10],ny:[16,12],nz:[0,0]},{size:2,px:[8,4],py:[7,2],pz:[1,-1],nx:[8,9],ny:[8,10],nz:[1,1]},{size:5,px:[4,8,7,6,6],py:[0,0,0,1,1],pz:[1,0,0,0,-1],nx:[11,5,8,4,10],ny:[5,3,4,4,5],nz:[0,1,1,1,0]},{size:2,px:[5,6],py:[8,5],pz:[0,0],nx:[6,6],ny:[8,3],nz:[0,-1]},{size:2,px:[18,5],py:[19,5],pz:[0,-1],nx:[4,21],ny:[5,19],nz:[2,0]},{size:2,px:[9,5],py:[13,6],pz:[0,1],nx:[2,2],ny:[4,2],nz:[1,-1]},{size:2,px:[10,4],py:[17,6],pz:[0,1],nx:[10,2],ny:[15,4],nz:[0,-1]},{size:3,px:[13,13,19],py:[11,12,8],pz:[0,0,-1],nx:[12,3,8],ny:[4,1,4],nz:[0,2,1]},{size:3,px:[11,7,4],py:[5,2,1],pz:[0,-1,-1],nx:[9,2,4],ny:[11,3,6],nz:[0,2,1]},{size:2,px:[10,7],py:[15,2],pz:[0,-1],nx:[4,4],ny:[0,1],nz:[2,2]},{size:5,px:[8,9,16,18,18],py:[0,1,1,1,1],pz:[1,1,0,0,-1],nx:[5,5,6,4,4],ny:[21,20,23,17,18],nz:[0,0,0,0,0]},{size:2,px:[6,7],py:[1,1],pz:[1,1],nx:[20,19],ny:[2,1],nz:[0,0]},{size:2,px:[2,2],py:[10,11],pz:[1,1],nx:[3,3],ny:[10,10],nz:[1,-1]},{size:2,px:[9,5],py:[23,1],pz:[0,-1],nx:[4,3],ny:[10,4],nz:[1,1]},{size:2,px:[1,10],py:[4,7],pz:[2,-1],nx:[4,3],ny:[23,21],nz:[0,0]},{size:2,px:[10,21],py:[11,18],pz:[1,0],nx:[10,4],ny:[18,1],nz:[0,-1]},{size:2,px:[11,23],py:[11,15],pz:[0,-1],nx:[11,11],ny:[7,9],nz:[1,1]},{size:2,px:[10,1],py:[7,7],pz:[1,-1],nx:[15,4],ny:[14,4],nz:[0,2]},{size:2,px:[1,2],py:[9,20],pz:[1,0],nx:[21,3],ny:[12,20],nz:[0,-1]},{size:2,px:[7,4],py:[0,0],pz:[1,2],nx:[4,2],ny:[0,19],nz:[0,-1]},{size:2,px:[2,4],py:[3,6],pz:[2,1],nx:[3,0],ny:[4,0],nz:[1,-1]},{size:2,px:[5,1],py:[5,0],pz:[1,-1],nx:[12,10],ny:[11,4],nz:[0,1]},{size:2,px:[11,12],py:[11,14],pz:[1,-1],nx:[18,16],ny:[21,15],nz:[0,0]},{size:2,px:[3,18],py:[1,5],pz:[2,-1],nx:[4,8],ny:[4,4],nz:[1,1]},{size:2,px:[9,10],py:[18,7],pz:[0,-1],nx:[3,6],ny:[0,0],nz:[2,1]},{size:2,px:[19,2],py:[1,4],pz:[0,-1],nx:[22,22],ny:[13,15],nz:[0,0]},{size:3,px:[13,15,20],py:[14,21,10],pz:[0,-1,-1],nx:[15,7,7],ny:[13,6,8],nz:[0,1,1]},{size:2,px:[9,9],py:[6,7],pz:[1,1],nx:[8,7],ny:[4,8],nz:[1,-1]},{size:2,px:[0,0],py:[5,3],pz:[1,2],nx:[5,10],ny:[2,9],nz:[1,-1]},{size:2,px:[14,11],py:[7,16],pz:[0,-1],nx:[1,0],ny:[17,4],nz:[0,2]},{size:2,px:[14,18],py:[17,18],pz:[0,-1],nx:[8,14],ny:[10,16],nz:[1,0]},{size:2,px:[6,11],py:[13,11],pz:[0,-1],nx:[8,9],ny:[12,9],nz:[0,0]},{size:2,px:[8,9],py:[2,2],pz:[0,0],nx:[3,3],ny:[2,2],nz:[2,-1]},{size:3,px:[21,21,21],py:[14,16,15],pz:[0,0,0],nx:[14,12,0],ny:[5,12,6],nz:[0,-1,-1]},{size:2,px:[4,21],py:[6,15],pz:[1,-1],nx:[5,1],ny:[6,5],nz:[1,1]},{size:2,px:[6,3],py:[2,1],pz:[1,2],nx:[8,0],ny:[4,20],nz:[1,-1]},{size:2,px:[13,2],py:[9,1],pz:[0,-1],nx:[3,5],ny:[1,2],nz:[2,1]},{size:2,px:[16,1],py:[5,4],pz:[0,-1],nx:[17,8],ny:[3,2],nz:[0,1]},{size:2,px:[9,2],py:[7,1],pz:[1,-1],nx:[20,20],ny:[17,16],nz:[0,0]},{size:2,px:[5,7],py:[3,6],pz:[2,-1],nx:[9,9],ny:[6,5],nz:[1,1]},{size:2,px:[11,17],py:[4,1],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[15,2],py:[11,0],pz:[0,-1],nx:[5,14],ny:[1,12],nz:[2,0]},{size:2,px:[22,19],py:[3,0],pz:[0,-1],nx:[9,4],ny:[6,4],nz:[1,1]},{size:2,px:[1,22],py:[3,21],pz:[0,-1],nx:[0,0],ny:[1,0],nz:[2,2]},{size:2,px:[11,11],py:[11,12],pz:[0,0],nx:[1,2],ny:[1,4],nz:[2,-1]},{size:2,px:[18,3],py:[8,1],pz:[0,2],nx:[13,1],ny:[8,5],nz:[0,-1]},{size:2,px:[13,6],py:[21,3],pz:[0,-1],nx:[11,11],ny:[6,5],nz:[1,1]},{size:2,px:[15,14],py:[4,4],pz:[0,0],nx:[17,1],ny:[12,5],nz:[0,-1]},{size:2,px:[11,3],py:[12,1],pz:[0,-1],nx:[1,2],ny:[2,4],nz:[2,1]},{size:2,px:[3,2],py:[7,3],pz:[0,1],nx:[16,2],ny:[3,5],nz:[0,-1]},{size:2,px:[10,5],py:[7,20],pz:[1,-1],nx:[9,8],ny:[4,6],nz:[1,1]},{size:2,px:[19,2],py:[10,2],pz:[0,-1],nx:[9,4],ny:[3,1],nz:[1,2]},{size:2,px:[14,9],py:[0,23],pz:[0,-1],nx:[4,4],ny:[3,2],nz:[2,2]},{size:2,px:[6,9],py:[4,10],pz:[1,0],nx:[10,9],ny:[9,0],nz:[0,-1]},{size:4,px:[6,9,10,8],py:[20,23,18,23],pz:[0,0,0,0],nx:[9,22,1,2],ny:[21,14,2,5],nz:[0,-1,-1,-1]},{size:2,px:[17,18],py:[13,6],pz:[0,-1],nx:[6,7],ny:[9,11],nz:[1,1]},{size:5,px:[18,19,20,19,20],py:[15,19,16,20,17],pz:[0,0,0,0,0],nx:[11,22,23,23,23],ny:[10,22,20,19,19],nz:[1,0,0,0,-1]},{size:2,px:[10,10],py:[1,0],pz:[1,1],nx:[21,11],ny:[0,4],nz:[0,-1]},{size:2,px:[11,0],py:[9,3],pz:[0,-1],nx:[9,4],ny:[2,1],nz:[1,2]},{size:2,px:[14,23],py:[2,18],pz:[0,-1],nx:[15,18],ny:[1,2],nz:[0,0]},{size:2,px:[9,3],py:[0,0],pz:[1,-1],nx:[3,12],ny:[1,5],nz:[2,0]},{size:2,px:[8,8],py:[7,8],pz:[1,1],nx:[8,8],ny:[4,4],nz:[1,-1]},{size:2,px:[1,0],py:[1,3],pz:[2,-1],nx:[7,19],ny:[9,15],nz:[1,0]},{size:3,px:[16,6,4],py:[21,5,4],pz:[0,-1,-1],nx:[4,19,8],ny:[5,21,11],nz:[2,0,1]},{size:2,px:[5,5],py:[6,6],pz:[1,-1],nx:[10,10],ny:[10,12],nz:[0,0]},{size:2,px:[6,11],py:[2,5],pz:[1,0],nx:[3,4],ny:[4,7],nz:[1,-1]},{size:3,px:[8,6,2],py:[4,10,2],pz:[1,1,2],nx:[2,18,5],ny:[0,11,5],nz:[0,-1,-1]},{size:2,px:[11,7],py:[9,7],pz:[0,-1],nx:[12,3],ny:[9,5],nz:[0,1]},{size:2,px:[14,13],py:[20,20],pz:[0,0],nx:[13,3],ny:[21,5],nz:[0,-1]},{size:2,px:[13,7],py:[5,3],pz:[0,-1],nx:[3,4],ny:[1,4],nz:[2,1]},{size:2,px:[6,2],py:[21,5],pz:[0,-1],nx:[2,3],ny:[5,10],nz:[2,1]},{size:2,px:[23,5],py:[6,0],pz:[0,2],nx:[21,4],ny:[6,1],nz:[0,-1]},{size:2,px:[9,9],py:[7,6],pz:[1,1],nx:[8,2],ny:[4,2],nz:[1,-1]},{size:2,px:[22,11],py:[20,9],pz:[0,1],nx:[8,8],ny:[10,10],nz:[1,-1]},{size:2,px:[8,16],py:[21,12],pz:[0,-1],nx:[2,7],ny:[5,23],nz:[2,0]},{size:5,px:[0,1,1,1,1],py:[3,1,9,4,7],pz:[2,2,1,1,1],nx:[11,22,22,23,23],ny:[10,21,22,19,20],nz:[1,0,0,0,-1]},{size:2,px:[17,5],py:[12,4],pz:[0,-1],nx:[8,8],ny:[4,5],nz:[1,1]},{size:2,px:[16,4],py:[7,10],pz:[0,-1],nx:[9,15],ny:[4,6],nz:[1,0]},{size:2,px:[3,6],py:[3,5],pz:[2,1],nx:[11,12],ny:[11,23],nz:[0,-1]},{size:2,px:[5,2],py:[14,7],pz:[0,1],nx:[4,17],ny:[18,16],nz:[0,-1]},{size:3,px:[10,1,1],py:[12,5,4],pz:[0,-1,-1],nx:[7,11,5],ny:[1,2,1],nz:[1,0,1]},{size:2,px:[7,6],py:[3,9],pz:[0,-1],nx:[2,2],ny:[2,3],nz:[2,2]},{size:2,px:[13,6],py:[22,9],pz:[0,-1],nx:[8,4],ny:[4,3],nz:[1,2]},{size:5,px:[12,9,10,11,11],py:[0,0,0,0,0],pz:[0,0,0,0,-1],nx:[16,5,10,4,8],ny:[10,3,6,4,4],nz:[0,1,0,1,1]},{size:2,px:[18,19],py:[23,20],pz:[0,0],nx:[8,5],ny:[11,3],nz:[1,-1]},{size:2,px:[8,3],py:[7,2],pz:[1,2],nx:[8,4],ny:[4,3],nz:[1,-1]},{size:5,px:[8,14,8,7,4],py:[6,12,8,6,3],pz:[1,0,1,1,2],nx:[2,6,6,7,7],ny:[0,1,2,0,0],nz:[2,0,0,0,-1]},{size:3,px:[1,2,3],py:[15,18,21],pz:[0,0,0],nx:[19,5,18],ny:[23,5,8],nz:[0,-1,-1]},{size:2,px:[6,2],py:[6,1],pz:[1,-1],nx:[0,0],ny:[12,4],nz:[0,1]},{size:2,px:[3,5],py:[5,11],pz:[2,1],nx:[14,5],ny:[19,5],nz:[0,-1]},{size:2,px:[10,4],py:[4,4],pz:[1,-1],nx:[11,5],ny:[4,2],nz:[1,2]},{size:2,px:[18,4],py:[6,4],pz:[0,-1],nx:[4,8],ny:[5,4],nz:[1,1]},{size:2,px:[6,12],py:[2,4],pz:[1,0],nx:[8,8],ny:[3,4],nz:[1,-1]},{size:2,px:[1,0],py:[1,1],pz:[1,2],nx:[7,2],ny:[4,7],nz:[0,-1]},{size:2,px:[8,0],py:[20,0],pz:[0,-1],nx:[4,5],ny:[10,11],nz:[1,1]},{size:2,px:[6,14],py:[5,2],pz:[1,-1],nx:[0,0],ny:[0,2],nz:[1,0]},{size:2,px:[5,15],py:[4,7],pz:[1,-1],nx:[4,7],ny:[1,2],nz:[2,1]},{size:2,px:[7,5],py:[2,1],pz:[0,1],nx:[3,1],ny:[4,1],nz:[1,-1]},{size:2,px:[8,9],py:[4,2],pz:[0,-1],nx:[11,9],ny:[1,3],nz:[0,0]},{size:2,px:[6,3],py:[2,4],pz:[1,-1],nx:[4,8],ny:[4,4],nz:[1,1]},{size:2,px:[3,7],py:[3,7],pz:[2,1],nx:[6,8],ny:[14,4],nz:[0,-1]},{size:2,px:[3,0],py:[21,3],pz:[0,2],nx:[20,8],ny:[10,4],nz:[0,-1]},{size:2,px:[6,3],py:[5,8],pz:[0,-1],nx:[4,3],ny:[4,2],nz:[0,1]},{size:2,px:[3,6],py:[7,13],pz:[1,0],nx:[3,2],ny:[4,3],nz:[1,-1]},{size:2,px:[16,10],py:[9,7],pz:[0,1],nx:[7,9],ny:[3,10],nz:[1,-1]},{size:2,px:[13,10],py:[6,7],pz:[0,-1],nx:[8,17],ny:[4,12],nz:[1,0]},{size:2,px:[5,10],py:[4,10],pz:[2,1],nx:[5,4],ny:[9,2],nz:[1,-1]},{size:4,px:[15,3,5,0],py:[12,4,2,3],pz:[0,-1,-1,-1],nx:[13,7,5,7],ny:[12,6,0,7],nz:[0,1,2,1]},{size:4,px:[2,3,16,17],py:[3,4,6,6],pz:[2,1,0,0],nx:[16,16,8,16],ny:[8,3,10,13],nz:[0,-1,-1,-1]},{size:2,px:[16,8],py:[1,4],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[9,14],py:[6,2],pz:[1,-1],nx:[8,8],ny:[6,4],nz:[1,1]},{size:2,px:[8,4],py:[10,4],pz:[1,2],nx:[10,0],ny:[5,7],nz:[1,-1]},{size:2,px:[9,10],py:[4,4],pz:[0,0],nx:[9,7],ny:[3,5],nz:[0,-1]},{size:5,px:[11,10,13,6,12],py:[2,2,2,1,2],pz:[0,0,0,1,0],nx:[4,18,18,13,13],ny:[2,18,19,7,7],nz:[2,0,0,0,-1]},{size:4,px:[13,13,13,2],py:[13,12,11,3],pz:[0,0,0,-1],nx:[4,6,8,11],ny:[2,2,4,4],nz:[2,1,1,0]},{size:2,px:[4,7],py:[6,13],pz:[1,0],nx:[8,10],ny:[4,22],nz:[1,-1]},{size:2,px:[0,7],py:[4,17],pz:[1,-1],nx:[0,1],ny:[5,21],nz:[2,0]},{size:2,px:[12,13],py:[22,22],pz:[0,0],nx:[2,2],ny:[13,13],nz:[0,-1]},{size:3,px:[4,4,3],py:[22,23,19],pz:[0,0,0],nx:[8,12,3],ny:[22,15,2],nz:[0,-1,-1]},{size:2,px:[10,12],py:[3,13],pz:[0,-1],nx:[15,2],ny:[10,2],nz:[0,2]},{size:2,px:[1,1],py:[3,3],pz:[2,-1],nx:[8,4],ny:[0,0],nz:[1,2]},{size:2,px:[6,12],py:[6,18],pz:[1,0],nx:[12,19],ny:[17,16],nz:[0,-1]},{size:2,px:[10,5],py:[2,1],pz:[0,1],nx:[5,4],ny:[4,17],nz:[0,-1]},{size:3,px:[3,12,11],py:[5,23,23],pz:[2,0,0],nx:[12,4,4],ny:[21,17,1],nz:[0,-1,-1]},{size:2,px:[12,0],py:[21,5],pz:[0,-1],nx:[0,0],ny:[7,9],nz:[1,1]},{size:2,px:[17,17],py:[12,11],pz:[0,0],nx:[8,11],ny:[4,11],nz:[1,-1]},{size:2,px:[11,0],py:[22,1],pz:[0,-1],nx:[4,6],ny:[1,0],nz:[1,1]},{size:2,px:[11,11],py:[9,5],pz:[1,1],nx:[23,11],ny:[23,20],nz:[0,-1]},{size:5,px:[4,12,11,9,8],py:[0,1,1,0,1],pz:[1,0,0,0,0],nx:[4,17,8,7,7],ny:[2,13,4,4,4],nz:[2,0,1,1,-1]},{size:2,px:[11,13],py:[12,12],pz:[0,-1],nx:[1,1],ny:[4,2],nz:[1,2]},{size:2,px:[23,4],py:[23,2],pz:[0,-1],nx:[5,2],ny:[23,6],nz:[0,1]},{size:3,px:[8,16,0],py:[5,15,6],pz:[1,-1,-1],nx:[23,23,11],ny:[18,17,8],nz:[0,0,1]},{size:2,px:[1,16],py:[4,15],pz:[2,-1],nx:[2,2],ny:[3,2],nz:[2,2]},{size:2,px:[3,8],py:[7,9],pz:[1,-1],nx:[4,2],ny:[10,5],nz:[1,2]},{size:3,px:[22,1,9],py:[23,2,3],pz:[0,-1,-1],nx:[2,2,5],ny:[5,4,19],nz:[2,2,0]},{size:2,px:[2,20],py:[5,15],pz:[1,-1],nx:[2,1],ny:[1,2],nz:[2,2]},{size:2,px:[4,8],py:[1,19],pz:[1,-1],nx:[2,2],ny:[5,4],nz:[2,2]},{size:2,px:[9,10],py:[21,0],pz:[0,-1],nx:[6,5],ny:[1,1],nz:[1,1]},{size:2,px:[4,8],py:[3,6],pz:[2,1],nx:[9,2],ny:[4,1],nz:[1,-1]},{size:3,px:[17,3,10],py:[8,0,2],pz:[0,2,0],nx:[13,2,6],ny:[15,5,1],nz:[0,-1,-1]},{size:2,px:[9,6],py:[20,21],pz:[0,-1],nx:[4,2],ny:[10,5],nz:[1,2]},{size:2,px:[3,7],py:[0,1],pz:[2,1],nx:[7,20],ny:[1,19],nz:[0,-1]},{size:2,px:[4,5],py:[0,1],pz:[1,0],nx:[3,2],ny:[4,2],nz:[0,-1]},{size:2,px:[2,7],py:[4,19],pz:[2,0],nx:[5,2],ny:[10,2],nz:[1,-1]},{size:5,px:[3,3,4,7,7],py:[1,0,0,0,1],pz:[1,1,1,0,0],nx:[5,4,10,8,8],ny:[3,3,5,4,4],nz:[1,1,0,1,-1]},{size:2,px:[1,5],py:[0,3],pz:[1,-1],nx:[1,0],ny:[0,1],nz:[0,1]},{size:2,px:[10,0],py:[5,5],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[0,9],py:[0,4],pz:[2,-1],nx:[13,10],ny:[0,0],nz:[0,0]},{size:2,px:[13,4],py:[14,5],pz:[0,-1],nx:[4,2],ny:[0,0],nz:[0,1]},{size:2,px:[17,4],py:[13,3],pz:[0,-1],nx:[4,2],ny:[4,2],nz:[1,2]},{size:2,px:[1,0],py:[6,2],pz:[1,-1],nx:[1,6],ny:[2,12],nz:[2,0]},{size:2,px:[12,4],py:[6,0],pz:[0,-1],nx:[3,3],ny:[8,9],nz:[1,1]},{size:2,px:[1,5],py:[1,5],pz:[1,-1],nx:[17,17],ny:[13,7],nz:[0,0]},{size:2,px:[7,3],py:[12,6],pz:[0,1],nx:[3,4],ny:[4,11],nz:[1,-1]},{size:2,px:[6,17],py:[2,8],pz:[1,0],nx:[3,3],ny:[1,2],nz:[1,-1]},{size:3,px:[13,6,6],py:[22,11,10],pz:[0,1,1],nx:[13,12,11],ny:[20,20,20],nz:[0,0,0]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,12],ny:[4,20],nz:[1,-1]},{size:2,px:[5,2],py:[1,1],pz:[1,-1],nx:[13,6],ny:[0,0],nz:[0,1]},{size:2,px:[2,8],py:[3,9],pz:[2,0],nx:[8,16],ny:[5,17],nz:[0,-1]},{size:2,px:[16,15],py:[1,1],pz:[0,0],nx:[7,11],ny:[8,0],nz:[1,-1]},{size:2,px:[11,18],py:[21,23],pz:[0,-1],nx:[1,1],ny:[4,3],nz:[1,2]},{size:2,px:[1,5],py:[0,2],pz:[1,-1],nx:[15,11],ny:[8,7],nz:[0,0]},{size:2,px:[5,4],py:[7,8],pz:[1,-1],nx:[9,10],ny:[13,11],nz:[0,0]},{size:2,px:[7,4],py:[10,4],pz:[1,2],nx:[22,4],ny:[0,2],nz:[0,-1]},{size:2,px:[11,3],py:[3,1],pz:[0,2],nx:[8,0],ny:[4,0],nz:[1,-1]},{size:2,px:[5,21],py:[11,22],pz:[0,-1],nx:[10,11],ny:[11,9],nz:[0,0]},{size:2,px:[5,5],py:[0,1],pz:[2,2],nx:[2,21],ny:[6,14],nz:[0,-1]},{size:3,px:[10,10,1],py:[11,0,5],pz:[0,-1,-1],nx:[6,12,5],ny:[2,5,2],nz:[1,0,1]},{size:2,px:[9,10],py:[5,6],pz:[0,0],nx:[12,19],ny:[23,5],nz:[0,-1]},{size:2,px:[11,5],py:[9,6],pz:[0,1],nx:[21,0],ny:[23,0],nz:[0,-1]},{size:2,px:[13,12],py:[19,15],pz:[0,0],nx:[13,0],ny:[17,0],nz:[0,-1]},{size:2,px:[14,0],py:[17,3],pz:[0,-1],nx:[7,16],ny:[8,19],nz:[1,0]},{size:2,px:[3,6],py:[2,4],pz:[2,1],nx:[8,1],ny:[4,4],nz:[1,-1]},{size:2,px:[13,10],py:[23,20],pz:[0,-1],nx:[4,7],ny:[5,10],nz:[2,1]},{size:2,px:[16,9],py:[22,5],pz:[0,-1],nx:[4,2],ny:[10,3],nz:[1,2]},{size:4,px:[3,1,1,5],py:[4,2,1,2],pz:[0,2,2,1],nx:[13,5,8,0],ny:[22,2,9,2],nz:[0,-1,-1,-1]},{size:2,px:[9,9],py:[0,0],pz:[1,-1],nx:[19,20],ny:[1,2],nz:[0,0]},{size:2,px:[7,22],py:[6,8],pz:[1,0],nx:[4,4],ny:[2,4],nz:[2,-1]},{size:2,px:[3,6],py:[4,4],pz:[2,1],nx:[10,20],ny:[10,6],nz:[0,-1]},{size:2,px:[6,12],py:[6,15],pz:[1,-1],nx:[0,0],ny:[2,5],nz:[2,1]},{size:2,px:[2,7],py:[4,10],pz:[2,-1],nx:[3,6],ny:[4,8],nz:[2,1]},{size:3,px:[11,11,4],py:[0,5,7],pz:[1,-1,-1],nx:[6,12,12],ny:[1,1,2],nz:[1,0,0]},{size:2,px:[11,17],py:[4,18],pz:[0,-1],nx:[8,2],ny:[10,2],nz:[0,2]},{size:2,px:[17,17],py:[10,18],pz:[0,-1],nx:[8,8],ny:[2,3],nz:[1,1]},{size:2,px:[9,9],py:[7,7],pz:[1,-1],nx:[7,4],ny:[6,3],nz:[1,2]},{size:2,px:[18,21],py:[0,0],pz:[0,-1],nx:[11,6],ny:[5,3],nz:[0,1]},{size:2,px:[5,2],py:[8,4],pz:[0,2],nx:[5,8],ny:[9,16],nz:[0,-1]},{size:2,px:[12,2],py:[5,4],pz:[0,-1],nx:[4,15],ny:[4,8],nz:[1,0]},{size:2,px:[1,1],py:[4,6],pz:[1,1],nx:[11,3],ny:[7,9],nz:[0,-1]},{size:2,px:[2,1],py:[3,3],pz:[2,2],nx:[2,2],ny:[15,16],nz:[0,0]},{size:2,px:[17,18],py:[5,5],pz:[0,0],nx:[9,21],ny:[2,10],nz:[1,-1]},{size:2,px:[6,3],py:[14,7],pz:[0,1],nx:[3,4],ny:[4,5],nz:[1,-1]},{size:2,px:[0,3],py:[3,1],pz:[1,-1],nx:[19,10],ny:[12,4],nz:[0,1]},{size:2,px:[6,16],py:[3,8],pz:[1,0],nx:[8,10],ny:[20,4],nz:[0,-1]},{size:3,px:[5,5,2],py:[21,8,4],pz:[0,1,2],nx:[10,6,3],ny:[15,2,1],nz:[0,-1,-1]},{size:2,px:[11,10],py:[10,12],pz:[0,0],nx:[11,11],ny:[2,1],nz:[1,-1]},{size:2,px:[10,10],py:[3,2],pz:[1,1],nx:[8,11],ny:[3,5],nz:[1,-1]},{size:2,px:[13,3],py:[5,8],pz:[0,-1],nx:[12,3],ny:[3,1],nz:[0,2]},{size:2,px:[13,7],py:[2,1],pz:[0,1],nx:[5,5],ny:[1,1],nz:[0,-1]},{size:2,px:[11,10],py:[10,8],pz:[0,-1],nx:[14,16],ny:[10,15],nz:[0,0]},{size:2,px:[2,10],py:[7,8],pz:[1,-1],nx:[2,6],ny:[5,6],nz:[2,1]},{size:2,px:[10,10],py:[1,8],pz:[0,-1],nx:[2,2],ny:[3,2],nz:[2,2]},{size:2,px:[4,0],py:[5,2],pz:[1,-1],nx:[1,2],ny:[2,3],nz:[2,1]},{size:2,px:[1,12],py:[1,9],pz:[2,-1],nx:[16,17],ny:[3,3],nz:[0,0]},{size:2,px:[12,6],py:[5,8],pz:[0,-1],nx:[3,4],ny:[7,4],nz:[1,1]},{size:2,px:[14,3],py:[11,5],pz:[0,-1],nx:[11,4],ny:[0,0],nz:[0,1]},{size:2,px:[6,10],py:[6,6],pz:[1,-1],nx:[0,0],ny:[1,0],nz:[2,2]},{size:2,px:[3,7],py:[0,7],pz:[1,-1],nx:[15,13],ny:[8,4],nz:[0,0]},{size:2,px:[18,1],py:[15,0],pz:[0,-1],nx:[18,18],ny:[18,17],nz:[0,0]},{size:2,px:[5,2],py:[4,4],pz:[0,-1],nx:[4,18],ny:[4,15],nz:[1,0]},{size:3,px:[3,14,13],py:[2,7,8],pz:[2,0,0],nx:[10,0,2],ny:[8,3,2],nz:[0,-1,-1]},{size:2,px:[16,0],py:[14,3],pz:[0,-1],nx:[18,3],ny:[12,5],nz:[0,2]},{size:2,px:[5,3],py:[8,3],pz:[1,2],nx:[13,4],ny:[10,4],nz:[0,-1]},{size:2,px:[3,6],py:[1,2],pz:[2,1],nx:[8,1],ny:[4,20],nz:[1,-1]},{size:2,px:[10,10],py:[8,3],pz:[1,-1],nx:[12,7],ny:[2,1],nz:[0,1]},{size:2,px:[17,3],py:[9,2],pz:[0,2],nx:[7,6],ny:[4,0],nz:[1,-1]},{size:2,px:[12,1],py:[2,1],pz:[0,-1],nx:[4,4],ny:[2,3],nz:[2,2]},{size:2,px:[22,5],py:[15,3],pz:[0,2],nx:[16,17],ny:[14,2],nz:[0,-1]},{size:2,px:[8,11],py:[19,13],pz:[0,-1],nx:[0,0],ny:[2,4],nz:[2,1]},{size:2,px:[8,11],py:[8,1],pz:[1,-1],nx:[3,3],ny:[2,5],nz:[1,2]},{size:3,px:[3,8,0],py:[7,7,5],pz:[1,-1,-1],nx:[11,5,1],ny:[11,7,5],nz:[0,1,1]},{size:2,px:[12,6],py:[12,6],pz:[0,1],nx:[9,0],ny:[4,2],nz:[1,-1]},{size:2,px:[16,12],py:[7,1],pz:[0,-1],nx:[16,7],ny:[6,4],nz:[0,1]},{size:2,px:[13,5],py:[14,0],pz:[0,-1],nx:[13,10],ny:[0,0],nz:[0,0]},{size:5,px:[11,12,13,12,7],py:[0,1,0,0,0],pz:[0,0,0,0,1],nx:[13,16,14,4,4],ny:[18,23,18,5,5],nz:[0,0,0,2,-1]},{size:2,px:[14,5],py:[12,4],pz:[0,-1],nx:[7,7],ny:[8,2],nz:[1,1]},{size:2,px:[19,3],py:[2,5],pz:[0,-1],nx:[11,23],ny:[7,13],nz:[1,0]},{size:2,px:[0,0],py:[19,20],pz:[0,0],nx:[9,4],ny:[5,2],nz:[0,-1]},{size:2,px:[15,4],py:[12,3],pz:[0,2],nx:[9,5],ny:[4,5],nz:[1,-1]},{size:4,px:[8,0,1,21],py:[6,0,7,16],pz:[1,-1,-1,-1],nx:[11,6,11,5],ny:[8,6,4,3],nz:[1,1,1,2]},{size:2,px:[11,11],py:[7,5],pz:[0,-1],nx:[9,10],ny:[6,7],nz:[0,0]},{size:2,px:[2,4],py:[1,2],pz:[2,1],nx:[16,6],ny:[0,1],nz:[0,-1]},{size:2,px:[0,0],py:[5,3],pz:[1,2],nx:[1,21],ny:[23,8],nz:[0,-1]},{size:2,px:[10,0],py:[7,0],pz:[0,-1],nx:[4,13],ny:[4,10],nz:[1,0]},{size:2,px:[11,4],py:[0,4],pz:[1,-1],nx:[4,2],ny:[16,8],nz:[0,1]},{size:2,px:[5,3],py:[12,6],pz:[0,1],nx:[3,3],ny:[4,2],nz:[1,-1]},{size:2,px:[10,0],py:[19,11],pz:[0,-1],nx:[9,5],ny:[21,9],nz:[0,1]},{size:2,px:[0,0],py:[17,9],pz:[0,1],nx:[0,5],ny:[0,9],nz:[2,-1]},{size:2,px:[4,5],py:[2,4],pz:[0,-1],nx:[4,4],ny:[5,6],nz:[1,1]},{size:2,px:[8,4],py:[1,0],pz:[1,2],nx:[4,3],ny:[3,6],nz:[0,-1]},{size:2,px:[11,0],py:[7,2],pz:[1,-1],nx:[5,5],ny:[1,0],nz:[2,2]},{size:2,px:[13,0],py:[17,2],pz:[0,-1],nx:[3,6],ny:[5,8],nz:[2,1]},{size:2,px:[2,1],py:[0,5],pz:[2,-1],nx:[4,9],ny:[2,7],nz:[2,1]},{size:2,px:[12,5],py:[13,8],pz:[0,-1],nx:[23,11],ny:[13,7],nz:[0,1]},{size:2,px:[0,0],py:[0,2],pz:[1,0],nx:[3,6],ny:[11,18],nz:[0,-1]},{size:2,px:[4,3],py:[6,5],pz:[0,-1],nx:[1,1],ny:[1,3],nz:[2,1]},{size:4,px:[3,6,3,6],py:[3,6,2,5],pz:[2,1,2,1],nx:[0,4,1,1],ny:[0,22,17,0],nz:[0,-1,-1,-1]},{size:2,px:[8,4],py:[6,3],pz:[1,2],nx:[9,15],ny:[4,8],nz:[1,-1]},{size:2,px:[8,18],py:[7,8],pz:[1,0],nx:[8,5],ny:[4,0],nz:[1,-1]},{size:2,px:[0,0],py:[4,5],pz:[1,-1],nx:[5,6],ny:[0,0],nz:[1,1]},{size:2,px:[13,18],py:[23,19],pz:[0,0],nx:[7,13],ny:[10,20],nz:[1,-1]},{size:2,px:[10,6],py:[2,0],pz:[0,1],nx:[4,1],ny:[5,1],nz:[1,-1]},{size:2,px:[1,1],py:[5,4],pz:[2,2],nx:[0,20],ny:[4,4],nz:[2,-1]},{size:2,px:[5,5],py:[1,0],pz:[2,2],nx:[12,6],ny:[18,11],nz:[0,-1]},{size:5,px:[2,1,3,1,5],py:[3,3,7,4,9],pz:[2,2,1,2,1],nx:[9,3,8,16,10],ny:[5,3,10,6,7],nz:[1,-1,-1,-1,-1]},{size:2,px:[4,1],py:[12,3],pz:[0,-1],nx:[10,1],ny:[11,2],nz:[0,2]},{size:2,px:[19,0],py:[10,7],pz:[0,-1],nx:[14,7],ny:[6,3],nz:[0,1]},{size:2,px:[7,4],py:[2,1],pz:[1,2],nx:[6,0],ny:[2,18],nz:[0,-1]},{size:2,px:[14,8],py:[3,0],pz:[0,1],nx:[17,1],ny:[1,4],nz:[0,-1]},{size:2,px:[18,19],py:[1,17],pz:[0,-1],nx:[5,11],ny:[2,5],nz:[2,1]},{size:5,px:[12,12,12,6,12],py:[10,11,12,6,9],pz:[0,0,0,1,0],nx:[13,3,12,6,6],ny:[4,1,4,2,2],nz:[0,2,0,1,-1]},{size:2,px:[11,10],py:[3,3],pz:[0,0],nx:[4,9],ny:[4,17],nz:[1,-1]},{size:2,px:[11,0],py:[13,5],pz:[0,2],nx:[8,18],ny:[15,15],nz:[0,-1]},{size:2,px:[3,4],py:[6,5],pz:[1,1],nx:[0,0],ny:[9,4],nz:[1,-1]},{size:2,px:[0,0],py:[1,0],pz:[2,2],nx:[2,15],ny:[2,1],nz:[2,-1]},{size:3,px:[2,4,2],py:[4,9,5],pz:[2,1,2],nx:[2,5,14],ny:[0,1,4],nz:[0,-1,-1]},{size:2,px:[11,12],py:[20,20],pz:[0,0],nx:[6,10],ny:[9,19],nz:[1,-1]},{size:2,px:[7,0],py:[16,8],pz:[0,-1],nx:[2,3],ny:[2,4],nz:[2,1]},{size:5,px:[16,17,15,16,15],py:[1,1,1,0,0],pz:[0,0,0,0,0],nx:[8,8,4,12,12],ny:[8,7,2,23,23],nz:[1,1,2,0,-1]},{size:2,px:[2,4],py:[6,12],pz:[1,-1],nx:[8,13],ny:[1,1],nz:[1,0]},{size:2,px:[9,2],py:[3,2],pz:[0,-1],nx:[3,4],ny:[6,5],nz:[1,1]},{size:2,px:[10,8],py:[6,1],pz:[1,-1],nx:[11,8],ny:[2,2],nz:[0,0]},{size:2,px:[9,3],py:[7,0],pz:[1,-1],nx:[19,19],ny:[18,16],nz:[0,0]},{size:2,px:[3,2],py:[1,1],pz:[2,2],nx:[22,11],ny:[4,0],nz:[0,-1]},{size:2,px:[10,10],py:[9,8],pz:[1,1],nx:[4,4],ny:[10,2],nz:[1,-1]},{size:2,px:[0,1],py:[0,5],pz:[0,-1],nx:[10,8],ny:[2,2],nz:[0,0]},{size:2,px:[3,3],py:[8,7],pz:[1,1],nx:[8,2],ny:[8,3],nz:[0,-1]},{size:2,px:[13,5],py:[21,3],pz:[0,-1],nx:[13,3],ny:[20,5],nz:[0,2]},{size:2,px:[12,5],py:[11,2],pz:[0,-1],nx:[1,0],ny:[19,9],nz:[0,1]},{size:2,px:[7,10],py:[9,10],pz:[1,1],nx:[8,4],ny:[10,2],nz:[1,-1]},{size:2,px:[0,0],py:[5,9],pz:[2,1],nx:[2,11],ny:[9,19],nz:[1,-1]},{size:2,px:[3,5],py:[1,2],pz:[2,1],nx:[8,23],ny:[4,9],nz:[1,-1]},{size:2,px:[3,4],py:[2,4],pz:[2,1],nx:[5,9],ny:[2,5],nz:[2,-1]},{size:2,px:[11,11],py:[2,3],pz:[1,1],nx:[19,9],ny:[6,5],nz:[0,-1]},{size:2,px:[9,4],py:[5,10],pz:[1,-1],nx:[10,22],ny:[0,16],nz:[1,0]},{size:3,px:[19,9,19],py:[3,1,2],pz:[0,1,0],nx:[6,3,6],ny:[10,3,0],nz:[1,-1,-1]},{size:2,px:[8,3],py:[10,3],pz:[1,2],nx:[23,14],ny:[3,18],nz:[0,-1]},{size:2,px:[11,11],py:[19,0],pz:[0,-1],nx:[4,16],ny:[4,11],nz:[1,0]},{size:2,px:[22,23],py:[3,22],pz:[0,-1],nx:[9,3],ny:[4,2],nz:[1,2]},{size:2,px:[7,2],py:[12,4],pz:[0,-1],nx:[8,4],ny:[10,5],nz:[0,1]},{size:2,px:[12,13],py:[5,13],pz:[0,-1],nx:[11,3],ny:[2,0],nz:[0,2]},{size:2,px:[3,17],py:[0,16],pz:[1,-1],nx:[12,12],ny:[5,6],nz:[0,0]},{size:2,px:[4,3],py:[1,0],pz:[2,2],nx:[4,3],ny:[0,3],nz:[0,-1]},{size:2,px:[10,3],py:[12,0],pz:[0,-1],nx:[12,12],ny:[13,12],nz:[0,0]},{size:2,px:[13,4],py:[11,14],pz:[0,-1],nx:[0,0],ny:[4,6],nz:[1,0]},{size:2,px:[8,7],py:[7,8],pz:[1,1],nx:[3,0],ny:[5,21],nz:[2,-1]},{size:2,px:[1,3],py:[4,14],pz:[2,0],nx:[8,8],ny:[7,7],nz:[1,-1]},{size:2,px:[13,11],py:[20,7],pz:[0,-1],nx:[21,21],ny:[20,18],nz:[0,0]},{size:2,px:[2,1],py:[11,0],pz:[0,-1],nx:[2,2],ny:[15,14],nz:[0,0]},{size:2,px:[10,1],py:[8,0],pz:[1,-1],nx:[8,4],ny:[7,4],nz:[1,2]},{size:2,px:[17,6],py:[13,1],pz:[0,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[7,15],py:[1,3],pz:[1,0],nx:[15,5],ny:[1,8],nz:[0,-1]},{size:2,px:[16,1],py:[20,10],pz:[0,-1],nx:[6,8],ny:[11,10],nz:[1,1]},{size:2,px:[7,14],py:[0,0],pz:[1,0],nx:[7,8],ny:[7,3],nz:[1,-1]},{size:2,px:[12,5],py:[17,4],pz:[0,-1],nx:[12,5],ny:[16,10],nz:[0,1]},{size:2,px:[13,3],py:[15,0],pz:[0,-1],nx:[12,7],ny:[17,8],nz:[0,1]},{size:2,px:[7,1],py:[14,1],pz:[0,-1],nx:[4,6],ny:[6,12],nz:[1,0]},{size:2,px:[8,7],py:[0,0],pz:[0,0],nx:[6,20],ny:[5,5],nz:[0,-1]},{size:2,px:[10,2],py:[22,5],pz:[0,-1],nx:[4,8],ny:[4,9],nz:[2,1]},{size:4,px:[8,2,2,9],py:[6,5,3,11],pz:[1,-1,-1,-1],nx:[2,7,4,3],ny:[2,1,0,2],nz:[2,0,1,2]},{size:2,px:[12,6],py:[12,6],pz:[0,1],nx:[8,2],ny:[4,1],nz:[1,-1]},{size:2,px:[13,11],py:[19,8],pz:[0,-1],nx:[13,13],ny:[20,17],nz:[0,0]},{size:2,px:[11,19],py:[5,14],pz:[0,-1],nx:[3,4],ny:[8,4],nz:[1,1]},{size:2,px:[10,0],py:[8,6],pz:[1,-1],nx:[21,21],ny:[16,15],nz:[0,0]},{size:2,px:[1,12],py:[7,6],pz:[1,-1],nx:[2,7],ny:[5,14],nz:[2,0]},{size:2,px:[2,9],py:[7,5],pz:[1,-1],nx:[2,5],ny:[5,9],nz:[2,1]},{size:2,px:[12,5],py:[15,6],pz:[0,-1],nx:[3,12],ny:[0,2],nz:[2,0]},{size:2,px:[23,22],py:[23,1],pz:[0,-1],nx:[0,0],ny:[2,3],nz:[2,2]},{size:2,px:[3,6],py:[1,2],pz:[2,1],nx:[8,0],ny:[4,3],nz:[1,-1]},{size:2,px:[5,1],py:[9,1],pz:[0,-1],nx:[4,2],ny:[4,2],nz:[1,2]},{size:2,px:[0,1],py:[0,0],pz:[2,0],nx:[2,3],ny:[9,10],nz:[0,-1]},{size:2,px:[6,0],py:[16,14],pz:[0,-1],nx:[6,3],ny:[23,14],nz:[0,0]},{size:2,px:[3,3],py:[2,3],pz:[2,1],nx:[13,3],ny:[19,14],nz:[0,-1]},{size:2,px:[11,5],py:[8,18],pz:[0,-1],nx:[4,7],ny:[1,2],nz:[2,1]},{size:2,px:[4,4],py:[5,6],pz:[1,1],nx:[2,2],ny:[5,3],nz:[2,-1]},{size:2,px:[7,3],py:[13,7],pz:[0,1],nx:[4,3],ny:[4,1],nz:[1,-1]},{size:2,px:[0,0],py:[5,6],pz:[1,0],nx:[2,1],ny:[5,1],nz:[1,-1]},{size:2,px:[7,14],py:[3,5],pz:[1,0],nx:[5,0],ny:[16,7],nz:[0,-1]},{size:2,px:[11,2],py:[18,5],pz:[0,2],nx:[11,4],ny:[16,4],nz:[0,-1]},{size:2,px:[6,16],py:[19,20],pz:[0,-1],nx:[3,2],ny:[10,5],nz:[1,2]},{size:2,px:[5,3],py:[3,1],pz:[0,1],nx:[1,3],ny:[4,8],nz:[0,-1]},{size:2,px:[12,6],py:[13,6],pz:[0,1],nx:[10,1],ny:[12,2],nz:[0,-1]},{size:2,px:[8,3],py:[6,2],pz:[1,-1],nx:[4,8],ny:[2,4],nz:[2,1]},{size:2,px:[9,3],py:[21,2],pz:[0,-1],nx:[8,4],ny:[1,0],nz:[1,2]},{size:2,px:[8,4],py:[1,0],pz:[1,-1],nx:[8,6],ny:[4,2],nz:[1,1]},{size:2,px:[2,7],py:[1,6],pz:[2,-1],nx:[7,9],ny:[6,4],nz:[1,1]},{size:2,px:[6,3],py:[8,3],pz:[1,2],nx:[10,5],ny:[19,11],nz:[0,-1]},{size:2,px:[2,2],py:[3,4],pz:[2,2],nx:[3,6],ny:[4,6],nz:[1,-1]},{size:2,px:[3,11],py:[5,20],pz:[2,0],nx:[11,5],ny:[21,8],nz:[0,-1]},{size:3,px:[5,9,5],py:[4,7,5],pz:[2,0,2],nx:[23,10,4],ny:[23,3,22],nz:[0,-1,-1]},{size:4,px:[11,9,7,1],py:[13,8,11,10],pz:[0,-1,-1,-1],nx:[8,2,11,12],ny:[4,2,4,4],nz:[1,2,0,0]},{size:2,px:[0,0],py:[7,6],pz:[1,1],nx:[0,4],ny:[1,0],nz:[2,-1]},{size:2,px:[19,20],py:[0,1],pz:[0,0],nx:[21,1],ny:[0,2],nz:[0,-1]},{size:2,px:[8,5],py:[11,0],pz:[0,-1],nx:[11,0],ny:[12,1],nz:[0,2]},{size:2,px:[11,11],py:[1,1],pz:[0,-1],nx:[4,7],ny:[5,4],nz:[1,1]},{size:2,px:[5,12],py:[4,23],pz:[2,-1],nx:[13,15],ny:[5,4],nz:[0,0]},{size:2,px:[12,20],py:[4,16],pz:[0,-1],nx:[9,4],ny:[2,1],nz:[0,1]},{size:2,px:[12,13],py:[2,2],pz:[0,0],nx:[4,16],ny:[2,11],nz:[2,0]},{size:2,px:[19,14],py:[10,17],pz:[0,-1],nx:[3,8],ny:[0,2],nz:[2,0]},{size:2,px:[8,12],py:[1,2],pz:[1,0],nx:[19,10],ny:[3,1],nz:[0,-1]},{size:4,px:[17,2,3,10],py:[8,6,2,12],pz:[0,1,2,0],nx:[17,9,12,2],ny:[9,22,13,5],nz:[0,-1,-1,-1]},{size:2,px:[20,10],py:[15,7],pz:[0,1],nx:[13,9],ny:[7,3],nz:[0,-1]},{size:2,px:[0,0],py:[1,0],pz:[2,2],nx:[10,3],ny:[9,2],nz:[1,-1]},{size:2,px:[4,3],py:[1,0],pz:[2,2],nx:[0,22],ny:[14,6],nz:[0,-1]},{size:2,px:[16,3],py:[4,0],pz:[0,2],nx:[16,3],ny:[2,0],nz:[0,-1]},{size:2,px:[8,16],py:[6,12],pz:[1,0],nx:[8,12],ny:[4,7],nz:[1,-1]},{size:2,px:[5,11],py:[0,5],pz:[2,1],nx:[10,1],ny:[5,5],nz:[1,-1]},{size:2,px:[7,4],py:[5,5],pz:[0,-1],nx:[3,6],ny:[2,3],nz:[1,0]},{size:2,px:[11,11],py:[11,12],pz:[0,0],nx:[23,7],ny:[20,2],nz:[0,-1]},{size:2,px:[16,8],py:[12,5],pz:[0,1],nx:[8,2],ny:[2,1],nz:[1,-1]},{size:3,px:[6,11,11],py:[11,23,20],pz:[1,0,0],nx:[11,3,22],ny:[21,3,16],nz:[0,-1,-1]},{size:2,px:[17,15],py:[3,2],pz:[0,-1],nx:[4,4],ny:[3,2],nz:[2,2]},{size:2,px:[21,21],py:[11,10],pz:[0,0],nx:[11,3],ny:[6,2],nz:[1,-1]},{size:2,px:[23,21],py:[22,10],pz:[0,-1],nx:[20,10],ny:[18,10],nz:[0,1]},{size:2,px:[4,2],py:[6,3],pz:[1,2],nx:[3,2],ny:[4,3],nz:[1,-1]},{size:2,px:[16,0],py:[18,11],pz:[0,-1],nx:[8,7],ny:[4,4],nz:[0,0]},{size:2,px:[6,21],py:[3,16],pz:[0,-1],nx:[1,8],ny:[2,14],nz:[2,0]},{size:2,px:[8,1],py:[3,0],pz:[0,-1],nx:[11,11],ny:[2,1],nz:[0,0]},{size:3,px:[11,11,11],py:[9,10,8],pz:[1,1,1],nx:[23,1,0],ny:[23,9,11],nz:[0,-1,-1]},{size:2,px:[6,3],py:[2,1],pz:[1,2],nx:[7,1],ny:[8,2],nz:[0,-1]},{size:2,px:[10,17],py:[17,19],pz:[0,-1],nx:[10,4],ny:[16,9],nz:[0,1]},{size:2,px:[3,6],py:[7,1],pz:[1,-1],nx:[11,0],ny:[11,8],nz:[0,1]},{size:2,px:[10,5],py:[11,4],pz:[1,2],nx:[5,5],ny:[0,0],nz:[2,-1]},{size:2,px:[3,6],py:[3,6],pz:[2,1],nx:[8,0],ny:[4,16],nz:[1,-1]},{size:2,px:[14,1],py:[20,2],pz:[0,-1],nx:[7,7],ny:[11,9],nz:[1,1]},{size:3,px:[11,13,4],py:[16,21,3],pz:[0,0,2],nx:[14,16,5],ny:[20,14,9],nz:[0,-1,-1]},{size:2,px:[7,0],py:[1,1],pz:[1,-1],nx:[4,7],ny:[2,4],nz:[2,1]},{size:2,px:[23,11],py:[9,4],pz:[0,1],nx:[11,3],ny:[1,3],nz:[0,-1]},{size:2,px:[11,13],py:[23,23],pz:[0,0],nx:[13,13],ny:[20,20],nz:[0,-1]},{size:2,px:[10,8],py:[5,11],pz:[0,-1],nx:[20,19],ny:[18,20],nz:[0,0]},{size:2,px:[19,5],py:[22,4],pz:[0,-1],nx:[2,9],ny:[3,17],nz:[1,0]},{size:2,px:[15,2],py:[13,7],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:2,px:[14,13],py:[17,2],pz:[0,-1],nx:[15,13],ny:[19,15],nz:[0,0]},{size:2,px:[12,23],py:[8,22],pz:[0,-1],nx:[7,10],ny:[5,9],nz:[1,0]},{size:2,px:[2,6],py:[21,10],pz:[0,-1],nx:[3,4],ny:[3,3],nz:[1,1]},{size:2,px:[15,11],py:[5,0],pz:[0,-1],nx:[3,4],ny:[17,16],nz:[0,0]},{size:2,px:[3,1],py:[18,8],pz:[0,1],nx:[14,4],ny:[17,7],nz:[0,-1]},{size:2,px:[15,3],py:[18,3],pz:[0,2],nx:[1,22],ny:[0,1],nz:[0,-1]},{size:2,px:[13,3],py:[9,3],pz:[0,-1],nx:[0,1],ny:[9,20],nz:[1,0]},{size:2,px:[1,1],py:[1,0],pz:[2,2],nx:[9,23],ny:[10,12],nz:[1,-1]},{size:4,px:[9,0,9,1],py:[8,0,0,10],pz:[1,-1,-1,-1],nx:[23,7,5,23],ny:[20,7,5,19],nz:[0,1,2,0]},{size:2,px:[18,18],py:[12,12],pz:[0,-1],nx:[8,4],ny:[4,2],nz:[1,2]},{size:3,px:[0,4,1],py:[3,5,3],pz:[1,-1,-1],nx:[16,11,8],ny:[8,5,6],nz:[0,0,0]},{size:5,px:[9,10,14,11,11],py:[0,0,0,0,0],pz:[0,0,0,0,-1],nx:[8,3,4,6,2],ny:[22,9,5,4,0],nz:[0,1,0,0,2]},{size:2,px:[6,5],py:[2,2],pz:[1,1],nx:[7,3],ny:[8,7],nz:[0,-1]},{size:2,px:[11,5],py:[15,2],pz:[0,-1],nx:[3,10],ny:[0,1],nz:[2,0]},{size:2,px:[0,11],py:[11,12],pz:[1,-1],nx:[22,22],ny:[14,13],nz:[0,0]},{size:2,px:[2,2],py:[15,14],pz:[0,0],nx:[1,2],ny:[11,8],nz:[1,-1]},{size:2,px:[11,6],py:[0,7],pz:[1,-1],nx:[19,5],ny:[3,0],nz:[0,2]},{size:2,px:[2,3],py:[3,7],pz:[2,1],nx:[1,5],ny:[5,0],nz:[1,-1]},{size:2,px:[10,14],py:[4,5],pz:[0,-1],nx:[4,18],ny:[2,12],nz:[2,0]},{size:2,px:[19,10],py:[12,2],pz:[0,-1],nx:[13,4],ny:[10,2],nz:[0,2]},{size:2,px:[6,1],py:[21,6],pz:[0,-1],nx:[6,5],ny:[0,0],nz:[1,1]}],alpha:[-1.044179,1.044179,-.6003138,.6003138,-.4091282,.4091282,-.4590148,.4590148,-.4294004,.4294004,-.3360846,.3360846,-.3054186,.3054186,-.2901743,.2901743,-.3522417,.3522417,-.3195838,.3195838,-.2957309,.2957309,-.2876727,.2876727,-.263746,.263746,-.26079,.26079,-.2455714,.2455714,-.2749847,.2749847,-.2314217,.2314217,-.2540871,.2540871,-.2143416,.2143416,-.2565697,.2565697,-.1901272,.1901272,-.2259981,.2259981,-.2012333,.2012333,-.244846,.244846,-.2192845,.2192845,-.2005951,.2005951,-.2259,.2259,-.1955758,.1955758,-.2235332,.2235332,-.170449,.170449,-.1584628,.1584628,-.216771,.216771,-.1592909,.1592909,-.1967292,.1967292,-.1432268,.1432268,-.2039949,.2039949,-.1404068,.1404068,-.1788201,.1788201,-.1498714,.1498714,-.1282541,.1282541,-.1630182,.1630182,-.1398111,.1398111,-.1464143,.1464143,-.1281712,.1281712,-.1417014,.1417014,-.1779164,.1779164,-.2067174,.2067174,-.1344947,.1344947,-.1357351,.1357351,-.1683191,.1683191,-.1821768,.1821768,-.2158307,.2158307,-.1812857,.1812857,-.1635445,.1635445,-.1474934,.1474934,-.1771993,.1771993,-.151762,.151762,-.1283184,.1283184,-.1862675,.1862675,-.1420491,.1420491,-.1232165,.1232165,-.1472696,.1472696,-.1192156,.1192156,-.1602034,.1602034,-.1321473,.1321473,-.1358101,.1358101,-.1295821,.1295821,-.1289102,.1289102,-.123252,.123252,-.1332227,.1332227,-.1358887,.1358887,-.1179559,.1179559,-.1263694,.1263694,-.1444876,.1444876,-.1933141,.1933141,-.1917886,.1917886,-.119976,.119976,-.1359937,.1359937,-.1690073,.1690073,-.1894222,.1894222,-.1699422,.1699422,-.1340361,.1340361,-.1840622,.1840622,-.1277397,.1277397,-.138161,.138161,-.1282241,.1282241,-.1211334,.1211334,-.1264628,.1264628,-.137301,.137301,-.1363356,.1363356,-.1562568,.1562568,-.1268735,.1268735,-.1037859,.1037859,-.1394322,.1394322,-.1449225,.1449225,-.1109657,.1109657,-.1086931,.1086931,-.1379135,.1379135,-.1881974,.1881974,-.1304956,.1304956,-.09921777,.09921777,-.1398624,.1398624,-.1216469,.1216469,-.1272741,.1272741,-.1878236,.1878236,-.1336894,.1336894,-.1256289,.1256289,-.1247231,.1247231,-.18534,.18534,-.1087805,.1087805,-.1205676,.1205676,-.1023182,.1023182,-.1268422,.1268422,-.14229,.14229,-.1098174,.1098174,-.1317018,.1317018,-.1378142,.1378142,-.127455,.127455,-.1142944,.1142944,-.1713488,.1713488,-.1103035,.1103035,-.1045221,.1045221,-.1293015,.1293015,-.09763183,.09763183,-.1387213,.1387213,-.09031167,.09031167,-.1283052,.1283052,-.1133462,.1133462,-.09370681,.09370681,-.1079269,.1079269,-.1331913,.1331913,-.08969902,.08969902,-.104456,.104456,-.09387466,.09387466,-.1208988,.1208988,-.1252011,.1252011,-.1401277,.1401277,-.1461381,.1461381,-.1323763,.1323763,-.09923889,.09923889,-.1142899,.1142899,-.09110853,.09110853,-.1106607,.1106607,-.125314,.125314,-.09657895,.09657895,-.103001,.103001,-.1348857,.1348857,-.1237793,.1237793,-.1296943,.1296943,-.1323385,.1323385,-.08331554,.08331554,-.08417589,.08417589,-.1104431,.1104431,-.117071,.117071,-.1391725,.1391725,-.1485189,.1485189,-.1840393,.1840393,-.123825,.123825,-.1095287,.1095287,-.1177869,.1177869,-.1036409,.1036409,-.09802581,.09802581,-.09364054,.09364054,-.09936022,.09936022,-.1117201,.1117201,-.10813,.10813,-.1331861,.1331861,-.1192122,.1192122,-.09889761,.09889761,-.1173456,.1173456,-.1032917,.1032917,-.09268551,.09268551,-.1178563,.1178563,-.1215065,.1215065,-.1060437,.1060437,-.1010044,.1010044,-.1021683,.1021683,-.09974968,.09974968,-.1161528,.1161528,-.08686721,.08686721,-.08145259,.08145259,-.0993706,.0993706,-.1170885,.1170885,-.07693779,.07693779,-.09047233,.09047233,-.09168442,.09168442,-.1054105,.1054105,-.09036177,.09036177,-.1251949,.1251949,-.09523847,.09523847,-.103893,.103893,-.143366,.143366,-.148983,.148983,-.08393174,.08393174,-.08888026,.08888026,-.09347861,.09347861,-.1044838,.1044838,-.1102144,.1102144,-.1383415,.1383415,-.1466476,.1466476,-.1129741,.1129741,-.1310915,.1310915,-.1070648,.1070648,-.07559007,.07559007,-.08812082,.08812082,-.1234272,.1234272,-.1088022,.1088022,-.08388703,.08388703,-.07179593,.07179593,-.1008961,.1008961,-.0903007,.0903007,-.08581345,.08581345,-.09023431,.09023431,-.09807321,.09807321,-.09621402,.09621402,-.1730195,.1730195,-.08984631,.08984631,-.09556661,.09556661,-.1047576,.1047576,-.07854313,.07854313,-.08682118,.08682118,-.1159761,.1159761,-.133954,.133954,-.1003048,.1003048,-.09747544,.09747544,-.09501058,.09501058,-.1321566,.1321566,-.09194706,.09194706,-.09359276,.09359276,-.1015916,.1015916,-.1174192,.1174192,-.1039931,.1039931,-.09746733,.09746733,-.128612,.128612,-.1044899,.1044899,-.1066385,.1066385,-.08368626,.08368626,-.1271919,.1271919,-.1055946,.1055946,-.08272876,.08272876,-.1370564,.1370564,-.08539379,.08539379,-.1100343,.1100343,-.0810217,.0810217,-.1028728,.1028728,-.1305065,.1305065,-.1059506,.1059506,-.1264646,.1264646,-.08383843,.08383843,-.09357698,.09357698,-.074744,.074744,-.07814045,.07814045,-.0860097,.0860097,-.120609,.120609,-.09986512,.09986512,-.08516476,.08516476,-.07198783,.07198783,-.07838409,.07838409,-.1005142,.1005142,-.09951857,.09951857,-.07253998,.07253998,-.09913739,.09913739,-.0750036,.0750036,-.0925809,.0925809,-.1400287,.1400287,-.1044404,.1044404,-.07404339,.07404339,-.07256833,.07256833,-.1006995,.1006995,-.1426043,.1426043,-.1036529,.1036529,-.1208443,.1208443,-.1074245,.1074245,-.1141448,.1141448,-.1015809,.1015809,-.1028822,.1028822,-.1055682,.1055682,-.09468699,.09468699,-.1010098,.1010098,-.1205054,.1205054,-.08392956,.08392956,-.08052297,.08052297,-.09576507,.09576507,-.09515692,.09515692,-.1564745,.1564745,-.07357238,.07357238,-.1129262,.1129262,-.1013265,.1013265,-.08760761,.08760761,-.08714771,.08714771,-.09605039,.09605039,-.09064677,.09064677,-.08243857,.08243857,-.08495858,.08495858,-.08350249,.08350249,-.07423234,.07423234,-.07930799,.07930799,-.06620023,.06620023,-.07311919,.07311919,-.1237938,.1237938,-.1086814,.1086814,-.06379798,.06379798,-.07526021,.07526021,-.08297097,.08297097,-.08186337,.08186337,-.07627362,.07627362,-.1061638,.1061638,-.08328494,.08328494,-.1040895,.1040895,-.07649056,.07649056,-.07299058,.07299058,-.09195198,.09195198,-.0799088,.0799088,-.07429346,.07429346,-.09991702,.09991702,-.09755385,.09755385,-.1344138,.1344138,-.1707917,.1707917,-.0832545,.0832545,-.08137793,.08137793,-.08308659,.08308659,-.07440414,.07440414,-.07012744,.07012744,-.08122943,.08122943,-.08845462,.08845462,-.0880345,.0880345,-.09653392,.09653392,-.08795691,.08795691,-.1119045,.1119045,-.1068308,.1068308,-.08406359,.08406359,-.1220414,.1220414,-.1024235,.1024235,-.1252897,.1252897,-.1121234,.1121234,-.0905415,.0905415,-.08974435,.08974435,-.1351578,.1351578,-.1106442,.1106442,-.08093913,.08093913,-.09800762,.09800762,-.07012823,.07012823,-.07434949,.07434949,-.08684816,.08684816,-.08916388,.08916388,-.08773159,.08773159,-.07709608,.07709608,-.07230518,.07230518,-.09662156,.09662156,-.07957632,.07957632,-.07628441,.07628441,-.08050202,.08050202,-.1290593,.1290593,-.09246182,.09246182,-.09703662,.09703662,-.07866445,.07866445,-.1064783,.1064783,-.1012339,.1012339,-.06828389,.06828389,-.1005039,.1005039,-.07559687,.07559687,-.06359878,.06359878,-.08387002,.08387002,-.07851323,.07851323,-.08878569,.08878569,-.07767654,.07767654,-.08033338,.08033338,-.09142797,.09142797,-.08590585,.08590585,-.1052318,.1052318,-.08760062,.08760062,-.09222192,.09222192,-.07548828,.07548828,-.08003344,.08003344,-.1177076,.1177076,-.1064964,.1064964,-.08655553,.08655553,-.09418112,.09418112,-.07248163,.07248163,-.07120974,.07120974,-.06393114,.06393114,-.07997487,.07997487,-.1220941,.1220941,-.09892518,.09892518,-.08270271,.08270271,-.10694,.10694,-.05860771,.05860771,-.091266,.091266,-.06212559,.06212559,-.09397538,.09397538,-.08070447,.08070447,-.08415587,.08415587,-.08564455,.08564455,-.07791811,.07791811,-.06642259,.06642259,-.08266167,.08266167,-.1134986,.1134986,-.1045267,.1045267,-.07122085,.07122085,-.07979415,.07979415,-.07922347,.07922347,-.09003421,.09003421,-.08796449,.08796449,-.07933279,.07933279,-.08307947,.08307947,-.08946349,.08946349,-.07643384,.07643384,-.07818534,.07818534,-.07990991,.07990991,-.09885664,.09885664,-.08071329,.08071329,-.06952112,.06952112,-.06429706,.06429706,-.06307229,.06307229,-.08100137,.08100137,-.07693623,.07693623,-.06906625,.06906625,-.07390462,.07390462,-.06487217,.06487217,-.1233681,.1233681,-.06979273,.06979273,-.08358669,.08358669,-.109542,.109542,-.08519717,.08519717,-.07599857,.07599857,-.06042816,.06042816,-.06546304,.06546304,-.1016245,.1016245,-.08308787,.08308787,-.07385708,.07385708,-.0675163,.0675163,-.09036695,.09036695,-.09371335,.09371335,-.1116088,.1116088,-.05693741,.05693741,-.06383983,.06383983,-.05389843,.05389843,-.08383191,.08383191,-.07820822,.07820822,-.07067557,.07067557,-.07971948,.07971948,-.07360668,.07360668,-.07008027,.07008027,-.08013378,.08013378,-.08331605,.08331605,-.07145702,.07145702,-.0786394,.0786394,-.06992679,.06992679,-.05716495,.05716495,-.05306006,.05306006,-.08855639,.08855639,-.07656397,.07656397,-.06939272,.06939272,-.07523742,.07523742,-.08472299,.08472299,-.08114341,.08114341,-.06795517,.06795517,-.0789013,.0789013,-.07488741,.07488741,-.09281972,.09281972,-.09325498,.09325498,-.1401587,.1401587,-.1176284,.1176284,-.08867597,.08867597,-.08124232,.08124232,-.09441235,.09441235,-.08029452,.08029452,-.08581848,.08581848,-.1029819,.1029819,-.09569118,.09569118,-.07690893,.07690893,-.09018228,.09018228,-.1049209,.1049209,-.08969413,.08969413,-.08651891,.08651891,-.08613331,.08613331,-.07120468,.07120468,-.08743959,.08743959,-.07607158,.07607158,-.1015547,.1015547,-.08090879,.08090879,-.07114079,.07114079,-.08744835,.08744835,-.06074904,.06074904,-.06919871,.06919871,-.07607774,.07607774,-.094446,.094446,-.07833429,.07833429,-.06817555,.06817555,-.0899739,.0899739,-.09845223,.09845223,-.0789418,.0789418,-.07921373,.07921373,-.07448032,.07448032,-.1178165,.1178165,-.08216686,.08216686,-.08103286,.08103286,-.0698147,.0698147,-.08709008,.08709008,-.08336259,.08336259,-.06213589,.06213589,-.07068045,.07068045,-.06915676,.06915676,-.07103416,.07103416,-.06523849,.06523849,-.0763476,.0763476,-.07263038,.07263038,-.07164396,.07164396,-.08745559,.08745559,-.06960181,.06960181,-.08500098,.08500098,-.0652326,.0652326,-.07319714,.07319714,-.06268125,.06268125,-.07083135,.07083135,-.07984517,.07984517,-.1256265,.1256265,-.1065412,.1065412,-.08524323,.08524323,-.09291364,.09291364,-.07936567,.07936567,-.08607723,.08607723,-.07583416,.07583416,-.07931928,.07931928,-.07408357,.07408357,-.1034404,.1034404,-.1012127,.1012127,-.07916689,.07916689,-.08753651,.08753651,-.06090366,.06090366,-.07500103,.07500103,-.1228709,.1228709,-.06318201,.06318201,-.0758542,.0758542,-.0708909,.0708909,-.1053542,.1053542,-.08549521,.08549521,-.07906308,.07906308,-.0633878,.0633878,-.0841791,.0841791,-.07115511,.07115511,-.07693949,.07693949,-.07446749,.07446749,-.1037929,.1037929,-.07991005,.07991005,-.07119439,.07119439,-.0707134,.0707134,-.08587362,.08587362,-.07001236,.07001236,-.07567115,.07567115,-.0711893,.0711893,-.06844895,.06844895,-.1035118,.1035118,-.08156618,.08156618,-.07449593,.07449593,-.0815436,.0815436,-.09110878,.09110878,-.06222534,.06222534,-.1033841,.1033841,-.06811687,.06811687,-.06828443,.06828443,-.05769408,.05769408,-.05917684,.05917684,-.08358868,.08358868]}]},headtrackr.getWhitebalance=function(a){for(var c,d,e,f,h=a.getContext("2d"),i=h.getImageData(0,0,a.width,a.height),j=i.data,k=i.width*i.height,l=g=b=0,m=0;k>m;m++)l+=j[4*m],g+=j[4*m+1],b+=j[4*m+2];
return d=l/k,f=g/k,e=b/k,c=(d+f+e)/3},headtrackr.Smoother=function(a,b){function c(c){var g=[];if(this.interpolate)for(var h=c/b,i=h>>0,j=a/(1-a),k=(h-i)*j,l=2+i*j,m=1+i*j,n=0;f>n;n++)g[n]=k*(d[n]-e[n])+l*d[n]-m*e[n];else for(var h=c/b>>0,j=a*h/(1-a),k=2+j,l=1+j,n=0;f>n;n++)g[n]=k*d[n]-l*e[n];return g}var d,e,f,g,h=new Date;this.initialized=!1,this.interpolate=!1,this.init=function(a){this.initialized=!0,d=[a.x,a.y,a.z,a.width,a.height],e=d,f=d.length},this.smooth=function(b){if(g=[b.x,b.y,b.z,b.width,b.height],this.initialized){for(var i=0;f>i;i++)d[i]=a*g[i]+(1-a)*d[i],e[i]=a*d[i]+(1-a)*e[i];h=new Date;var j=new Date-h,k=c(j);return b.x=k[0],b.y=k[1],b.z=k[2],b.width=k[3],b.height=k[4],b}return!1}},headtrackr.camshift={},headtrackr.camshift.Histogram=function(a){this.size=4096;var b,c,d,e,f,g,h=[];for(b=0;b<this.size;b++)h.push(0);for(c=0,g=a.length;g>c;c+=4)d=a[c+0]>>4,e=a[c+1]>>4,f=a[c+2]>>4,h[256*d+16*e+f]+=1;this.getBin=function(a){return h[a]}},headtrackr.camshift.Moments=function(a,b,c,d,e,f){this.m00=0,this.m01=0,this.m10=0,this.m11=0,this.m02=0,this.m20=0;var g,h,i,j,k,l=[];for(g=b;d>g;g++)for(l=a[g],j=g-b,h=c;e>h;h++)i=l[h],k=h-c,this.m00+=i,this.m01+=k*i,this.m10+=j*i,f&&(this.m11+=j*k*i,this.m02+=k*k*i,this.m20+=j*j*i);this.invM00=1/this.m00,this.xc=this.m10*this.invM00,this.yc=this.m01*this.invM00,this.mu00=this.m00,this.mu01=0,this.mu10=0,f&&(this.mu20=this.m20-this.m10*this.xc,this.mu02=this.m02-this.m01*this.yc,this.mu11=this.m11-this.m01*this.xc)},headtrackr.camshift.Rectangle=function(a,b,c,d){this.x=a,this.y=b,this.width=c,this.height=d,this.clone=function(){var a=new headtrackr.camshift.Rectangle;return a.height=this.height,a.width=this.width,a.x=this.x,a.y=this.y,a}},headtrackr.camshift.Tracker=function(a){function b(b){var d=b.width,e=b.height,f=c(b),g=f.mu20*f.invM00,j=f.mu02*f.invM00;if(a.calcAngles){var k=f.mu11*f.invM00,l=g+j,m=Math.sqrt(4*k*k+(g-j)*(g-j));i.width=Math.sqrt(.5*(l-m))<<2,i.height=Math.sqrt(.5*(l+m))<<2,i.angle=Math.atan2(2*k,g-j+m),i.angle<0&&(i.angle=i.angle+Math.PI)}else i.width=Math.sqrt(g)<<2,i.height=Math.sqrt(j)<<2,i.angle=Math.PI/2;i.x=Math.floor(Math.max(0,Math.min(h.x+h.width/2,d))),i.y=Math.floor(Math.max(0,Math.min(h.y+h.height/2,e))),h.width=Math.floor(1.1*i.width),h.height=Math.floor(1.1*i.height)}function c(a){var b=a.width,c=a.height,i=a.data,j=new headtrackr.camshift.Histogram(i),k=d(f,j);g=e(i,a.width,a.height,k);var l,m,n,o,p,q,r,s,t=10,u=h.x,v=h.y;for(o=0;t>o;o++){if(p=Math.max(h.x,0),q=Math.max(h.y,0),r=Math.min(p+h.width,b),s=Math.min(q+h.height,c),l=new headtrackr.camshift.Moments(g,p,q,r,s,o==t-1),m=l.xc,n=l.yc,h.x+=m-h.width/2>>0,h.y+=n-h.height/2>>0,h.x==u&&h.y==v){l=new headtrackr.camshift.Moments(g,p,q,r,s,!0);break}u=h.x,v=h.y}return h.x=Math.max(0,Math.min(h.x,b)),h.y=Math.max(0,Math.min(h.y,c)),l}function d(a,b){for(var c,d=[],e=0;4096>e;e++)c=0!=b.getBin(e)?Math.min(a.getBin(e)/b.getBin(e),1):0,d.push(c);return d}function e(a,b,c,d){var e,f,g,h,i,j,k=[],l=[];for(e=0;b>e;e++){for(l=[],f=0;c>f;f++)j=4*(f*b+e),g=a[j]>>4,h=a[j+1]>>4,i=a[j+2]>>4,l.push(d[256*g+16*h+i]);k[e]=l}return k}void 0===a&&(a={}),void 0===a.calcAngles&&(a.calcAngles=!0);var f,g,h,i,j,k,l;this.getSearchWindow=function(){return h.clone()},this.getTrackObj=function(){return i.clone()},this.getPdf=function(){return g},this.getBackProjectionImg=function(){var a,b,c,d=g,e=k,f=l,h=j.createImageData(e,f),i=h.data;for(a=0;e>a;a++)for(b=0;f>b;b++)c=Math.floor(255*d[a][b]),pos=4*(b*e+a),i[pos]=c,i[pos+1]=c,i[pos+2]=c,i[pos+3]=255;return h},this.initTracker=function(a,b){j=a.getContext("2d");var c=b.width,d=b.height,e=b.x,g=b.y,k=j.getImageData(e,g,c,d);f=new headtrackr.camshift.Histogram(k.data),h=b.clone(),i=new headtrackr.camshift.TrackObj},this.track=function(a){var c=a.getContext("2d");l=a.height,k=a.width;var d=c.getImageData(0,0,a.width,a.height);0!=d.width&&0!=d.height&&b(d)}},headtrackr.camshift.TrackObj=function(){this.height=0,this.width=0,this.angle=0,this.x=0,this.y=0,this.clone=function(){var a=new headtrackr.camshift.TrackObj;return a.height=this.height,a.width=this.width,a.angle=this.angle,a.x=this.x,a.y=this.y,a}},headtrackr.facetrackr={},headtrackr.facetrackr.Tracker=function(a){function b(){var a=(new Date).getTime(),b=document.createElement("canvas");b.width=f.width,b.height=f.height,b.getContext("2d").drawImage(f,0,0,b.width,b.height);var c,d=headtrackr.ccv.detect_objects(headtrackr.ccv.grayscale(b),headtrackr.cascade,5,1),e=(new Date).getTime()-a;d.length>0&&(c=d[0]);for(var g=1;g<d.length;g++)d[g].confidence>c.confidence&&(c=d[g]);var h=new headtrackr.facetrackr.TrackObj;return void 0!==c&&(h.width=c.width,h.height=c.height,h.x=c.x,h.y=c.y,h.confidence=c.confidence),h.time=e,h.detection="VJ",h}function c(){var b=(new Date).getTime();h.track(f);var c=h.getTrackObj();a.debug&&a.debug.getContext("2d").putImageData(h.getBackProjectionImg(),0,0);var d=(new Date).getTime()-b,e=new headtrackr.facetrackr.TrackObj;return e.width=c.width,e.height=c.height,e.x=c.x,e.y=c.y,e.angle=c.angle,e.confidence=1,e.time=d,e.detection="CS",e}function d(){var a=new headtrackr.facetrackr.TrackObj;return a.wb=headtrackr.getWhitebalance(f),a.detection="WB",a}if(a||(a={}),void 0===a.sendEvents&&(a.sendEvents=!0),void 0===a.whitebalancing&&(a.whitebalancing=!0),void 0===a.debug?a.debug=!1:"CANVAS"!=a.debug.tagName&&(a.debug=!1),a.whitebalancing)var e="WB";else var e="VJ";void 0==a.calcAngles&&(a.calcAngles=!1);var f,g,h,i=-10,j=[],k=15;this.init=function(b){f=b,h=new headtrackr.camshift.Tracker({calcAngles:a.calcAngles})},this.track=function(){var l;if("WB"==e?l=d():"VJ"==e?l=b():"CS"==e&&(l=c()),"WB"==l.detection&&(j.length>=k&&j.pop(),j.unshift(l.wb),j.length==k)){var m=Math.max.apply(null,j),n=Math.min.apply(null,j);2>m-n&&(e="VJ")}if("VJ"==l.detection&&l.confidence>i){e="CS";var o=new headtrackr.camshift.Rectangle(Math.floor(l.x),Math.floor(l.y),Math.floor(l.width),Math.floor(l.height));h.initTracker(f,o)}if(g=l,"CS"==l.detection&&a.sendEvents){var p=document.createEvent("Event");p.initEvent("facetrackingEvent",!0,!0),p.height=l.height,p.width=l.width,p.angle=l.angle,p.x=l.x,p.y=l.y,p.confidence=l.confidence,p.detection=l.detection,p.time=l.time,document.dispatchEvent(p)}},this.getTrackingObject=function(){return g.clone()}},headtrackr.facetrackr.TrackObj=function(){this.height=0,this.width=0,this.angle=0,this.x=0,this.y=0,this.confidence=-1e4,this.detection="",this.time=0,this.clone=function(){var a=new headtrackr.facetrackr.TrackObj;return a.height=this.height,a.width=this.width,a.angle=this.angle,a.x=this.x,a.y=this.y,a.confidence=this.confidence,a.detection=this.detection,a.time=this.time,a}},headtrackr.Ui=function(){var a,b=document.createElement("div"),c=document.createElement("div"),d=document.createElement("p");b.setAttribute("id","headtrackerMessageDiv"),b.style.left="20%",b.style.right="20%",b.style.top="30%",b.style.fontSize="90px",b.style.color="#777",b.style.position="absolute",b.style.fontFamily="Helvetica, Arial, sans-serif",b.style.zIndex="100002",c.style.marginLeft="auto",c.style.marginRight="auto",c.style.width="100%",c.style.textAlign="center",c.style.color="#fff",c.style.backgroundColor="#444",c.style.opacity="0.5",d.setAttribute("id","headtrackerMessage"),c.appendChild(d),b.appendChild(c),document.body.appendChild(b);var e={"no getUserMedia":"getUserMedia is not supported in your browser :(","no camera":"no camera found :("},f={whitebalance:"Waiting for camera whitebalancing",detecting:"Please wait while camera is detecting your face...",hints:"We seem to have some problems detecting your face. Please make sure that your face is well and evenly lighted, and that your camera is working.",redetecting:"Lost track of face, trying to detect again..",lost:"Lost track of face :(",found:"Face found! Move your head!"},g=!1;document.addEventListener("headtrackrStatus",function(b){if(b.status in f){if(window.clearTimeout(a),!g){var c=document.getElementById("headtrackerMessage");c.innerHTML=f[b.status],a=window.setTimeout(function(){c.innerHTML=""},3e3)}}else if(b.status in e){g=!0,window.clearTimeout(a);var c=document.getElementById("headtrackerMessage");c.innerHTML=e[b.status],window.setTimeout(function(){c.innerHTML="added fallback video for demo"},2e3),window.setTimeout(function(){c.innerHTML="",g=!1},4e3)}},!0)},headtrackr.headposition={},headtrackr.headposition.Tracker=function(a,b,c,d){if(d||(d={}),void 0===d.edgecorrection)var e=!0;else var e=d.edgecorrection;this.camheight_cam=c,this.camwidth_cam=b;var f=16,g=19,h=Math.atan(f/g),i=Math.sqrt(f*f+g*g),j=Math.sin(h),k=Math.cos(h),l=Math.tan(h),m=a.width,n=a.height,o=Math.sqrt(m*m+n*n);if(void 0===d.fov){var p=j*o,q=this.camwidth_cam/p*f;if(void 0===d.distance_to_screen)var r=60;else var r=d.distance_to_screen;var s=2*Math.atan(q/2/r)}else var s=d.fov*Math.PI/180;var t,u,v,w=2*Math.tan(s/2);this.track=function(a){var b=a.width,c=a.height,f=a.x,g=a.y;if(e){var h=11,m=f-b/2,n=this.camwidth_cam-(f+b/2),p=g-c/2,q=this.camheight_cam-(g+c/2),r=h>m||h>n,s=h>p||h>q;if(s)if(r){var x=h>m,y=h>p;f=x?b-o*j/2:f-b/2+o*j/2,g=y?c-o*k/2:g-c/2+o*k/2}else if(h>p){var z=p/h,A=(h-p)/h;g=c-(z*(c/2)+A*(b/l/2)),o=A*(b/j)+z*Math.sqrt(b*b+c*c)}else{var z=q/h,A=(h-q)/h;g=g-c/2+(z*(c/2)+A*(b/l/2)),o=A*(b/j)+z*Math.sqrt(b*b+c*c)}else if(r)if(h>m){var z=m/h,A=(h-m)/h;o=A*(c/k)+z*Math.sqrt(b*b+c*c),f=b-(z*(b/2)+A*(c*l/2))}else{var z=n/h,A=(h-n)/h;o=A*(c/k)+z*Math.sqrt(b*b+c*c),f=f-b/2+(z*(b/2)+A*(c*l/2))}else o=Math.sqrt(b*b+c*c)}else o=Math.sqrt(b*b+c*c);v=i*this.camwidth_cam/(w*o),t=-(f/this.camwidth_cam-.5)*v*w,u=-(g/this.camheight_cam-.5)*v*w*(this.camheight_cam/this.camwidth_cam),u+=void 0===d.distance_from_camera_to_screen?11.5:d.distance_from_camera_to_screen;var B=document.createEvent("Event");return B.initEvent("headtrackingEvent",!0,!0),B.x=t,B.y=u,B.z=v,document.dispatchEvent(B),new headtrackr.headposition.TrackObj(t,u,v)},this.getTrackerObj=function(){return new headtrackr.headposition.TrackObj(t,u,v)},this.getFOV=function(){return 180*s/Math.PI}},headtrackr.headposition.TrackObj=function(a,b,c){this.x=a,this.y=b,this.z=c,this.clone=function(){var a=new headtrackr.headposition.TrackObj;return a.x=this.x,a.y=this.y,a.z=this.z,a}},headtrackr.controllers={},headtrackr.controllers.three={},headtrackr.controllers.three.realisticAbsoluteCameraControl=function(a,b,c,d,e){if(void 0===e&&(e={}),void 0===e.screenHeight)var f=20;else var f=e.screenHeight;void 0===e.damping&&(e.damping=1),a.position.x=c[0],a.position.y=c[1],a.position.z=c[2],a.lookAt(d);var g=f*b,h=g*a.aspect;document.addEventListener("headtrackingEvent",function(d){var f=d.x>0?0:2*-d.x*e.damping*b,i=d.y<0?0:2*d.y*e.damping*b;a.setViewOffset(h+Math.abs(2*d.x*e.damping*b),g+Math.abs(d.y*e.damping*2*b),f,i,h,g),a.position.x=c[0]+d.x*b*e.damping,a.position.y=c[1]+d.y*b*e.damping,a.position.z=c[2]+d.z*b,a.fov=360*Math.atan((g/2+Math.abs(d.y*b*e.damping))/Math.abs(d.z*b))/Math.PI,a.updateProjectionMatrix()},!1)},headtrackr.controllers.three.realisticRelativeCameraControl=function(a,b,c,d){if(void 0===d&&(d={}),void 0===d.screenHeight)var e=20;else var e=d.screenHeight;var f=a.parent,g=new THREE.Object3D;g.position.set(0,0,0),g.add(a),f.add(g);var h=e*b,i=h*a.aspect;document.addEventListener("headtrackingEvent",function(d){var e=d.x>0?0:2*-d.x*b,f=d.y>0?0:2*-d.y*b;a.setViewOffset(i+Math.abs(2*d.x*b),h+Math.abs(2*d.y*b),e,f,i,h),g.rotation=a.rotation,g.position.x=0,g.position.y=0,g.position.z=0,g.translateX(d.x*b),g.translateY(d.y*b),g.translateZ(d.z*b+c),a.fov=360*Math.atan((h/2+Math.abs(d.y*b))/Math.abs(d.z*b))/Math.PI,a.updateProjectionMatrix()},!1)},headtrackr});
/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		} );

	},

	parse: function ( text ) {

		function vector( x, y, z ) {

			return new THREE.Vector3( parseFloat( x ), parseFloat( y ), parseFloat( z ) );

		}

		function uv( u, v ) {

			return new THREE.Vector2( parseFloat( u ), parseFloat( v ) );

		}

		function face3( a, b, c, normals ) {

			return new THREE.Face3( a, b, c, normals );

		}
		
		var object = new THREE.Object3D();
		var geometry, material, mesh;

		function parseVertexIndex( index ) {

			index = parseInt( index );

			return index >= 0 ? index - 1 : index + vertices.length;

		}

		function parseNormalIndex( index ) {

			index = parseInt( index );

			return index >= 0 ? index - 1 : index + normals.length;

		}

		function parseUVIndex( index ) {

			index = parseInt( index );

			return index >= 0 ? index - 1 : index + uvs.length;

		}
		
		function add_face( a, b, c, normals_inds ) {

			if ( normals_inds === undefined ) {

				geometry.faces.push( face3(
					vertices[ parseVertexIndex( a ) ] - 1,
					vertices[ parseVertexIndex( b ) ] - 1,
					vertices[ parseVertexIndex( c ) ] - 1
				) );

			} else {

				geometry.faces.push( face3(
					vertices[ parseVertexIndex( a ) ] - 1,
					vertices[ parseVertexIndex( b ) ] - 1,
					vertices[ parseVertexIndex( c ) ] - 1,
					[
						normals[ parseNormalIndex( normals_inds[ 0 ] ) ].clone(),
						normals[ parseNormalIndex( normals_inds[ 1 ] ) ].clone(),
						normals[ parseNormalIndex( normals_inds[ 2 ] ) ].clone()
					]
				) );

			}

		}
		
		function add_uvs( a, b, c ) {
	  
			geometry.faceVertexUvs[ 0 ].push( [
				uvs[ parseUVIndex( a ) ].clone(),
				uvs[ parseUVIndex( b ) ].clone(),
				uvs[ parseUVIndex( c ) ].clone()
			] );

		}
		
		function handle_face_line(faces, uvs, normals_inds) {

			if ( faces[ 3 ] === undefined ) {
				
				add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );
				
				if ( uvs !== undefined && uvs.length > 0 ) {

					add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );

				}

			} else {
				
				if ( normals_inds !== undefined && normals_inds.length > 0 ) {

					add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ] );
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ] );

				} else {

					add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ] );
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ] );

				}
				
				if ( uvs !== undefined && uvs.length > 0 ) {

					add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
					add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );

				}

			}
			
		}

		// create mesh if no objects in text

		if ( /^o /gm.test( text ) === false ) {

			geometry = new THREE.Geometry();
			material = new THREE.MeshLambertMaterial();
			mesh = new THREE.Mesh( geometry, material );
			object.add( mesh );

		}

		var vertices = [];
		var normals = [];
		var uvs = [];

		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// f vertex vertex vertex ...

		var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

		// f vertex/uv vertex/uv vertex/uv ...

		var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

		var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

		// f vertex//normal vertex//normal vertex//normal ... 

		var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/

		//

		var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				vertices.push( 
					geometry.vertices.push(
						vector(
							result[ 1 ], result[ 2 ], result[ 3 ]
						)
					)
				);

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push(
					vector(
						result[ 1 ], result[ 2 ], result[ 3 ]
					)
				);

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				uvs.push(
					uv(
						result[ 1 ], result[ 2 ]
					)
				);

			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

				// ["f 1 2 3", "1", "2", "3", undefined]

				handle_face_line(
					[ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ]
				);

			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
				
				handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
				);

			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

				handle_face_line(
					[ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
					[ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
					[ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
				);

			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

				handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ ], //uv
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
				);

			} else if ( /^o /.test( line ) ) {

				geometry = new THREE.Geometry();
				material = new THREE.MeshLambertMaterial();

				mesh = new THREE.Mesh( geometry, material );
				mesh.name = line.substring( 2 ).trim();
				object.add( mesh );

			} else if ( /^g /.test( line ) ) {

				// group

			} else if ( /^usemtl /.test( line ) ) {

				// material

				material.name = line.substring( 7 ).trim();

			} else if ( /^mtllib /.test( line ) ) {

				// mtl file

			} else if ( /^s /.test( line ) ) {

				// smooth shading

			} else {

				// console.log( "THREE.OBJLoader: Unhandled line " + line );

			}

		}

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			var geometry = children[ i ].geometry;

			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();

		}
		
		return object;

	}

};
// This THREEx helper makes it easy to handle the fullscreen API
// * it hides the prefix for each browser
// * it hides the little discrepencies of the various vendor API
// * at the time of this writing (nov 2011) it is available in 
//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).

// 
// # Code

//

/** @namespace */
var THREEx		= THREEx 		|| {};
THREEx.FullScreen	= THREEx.FullScreen	|| {};

/**
 * test if it is possible to have fullscreen
 * 
 * @returns {Boolean} true if fullscreen API is available, false otherwise
*/
THREEx.FullScreen.available	= function()
{
	return this._hasWebkitFullScreen || this._hasMozFullScreen;
}

/**
 * test if fullscreen is currently activated
 * 
 * @returns {Boolean} true if fullscreen is currently activated, false otherwise
*/
THREEx.FullScreen.activated	= function()
{
	if( this._hasWebkitFullScreen ){
		return document.webkitIsFullScreen;
	}else if( this._hasMozFullScreen ){
		return document.mozFullScreen;
	}else{
		console.assert(false);
	}
}

/**
 * Request fullscreen on a given element
 * @param {DomElement} element to make fullscreen. optional. default to document.body
*/
THREEx.FullScreen.request	= function(element)
{
	element	= element	|| document.body;
	if( this._hasWebkitFullScreen ){
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}else if( this._hasMozFullScreen ){
		element.mozRequestFullScreen();
	}else{
		console.assert(false);
	}
}

/**
 * Cancel fullscreen
*/
THREEx.FullScreen.cancel	= function()
{
	if( this._hasWebkitFullScreen ){
		document.webkitCancelFullScreen();
	}else if( this._hasMozFullScreen ){
		document.mozCancelFullScreen();
	}else{
		console.assert(false);
	}
}


// internal functions to know which fullscreen API implementation is available
THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;	

/**
 * Bind a key to renderer screenshot
*/
THREEx.FullScreen.bindKey	= function(opts){
	opts		= opts		|| {};
	var charCode	= opts.charCode	|| 'f'.charCodeAt(0);
	var dblclick	= opts.dblclick !== undefined ? opts.dblclick : false;
	var element	= opts.element

	var toggle	= function(){
		if( THREEx.FullScreen.activated() ){
			THREEx.FullScreen.cancel();
		}else{
			THREEx.FullScreen.request(element);
		}		
	}

	// callback to handle keypress
	var __bind	= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	var onKeyPress	= __bind(function(event){
		// return now if the KeyPress isnt for the proper charCode
		if( event.which !== charCode )	return;
		// toggle fullscreen
		toggle();
	}, this);

	// listen to keypress
	// NOTE: for firefox it seems mandatory to listen to document directly
	document.addEventListener('keypress', onKeyPress, false);
	// listen to dblclick
	dblclick && document.addEventListener('dblclick', toggle, false);

	return {
		unbind	: function(){
			document.removeEventListener('keypress', onKeyPress, false);
			dblclick && document.removeEventListener('dblclick', toggle, false);
		}
	};
}

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join("\n")

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

THREE.EffectComposer.prototype = {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( !pass.enabled ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( pass instanceof THREE.MaskPass ) {

				maskActive = true;

			} else if ( pass instanceof THREE.ClearMaskPass ) {

				maskActive = false;

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			renderTarget = this.renderTarget1.clone();

			renderTarget.width = window.innerWidth;
			renderTarget.height = window.innerHeight;

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		var renderTarget = this.renderTarget1.clone();

		renderTarget.width = width;
		renderTarget.height = height;

		this.reset( renderTarget );

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		this.scene.overrideMaterial = this.overrideMaterial;

		if ( this.clearColor ) {

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

		}

		this.scene.overrideMaterial = null;

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

	this.scene = scene;
	this.camera = camera;

	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;

	this.inverse = false;

};

THREE.MaskPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		var context = renderer.context;

		// don't update color or depth

		context.colorMask( false, false, false, false );
		context.depthMask( false );

		// set up stencil

		var writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		context.enable( context.STENCIL_TEST );
		context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
		context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
		context.clearStencil( clearValue );

		// draw into the stencil buffer

		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		// re-enable update of color and depth

		context.colorMask( true, true, true, true );
		context.depthMask( true );

		// only render where stencil is set to 1

		context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

	}

};


THREE.ClearMaskPass = function () {

	this.enabled = true;

};

THREE.ClearMaskPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		var context = renderer.context;

		context.disable( context.STENCIL_TEST );

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;


	this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

};

/**
 * @author Felix Turner / www.airtight.cc / @felixturner
 *
 * Bad TV Shader
 * Simulates a bad TV via horizontal distortion and vertical roll
 * Uses Ashima WebGl Noise: https://github.com/ashima/webgl-noise
 *
 * time: steadily increasing float passed in
 * distortion: amount of thick distortion
 * distortion2: amount of fine grain distortion
 * speed: distortion vertical travel speed
 * rollSpeed: vertical roll speed
 * 
 * The MIT License
 * 
 * Copyright (c) 2014 Felix Turner
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

THREE.BadTVShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"distortion":     { type: "f", value: 3.0 },
		"distortion2":     { type: "f", value: 5.0 },
		"speed":     { type: "f", value: 0.2 },
		"rollSpeed":     { type: "f", value: 0.1 },
	},

	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float time;",
		"uniform float distortion;",
		"uniform float distortion2;",
		"uniform float speed;",
		"uniform float rollSpeed;",
		"varying vec2 vUv;",
		
		// Start Ashima 2D Simplex Noise

		"vec3 mod289(vec3 x) {",
		"  return x - floor(x * (1.0 / 289.0)) * 289.0;",
		"}",

		"vec2 mod289(vec2 x) {",
		"  return x - floor(x * (1.0 / 289.0)) * 289.0;",
		"}",

		"vec3 permute(vec3 x) {",
		"  return mod289(((x*34.0)+1.0)*x);",
		"}",

		"float snoise(vec2 v)",
		"  {",
		"  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0",
		"                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)",
		"                     -0.577350269189626,  // -1.0 + 2.0 * C.x",
		"                      0.024390243902439); // 1.0 / 41.0",
		"  vec2 i  = floor(v + dot(v, C.yy) );",
		"  vec2 x0 = v -   i + dot(i, C.xx);",

		"  vec2 i1;",
		"  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
		"  vec4 x12 = x0.xyxy + C.xxzz;",
		" x12.xy -= i1;",

		"  i = mod289(i); // Avoid truncation effects in permutation",
		"  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
		"		+ i.x + vec3(0.0, i1.x, 1.0 ));",

		"  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
		"  m = m*m ;",
		"  m = m*m ;",

		"  vec3 x = 2.0 * fract(p * C.www) - 1.0;",
		"  vec3 h = abs(x) - 0.5;",
		"  vec3 ox = floor(x + 0.5);",
		"  vec3 a0 = x - ox;",

		"  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",

		"  vec3 g;",
		"  g.x  = a0.x  * x0.x  + h.x  * x0.y;",
		"  g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
		"  return 130.0 * dot(m, g);",
		"}",

		// End Ashima 2D Simplex Noise

		"void main() {",

			"vec2 p = vUv;",
			"float ty = time*speed;",
			"float yt = p.y - ty;",

			//smooth distortion
			"float offset = snoise(vec2(yt*3.0,0.0))*0.2;",
			// boost distortion
			"offset = pow( offset*distortion,3.0)/distortion;",
			//add fine grain distortion
			"offset += snoise(vec2(yt*50.0,0.0))*distortion2*0.001;",
			//combine distortion on X with roll on Y
			"gl_FragColor = texture2D(tDiffuse,  vec2(fract(p.x + offset),fract(p.y-time*rollSpeed) ));",

		"}"

	].join("\n")

};

// ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗         ████████╗██████╗ ██╗██████╗ 
// ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║         ╚══██╔══╝██╔══██╗██║██╔══██╗
// ██║  ██║██║██║  ███╗██║   ██║   ███████║██║            ██║   ██████╔╝██║██████╔╝
// ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║            ██║   ██╔══██╗██║██╔═══╝ 
// ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗       ██║   ██║  ██║██║██║     
// ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝     

window.DT = (function (window, document, undefined) {
    'use strict';
    var DT = {};

    window.requestAnimationFrame = function () {
        return (
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback){
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }(),
    window.cancelAnimationFrame = function () {
        return (
            window.cancelAnimationFrame       ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame    ||
            window.oCancelAnimationFrame      ||
            window.msCancelAnimationFrame     ||
            function(id){
                window.clearTimeout(id);
            }
        );
    }();

    // constant
    DT.gameOverTime = 4000;
    DT.scale = 3;

    // jQuery chache
    DT.$document = $(document);
    DT.$window = $(window);
    DT.$title = $('title');
    DT.$body = $('body');
    DT.$chooseControl = $('.choose_control');
    DT.$pause = $('.pause');
    DT.$share = $('.share');
    DT.$dogecoin = $('#dogecoin');
    DT.$gameovermessage = $('#gameovermessage');

    // favicon
    DT.$document.on('update', function (e, data) {
        if (DT.player.isFun && DT.animate.id % 10 === 0) $('#fav').attr('href', 'img/' + (DT.animate.id % 18 + 1) + '.png');
    });
    DT.$document.on('showFun', function (e, data) {
        if (!data.isFun) $('#fav').attr('href', 'img/0.png');
    });
// ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗
// ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝
// ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  
// ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  
// ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗
// ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝
;(function () {
    'use strict';
    DT.getCookie = function (name) {
        var matches = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };
    DT.genRandomFloorBetween = function (min, max) {
        var rand = min - 0.5 + Math.random()*(max-min+1);
        rand = Math.round(rand);
        return rand;
    };
    DT.genRandomBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    DT.genRandomSign = function () {
        var signVal = Math.random() - 0.5;
        return Math.abs(signVal)/signVal;
    };
    //faster than Math.min with two args
    DT.getMin = function (a, b) {
        return a < b ? a : b;
    };
    //faster than Math.max with two args
    DT.getMax = function (a, b) {
        return a > b ? a : b;
    };
    DT.normalizeT = function (t) {
        t = t % 1;
        t = t < 0 ? 1 + t : t;
        return t;
    };
    DT.getNormalAt = function (t, tube, normals) {
        tube = tube || DT.tube;
        normals = normals || 'normals';
        var normal = new THREE.Vector3(),
            segments = tube[normals].length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        if (pick < 0) pick = 0;

        tube = tube || DT.tube;
        normal.subVectors( tube[normals][ pickNext ], tube[normals][ pick ] );
        normal.multiplyScalar( pickt - pick ).add( tube[normals][ pick ] );
        return normal;
    };
    DT.getBinormalAt = function (t, tube) {
        return DT.getNormalAt(t, tube, 'binormals');
    };
    DT.createGeometry = function (circumradius) {
        var geometry = new THREE.Geometry(),
            x,
            innerradius = circumradius * 0.97,
            n = 60;

        function setMainVert (rad, numb) {
            var vert = [];
            for (var i = 0; i < numb; i++) {
                var vec3 = new THREE.Vector3(
                    rad * Math.sin((Math.PI / numb) + (i * ((2 * Math.PI)/ numb))),
                    rad * Math.cos((Math.PI / numb) + (i * ((2 * Math.PI)/ numb))),
                    0
                );
                vert.push(vec3);
            }
            return vert;
        }

        function fillVert (vert) {
            var nFilled, nUnfilled, result = [];

            nFilled = vert.length;
            nUnfilled = n/nFilled;
            vert.forEach(function (el, i, arr) {
                var nextInd = i === arr.length - 1 ? 0 : i + 1;
                var vec = el.clone().sub(arr[nextInd]);
                for (var j = 0; j < nUnfilled; j++) {
                    result.push(vec.clone().multiplyScalar(1/nUnfilled).add(el));
                }
            });
            return result;
        }

        // set morph targets
        [60, 5, 4, 3, 2].forEach(function (el, i, arr) {
            var vert,
                vertOuter,
                vertInner;

            vertOuter = fillVert(setMainVert(circumradius, el).slice(0)).slice(0);
            vertInner = fillVert(setMainVert(innerradius, el).slice(0)).slice(0);

            vert = vertOuter.concat(vertInner);

            geometry.morphTargets.push({name: 'vert'+i, vertices: vert});

            if (i === 0) {
                geometry.vertices = vert.slice(0);
            }
        });
        
        // Generate the faces of the n-gon.
        for (x = 0; x < n; x++) {
            var next = x === n - 1 ? 0 : x + 1;
            geometry.faces.push(new THREE.Face3(x, next, x + n));
            geometry.faces.push(new THREE.Face3(x + n, next, next + n));
        }

        return geometry;
    };
    DT.lookAt = function (t, tube, tObject) {
        var tLook = DT.normalizeT(t),
            normalLook = DT.getNormalAt(tLook),
            binormalLook = DT.getBinormalAt(tLook),
            vectorLook = tube.path.getTangentAt(tLook)
                .multiplyScalar(DT.scale)
                .add(tObject.position);

        var m1 = new THREE.Matrix4().copy( tObject.matrix );
        m1.lookAt( vectorLook, tObject.position, normalLook );
        tObject.rotation.setFromRotationMatrix( m1 );
    };
    DT.animate = function (nowMsec) {
        nowMsec = nowMsec || Date.now();
        DT.animate.lastTimeMsec = DT.animate.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = DT.getMin(100, nowMsec - DT.animate.lastTimeMsec);
        // keep looping
        DT.animate.id = requestAnimationFrame(DT.animate);
        // change last time
        DT.animate.lastTimeMsec = nowMsec;
        // call each update function
        DT.$document.trigger('updatePath', {
            delta: deltaMsec / 1000,
            now: nowMsec / 1000,
        });
    };
    DT.$document.on('startGame', function (e, data) {
        DT.animate.id = requestAnimationFrame(DT.animate);
    });
    DT.$document.on('pauseGame', function () {
        cancelAnimationFrame(DT.animate.id);
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.animate.id = requestAnimationFrame(DT.animate);
    });
    DT.$document.on('gameOver', function (e, data) {
        if (data.cause === 'death') {
            DT.gameOverTimeout = setTimeout(function() {
                cancelAnimationFrame(DT.animate.id);
            }, DT.gameOverTime);
        } else {
            cancelAnimationFrame(DT.animate.id);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        clearTimeout(DT.gameOverTimeout);
        cancelAnimationFrame(DT.animate.id); 
    });
})();

// ████████╗██╗  ██╗██████╗ ███████╗███████╗    ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ 
// ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔════╝    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗
   // ██║   ███████║██████╔╝█████╗  █████╗      ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║
   // ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══╝      ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║
   // ██║   ██║  ██║██║  ██║███████╗███████╗    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝     ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ 
;(function () {
    'use strict';
    DT.renderer = new THREE.WebGLRenderer({antialiasing: true});
    DT.renderer.setSize(window.innerWidth, window.innerHeight);
    DT.renderer.physicallyBasedShading = true;
    DT.renderer.domElement.style.position = 'absolute';
    DT.renderer.domElement.style.left = 0;
    DT.renderer.domElement.style.top = 0;
    DT.renderer.domElement.style.zIndex = -1;
    document.body.appendChild(DT.renderer.domElement);
    $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});

    DT.scene = new THREE.Scene();

    // PATH
    DT.parent = new THREE.Object3D();
    DT.scene.add(DT.parent);
    DT.splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
    DT.parent.add(DT.splineCamera);

    // when resize
    new THREEx.WindowResize(DT.renderer, DT.splineCamera);

    var extrudePath = new THREE.Curves.TorusKnot(),
        tube = new THREE.TubeGeometry(extrudePath, 100, 3, 8, true, true);

    DT.tube = tube;

    var binormal = new THREE.Vector3(),
        normal = new THREE.Vector3();

    // coupling
    DT.$document.on('updatePath', function (e, data) {
        DT.renderer.render(DT.scene, DT.splineCamera);
        var dtime = data.delta,
            speed0 = DT.game.speed.getSpeed0(),
            path, dpath, t, pos;
        
        dpath = speed0 * dtime;
        DT.game.path += dpath;
        path = DT.game.path;
        
        t = path % 1;
        pos = tube.path.getPointAt( t );

        pos.multiplyScalar(DT.scale);

        // interpolation
        var segments = tube.binormals.length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

        var dir = tube.path.getTangentAt( DT.normalizeT(t + 0.01) ),
            offset = 0;

        normal.copy( binormal ).cross( dir );

        DT.splineCamera.position = pos;

        var lookAt = new THREE.Vector3().copy( pos ).add( dir );

        DT.splineCamera.matrix.lookAt(DT.splineCamera.position, lookAt, normal);
        DT.splineCamera.rotation.setFromRotationMatrix( DT.splineCamera.matrix, DT.splineCamera.rotation.order );

        DT.parent.rotation.y += ( -DT.parent.rotation.y ) * 0.05;

        data.tube = tube;
        data.t = t;
        data.normal = normal;
        data.binormal = binormal;
        DT.$document.trigger('update', data);
    });

    // LIGHTS
    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.5)
    };
    DT.scene.add(DT.lights.light);
    DT.scene.add(DT.lights.directionalLight);

    DT.$document.on('update', function (e, data) {
        var posLight = data.tube.path.getPointAt(DT.normalizeT(data.t));
        posLight.multiplyScalar(DT.scale);
        DT.lights.light.position = posLight;

        var posDirectLight = data.tube.path.getPointAt(DT.normalizeT(data.t + 0.006));
        posDirectLight.multiplyScalar(DT.scale);
        DT.lights.directionalLight.position = posDirectLight;
    });

    // BACKGROUND
    var geomBG = new THREE.SphereGeometry(500, 32, 32);
    var matBG = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/background5.jpg'),
        });
    var worldBG = new THREE.Mesh(geomBG, matBG);
    worldBG.material.side = THREE.BackSide;
    worldBG.rotation.x = Math.PI/8;
    worldBG.rotation.y = -Math.PI/2;
    worldBG.rotation.z = Math.PI/2;
    DT.scene.add(worldBG);

    // EFFECT
    DT.effectComposer = new THREE.EffectComposer( DT.renderer );
    DT.effectComposer.addPass( new THREE.RenderPass( DT.scene, DT.splineCamera ) );
    DT.effectComposer.on = false;

    var badTVParams = {
        mute:true,
        show: true,
        distortion: 3.0,
        distortion2: 1.0,
        speed: 0.3,
        rollSpeed: 0.1
    }
    
    var badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
    badTVPass.on = false;
    badTVPass.renderToScreen = true;
    DT.effectComposer.addPass(badTVPass);

    DT.$document.on('update', function (e, data) {
        if (DT.effectComposer.on) {
            badTVPass.uniforms[ "distortion" ].value = badTVParams.distortion;
            badTVPass.uniforms[ "distortion2" ].value = badTVParams.distortion2;
            badTVPass.uniforms[ "speed" ].value = badTVParams.speed;
            badTVPass.uniforms[ "rollSpeed" ].value = badTVParams.rollSpeed;
            DT.effectComposer.render();
                badTVParams.distortion+=0.3;
                badTVParams.distortion2+=0.1;
                badTVParams.speed+=0.03;
                badTVParams.rollSpeed+=0.01;
        };
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.effectComposer.on = true;
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.effectComposer.on = false;
        badTVParams = {
            distortion: 3.0,
            distortion2: 1.0,
            speed: 0.3,
            rollSpeed: 0.1
        }
    });

    // change IcosahedronGeometry prototype
    THREE.IcosahedronGeometry = function (radius, detail) {
        this.radius = radius;
        this.detail = detail;
        var t = (1 + Math.sqrt(5)) / 2;
        var vertices = [
            [ -1,  t,  0 ], [  1, t, 0 ], [ -1, -t,  0 ], [  1, -t,  0 ],
            [  0, -1,  t ], [  0, 1, t ], [  0, -1, -t ], [  0,  1, -t ],
            [  t,  0, -1 ], [  t, 0, 1 ], [ -t,  0, -1 ], [ -t,  0,  1 ]
        ];
        vertices = vertices.map(function (el) {
            return el.map(function (el) {
                return el * Math.random();
            });
        });
        var faces = [
            [ 0, 11,  5 ], [ 0,  5,  1 ], [  0,  1,  7 ], [  0,  7, 10 ], [  0, 10, 11 ],
            [ 1,  5,  9 ], [ 5, 11,  4 ], [ 11, 10,  2 ], [ 10,  7,  6 ], [  7,  1,  8 ],
            [ 3,  9,  4 ], [ 3,  4,  2 ], [  3,  2,  6 ], [  3,  6,  8 ], [  3,  8,  9 ],
            [ 4,  9,  5 ], [ 2,  4, 11 ], [  6,  2, 10 ], [  8,  6,  7 ], [  9,  8,  1 ]
        ];
        THREE.PolyhedronGeometry.call(this, vertices, faces, radius, detail);
    };
    THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
})();
// ███████╗██╗  ██╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗         ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     ███████╗
// ██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║         ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     ██╔════╝
// █████╗   ╚███╔╝    ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║         ██╔████╔██║██║   ██║██║  ██║█████╗  ██║     ███████╗
// ██╔══╝   ██╔██╗    ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║         ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     ╚════██║
// ███████╗██╔╝ ██╗   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗███████║
// ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
;(function () {
    'use strict';
    DT.listOfModels = [{
            name: 'bonusH1',
            scale: 0.1,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0xff0000,
        }, {
            name: 'bonusI',
            scale: 0.02,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
            '5': 0xffffff,
            'html': 0xffffff,
            'orange': 0xD0671F,
            'shield': 0xC35020,
        }, {
            name: 'bonusE1',
            scale: 0.75,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }, {
            name: 'bonusH2',
            scale: 0.1,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0xff0000,
        }, {
            name: 'shield',
            scale: 0.16,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }, {
            name: 'bonusE2',
            scale: 0.75,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }
    ];
    // LOADER
    var manager = new THREE.LoadingManager();

    manager.onProgress = function (item, loaded, total) {
        console.info('loaded item', loaded, 'of', total, '('+item+')');
    };
    
    var loader = new THREE.OBJLoader(manager);

    DT.listOfModels.forEach(function (el, i, a) {
        loader.load('objects/' + el.name + '.obj', function ( object ) {
            object.traverse( function ( child ) {
                var color = el[child.name] || el.color; 
                child.material = new THREE.MeshPhongMaterial({
                    color: color,
                    shading: THREE.SmoothShading,
                    emissive: new THREE.Color(color).multiplyScalar(0.5),
                    shininess: 100,
                });
            });
            if (i === 1) {
                a[i].object = object
            } else {
                a[i].object = object.children[0];
            }
            DT.$document.trigger('externalObjectLoaded', {index: i});
        });
    });
})();


 // ██████╗  █████╗ ███╗   ███╗███████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
// ██║  ███╗███████║██╔████╔██║█████╗  
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
;(function () {
    'use strict';
    DT.Game = function () {
        this.param = {
            spacing: 3,
            spawnCoord: -200,
            opacityCoord: 2,
            dieCoord: 30,
            stonesCloseness: 30,
            globalVolume: 1,
            prevGlobalVolume: 1
        };
        this.speed = {
            speed0: 1/60,
            speed: 1/60,
            acceleration: 1/2500,
            changer: 0,
            speedIncTimer: 0,
            divirer: 1,
            setChanger: function (changer) {
                this.changer = changer;
            },
            increaseSpeed: function (dtime) {
                this.speedIncTimer += 1;
                this.speed = this.speed0 + this.acceleration * Math.sqrt(this.speedIncTimer);
                // this.speed0 += this.acceleration * dtime;
            },
            slowDown: function (mult) {
                this.speedIncTimer *= mult;
            },
            getChanger: function() {
                return this.changer;
            },
            getSpeed0: function () {
                return (this.speed + this.changer) / this.divider;
            },
            getAcceleration: function () {
                return this.acceleration;
            }
        };
        this.wasStarted = false;
        this.wasPaused = false;
        this.wasOver = false;
        this.wasMuted = false;
        this.timer = 0;
        this.path = 0;
    };
    DT.Game.prototype.startGame = function() {
        this.wasStarted = true;
    };

    DT.Game.prototype.updateTimer = function (dtime) {
        var sec, min;
        this.timer += dtime;
        sec = Math.floor(this.timer);
        if (sec > Math.floor(this.timer - dtime) ) {
            min = Math.floor(sec / 60);
            sec = sec % 60;
            sec = sec < 10 ? '0' + sec.toString() : sec;
            DT.$title.html(min + ':' + sec + ' in digital trip');
        }
    };
    DT.Game.prototype.update = function(data) {
        this.updateTimer(data.delta);
        this.speed.increaseSpeed(data.delta);
    };
    DT.Game.prototype.reset = function() {
        this.timer = 0;
        this.path = 0;
        this.speed.changer = 0;
        this.speed.speed0 = 1/60;
        this.wasOver = false;
        this.wasPaused = false; // ?
        this.wasStarted = false;
        this.speed.speedIncTimer = 0;
    };
    DT.Game.prototype.gameOver = function() {
        this.wasOver = true;
    };

    DT.game = new DT.Game();

    DT.$document.on('startGame', function (e, data) {
        DT.game.startGame();
        DT.game.speed.divider = data.control === 'webcam' ? 2 : 1;
    });
    DT.$document.on('pauseGame', function () {
        DT.game.wasPaused = true;
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.game.wasPaused = false;
    });
    DT.$document.on('update', function (e, data) {
        DT.game.update(data);
    });
    DT.$document.on('changeSpeed', function (e, data) {
        DT.game.speed.setChanger(data.changer);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.game.gameOver();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.game.reset();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            DT.$document.trigger('changeSpeed', {changer: -DT.game.speed.getSpeed0()/2});
            DT.game.speed.slowDown(0.5);
        } else {
            DT.$document.trigger('changeSpeed', {changer: 0});
        }
    });
})();
// ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
// ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
// ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
// ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
// ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
// ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
;(function () {
    'use strict';
    DT.Player = function (options) {
        if (!DT.Player.__instance) {
            DT.Player.__instance = this;
        } else {
            return DT.Player.__instance;
        }
        var _this = this;
        this.scene = options.scene || DT.scene;
        this.currentHelth = options.currentHelth || 100;
        this.currentScore = options.currentScore || 0;
        this.position = new THREE.Vector3();
        this.destPoint = options.destPoint || new THREE.Vector3(0, 0, 0);
        this.isInvulnerability = options.isInvulnerability || false;
        this.isFun = options.isFun || false;
        this.invulnerTimer = null;
        this.funTimer = null;

        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));
        this.sphere.position = this.position;

        this.t = 0;

        this.light = new THREE.PointLight(0xff0000, 1.75, 15);
        this.light.position = this.position;
        this.light.color = this.sphere.material.color;
        this.scene.add(this.light);

        this.firstMove = true;
        this.moveIterator = 0;

        this.lines = new THREE.Object3D();
        this.scene.add(this.lines);

        var lineGeom = DT.createGeometry(2),
            limeMat = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.6,
                morphTargets: true
            }),
            limeMat2 = new THREE.MeshBasicMaterial({
                color: 0x00ffc6,
                transparent: true,
                opacity: 0.4,
                morphTargets: true,
            });

        this.line = new THREE.Mesh(lineGeom, limeMat);
        this.line2 = new THREE.Mesh(lineGeom, limeMat2);

        this.line.position.z = +0.5;
        this.lines.add(this.line);

        this.line2.position.z = -0.5;
        this.lines.add(this.line2);

        this.blink = {
            defColor: new THREE.Color('red'),
            color: new THREE.Color('white'),
            bColor: new THREE.Color(0, 0, 0),
            frames: 0,
            framesLeft: 0,
            doBlink: function (color, frames) {
                var tempColor = new THREE.Color(color).multiplyScalar(-1);
                this.color = new THREE.Color(color);
                this.framesLeft = this.frames = frames;
                this.bColor.addColors(this.defColor, tempColor).multiplyScalar(1/frames);
            },
        };

        this.emitter = Fireworks.createEmitter({nParticles : 100})
        .effectsStackBuilder()
            .spawnerSteadyRate(30)
            .position(Fireworks.createShapePoint(0, 0, 0))
            .velocity(Fireworks.createShapePoint(0, 0, 0))
            .lifeTime(0.2, 0.7)
            .renderToThreejsParticleSystem({
                particleSystem  : function(emitter){
                    var i,
                        geometry    = new THREE.Geometry(),
                        texture = Fireworks.ProceduralTextures.buildTexture(),
                        material    = new THREE.ParticleBasicMaterial({
                            color       : new THREE.Color().setHSL(1, 0, 0.6).getHex(),
                            size        : 1.3,
                            sizeAttenuation : true,
                            vertexColors    : true,
                            map     : texture,
                            blending    : THREE.AdditiveBlending,
                            depthWrite  : false,
                            transparent : true
                        }),
                        particleSystem = new THREE.ParticleSystem(geometry, material);
                        particleSystem.dynamic  = true;
                        particleSystem.sortParticles = true;
                    // init vertices
                    for(i = 0; i < emitter.nParticles(); i++){
                        geometry.vertices.push( new THREE.Vector3() );
                    }
                    // init colors
                    geometry.colors = new Array(emitter.nParticles());
                    for(i = 0; i < emitter.nParticles(); i++){
                        geometry.colors[i]  = _this.sphere.material.color;
                    }
                    
                    DT.parent.add(particleSystem);
                    _this.particleSystem = particleSystem;
                    return particleSystem;
                }
            }).back()
        .start();
    };

    DT.Player.prototype.updateBlink = function () {
        // TODO: refactor
        if (this.blink.framesLeft === 0) {
            return this;
        }
        if (this.blink.framesLeft === 1) {
            this.sphere.material.color.copy(this.blink.defColor);
        }
        if (this.blink.framesLeft === this.blink.frames) {
            this.sphere.material.color.copy(this.blink.color);
        }
        if (this.blink.framesLeft < this.blink.frames) {
            this.sphere.material.color.add(this.blink.bColor);
        }
        this.blink.framesLeft -= 1;
        return this;
    };

    DT.Player.prototype.changeHelth = function(delta) {
        if (delta > 0 || this.isInvulnerability === false) {
            var helth = this.currentHelth;
            if (helth > 0) {
                helth += delta;
                if (helth <= 0) {
                    helth = 0;
                    DT.$document.trigger('gameOver', {cause: 'death'});
                }
                if (helth > 100) {
                    helth = 100;
                }
            }
            this.currentHelth = helth;
            DT.$document.trigger('showHelth', {delta: delta, helth: this.currentHelth});
        }
        return this;
    };

    DT.Player.prototype.makeInvulner = function (time) {
        this.invulnerTimer = (time || 10000) / 1000 * 60;
        this.isInvulnerability = true;
        DT.$document.trigger('showInvulner', {invulner: true});
        return this;
    };

    DT.Player.prototype.stopInvulner = function () {
        if (!this.isInvulnerability) return;
        this.invulnerTimer = 0;
        this.isInvulnerability = false;
        DT.$document.trigger('showInvulner', {invulner: false});
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
        this.currentScore = parseFloat(this.currentScore.toFixed(1));
        DT.$document.trigger('showScore', {score: this.currentScore});
        return this;
    };

    DT.Player.prototype.makeFun = function(time) {
        this.isFun = true;
        this.funTimer = (time || 10000) / 1000 * 60;
        DT.$document.trigger('showFun', {isFun: true});
        return this;
    };

    DT.Player.prototype.stopFun = function () {
        this.isFun = false;
        this.funTimer = 0;
        DT.$document.trigger('showFun', {isFun: false});
        return this;
    };

    DT.Player.prototype.updateInvulnerability = function () {
        if (this.isInvulnerability) {
            this.invulnerTimer -= 1;
            if (this.invulnerTimer <= 0) {
                this.isInvulnerability = false;
                DT.$document.trigger('showInvulner', {invulner: false});
            } else {
                return this;
            }
        }
        return this;
    };

    DT.Player.prototype.updateFun = function () {
        if (this.isFun) {
            this.funTimer -= 1;
            if (this.funTimer <= 0) {
                this.stopFun();
            } else if (this.funTimer % 6 === 0) {
                var color = new THREE.Color().setRGB(
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3)
                );
                this.blink.doBlink(color, 10);
            }
        }
        return this;
    };

    DT.Player.prototype.update = function (data) {
        this.t = DT.normalizeT(data.t + 0.004);
        var pos = data.tube.path.getPointAt(this.t),
            binormal = DT.getBinormalAt(this.t),
            posPlayer = pos.clone().multiplyScalar(DT.scale);
        data.normalPos = posPlayer.clone();

        posPlayer.add(binormal.multiplyScalar(DT.scale * this.destPoint.x));
        data.actualPos = posPlayer.clone();

        this.updateInvulnerability();
        this.updateFun();
        this.updateBlink();

        this.moveSphere(data);

        this.lines.position = this.position.clone();

        DT.lookAt(data.t + 0.006, data.tube, this.lines);

        this.lines.children.forEach(function (el, i) {
            DT.angleSign = i === 0 ? 1 : -1;
            el.rotation.z += Math.PI/360/2 * DT.angleSign;
            el.scale = new THREE.Vector3(1,1,1).addScalar(DT.audio.valueAudio/256/30);
        });

        this.particleSystem.position.copy(this.position);

        var posVel = data.tube.path.getTangentAt(data.t).negate().multiplyScalar(DT.scale * 2);

        this.emitter.update(data.delta).render();
        this.emitter._particles.forEach(function(el) {
            el.velocity.vector = posVel;
        });
        return this;
    };

    DT.Player.prototype.reset = function () {
        this.currentHelth = 100;
        this.currentScore = 0;
        this.destPoint = new THREE.Vector3(0, 0, 0);
        this.isInvulnerability = false;
        this.isFun = false;
        return this;
    };

    DT.Player.prototype.changeDestPoint = function(vector3) {
        if (!vector3.equals(this.destPoint)) {
            this.destPoint.add(vector3);
        }
        return this;
    };

    DT.Player.prototype.moveSphere = function(data) {
        var normalPos = data.normalPos,
            actualPos = data.actualPos,
            offsetForw,
            offsetSide,
            max = 7;

        if (this.firstMove) {
            this.position = actualPos;
            this.prevActualPos = actualPos;
            this.prevNormalPos = normalPos;
            this.firstMove = !this.firstMove;
        }

        offsetForw = normalPos.clone().sub(this.position);
        this.position.add(offsetForw);
        this.prevActualPos.add(normalPos.clone().sub(this.prevNormalPos));
        this.prevNormalPos.add(normalPos.clone().sub(this.prevNormalPos));

        if (!this.position.equals(actualPos)) {
            this.prevActualPos = actualPos;
            this.moveIterator += 1;
        } else {
            this.moveIterator -= 1;
        }
        
        if (this.moveIterator > max) this.moveIterator = max;
        if (this.moveIterator <  0) this.moveIterator =  0;

        offsetSide = this.prevActualPos.clone().sub(normalPos).multiplyScalar(this.moveIterator / max);
        
        this.position.add(offsetSide);

        if (!normalPos.equals(actualPos)) this.prevActualPos = actualPos;

        this.light.position = this.sphere.position = this.position;

        DT.moveIterator = this.moveIterator
        return this;
    };

    DT.Player.prototype.bump = function (amp) {
        if (this.isInvulnerability) return;
        for (var i = 0; i < 2; i++) {
            amp = amp || 0.15;
            this.sphere.position.x += DT.genRandomSign() * amp;
            this.sphere.position.y += DT.genRandomSign() * amp;
        }
        return this;
     };

    DT.player = new DT.Player({
        currentHelth: 100,
        currentScore: 0,
        destPoint: new THREE.Vector3(0, 0, 0),
        isInvulnerability: false,
        isFun: false,
    });
    DT.$document.on('update', function (e, data) {
        DT.player.update(data);
    });
    DT.$document.on('makeFun', function (e, data) {
        if (!DT.game.wasOver) DT.player.makeFun();
    });
    DT.$document.on('stopFun', function (e, data) {
        DT.player.stopFun();
    });
    DT.$document.on('changeScore', function (e, data) {
        DT.player.changeScore(data.delta);
    });
    DT.$document.on('changeHelth', function (e, data) {
        DT.player.changeHelth(data.delta);
    });
    DT.$document.on('makeInvulner', function (e, data) {
        DT.player.makeInvulner();
    });
    DT.$document.on('stopInvulner', function (e, data) {
        DT.player.stopInvulner();
    });
    DT.$document.on('blink', function (e, data) {
        DT.player.blink.doBlink(data.color, data.frames);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.player.stopFun();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.player.reset();
    });
    // lines
    DT.$document.on('showHelth', function (e, data) {
        var mt = (100 - data.helth) / 25,
            counter = 0;
        clearInterval(DT.lineChangeInterval);
        DT.lineChangeInterval = setInterval(function () {
            var max = 40;
            counter++
            DT.player.lines.children.forEach(function (el, ind) {
                if (ind > 1) return;
                el.morphTargetInfluences.forEach(function (e, i, a) {
                    if (e !== 0 && i !== mt) a[i] = DT.getMax(a[i] - 1/max, 0);
                });
                el.morphTargetInfluences[ mt ] = DT.getMin(el.morphTargetInfluences[ mt ] + 1/max, 1);
            });
            if (counter === max) clearInterval(DT.lineChangeInterval);
        }, 20);
    });
    DT.$document.on('resetGame', function (e, data) {
        clearInterval(DT.lineChangeInterval);
        DT.player.lines.children.forEach(function (el, ind) {
            if (ind > 1) return;
            el.morphTargetInfluences.forEach(function (e, i, a) {
                a[i] = 0;
            });
            el.morphTargetInfluences[ 0 ] = 1;
        });
    });
    DT.$document.on('showInvulner', function (e, data) {
        DT.handlers.triggerOpacityOnLines(data.invulner);
    });
    DT.$document.on('showFun', function (e, data) {
        DT.handlers.triggerOpacityOnLines(data.isFun);
    });
})();
 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
// ██║  ███╗███████║██╔████╔██║█████╗      ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
;(function () {
    'use strict';
    DT.GameObject = function (options) {
        this.tObject = options.tObject || new options.THREEConstructor(
            options.geometry,
            options.material
        );
        this.geometry = this.tObject.geometry;
        this.material = this.tObject.material;
        this.scene = options.scene || DT.scene;
    };
    DT.GameObject.prototype.addToScene = function () {
        this.scene.add(this.tObject);
        return this;
    };
    DT.GameObject.prototype.removeFromScene = function () {
        this.scene.remove(this.tObject);
        // this.tObject.children.forEach(function (el) {
            // if (el.geometry && el.geometry.dispose ) el.geometry.dispose();
        //     if (el.material && el.material.dispose ) el.material.dispose();
        //     if (el.texture && el.texture.dispose ) el.texture.dispose();
        // });
        // if (this.tObject.geometry && this.tObject.geometry.dispose ) this.tObject.geometry.dispose();
        // if (this.tObject.material && this.tObject.material.dispose ) this.tObject.material.dispose();
        // if (this.tObject.texture && this.tObject.texture.dispose ) this.tObject.texture.dispose();
        return this;
    };
    DT.GameObject.prototype.create = function () {
        // empty method
        console.warn('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.createAndAdd = function () {
        return this.create()
            .addToScene();
    };
    DT.GameObject.prototype.update = function (options) {
        return this.updateGeometry(options.geometry)
            .updateMaterial(options.material);
    };
    DT.GameObject.prototype.updateGeometry = function (options) {
        // empty method
        console.warn('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateMaterial = function (options) {
        // empty method
        console.warn('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] += options[prop];
        }
        return this;
    };
    DT.GameObject.prototype.setParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] = options[prop];
        }
        return this;
    };
})();
 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗ ██╗     ██╗          ██████╗ ██████╗      ██╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔════╝██╔═══██╗██║     ██║         ██╔═══██╗██╔══██╗     ██║
// ██║  ███╗███████║██╔████╔██║█████╗      ██║     ██║   ██║██║     ██║         ██║   ██║██████╔╝     ██║
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║     ██║   ██║██║     ██║         ██║   ██║██╔══██╗██   ██║
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╗╚██████╔╝███████╗███████╗    ╚██████╔╝██████╔╝╚█████╔╝
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝ ╚══════╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ 
;(function () {
    'use strict';
    DT.GameCollectionObject = function (options) {
        DT.GameObject.apply(this, arguments);
        this.collection = options.collection;
    };
    DT.GameCollectionObject.prototype = Object.create(DT.GameObject.prototype);
    DT.GameCollectionObject.prototype.constructor = DT.GameCollectionObject;

    DT.GameCollectionObject.prototype.create = function () {
        this.collection.push(this);
        return this;
    };

    DT.GameCollectionObject.prototype.update = function (options) {
        if (this.tObject.position.distanceTo(options.dieCoord) < 10) {
            this.removeFromScene();
        } 
        var dist = this.tObject.position.distanceTo(options.opacityCoord),
            far = 10;
        if (dist < far) {
            var opacity = dist / far;
            if (this.tObject.children.length > 0) {
                this.tObject.children.forEach(function (el) {
                    el.material.transparent = true;
                    if (el.material.opacity > 0) el.material.opacity = opacity;
                });
            } else {
                this.tObject.material.transparent = true;
                this.tObject.material.opacity = opacity;
            }
        }
        return this;
    };

    DT.GameCollectionObject.prototype.removeFromScene = function () {
        DT.GameObject.prototype.removeFromScene.apply(this, arguments);
        var ind = this.collection.indexOf(this);
        if (ind !== -1) {
            this.collection.splice(ind, 1);
        }
        return this;
    };
})();

// ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
// ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
// ███████╗███████║██║█████╗  ██║     ██║  ██║
// ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
// ███████║██║  ██║██║███████╗███████╗██████╔╝
// ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
;(function () {
    'use strict';
    DT.Shield = function (options) {
        if (!DT.Shield.__instance) {
            DT.Shield.__instance = this;
        } else {
            return DT.Shield.__instance;
        }
        DT.GameObject.apply(this, arguments);
        this.tObject.scale.multiplyScalar(DT.listOfModels[4].scale);
        this.tObject.position = options.player.position;
        this.tObject.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            refractionRatio: 0,
            emissive:0xffffff,
            transparent: true,
            opacity: 0.05,
            wireframe: true,
            wireframeLinewidth: 3,
            shading: THREE.FlatShading,
        });
        this.player = options.player;
        this.interval;
    };
    DT.Shield.prototype = Object.create(DT.GameObject.prototype);
    DT.Shield.prototype.constructor = DT.Shield;

    DT.Shield.prototype.update = function () {
        this.tObject.position = this.player.position;
        DT.lookAt(DT.player.t - 0.004, DT.tube, this.tObject);
    };

    DT.$document.on('externalObjectLoaded', function (e, data) {
        if (data.index !== 4) return;
        DT.shield = new DT.Shield({
            tObject: DT.listOfModels[4].object.clone(),
            player: DT.player
        });
    
        DT.$document.on('update', function (e, data) {
            DT.shield.update();
        });
    
        DT.$document.on('showInvulner', function (e, data) {
            if (data.invulner) {
                clearInterval(DT.shield.interval);
                DT.shield.tObject.material.opacity = 0.05
                DT.shield.tObject.scale.set(DT.listOfModels[4].scale, DT.listOfModels[4].scale, DT.listOfModels[4].scale);
                DT.shield.addToScene();
            } else {
                DT.shield.interval = setInterval(function () {
                    DT.shield.tObject.material.opacity -= 0.0025;
                    DT.shield.tObject.scale.addScalar(DT.listOfModels[4].scale/20);
                    if (DT.shield.tObject.material.opacity < 0) {
                        DT.shield.removeFromScene();
                        clearInterval(DT.shield.interval);
                    }
                }, 20);
            }
        });
    });
})();

// ██████╗ ██╗   ██╗███████╗████████╗
// ██╔══██╗██║   ██║██╔════╝╚══██╔══╝
// ██║  ██║██║   ██║███████╗   ██║   
// ██║  ██║██║   ██║╚════██║   ██║   
// ██████╔╝╚██████╔╝███████║   ██║   
// ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
;(function () {
    'use strict';
    DT.Dust = function (options) {
        DT.GameObject.apply(this, arguments);
        this.number = options.number || 2000;
        this.createAndAdd();
    };
    DT.Dust.prototype = Object.create(DT.GameObject.prototype);
    DT.Dust.prototype.constructor = DT.Dust;

    DT.Dust.prototype.create = function () {
        for (var i = 0; i < this.number; i++) {
            this.geometry.vertices.push(new THREE.Vector3(
                DT.genRandomBetween(-120, 120),
                DT.genRandomBetween(-120, 120),
                DT.genRandomBetween(-50, 50)
            ));
        }
        this.material.visible = false;
        this.material.transparent = true;
        this.material.opacity = 0;
        return this;
    };

    DT.Dust.prototype.updateMaterial = function (options) {
        if (!this.material.visible) {
            this.material.visible = true;
        }
        this.material.color = options.isFun ? options.color : new THREE.Color().setRGB(1,0,0);
        this.material.opacity = 0.5 + DT.audio.valueAudio/256;
        return this;
    };

    // Dust object 
    DT.dust = new DT.Dust({
        geometry: new THREE.Geometry({}),
        material: new THREE.ParticleSystemMaterial({size: 0.25}),
        THREEConstructor: THREE.ParticleSystem
    });
    DT.$document.on('update', function (e, data) {
        DT.dust.updateMaterial({
            isFun: DT.player.isFun,
            valueAudio: DT.audio.valueAudio,
            color: DT.player.sphere.material.color
        });
    });
})();
// ███████╗████████╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
// ███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗  
// ╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝  
// ███████║   ██║   ╚██████╔╝██║ ╚████║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝
;(function () {
    'use strict';
    DT.Stone = function (options) {
        var radius, color, depth, tObject;

        radius = DT.genRandomBetween(1, 2);
        depth = DT.genRandomFloorBetween(80, 100) / 255;
        color = new THREE.Color().setRGB(depth, depth, depth);

        tObject = THREE.SceneUtils.createMultiMaterialObject( new THREE.IcosahedronGeometry(radius, 0), [
            new THREE.MeshPhongMaterial({
                shading: THREE.FlatShading,
                color: color,
                specular: 0x111111,
                shininess: 100,
                transparent: true,
                opacity: new DT.StonesCollection().opacity,
            }),
            new THREE.MeshPhongMaterial({
                shading: THREE.FlatShading,
                color: color,
                specular: 0x111111,
                shininess: 100,
                transparent: true,
                opacity: 1 - new DT.StonesCollection().opacity,
                wireframe: true,
                wireframeLinewidth: 2,
            })]);

        DT.GameCollectionObject.apply(this, [{
            tObject: tObject,
            collection: options.collection
        }]);
        this.t = options.t;
        this.tObject.position = options.position;
        this.setParam('rotation', {
            x: Math.random(),
            y: Math.random()
        })
        .createAndAdd();
        this.distanceToSphere = null;
        this.wasMissed = false;
    };
    DT.Stone.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Stone.prototype.constructor = DT.Stone;

    DT.Stone.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        var el = this.tObject;
        this.distanceToSphere = el.position.distanceTo(options.sphere.position);
        this.minDistance = options.sphere.geometry.radius + el.children[0].geometry.radius;
            
        if (this.distanceToSphere < this.minDistance) {
            this.removeFromScene();
            // coupling
            if (!DT.game.wasOver) {
                DT.$document.trigger('changeHelth', {delta: -25});
                DT.$document.trigger('bump', {});
                DT.audio.sounds.stoneDestroy.play();
                DT.sendSocketMessage({
                    type: 'vibr',
                    time: 200
                });
            }
            if (!DT.game.wasOver && DT.player.isInvulnerability === false) {
                DT.$document.trigger('blink', {color: 0x000000, frames: 60});
                DT.$document.trigger('hit', {});
            }
        }
        if (!DT.game.wasOver && !this.wasMissed && this.distanceToSphere > this.minDistance && this.distanceToSphere < this.minDistance * 1.2 && this.t < DT.player.t) {
            DT.audio.sounds.stoneMiss.play();
            this.wasMissed = true;
        }
        var binormal = DT.getBinormalAt(this.t),
            estimatedPlayerPosition = options.data.tube.path.getPointAt(this.t)
                .multiplyScalar(DT.scale)
                .add(binormal.multiplyScalar(DT.scale * DT.player.destPoint.x));

        if (el.position.distanceTo(estimatedPlayerPosition) < this.minDistance) {
            if (DT.player.isFun) {
                el.children[1].material.emissive = new THREE.Color().setRGB(1,0,0);
            } else {
                el.children[0].material.emissive = new THREE.Color().setRGB(0.5,0,0);
            }
        } else {
            if (DT.player.isFun) {
                el.children[1].material.emissive = new THREE.Color().setRGB(0,1,0);
            } else {
                el.children[0].material.emissive = new THREE.Color().setRGB(0,0,0);
            }
        }

        this.updateParam('rotation', {x: 0.014, y: 0.014});
        return this;
    };

    DT.StaticStone = function (options) {
        DT.Stone.apply(this, [options]);
    };
    DT.StaticStone.prototype = Object.create(DT.Stone.prototype);
    DT.StaticStone.prototype.constructor = DT.StaticStone;

    DT.StaticStone.prototype.update = function (options) {
        if (DT.player.isFun) {
            this.tObject.children[1].material.emissive = new THREE.Color().setRGB(0,1,0);
        } else {
            this.tObject.children[0].material.emissive = new THREE.Color().setRGB(0,0,0);
        }

        this.updateParam('rotation', {x: 0.007, y: 0.007});
        return this;
    };
})();
 // ██████╗ ██████╗ ██╗███╗   ██╗
// ██╔════╝██╔═══██╗██║████╗  ██║
// ██║     ██║   ██║██║██╔██╗ ██║
// ██║     ██║   ██║██║██║╚██╗██║
// ╚██████╗╚██████╔╝██║██║ ╚████║
 // ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
;(function () {
    'use strict';
    var coin_cap_texture = THREE.ImageUtils.loadTexture('./img/avers.png'),
        r = 0.5, i,
        coin_sides_geo = new THREE.CylinderGeometry( r, r, 0.05, 32, 1, true ),
        coin_cap_geo = new THREE.Geometry();
        
    for (i = 0; i < 100; i++) {
        var a = i * 1/100 * Math.PI * 2,
            z = Math.sin(a),
            xCosA = Math.cos(a),
            a1 = (i+1) * 1/100 * Math.PI * 2,
            z1 = Math.sin(a1),
            x1 = Math.cos(a1);
        coin_cap_geo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(xCosA*r, 0, z*r),
            new THREE.Vector3(x1*r, 0, z1*r)
        );
        coin_cap_geo.faceVertexUvs[0].push([
            new THREE.Vector2(0.5, 0.5),
            new THREE.Vector2(xCosA/2+0.5, z/2+0.5),
            new THREE.Vector2(x1/2+0.5, z1/2+0.5)
        ]);
        coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
    }
    coin_cap_geo.computeCentroids();
    coin_cap_geo.computeFaceNormals();

    DT.Coin = function (options) {
        var tObject = new THREE.Object3D();

        var coin_sides_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b}),
            coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat ),
            coin_cap_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b, map: coin_cap_texture}),
            coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat ),
            coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );

        coin_cap_top.position.y = 0.05;
        coin_cap_bottom.position.y = -0.05;
        coin_cap_top.rotation.x = Math.PI;
        
        tObject.add(coin_sides);
        tObject.add(coin_cap_top);
        tObject.add(coin_cap_bottom);
        
        DT.GameCollectionObject.apply(this, [{
            tObject: tObject.clone(),
            collection: options.collection
        }]);

        var t = DT.normalizeT(options.t + 0.25 + options.dt);
        var binormal = DT.getBinormalAt(t);
        
        var pos = options.tube.path.getPointAt(t)
            .multiplyScalar(DT.scale)
            .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;
        this.tObject.children.forEach(function (el) {
            el.material.transparent = false;
        });
        this.setParam('rotation', {
            x: 1.5,
            y: 0,
            z: options.zAngle
        }).createAndAdd();
    };
    DT.Coin.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Coin.prototype.constructor = DT.Coin;

    DT.Coin.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        this.updateParam('rotation', {z: 0.05});
        var positon = this.tObject.position;
        var distanceBerweenCenters = positon.distanceTo(options.sphere.position);
        if (distanceBerweenCenters < 0.9) {
            this.removeFromScene();
            if (!DT.game.wasOver) {
                DT.$document.trigger('changeScore', {delta: 0.1});
            }
            DT.$document.trigger('blink', {color: 0xcfb53b, frames: 60});
        }
        return this;
    };
})();

// ██████╗  ██████╗ ███╗   ██╗██╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██║   ██║██╔════╝
// ██████╔╝██║   ██║██╔██╗ ██║██║   ██║███████╗
// ██╔══██╗██║   ██║██║╚██╗██║██║   ██║╚════██║
// ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████║
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
;(function () {
    'use strict';
    DT.Bonus = function (options) {
        this.type = DT.genRandomFloorBetween(0, 2);
        // this.type = 1;

        var tObject;

        if (this.type === 0 || this.type === 2) {
            var geometry = DT.listOfModels[this.type].object.clone().geometry,
                material = DT.listOfModels[this.type].object.clone().material;

            material.transparent = false;
            material.opacity = 1;

            material.morphTargets = true;

            var mt1 = DT.listOfModels[this.type].object.geometry.vertices.slice(0),
                mt2 = DT.listOfModels[this.type + 3].object.geometry.vertices.slice(0);

            geometry.morphTargets.push({name: 'closed', vertices: mt1});
            geometry.morphTargets.push({name: 'open', vertices: mt2});

            tObject = new THREE.Mesh(geometry, material);
        } else {
            tObject = DT.listOfModels[this.type].object.clone();
            tObject.children.forEach(function (el) {
                el.material.transparent = false;
                el.material.opacity = 1;
            });
        }

        DT.GameCollectionObject.apply(this, [{
            tObject: tObject,
            collection: options.collection
        }]);

        var t = DT.normalizeT(options.t + 0.25),
            binormal = DT.getBinormalAt(t),
            pos = options.tube.path.getPointAt(t)
                .multiplyScalar(DT.scale)
                .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;

        DT.lookAt(t - 0.002, options.tube, this.tObject);

        this.tObject.scale.multiplyScalar(DT.listOfModels[this.type].scale);
        this.createAndAdd();

        this.blink = {
            defColor: new THREE.Color('red'),
            color: new THREE.Color('white'),
            bColor: new THREE.Color(0, 0, 0),
            frames: 0,
            framesLeft: 0,
            doBlink: function (color, frames) {
                var tempColor = new THREE.Color(color).multiplyScalar(-1);
                this.color = new THREE.Color(color);
                this.framesLeft = this.frames = frames;
                this.bColor.addColors(this.defColor, tempColor).multiplyScalar(1/frames);
            },
        };
    };

    DT.Bonus.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Bonus.prototype.constructor = DT.Bonus;

    DT.Bonus.prototype.updateBlink = function () {
        if (this.blink.framesLeft === 0) {
            return this;
        }
        if (this.blink.framesLeft === 1) {
            this.tObject.material.color.copy(this.blink.defColor);
        }
        if (this.blink.framesLeft === this.blink.frames) {
            this.tObject.material.color.copy(this.blink.color);
        }
        if (this.blink.framesLeft < this.blink.frames) {
            this.tObject.material.color.add(this.blink.bColor);
        }
        this.blink.framesLeft -= 1;
        return this;
    };

    DT.Bonus.prototype.update = function (options) {
        var _this = this;
        DT.GameCollectionObject.prototype.update.apply(this, arguments);

        if (this.type === 2) {
            if (DT.animate.id % 6 === 0) {
                var color = new THREE.Color().setRGB(
                    DT.genRandomBetween(0, 3),
                    DT.genRandomBetween(0, 3),
                    DT.genRandomBetween(0, 3)
                );
                this.blink.doBlink(color, 10);
            }
            this.updateBlink();
        }

        var dist = this.tObject.position.distanceTo(options.sphere.position);

        if (this.type === 0 && dist < 30) {
            this.tObject.morphTargetInfluences[1] = 5 - dist/6;
        }

        if (this.type === 2 && dist < 30) {
            this.tObject.morphTargetInfluences[1] = 1 - dist/30;
        }

        if (this.type === 0 && dist > 30) {
            var step = 120,
                n = (DT.animate.id % step) / (step - 1);
                n = n > 0.5 ? 2 * (1 - n) : 2 * n;
                
            this.tObject.morphTargetInfluences[0] = n;
            this.tObject.morphTargetInfluences[1] = 1 - n;
        }

        if (dist < 0.9) {
            this.removeFromScene();
            if (!DT.game.wasOver) {
                DT.$document.trigger('catchBonus', {type: _this.type});
                DT.$document.trigger('blink', {color: 0xff2222, frames: 60});
            }
        }
    };
})();

 // ██████╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║     ██║   ██║██║     ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██║     ██║   ██║██║     ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╗╚██████╔╝███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
 // ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
;(function () {
    'use strict';
    DT.Collection = function (options) {
        this.collection = [];
        this.constructor = options.constructor;
        this.opacity = 1;
    };

    DT.Collection.prototype.createObjects = function (options) {
        options.number = options.number || 1;
        options.collection = this.collection;
        return this;
    };

    DT.Collection.prototype.update = function (options) {
        this.collection.forEach(function (el) {
            el.update(options);
        });
        return this;
    };

    DT.Collection.prototype.removeObjects = function () {
        this.collection.forEach(function (el) {
            el.removeFromScene();
        });
        return this;
    };

    DT.Collection.prototype.reset = function () {
        this.collection.forEach(function (el) {
            el.scene.remove(el.tObject);
        });
        this.collection.length = 0;
        return this;
    };
})();

;(function () {
    'use strict';
    DT.StonesCollection = function () {
        if (!DT.StonesCollection.__instance) {
            DT.StonesCollection.__instance = this;
        } else {
            return DT.StonesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Stone
        }]);
    };
    DT.StonesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.StonesCollection.prototype.constructor = DT.StonesCollection;

    DT.StonesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        var el = this.collection[this.collection.length -1];

        if (el) {
            var dist = el.tObject.position.distanceTo(options.position)
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        var near = 5
        var isCoinsNear = ! new DT.CoinsCollection().collection.every(function (coin) {
                return coin.tObject.position.distanceTo(options.position) > near;
            });
        var isBonusesNear = ! new DT.BonusesCollection().collection.every(function (bonus) {
                return bonus.tObject.position.distanceTo(options.position) > near;
            });

        if (isCoinsNear || isBonusesNear) {
            return this;
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };

    DT.$document.on('update', function (e, data) {
        var t = DT.normalizeT(data.t + 0.08),
            binormal = DT.getBinormalAt(t);

        new DT.StonesCollection()
            .createObjects({
                position: data.tube.path.getPointAt(t)
                    .multiplyScalar(DT.scale)
                    .add(binormal.multiplyScalar(DT.scale * DT.genRandomFloorBetween(-1, 1))),
                t: t,
                sphere: DT.player.sphere,
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            clearInterval(DT.StonesCollection.transitionInterval);
            DT.StonesCollection.transitionInterval = setInterval(function () {
                new DT.StonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity -= 0.1;
                    el.tObject.children[1].material.opacity += 0.1;
                });
                new DT.StonesCollection().opacity -= 0.1;
                if (new DT.StonesCollection().opacity < 0) {
                    clearInterval(DT.StonesCollection.transitionInterval);
                }
            }, 50);
        } else {
            clearInterval(DT.StonesCollection.transitionInterval);
            DT.StonesCollection.transitionInterval = setInterval(function () {
                new DT.StonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity += 0.1
                    el.tObject.children[1].material.opacity -= 0.1
                });
                new DT.StonesCollection().opacity += 0.1;
                if (new DT.StonesCollection().opacity > 1) {
                    clearInterval(DT.StonesCollection.transitionInterval);
                }
            }, 50);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.StonesCollection().reset();
    });
})();

;(function () {
    'use strict';
    DT.StaticStonesCollection = function () {
        if (!DT.StaticStonesCollection.__instance) {
            DT.StaticStonesCollection.__instance = this;
        } else {
            return DT.StaticStonesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.StaticStone
        }]);
    };
    DT.StaticStonesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.StaticStonesCollection.prototype.constructor = DT.StaticStonesCollection;

    DT.StaticStonesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        var el = this.collection[this.collection.length -1];

        if (el) {
            var dist = el.tObject.position.distanceTo(options.position)
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        var near = 10;
        var isAnotherStoneNear = ! new DT.StaticStonesCollection().collection.every(function (coin) {
                return coin.tObject.position.distanceTo(options.position) > near;
            });

        if (isAnotherStoneNear) {
            return this;
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };

    for (var i = 500; i > 0; i--) {
        new DT.StaticStonesCollection()
            .createObjects({
                position: DT.tube.vertices[DT.genRandomFloorBetween(0, DT.tube.vertices.length-1)].clone().multiplyScalar(DT.scale),
                // t: t,
                sphere: DT.player.sphere,
            });
    }

    DT.$document.on('update', function (e, data) {
        new DT.StaticStonesCollection()
            .update();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            clearInterval(DT.StaticStonesCollection.transitionInterval);
            DT.StaticStonesCollection.transitionInterval = setInterval(function () {
                new DT.StaticStonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity -= 0.1;
                    el.tObject.children[1].material.opacity += 0.1;
                });
                new DT.StaticStonesCollection().opacity -= 0.1;
                if (new DT.StaticStonesCollection().opacity < 0) {
                    clearInterval(DT.StaticStonesCollection.transitionInterval);
                }
            }, 50);
        } else {
            clearInterval(DT.StaticStonesCollection.transitionInterval);
            DT.StaticStonesCollection.transitionInterval = setInterval(function () {
                new DT.StaticStonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity += 0.1
                    el.tObject.children[1].material.opacity -= 0.1
                });
                new DT.StaticStonesCollection().opacity += 0.1;
                if (new DT.StaticStonesCollection().opacity > 1) {
                    clearInterval(DT.StaticStonesCollection.transitionInterval);
                }
            }, 50);
        }
    });
})();

;(function () {
    'use strict';
    DT.CoinsCollection = function () {
        if (!DT.CoinsCollection.__instance) {
            DT.CoinsCollection.__instance = this;
        } else {
            return DT.CoinsCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Coin
        }]);
    };
    DT.CoinsCollection.prototype = Object.create(DT.Collection.prototype);
    DT.CoinsCollection.prototype.constructor = DT.CoinsCollection;

    DT.CoinsCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length) {
            for (var i = 0; i < options.number; i++) {
                options.zAngle = i * 0.25;
                options.dt = i * 0.004 ;
                new this.constructor(options);
            }
        }
        return this;
    };
    DT.$document.on('update', function (e, data) {
        new DT.CoinsCollection()
            .createObjects({
                offset: DT.genRandomFloorBetween(-1, 1),
                tube: data.tube,
                t: data.t,
                zAngle: 0,
                number: 10
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.CoinsCollection().reset()
    });
})();

;(function () {
    'use strict';
    DT.BonusesCollection = function (options) {
        if (!DT.BonusesCollection.__instance) {
            DT.BonusesCollection.__instance = this;
        } else {
            return DT.BonusesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Bonus
        }]);
        this.caughtBonuses = [];
    };
    DT.BonusesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.BonusesCollection.prototype.constructor = DT.BonusesCollection;

    DT.BonusesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length && DT.animate.id % 900 === 0) {
            for (var i = 0; i < options.number; i++) {
                new this.constructor(options);
            }
        }
        return this;
    };
    DT.BonusesCollection.prototype.useBonuses = function (type) {
        // helth
        if (type === 0) DT.$document.trigger('changeHelth', {delta: 25});
        // invulnerability
        if (type === 1) DT.$document.trigger('makeInvulner', {});
        // entertainment
        if (type === 2) DT.$document.trigger('makeFun', {});
        return this;
    };

    DT.BonusesCollection.prototype.catchBonus = function (type) {
        var _this = this;
        if (!this.caughtBonuses.length || this.caughtBonuses[0] === type) {
            this.caughtBonuses.push(type);
            if (this.caughtBonuses.length === 1) {
                this.useBonuses(type);
                var refreshBonus = setTimeout(function() {
                    _this.caughtBonuses.length = 0;
                    clearTimeout(refreshBonus);
                }, 100);
            }
        } else {
            this.caughtBonuses.length = 0;
            this.caughtBonuses.push(type);
        }
        DT.$document.trigger('showBonuses', {type: type, caughtBonuses: this.caughtBonuses});
        return this;
    };
    DT.BonusesCollection.prototype.reset = function () {
        DT.Collection.prototype.reset.apply(this, arguments);
        this.caughtBonuses.length = 0;
        return this;
    };
    DT.$document.on('update', function (e, data) {
        new DT.BonusesCollection()
            .createObjects({
                offset: DT.genRandomFloorBetween(-1, 1),
                tube: data.tube,
                t: data.t + DT.genRandomBetween(0, 0.1),
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                delta: data.delta * 1000
            });
    });
    DT.$document.on('catchBonus', function (e, data) {
        new DT.BonusesCollection().catchBonus(data.type);
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.BonusesCollection().reset(); 
    });
})();
 // █████╗ ██╗   ██╗██████╗ ██╗ ██████╗ 
// ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
// ███████║██║   ██║██║  ██║██║██║   ██║
// ██╔══██║██║   ██║██║  ██║██║██║   ██║
// ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
// ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 

;(function () {
    'use strict';
    DT.audio = {
        frequency: { // for audio visualization
            0: 43,
            1: 65,
            2: 43,
            3: 75,
        },
        valueAudio: 0,
        sounds: {
            catchCoin: 'sounds/coin.',
            gameover: 'sounds/gameover.',
            pause: 'sounds/pause.',
            stoneDestroy: 'sounds/stoneDestroy.',
            stoneMiss: 'sounds/stoneMiss.',
            catchBonus0: 'sounds/catchBonus0.',
            catchBonus1: 'sounds/catchBonus1.',
            catchBonus2: 'sounds/catchBonus2.',
            muv8: 'sounds/muv8.',
        },
        music: {
            0: 'sounds/main.',
            1: 'sounds/fun.',
            2: 'sounds/intro.',
            3: 'sounds/invulner.',
            started: [],
            paused: []
        }
    };
    DT.audio.reset = function () {
        DT.audio.music.paused.forEach(function (el) {el = false});
        DT.audio.music.started.forEach(function (el) {el = false});
    };

    DT.setVolume = function (volume) {
        DT.game.param.globalVolume = volume;
        if (DT.game.param.prevGlobalVolume !== DT.game.param.globalVolume) {
            DT.gainNodes.forEach(function(el) {
                if (el) {
                    el.gain.value = DT.game.param.globalVolume;
                }
            });
            DT.game.param.prevGlobalVolume = DT.game.param.globalVolume;
        }
    };

    DT.$window.on('focus', function() {
        if (!DT.game.wasMuted) {
            DT.setVolume(1);
        }
    });
    DT.$window.on('blur', function() {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            DT.$document.trigger('pauseGame', {});
        }
        DT.setVolume(0);
    });
    DT.$document.on('startGame', function (e, data) {
        DT.stopSound(2);
        DT.playSound(0);
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.audio.reset();
    });
    DT.$document.on('pauseGame', function () {
        DT.stopSoundBeforPause();
        DT.audio.sounds.pause.play();
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.playSoundAfterPause();
        DT.audio.sounds.pause.play();
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.stopSound(0);
        DT.stopSound(1);
    });
    DT.$document.on('gameOver', function (e, data) {
        if (data.cause === 'death') {
            DT.audio.sounds.gameover.play();
        }
    });
    DT.$document.on('changeScore', function (e, data) {
        DT.audio.sounds.catchCoin.play();
    });

    ;(function () {
        // MUSIC
        var counter = 0,
            buffers = [], sources=[], analysers = [], freqDomain = [],
            audio = new Audio(),
            canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs=\'vorbis\'') !== '',
            ext = canPlayOgg ? 'ogg' : 'mp3',
            destination,
            context;

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e) {
            alert('Opps.. Your browser do not support audio API');
        }
        DT.stopSound = function(index){
            if (DT.audio.music.started[index] === true) {
                sources[index].stop(index);
                DT.audio.music.started[index] = false;
            }
        };
        DT.gainNodes = [];
        DT.playSound = function(index){
            var gainNodes = DT.gainNodes;
            if (!DT.audio.music.started[index]) {
                DT.audio.music.started[index] = true;
                sources[index] = context.createBufferSource();
                sources[index].loop = true;
                sources[index].buffer = buffers[index];
                destination = context.destination;
                gainNodes[index] = context.createGain();
                gainNodes[index].gain.value = DT.game.param.globalVolume;
                analysers[index] = context.createAnalyser();
                analysers[index].fftSize = 2048;
                analysers[index].minDecibels = -50;
                analysers[index].maxDecibels = -20;
                sources[index].connect(gainNodes[index]);
                gainNodes[index].connect(analysers[index]);
                analysers[index].connect(destination);
                DT.$document.on('update', function (e, data) {
                    visualize(index);
                });
                sources[index].start(index);
                DT.audio.music.started[index] = true;
            }
        };
        DT.stopSoundBeforPause = function() {
            DT.audio.music.started.forEach(function(el, i) {
                DT.audio.music.paused[i] = el;
                DT.stopSound(i);
            });
        };
        DT.playSoundAfterPause = function() {
            DT.audio.music.paused.forEach(function(el, i) {
                if (el) DT.playSound(i);
            });
        };
        function initSound(arrayBuffer, bufferIndex) {
            context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
                buffers[bufferIndex] = decodedArrayBuffer;
                console.info('ready sound ' + bufferIndex);
                counter += 1;
                yepnope.showLoading(counter);
            }, function(e) {
                console.warn('Error decoding file', e);
            });
        };

        // SOUNDS
        function SFX(context, file) {
          var ctx = this;
          var loader = new BufferLoader(context, [file], onLoaded);
        
          function onLoaded(buffers) {
            ctx.buffers = buffers;
          };
        
          loader.load();
        }
        
        SFX.prototype.play = function() {
          var time = context.currentTime;
          // Make multiple sources using the same buffer and play in quick succession.
            var source = this.makeSource(this.buffers[0]);
            source.start(0);
        }
        
        SFX.prototype.makeSource = function(buffer) {
          var source = context.createBufferSource();
          var compressor = context.createDynamicsCompressor();
          var gain = context.createGain();
          gain.gain.value = DT.game.param.globalVolume;
          source.buffer = buffer;
          source.connect(gain);
          gain.connect(compressor);
          compressor.connect(context.destination);
          return source;
        };

        for (var prop in DT.audio.sounds) if (DT.audio.sounds.hasOwnProperty(prop)) {
            DT.audio.sounds[prop] = new SFX(context, DT.audio.sounds[prop] + ext);
        }

        var loadSoundFile = function(urlArr, bufferIndex) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlArr[bufferIndex] + ext, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
            };
            xhr.send();
        };
        for (var i = 0; i < 4; i++) {
            loadSoundFile(DT.audio.music, i);
        }
        var visualize = function(index) {
            freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
            analysers[index].getByteFrequencyData(freqDomain[index]);
            DT.audio.valueAudio = getFrequencyValue(DT.audio.frequency[index], index);
        };
        var getFrequencyValue = function(frequency, bufferIndex) {
            var nyquist = context.sampleRate/2,
                index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
            return freqDomain[bufferIndex][index];
        };
    })();

    DT.$document.on('showBonuses', function (e, data) {
        DT.audio.sounds['catchBonus' + data.type].play();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            DT.stopSound(0);
            DT.stopSound(3);
            DT.playSound(1);
        } else {
            DT.stopSound(1);
            DT.stopSound(3);
            DT.playSound(0);
        }
    });
    DT.$document.on('showInvulner', function (e, data) {
        if (DT.player.isFun) return;
        if (data.invulner) {
            DT.stopSound(0);
            DT.stopSound(1);
            DT.playSound(3);
        } else {
            DT.stopSound(3);
            DT.stopSound(1);
            DT.playSound(0);
        }
    });
})();
// ██╗  ██╗███████╗██╗   ██╗██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
// ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
// █████╔╝ █████╗   ╚████╔╝ ██████╔╝██║   ██║███████║██████╔╝██║  ██║
// ██╔═██╗ ██╔══╝    ╚██╔╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
// ██║  ██╗███████╗   ██║   ██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
// ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 

;(function () {
    'use strict';
    var keydownArrows = function(event) {
        var k = event.keyCode
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
                // arrows control
            if (k === 38) { // up arrow
                //
            }
            if (k === 40) { // down arrow
                // 
            }
            if (k === 37) { // left arrow
                DT.handlers.toTheLeft();
            }
            if (k === 39) { // right arrow
                DT.handlers.toTheRight();
            }
        }
    };
    var keyupHandler = function(event) {
        var k = event.keyCode;
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            if (k === 16) { //shift
                DT.$document.trigger('changeSpeed', {changer: 0});
            }
        }
    };
    DT.$document.on('startGame', function (e, data) {
        if (data.control === 'keyboard') {
            DT.$document.bind('keydown', keydownArrows);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        // if (data.cause === 'chooseControl') {
            DT.$document.unbind('keydown', keydownArrows);
        // }
    });
    // test fun mone and speen change
    // DT.$document.bind('keydown', function(event) {
    //     var k = event.keyCode
    //     if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
    //         // speedUp
    //         if (k === 16) { //shift
    //             DT.$document.trigger('stopFun', {});
    //             DT.$document.trigger('changeSpeed', {changer: DT.game.speed.getSpeed0()});
    //         }
    //         if (k === 17) {
    //             DT.$document.trigger('makeFun', {});
    //         }
    //     }
    // });
    DT.$document.bind('keyup', keyupHandler);
    DT.$document.on('startGame', function (e, data) {
        DT.$document.bind('keyup', DT.handlers.pauseOnSpace);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.$document.unbind('keyup', DT.handlers.pauseOnSpace);
    });
})();

// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║   
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   
;(function () {
    'use strict';
    DT.server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.44';
    DT.initSocket = function() {
        // Game config
        var leftBreakThreshold = -3,
            leftTurnThreshold = -20,
            rightBreakThreshold = 3,
            rightTurnThreshold = 20,
            // set socket
            socket = DT.initSocket.socket = io.connect(DT.server);
        // When initial welcome message, reply with 'game' device type
        socket.on('welcome', function(data) {
            socket.emit('device', {'type':'game', 'cookieUID': DT.getCookie('UID')});
        });
        // We receive our game code to show the user
        socket.on('initialize', function(gameCode) {
            // if (socket.gameCode !== gameCode) {
                socket.gameCode = gameCode;
                DT.$document.trigger('socketInitialized', gameCode);
            // }
        });
        // When the user inputs the code into the phone client, we become 'connected'. Start the game.
        socket.on('connected', function(data) {
        });
        // When the phone is turned, change destPoint
        socket.on('turn', function(turn) {
            if (DT.enableMobileSatus === 'enabled' && DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
                if(turn < leftBreakThreshold) {
                    if(turn > leftTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.left();
                    }
                } else if (turn > rightBreakThreshold) {
                    if(turn < rightTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.right();
                    }
                } else {
                    DT.handlers.center();
                }
            }
        });
        socket.on('click', function(click) {
            if (DT.enableMobileSatus === 'enabled') DT.handlers[click]();
        });
        // socket.on('message', function(data) {
        //     if (data.type === 'paymentCheck') DT.$document.trigger('paymentCheck', data);
        // });
        socket.on('paymentMessage', function(data) {
            DT.$document.trigger('paymentMessage', data);
        });
        socket.on('transactionMessage', function(data) {
            DT.$document.trigger('transactionMessage', data);
        });
        socket.on('start', function(data) {
            if (!DT.game.wasStarted) {
                DT.$document.trigger('startGame', {control: 'mobile'});
                DT.lastControl = 'mobile';
            }
        });
        DT.$document.on('changeScore', function (e, data) {
            DT.sendSocketMessage({type: 'vibr', time: 10});
        });
    };
    DT.sendSocketMessage = function (options) {
        var data = {
            'type': options.type,
            'time': options.time,
            'dogecoinId': options.dogecoinId,
            'gameCode': DT.initSocket.socket.gameCode,
            'sessionid': DT.initSocket.socket.socket.sessionid,
            'coinsCollect': DT.player.currentScore
        };
        if (DT.initSocket.socket) {
            DT.initSocket.socket.emit('message', data);
        }
    };

    DT.$document.on('startGame', function (e, data) {
        DT.sendSocketMessage({type: 'gamestarted'});
    });
    DT.$document.on('startGame', function (e, data) {
        if (data.control === 'mobile') DT.enableMobileSatus = 'enabled';
    });
    DT.$document.on('resetGame', function (e, data) {
        if (data.cause === 'chooseControl') DT.enableMobileSatus = 'disabled';
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.sendSocketMessage({type: 'gameover'});
    });
    DT.$document.on('checkup', function (e, data) {
        DT.sendSocketMessage({type: 'checkup', dogecoinId: data.dogecoinId});
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.sendSocketMessage({type: 'resetGame'});
    });
})();
// ██╗    ██╗███████╗██████╗  ██████╗ █████╗ ███╗   ███╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
// ██║ █╗ ██║█████╗  ██████╔╝██║     ███████║██╔████╔██║
// ██║███╗██║██╔══╝  ██╔══██╗██║     ██╔══██║██║╚██╔╝██║
// ╚███╔███╔╝███████╗██████╔╝╚██████╗██║  ██║██║ ╚═╝ ██║
 // ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝
;(function () {
    'use strict';
    // headtracker realization
    // get video and canvas
    var videoInput = document.getElementById('vid');
    var canvasInput = document.getElementById('compare');
    var canvasOverlay = document.getElementById('overlay')
    // var debugOverlay = document.getElementById('debug');
    var canvasContext = canvasInput.getContext('2d');
    var overlayContext = canvasOverlay.getContext('2d');
    // set mirror view to canvas
    canvasContext.translate(canvasInput.width, 0);
    canvasContext.scale(-1, 1);

    DT.enableWebcam = function () {
        if (DT.enableWebcam.satus === undefined) {
            DT.enableWebcam.satus = 'init';
            $('#compare, #overlay').show();
            // Game config
            var leftBreakThreshold = 60;
            var leftTurnThreshold =  50;
            var rightBreakThreshold =60;
            var rightTurnThreshold = 70;
            
            // Defime lib messages
            var statusMessages = {
                'whitebalance' : 'Checking cam and white balance',
                'detecting' : 'Head detected',
                'hints' : 'Something wrong. Try move your head',
                'redetecting' : 'Head lost, search',
                'lost' : 'Head lost',
                'found' : 'Now move to start'
            };
            
            var supportMessages = {
                'no getUserMedia' : 'Browser not allowed getUserMedia',
                'no camera' : 'Camera not found'
            };

            var headtrackrStatusHandler = function(event) {
                if (event.status in supportMessages) {
                    console.log(supportMessages[event.status]);
                } else if (event.status in statusMessages) {
                    console.log(statusMessages[event.status]);
                }
                if (event.status === 'camera found') {
                    $('#head').show();
                    $('.webcam_message').html('Move your head left and right<br>to steer the sphere');
                }
            };

            var facetrackingEventHandler = function( event ) {
                // once we have stable tracking, draw rectangle
                if (event.detection == 'CS' && DT.enableWebcam.satus !== 'disabled' && !DT.game.wasPaused) {
                    var posX = (event.x/120)*canvasInput.width;

                    if(posX < leftBreakThreshold) {
                        if(posX > leftTurnThreshold) {
                            DT.handlers.center();
                        } else {
                            if (!DT.enableWebcam.checkLeft) {
                                DT.enableWebcam.checkLeft = true;
                                $('#left_v_check').show();
                                if (DT.enableWebcam.checkRight) $('.turn_to_start span').html('Now move to start')
                            }
                            DT.handlers.left();
                        }
                    } else if (posX > rightBreakThreshold) {
                        if(posX < rightTurnThreshold) {
                            DT.handlers.center();
                        } else {
                            if (!DT.enableWebcam.checkRight) {
                                DT.enableWebcam.checkRight = true;
                                $('#right_v_check').show();
                                if (DT.enableWebcam.checkLeft) $('.turn_to_start span').html('Now move to start')
                            }
                            DT.handlers.right();
                        }
                    } else {
                        DT.handlers.center();
                        if (!DT.game.wasStarted && !DT.enableWebcam.turnToStart && DT.enableWebcam.checkLeft && DT.enableWebcam.checkRight) {
                            DT.enableWebcam.turnToStart = true;
                            DT.enableWebcam.satus = 'enabled';
                            DT.$document.trigger('startGame', {control: 'webcam'});
                            DT.lastControl = 'webcam';
                        }
                    }
                }
            }
            
            document.addEventListener('headtrackrStatus', headtrackrStatusHandler, true);
            
            // Set heastrackr
            DT.htracker = DT.htracker || new headtrackr.Tracker({
                altVideo : {"ogv" : "/media/facekat/nocamfallback.ogv", "mp4" : "/media/facekat/nocamfallback.mp4"},
                smoothing : false,
                fadeVideo : true,
                ui : false
            });
            DT.htracker.init(videoInput, canvasInput);
            DT.htracker.start();


            var drawIdent = function(cContext,x,y) {
            
                // normalise values
                x = (x/120)*canvasInput.width;
                y = (y/90)*canvasInput.height;
            
                // clean canvas
                cContext.clearRect(0,0,canvasInput.width,canvasInput.height);
            
                // draw rectangle around canvas
                cContext.strokeRect(0,0,canvasInput.width,canvasInput.height);
            
                // draw marker, from x,y position
                cContext.strokeStyle = "#00CC00";
                cContext.beginPath();
                cContext.moveTo(x-5,y);
                cContext.lineTo(x+5,y);
                cContext.closePath();
                cContext.stroke();
            
                cContext.beginPath();
                cContext.moveTo(x,y-5);
                cContext.lineTo(x,y+5);
                cContext.closePath();
                cContext.stroke();
            };
            
            document.addEventListener("facetrackingEvent", function(e) {
                drawIdent(overlayContext, e.x, e.y);
            }, false);

            document.addEventListener("facetrackingEvent", function( event ) {
                // once we have stable tracking, draw rectangle
                if (event.detection == "CS") {
                    overlayContext.translate(event.x, event.y)
                    overlayContext.rotate(event.angle-(Math.PI/2));
                    overlayContext.strokeStyle = "#00CC00";
                    overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
                    overlayContext.rotate((Math.PI/2)-event.angle);
                    overlayContext.translate(-event.x, -event.y);
                }
            }, true);
            
            document.addEventListener('facetrackingEvent', facetrackingEventHandler, true);
            DT.$document.on('resetGame', function (e, data) {
                if (data.cause === 'chooseControl') {
                    DT.enableWebcam.satus = 'disabled';
                    DT.htracker.stop();
                    DT.enableWebcam.checkLeft = null;
                    DT.enableWebcam.checkRight = null;
                    DT.enableWebcam.turnToStart = null;
                    $('#left_v_check, #right_v_check').hide();
                }
            });
        } else {
            $('#compare, #overlay').show();
            DT.enableWebcam.satus = 'enabled';
            DT.htracker.start();
        }
    };
})();

// ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
// ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
// ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
// ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
;(function () {
    'use strict';
    DT.handlers = {};
    DT.handlers.startOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            if (!DT.game.wasStarted) {
                DT.$document.trigger('startGame', {control: 'keyboard'});
                DT.lastControl = 'keyboard';
            }
        }
    };
    DT.handlers.pauseOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.pause();
        }
    };
    DT.handlers.fullscreen = function () {
        var isActivated = THREEx.FullScreen.activated();
        if (isActivated) {
            THREEx.FullScreen.cancel();
        } else {
            THREEx.FullScreen.request(document.body);
        }
    };
    DT.handlers.pause = function (isShare) {
        if (!DT.game.wasStarted || DT.game.wasOver) return;
        if (DT.game.wasPaused) {
            DT.$document.trigger('resumeGame', {});
        } else {
            DT.$document.trigger('pauseGame', {isShare: isShare});
        }
    };
    DT.handlers.mute = function() {
        if (DT.game.param.globalVolume === 1) {
            DT.setVolume(0);
            $('.music_button').html('N');
            DT.game.wasMuted = true;
        } else {
            DT.setVolume(1);
            $('.music_button').html('M');
            DT.game.wasMuted = false;
        }
    };
    DT.handlers.toTheLeft = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== -1) {
            DT.audio.sounds['muv8'].play();
            DT.player.changeDestPoint(new THREE.Vector3(-1, 0, 0));
        }
    };
    DT.handlers.toTheRight = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== 1) {
            DT.audio.sounds['muv8'].play();
            DT.player.changeDestPoint(new THREE.Vector3(1, 0, 0));
        }
    };
    DT.handlers.left = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== -1) {
            DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = -1;
        }
    };
    DT.handlers.right = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== 1) {
            DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = 1;
        }
    };
    DT.handlers.center = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            if (DT.player.destPoint.x === -1) DT.audio.sounds['muv8'].play();
            if (DT.player.destPoint.x === 1) DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = 0;
        }
    };
    DT.handlers.restart = function () {
        DT.$document.trigger('resetGame', {});
        $('.game_over').fadeOut(250);
        if (!DT.game.wasStarted) DT.$document.trigger('startGame', {control: DT.lastControl});
    };
    DT.handlers.chooseControlAfterGameOver = function () {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.game_over').fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    };
    DT.handlers.restartOnSpace = function (event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.restart();
        }
    };
    DT.handlers.triggerOpacityOnLines = function (hide) {
        if (hide) {
            DT.player.lines.children[0].material.opacity = 0;
            DT.player.lines.children[1].material.opacity = 0;
        } else if (!DT.player.isFun && !DT.player.isInvulnerability) {
            DT.player.lines.children[0].material.opacity = 0.6;
            DT.player.lines.children[1].material.opacity = 0.4;
        }
    };
    DT.handlers.share = function () {
        if (!DT.game.wasStarted || DT.game.wasOver || DT.shared) {
            DT.shared = !DT.shared;
            DT.$share.toggleClass('show-table');
            if ($('.choose_control')[0].style.webkitFilter === 'blur(0px)' || $('.choose_control')[0].style.webkitFilter === '') {
                $('.choose_control, .game_over, #interface, .mobile_choosen, .webcam_choosen').css({webkitFilter:'blur(10px)'});
                $(DT.renderer.domElement).css({webkitFilter:'blur(10px)'});
                if (DT.$share[0].style.webkitFilter !== undefined) {
                    DT.$share.css({'background-color': 'transparent'});
                }
            } else {
                $('.choose_control, .game_over, #interface, .mobile_choosen, .webcam_choosen').css({webkitFilter:'blur(0px)'});
                $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});
            }
        } else if (!DT.game.wasPaused) {
            DT.handlers.pause(true);
        } else if (DT.game.wasPaused) {
            DT.$pause.find('.social').show();
            DT.$pause.find('.change_controls').hide();
        }
    };
    DT.handlers.wowClick = function () {
        var dogecoinId = DT.$dogecoin.val();
        if (dogecoinId === '') {
            DT.$gameovermessage.html('type your dogecoin id');
        } else {
            DT.$gameovermessage.html('checking...');
            DT.$document.trigger('checkup', {dogecoinId: dogecoinId});
            $('#wow').unbind('click');
            $('#wow').on('click', function () {
                var oldText = DT.$gameovermessage.html();
                DT.$gameovermessage.html('you have already sent a request');
                DT.gameovermessageTimeout = setTimeout(function () {
                    DT.$gameovermessage.html(oldText);
                }, 3000);
            })
        }
    };
    DT.$document.on('startGame', function (e, data) {
        if (DT.shared) DT.handlers.share();
        $('#wow').bind('click', DT.handlers.wowClick);
    });
    DT.$document.on('resetGame', function (e, data) {
        if (DT.shared) DT.handlers.share();
        $('#wow').unbind('click', DT.handlers.wowClick);
        DT.$gameovermessage.html('');
        DT.$dogecoin.val('');
    });
})();
// ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗
// ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
// ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗  
// ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝  
// ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗
// ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
;(function () {
    'use strict';
    var errors = [
        '400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '410',
        '411', '412', '413', '414', '415', '416', '417', '418', '422', '423', '424',
        '425', '426', '428', '429', '431', '434', '449', '451', '456', '499', '500',
        '501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511'],
        errorsLen = errors.length;

    DT.runApp = function () {
        DT.initSocket();
        if (!document.hasFocus()) {
            DT.setVolume(0);
        } else {
            DT.setVolume(1);
        }
        DT.playSound(2);
        $(function() {
            $('#loader').hide();
            $('#interface').show();
            $('#footer').show();
            DT.$chooseControl.css({'display': 'table', 'opacity': '1'});
            DT.$document.bind('keyup', DT.handlers.startOnSpace);
            $('.choose_wasd').click(function() {
                if (!DT.game.wasStarted) {
                    DT.$document.trigger('startGame', {control: 'keyboard'});
                    DT.lastControl = 'keyboard';
                }
            });
            $('.choose_mobile').click(function() {
                DT.$chooseControl.hide();
                DT.$document.unbind('keyup', DT.handlers.startOnSpace);
                $('.mobile_choosen').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
            });
            $('.choose_webcam').click(function() {
                DT.$chooseControl.hide();
                DT.$document.unbind('keyup', DT.handlers.startOnSpace);
                $('.webcam_choosen').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
                DT.enableWebcam();
            });
        });
    };
    $('.pause .resume').click(function() {
        DT.$document.trigger('resumeGame', {});
    });
    $('.share .resume').click(function() {
        DT.handlers.share();
    });
    $('.change_controls.pause_control').click(function() {
        DT.$document.trigger('gameOver', {cause: 'reset'});
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        DT.$pause.fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace); 
    });
    $('.change_controls.webcam_control').click(function() {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.webcam_choosen').fadeOut(250);
        $('#compare, #overlay').hide();
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    });
    $('.change_controls.mobile_control').click(function() {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.mobile_choosen').fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    });
    $('#dogecoin').on('keyup', function (e) {
        e.stopPropagation();
    });
    $('#share-link').on('click', function (e) {
        e.preventDefault()
        DT.handlers.share();
    });
    DT.$document.keyup(function(event) {
        var k = event.keyCode;
        if (k === 77) {
            DT.handlers.mute();
        }
    });
    DT.$document.keyup(function(event) {
        var k = event.keyCode;
        if (k === 70) {
            DT.handlers.fullscreen();
        }
    });
    DT.$document.on('hit', function (e, data) {
        $('.error').html(errors[DT.genRandomFloorBetween(0, errorsLen)]);
        $('.hit').css({'display': 'table'}).fadeOut(250);
    });
    DT.$document.on('startGame', function (e, data) {
        DT.$chooseControl.fadeOut(250);
        $('.mobile_choosen').fadeOut(250);
        $('.webcam_choosen').fadeOut(250);
        DT.$document.unbind('keyup', DT.handlers.startOnSpace);
    });
    DT.$document.on('socketInitialized', function (e, gameCode) {
        var address = DT.server + '/m/#' + gameCode;
        $('.mobile_message span').html(address);
        $('#qrcode').html('').qrcode(address);
    });
    DT.$document.on('pauseGame', function (e, data) {
        if (data.isShare) {
            DT.$pause.find('.social').show();
            DT.$pause.find('.change_controls').hide();
        } else {
            DT.$pause.find('.social').hide();
            DT.$pause.find('.change_controls').show();
        }
        DT.$pause.css({'display': 'table'});
        $(DT.renderer.domElement).css({webkitFilter:'blur(10px)'});
        if (DT.$pause[0].style.webkitFilter !== undefined) {
            DT.$pause.css({'background-color': 'transparent'});
        }
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.$pause.css({'display': 'none'});
        $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});
    });
    DT.$document.on('showScore', function (e, data) {
        $('.current_coins').text(data.score);
    });
    DT.$document.on('gameOver', function (e, data) {
        if (data.cause === 'death') {
            $('.total_coins').text(Math.round(DT.player.currentScore));
            $('.game_over').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        $('canvas').css({webkitFilter:'blur(0px)'});
        $('.current_coins').html('0');
        DT.$title.html('digital trip');

        DT.$document.unbind('keyup', DT.handlers.restartOnSpace);
        $('.restart').unbind('click', DT.handlers.restart);
        $('.change_controls.gameover_control').unbind('click', DT.handlers.chooseControlAfterGameOver);
    });
    DT.$document.on('resetGame', function (e, data) {
        if (data.cause === 'chooseControl') {
            $('#compare, #overlay').hide();
        }
    });
    DT.$document.on('paymentMessage', function (e, data) {
        var text = data.type === 'transactionStart' ? 'transaction started. wait for complete...' : 'transaction denied. it seems like you tried to cheat';
        clearTimeout(DT.gameovermessageTimeout);
        DT.$gameovermessage.html(text);
    });
    DT.$document.on('transactionMessage', function (e, data) {
        var transactionid, error;
        try {
            transactionid = JSON.parse(data.transactionid).data.txid;
        }
        catch (e) {
            transactionid = data.transactionid;
        }
        try {
            error = JSON.parse(data.error).error;
        }
        catch (e) {
            error = data.error;
        }
        var text = data.type === 'transactionComplete' ? 'transaction complete. id: ' + transactionid : 'transaction failed. error: ' + error;
        clearTimeout(DT.gameovermessageTimeout);
        DT.$gameovermessage.html(text);
    });
    DT.$document.on('gameOver', function (e, data) {
        $('.restart').bind('click',DT.handlers.restart);
        $('.change_controls.gameover_control').bind('click', DT.handlers.chooseControlAfterGameOver);
        DT.$document.bind('keyup', DT.handlers.restartOnSpace);
    });
})();
// ███████╗████████╗ █████╗ ████████╗███████╗
// ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
// ███████╗   ██║   ███████║   ██║   ███████╗
// ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
// ███████║   ██║   ██║  ██║   ██║   ███████║
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
// ;(function () {
//     'use strict';
//     DT.setStats = function () {
//         var body = document.getElementsByTagName('body')[0];
//         DT.stats = DT.stats|| new Stats();
//         DT.stats.domElement.style.position = 'absolute';
//         DT.stats.domElement.style.top = '0px';
//         DT.stats.domElement.style.left = '0px';
//         DT.stats.domElement.style.zIndex = 100;
//         body.appendChild( DT.stats.domElement );
//         DT.stats2 = DT.stats2 || new Stats();
//         DT.stats2.setMode(1);
//         DT.stats2.domElement.style.position = 'absolute';
//         DT.stats2.domElement.style.top = '0px';
//         DT.stats2.domElement.style.left = '80px';
//         DT.stats2.domElement.style.zIndex = 100;
//         body.appendChild( DT.stats2.domElement );

//         DT.rendererStats  = new THREEx.RendererStats();
//         DT.rendererStats.domElement.style.position = 'absolute';
//         DT.rendererStats.domElement.style.left = '0px';
//         DT.rendererStats.domElement.style.top = '50px';
//         DT.rendererStats.domElement.style.zIndex = 100;
//         DT.rendererStats.domElement.style.width = '90px';
//         body.appendChild(DT.rendererStats.domElement);
//     };
//     DT.setStats();
//     DT.$document.on('update', function (e, data) {
//         DT.stats.update();
//         DT.stats2.update();
//         DT.rendererStats.update(DT.renderer);
//     });  
// })();

    return DT;
}(this, this.document));
//# sourceMappingURL=DT.js.map