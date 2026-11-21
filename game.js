
let scene, camera, renderer;
let player, car;
let keys = {};
let driving = false;
let speed = 0;

function startGame() {
    document.getElementById("start").style.display = "none";
    init();
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth/window.innerHeight, 0.1, 1000
    );

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

    let sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(20, 50, 20);
    scene.add(sun);

    // Ground
    let ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({color:0x399447})
    );
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);

    // Roads
    function makeRoad(x,z,w,d) {
        let road = new THREE.Mesh(
            new THREE.BoxGeometry(w,0.1,d),
            new THREE.MeshStandardMaterial({color:0x333333})
        );
        road.position.set(x,0.06,z);
        scene.add(road);
    }

    makeRoad(0,0,200,12);
    makeRoad(0,0,12,200);

    // City buildings
    for(let i=0;i<50;i++) {
        let h = 8 + Math.random()*20;

        let building = new THREE.Mesh(
            new THREE.BoxGeometry(8,h,8),
            new THREE.MeshStandardMaterial({
                color:Math.random()*0xffffff
            })
        );

        building.position.set(
            Math.random()*180-90,
            h/2,
            Math.random()*180-90
        );

        scene.add(building);
    }

    // Player
    player = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.5,1,4,8),
        new THREE.MeshStandardMaterial({color:0x0055ff})
    );
    player.position.set(0,1,5);
    scene.add(player);

    // Car
    car = new THREE.Group();

    let base = new THREE.Mesh(
        new THREE.BoxGeometry(2.5,1,4),
        new THREE.MeshStandardMaterial({color:0xff2222})
    );
    base.position.y = 0.7;
    car.add(base);

    let roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.8,0.8,2),
        new THREE.MeshStandardMaterial({color:0x55bbdd})
    );
    roof.position.y = 1.5;
    car.add(roof);

    car.position.set(5,0,5);
    scene.add(car);

    camera.position.set(0,8,15);

    document.addEventListener("keydown",e=>{
        keys[e.key.toLowerCase()] = true;

        if(e.key.toLowerCase()==="e") {
            if(!driving && player.position.distanceTo(car.position)<5) {
                driving = true;
            } else if(driving) {
                driving = false;
                player.position.copy(car.position);
                player.position.x += 3;
            }
        }
    });

    document.addEventListener("keyup",e=>{
        keys[e.key.toLowerCase()] = false;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if(driving) {
        if(keys.w) speed += 0.015;
        if(keys.s) speed -= 0.015;
        if(keys[" "]) speed *= 0.9;

        speed *= 0.99;

        if(keys.a) car.rotation.y += 0.035;
        if(keys.d) car.rotation.y -= 0.035;

        car.translateZ(-speed);
    } else {
        if(keys.w) player.position.z -= 0.15;
        if(keys.s) player.position.z += 0.15;
        if(keys.a) player.position.x -= 0.15;
        if(keys.d) player.position.x += 0.15;
    }

    let target = driving ? car.position : player.position;

    camera.position.x += (target.x-camera.position.x)*0.08;
    camera.position.z += (target.z+12-camera.position.z)*0.08;
    camera.position.y += (target.y+7-camera.position.y)*0.08;

    camera.lookAt(target);

    renderer.render(scene,camera);
}

window.addEventListener("resize",()=>{
    if(!camera) return;
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
});
