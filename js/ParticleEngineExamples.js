Examples = {
	startunnel : {
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( 0, 0, -500 ),
		positionSpread : new THREE.Vector3( 10, 10, 10 ),

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3( 0, 0, 200 ),
		velocitySpread : new THREE.Vector3( 40, 40, 80 ), 
		
		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 10,
		angleVelocitySpread     : 0,
		
		particleTexture : THREE.ImageUtils.loadTexture( 'img/spikey.png' ),

		sizeBase    : 4.0,
		sizeSpread  : 2.0,				
		colorBase   : new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
		opacityBase : 1,
		blendStyle  : THREE.AdditiveBlending,

		particlesPerSecond : 100,
		particleDeathAge   : 4.0,		
		emitterDeathAge    : 60
	}
}
