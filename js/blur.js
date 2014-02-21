var composer,
    hblur, vblur,
    bluriness = 0.5,
    winResize2   = new THREEx.WindowResize(composer, camera);

composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
hblur.uniforms[ "h" ].value *= bluriness;
composer.addPass( hblur );

vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
vblur.uniforms[ "v" ].value *= bluriness;
vblur.renderToScreen = true;
composer.addPass( vblur );

