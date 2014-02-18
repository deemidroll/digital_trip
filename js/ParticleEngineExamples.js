Examples = {
	startunnel : {
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( 0, 0, -200 ),
		positionSpread : new THREE.Vector3( 10, 10, 10 ),

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3( 0, 0, 100 ),
		velocitySpread : new THREE.Vector3( 5, 5, 80 ), 
		
		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 10,
		angleVelocitySpread     : 0,
		
		particleTexture : THREE.ImageUtils.loadTexture( 'img/spikey.png' ),

		sizeBase    : 1.0,
		sizeSpread  : 0.5,				
		colorBase   : new THREE.Vector3(0.0, 0.0, 0.2), // H,S,L
		opacityBase : 1,
		blendStyle  : THREE.AdditiveBlending,

		particlesPerSecond : 500,
		particleDeathAge   : 4.0,		
		emitterDeathAge    : 5
	}
}
