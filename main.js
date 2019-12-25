
var container
var scene, camera, renderer, controls

var mouseX = 0, mouseY = 0;
var start_time = Date.now();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var Y_AXIS, camera_pivot

init();
animate();

function init() {
    //container = document.createElement('div');
    //document.body.appendChild(container);

    // setup scene
    scene = new THREE.Scene();

    // setup camera
    //camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 30000 );
    //camera.position.z = 5000;
    camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
    camera.position.set(-900,-200,-900);

    // setup lights
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    //load skybox
    var textureLoader = new THREE.TextureLoader();

    let materialArray = [];
    let texture_ft = textureLoader.load("./assets/peaks_ft.png");
    let texture_bk = textureLoader.load("./assets/peaks_bk.png");
    let texture_up = textureLoader.load("./assets/peaks_up.png");
    let texture_dn = textureLoader.load("./assets/peaks_dn.png");
    let texture_rt = textureLoader.load("./assets/peaks_rt.png");
    let texture_lf = textureLoader.load("./assets/peaks_lf.png");
    
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

    for (let i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
    }
    let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    scene.add( skybox );

    // pivot camera
    camera_pivot = new THREE.Object3D()
    Y_AXIS = new THREE.Vector3( 0, 1, 0 );
    scene.add( camera_pivot );
    camera_pivot.add( camera );
    camera.position.set( 500, 0, 0 );
    camera.lookAt( camera_pivot.position );

    // adding text
    var merry = document.createElement('div');
    merry.style.position = 'absolute';
    merry.style.zIndex = 1;
    merry.style.width = 100;
    merry.style.height = 100;
    //merry.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    merry.innerHTML = "MERRY CHRISTMAS!";
    merry.style.color="#11800d";
    merry.style.top = 100 + 'px';
    merry.style.left = 200 + 'px';
    document.body.appendChild(merry);

    var msg = document.createElement('div');
    msg.style.position = 'absolute';
    msg.style.zIndex = 1;
    msg.style.width = 100;
    msg.style.height = 100;
    msg.style.backgroundColor = "transparent";
    msg.innerHTML = "click below to go to your virutal happy place :-)";
    msg.style.top = 150 + 'px';
    msg.style.left = 250 + 'px';
    document.body.appendChild(msg);

    var nav = document.createElement('div');
    nav.style.position = 'absolute';
    nav.style.zIndex = 1;
    nav.style.width = 100;
    nav.style.height = 100;
    nav.style.backgroundColor = "transparent";
    nav.innerHTML = "<a href='./evie.html'>EVIE</a><br></br><a href='./danny.html'>DAN</a><br></br><a href='./brian.html'>BRIAN</a><br></br><a href='./mom_jeff.html'>MOM & JEFF</a>";
    nav.style.top = 200 + 'px';
    nav.style.left = 300 + 'px';
    document.body.appendChild(nav);
    
    
    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function animate() {
    requestAnimationFrame(animate);

    camera_pivot.rotateOnAxis( Y_AXIS, 0.001 );    // radians

    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
