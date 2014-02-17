var composer,
    hblur, vblur;

composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
composer.addPass( hblur );

vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
vblur.renderToScreen = true;
composer.addPass( vblur );