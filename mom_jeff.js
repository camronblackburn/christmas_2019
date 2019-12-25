// mostly pulled from this example
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

// TODO
// it will run out of water .. how to keep it ?

import * as THREE from './lib/three.module.js';

import { OrbitControls } from './lib/OrbitControls.module.js';
import { Water } from './lib/water.js';
import { Sky } from './lib/sky.js';


var container;
var camera, scene, renderer, controls;
var water

var start_time = Date.now();
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.getElementById( 'container' );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    //
    scene = new THREE.Scene();
    //
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.x = 30;
    camera.position.y = 30;
    camera.position.z = 100;
    //
    var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    scene.add( light );

    // Water
    var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
    water = new Water(
	waterGeometry,
	{
	    textureWidth: 512,
	    textureHeight: 512,
	    waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    } ),
	    alpha: 1.0,
	    sunDirection: light.position.clone().normalize(),
	    sunColor: 0xffffff,
	    waterColor: 0x001e0f, // 0x34aeeb, (blue water)
	    distortionScale: 3.7,
	    fog: scene.fog !== undefined
	}
    );
    water.rotation.x = - Math.PI / 2;
    scene.add( water );

    // Skybox
    var sky = new Sky();
    var uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = 10;
    uniforms[ 'rayleigh' ].value = 2;
    uniforms[ 'luminance' ].value = 1;
    uniforms[ 'mieCoefficient' ].value = 0.005;
    uniforms[ 'mieDirectionalG' ].value = 0.8;
    var parameters = {
	distance: 400,
	inclination: 0.49,
	azimuth: 0.205
    };
    var cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    scene.background = cubeCamera.renderTarget;
    function updateSun() {
	var theta = Math.PI * ( parameters.inclination - 0.5 );
	var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
	light.position.x = parameters.distance * Math.cos( phi );
	light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
	light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );
	sky.material.uniforms[ 'sunPosition' ].value = light.position.copy( light.position );
	water.material.uniforms[ 'sunDirection' ].value.copy( light.position ).normalize();
	cubeCamera.updateCubeMap( renderer, sky );
    }
    updateSun();

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    //
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener( 'resize', onWindowResize, false );
}

function onDocumentMouseMove() {
    mouseX = ( event.clientX - windowHalfX ) * 0.25;
    mouseY = ( event.clientY - windowHalfY ) * 0.15;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );

    var time = performance.now() * 0.001;
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    var position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;
    camera.position.x += ( mouseX - camera.position.x ) * 0.01;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
    camera.position.z = - position + 1;


    renderer.render( scene, camera );
}

