// Prepare the glow composer's render target
var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
renderTargetGlow = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );
 
// Prepare the blur shader passes
hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );
 
var bluriness = 3;
 
hblur.uniforms[ "h" ].value = bluriness / SCREEN_WIDTH;
vblur.uniforms[ "v" ].value = bluriness / SCREEN_HEIGHT;
 
// Prepare the glow scene render pass
var renderModelGlow = new THREE.RenderPass( glowscene, camera);
 
// Create the glow composer
glowcomposer = new THREE.EffectComposer( renderer, renderTargetGlow );
 
// Add all the glow passes
glowcomposer.addPass( renderModelGlow );
glowcomposer.addPass( hblur );
glowcomposer.addPass( vblur );

glowcomposer.render();