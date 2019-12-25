// pulled pretty heavily from Eyal's how to make almost anything page
// https://gitlab.cba.mit.edu/classes/863.19/CBA/cbasite/blob/master/people/eyal/index.html

var container 
var scene, camera, renderer

var mouseX = 0, mouseY = 0;
var start_time = Date.now();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();


function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // setup scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xcce0ff );
    var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

    // setup camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 5000;

    // setup lights
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    var textureLoader = new THREE.TextureLoader();

    //cloud material
    var cloudTexture = textureLoader.load('./assets/cloud.png')
    cloudTexture.magFilter = THREE.LinearMipMapLinearFilter;
    cloudTexture.minFilter = THREE.LinearMipMapLinearFilter;


    var cloudMaterial = new THREE.ShaderMaterial({
        uniforms: {

	    "map": { type: "t", value: cloudTexture },
	    "fogColor" : { type: "c", value: fog.color },
	    "fogNear" : { type: "f", value: fog.near },
	    "fogFar" : { type: "f", value: fog.far },

	},
	vertexShader: document.getElementById( 'vs' ).textContent,
	fragmentShader: document.getElementById( 'fs' ).textContent,
	depthWrite: false,
	depthTest: false,
	transparent: true
    } );

    // generate sky of clouds
    var geometry = new THREE.Geometry();
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    for ( var i = 0; i < 8000; i++ ) {

	plane.position.x = Math.random() * 1000 - 500;
	plane.position.y = - Math.random() * Math.random() * 200 - 15;
	plane.position.z = i;
	plane.rotation.z = Math.random() * Math.PI;
	plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

        //geometry.merge(plane);
	THREE.GeometryUtils.merge( geometry, plane );

    }

    mesh = new THREE.Mesh( geometry, cloudMaterial );
    scene.add( mesh );

    mesh = new THREE.Mesh( geometry, cloudMaterial );
    mesh.position.z = - 8000;
    scene.add( mesh );

    // background sky
    scene.background = textureLoader.load('./assets/sky.jpg');

    
    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function animate() {
    requestAnimationFrame(animate);

    position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

    camera.position.x += ( mouseX - camera.position.x ) * 0.01;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
    camera.position.z = - position + 8000;

    renderer.render(scene, camera);
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
