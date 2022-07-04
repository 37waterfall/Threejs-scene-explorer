import * as THREE from './libs/three.module.js'
import Stats from './libs/stats.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { RoomEnvironment } from './libs/RoomEnvironment.js'

import { OrbitControls } from './libs/OrbitControls.js';

import { TWEEN } from './libs/tween.module.min.js'


let stats, clock;
let scene, camera, renderer, mixer, controls;

init();
animate();

function init() {

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    // scene.fog = new THREE.Fog(scene.background, 1, 5000);
    scene.background = new THREE.Color(0xaccdff);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    //

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(100, 150, 50);
    // camera.lookAt(scene.position);



    //

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // LIGHTS

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    scene.add(hemiLightHelper);

    //

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(- 1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
    scene.add(dirLightHelper);

    // GROUND

    // const groundGeo = new THREE.PlaneGeometry(10000, 10000);
    // const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    // groundMat.color.setHSL(0.095, 1, 0.75);

    // const ground = new THREE.Mesh(groundGeo, groundMat);
    // ground.position.y = - 33;
    // ground.rotation.x = - Math.PI / 2;
    // ground.receiveShadow = true;
    // scene.add(ground);


    //

    // const geometry = new THREE.BoxGeometry(5, 5, 5);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);


    // model

    const loader = new GLTFLoader().setPath('../gltf/');
    loader.load('final-test.glb', function (gltf) {

        scene.add(gltf.scene);

        render();

    });


    //

    stats = new Stats();
    document.body.appendChild(stats.dom);


    //

    // 

    controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 20;
    controls.maxDistance = 1000;
    controls.autoRotate = true;
    // controls.target.set(10, 90, - 16);

    //


    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {


    renderer.render(scene, camera);

    controls.update();

    TWEEN.update();

    stats.update();

}

// dom

let guideMode = document.getElementById('guideMode');
let exploreMode = document.getElementById('exploreMode');

let chooseItems = document.getElementsByClassName('chooseItem');
let leftBtn = document.getElementById('leftBtn');
let rightBtn = document.getElementById('rightBtn');

guideMode.addEventListener('click', function () {
    exploreMode.classList.remove('active');
    guideMode.classList.add('active');
})

exploreMode.addEventListener('click', function () {
    exploreMode.classList.add('active');
    guideMode.classList.remove('active');

    console.log(chooseItems)
})

const duration = 2000;

for (let i = 0; i < chooseItems.length; i++) {
    chooseItems[i].onclick = function (e) {

        for (let i = 0; i < chooseItems.length; i++) {
            chooseItems[i].classList.remove('activeItem');
        }

        chooseItems[i].classList.add('activeItem')

        if (i === 0) {
            controls.autoRotate = true;
            controls.enabled = true;

            new TWEEN.Tween(camera.position)
                .to({
                    x: 100,
                    y: 150,
                    z: 50
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

        }

        if (i === 1) {

            new TWEEN.Tween(camera.position)
                .to({
                    x: -15.2,
                    y: 1.6,
                    z: 108
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            controls.enabled = false;

            controls.autoRotate = false;

        }

    }
}

leftBtn.addEventListener('click', function () {
    new TWEEN.Tween(camera.position)
        .to({
            x: -15.2,
            y: 1.6,
            z: 108
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
})

rightBtn.addEventListener('click', function () {

    let chain1 = new TWEEN.Tween(camera.position)
        .to({
            x: -15.2,
            y: 1.6,
            z: 90
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    let chain2 = new TWEEN.Tween(camera.position)
        .to({
            x: -5.2,
            y: 1.6,
            z: 90
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)

    chain1.chain(chain2)
})


