import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

let scene, camera, renderer, controls;
let model;
let blenderLights = [];
let isWireframe = false;
let isRotating = false;

let ambientLight, directionalLight;

function init() {
    // Create the scene with a dark gray background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // Fix aspect ratio distortion
    const aspectRatio = window.innerWidth * 0.6 / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
    camera.position.set(0, 2, 5);

    // Initialize renderer with tone mapping
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    document.getElementById('renderArea').appendChild(renderer.domElement);

    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add ambient light for general illumination
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light for shadows and highlights
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Set up event listeners for UI controls
    document.getElementById('toggleRotation').addEventListener('click', toggleRotation);
    document.getElementById('toggleLight').addEventListener('click', toggleLight);
    document.getElementById('lightIntensity').addEventListener('input', adjustLightIntensity);
    document.getElementById('lightColor').addEventListener('input', changeLightColor);
    document.getElementById('viewStructure').addEventListener('click', toggleWireframe);
    document.getElementById('backButton').addEventListener('click', () => window.location.href = "index.html");

    loadModel();
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('assets/models/chinese_vintage_lantern_2.glb', (gltf) => {
        model = gltf.scene;
        scene.add(model);

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);
        model.scale.setScalar(2.5 / size);

        // Adjust control target
        controls.target.copy(new THREE.Vector3(0, -0.5, 0));
        controls.update();

        // Process model lights
        blenderLights = [];
        model.traverse((object) => {
            if (object.isLight) {
                object.intensity = Math.max(object.intensity, 1);
                blenderLights.push(object);
            }
        });

        // Initialize light UI controls if lights exist
        if (blenderLights.length > 0) {
            document.getElementById('lightIntensity').value = blenderLights[0].intensity;
        }
    });
}

// Toggle model rotation
function toggleRotation() {
    isRotating = !isRotating;
}

// Toggle visibility of lights in the model
function toggleLight() {
    blenderLights.forEach(light => {
        light.visible = !light.visible;
    });
}

// Adjust light intensity
function adjustLightIntensity(event) {
    const intensity = parseFloat(event.target.value);
    blenderLights.forEach(light => {
        light.intensity = intensity;
    });
}

// Change light color
function changeLightColor(event) {
    const color = new THREE.Color(event.target.value);
    blenderLights.forEach(light => {
        light.color.set(color);
    });
}

// Toggle wireframe mode for the model
function toggleWireframe() {
    isWireframe = !isWireframe;
    model.traverse(obj => obj.isMesh && (obj.material.wireframe = isWireframe));
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (isRotating && model) model.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();
