import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

let scene, camera, renderer, controls;
let model;
let isRotating = false;
let blenderLights = [];
let isWireframe = false;

function init() {
    // Create scene and set background color
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // Initialize camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth * 0.6 / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 5);

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
    document.getElementById('renderArea').appendChild(renderer.domElement);

    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add ambient light and spotlight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(5, 10, 5);
    scene.add(spotLight);

    // Set up event listeners for UI controls
    document.getElementById('rotateModel').addEventListener('click', toggleRotation);
    document.getElementById('toggleLight').addEventListener('click', toggleLight);
    document.getElementById('lightIntensity').addEventListener('input', adjustLightIntensity);
    document.getElementById('lightColor').addEventListener('input', changeLightColor);
    document.getElementById('toggleStructure').addEventListener('click', toggleWireframe);
    document.getElementById('backButton').addEventListener('click', () => window.location.href = "index.html");
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('assets/models/european_lamp_1.glb', (gltf) => {
        model = gltf.scene;
        scene.add(model);

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);
        model.scale.setScalar(2.5 / size);

        // Adjust control target
        controls.target.copy(new THREE.Vector3(0, -1.5, 0));
        controls.update();

        // Process model lights and materials
        blenderLights = [];
        model.traverse((object) => {
            if (object.isLight) {
                object.intensity = Math.max(object.intensity, 1);
                blenderLights.push(object);
            }

            if (object.isMesh) {
                if (object.material) {
                    object.material.envMapIntensity = 1.5;
                    if (object.material.metalness > 0.5) {
                        object.material.roughness = 0.2;
                    }
                }
            }
        });
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
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.wireframe = isWireframe;
            child.material.color.set(isWireframe ? 0xffffff : 0xcccccc);
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (isRotating) {
        model.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth * 0.6 / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
});

init();
loadModel();
animate();
