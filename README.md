## THREEJS GIF MATERIAL

**Inspired by [@gtk2k](https://github.com/gtk2k)'s [amazing sample](https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif).**

### Usage: 
```javascript
import * as THREE from 'three';
import GifMaterial from 'three-gif-material';

function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1 );
  document.body.appendChild( renderer.domElement );
  
  const orbit = new THREE.OrbitControls( camera, renderer.domElement );
  orbit.enableZoom = false;
  
  const geometry = new THREE.PlaneBufferGeometry(2, 2);
  const material = new GifMaterial();
  material.setParams({uri: '', autoplay: true});
  
  scene.add(new THREE.Mesh(geometry, material));
  
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  
  render();
}
```

### Api Reference

`1. material.setParams({uri, autoplay}: {uri: string, autoplay: boolean}): Initiliaze the material  with params.`

`2. material.play(): Start playing the gif frames.`

`3. material.pause(): Pause the gif frames.`

`4. material.reset(): Reset the material properties.`


