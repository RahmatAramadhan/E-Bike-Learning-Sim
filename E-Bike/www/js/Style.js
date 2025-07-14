const sw = document.getElementById('switch');
const status = document.getElementById('status');
let isOn = true;

sw.addEventListener('click', () => {
    isOn = !isOn;
    if (isOn) {
        sw.classList.remove('off');
        status.textContent = 'ON';
    } else {
        sw.classList.add('off');
        status.textContent = 'OFF';
    }
});

const keyRotator = document.getElementById('key-rotator');
    const keyStatusText = document.getElementById('key-status-text');
    let locked = true;

    keyRotator.addEventListener('click', () => {
        locked = !locked;
        keyRotator.classList.toggle('unlocked', !locked);
        keyStatusText.textContent = locked ? 'LOCKED' : 'UNLOCKED';
    }
);

const knob = document.getElementById('knob');
const positions = ['P', 'R', 'D'];
let currentIndex = 0;

const angleMap = {
    0: -40, 
    1: 0,   
    2: 40   
};

function updateKnob() {
    const angle = angleMap[currentIndex];
    knob.style.transform = `rotate(${angle}deg)`;
}

document.getElementById('leftBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + positions.length) % positions.length;
    updateKnob();
});

document.getElementById('rightBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % positions.length;
    updateKnob();
});

updateKnob();

const switchKnob = document.getElementById('switchKnob');
  const label = document.getElementById('knobLabel');

  const positionsLabel = [2, 31, 60]; 
  const labels = ['I', 'O', 'II']; 
  let current = 0;

  switchKnob.addEventListener('click', () => {
    current = (current + 1) % positionsLabel.length;
    switchKnob.style.left = positionsLabel[current] + 'px';
    label.textContent = labels[current];
    console.log("Mode:", labels[current]);
});

let mixer;
let action;
let speed = 0;
const acceleration = 0.01;       // naiknya lebih cepat dari sebelumnya
const deceleration = 0.008;      // turunnya juga agak cepat biar gak ngambang
const maxSpeed = 3; 
let isPressed = false;

// === DOM ===
const container = document.getElementById("wheel-cycle");
const pedalBtn = document.getElementById("pedal-button");
const kecepatanDiv = document.getElementById("kecepatan");

// === SCENE ===
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e7efff');

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(120, 20, 120);
camera.lookAt(0, 0, 0);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// === LIGHT ===
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// === MODEL ===
const loader = new THREE.GLTFLoader();
loader.setPath('../../Assets/3d/');
loader.load('Roda.glb', (gltf) => {
    const object = gltf.scene;
    object.position.set(0, 0, 0);
    object.rotation.y = -0.8;
    object.scale.set(1, 1, 1);
    scene.add(object);

    // Ambil animasi dari Blender
    if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(object);
        action = mixer.clipAction(gltf.animations[0]);
        action.play();
        action.timeScale = 0;
    }
}, undefined, (error) => {
    console.error('GLB Load Error:', error);
});

// === EVENT GAS BUTTON ===
pedalBtn.addEventListener("mousedown", () => isPressed = true);
pedalBtn.addEventListener("mouseup", () => isPressed = false);
pedalBtn.addEventListener("mouseleave", () => isPressed = false);
// Touch support
pedalBtn.addEventListener("touchstart", () => isPressed = true);
pedalBtn.addEventListener("touchend", () => isPressed = false);

// === RESIZE HANDLING ===
window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// === ANIMASI LOOP ===
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Naik atau turun speed
    if (isPressed) {
        if (speed < maxSpeed) speed += acceleration;
    } else {
        if (speed > 0) speed -= deceleration;
        if (speed < 0) speed = 0;
    }

    if (action) action.timeScale = speed;

    // Tampilkan kecepatan (0–60 berdasarkan proporsi dari maxSpeed)
    const displayedSpeed = Math.round((speed / maxSpeed) * 60);
    kecepatanDiv.textContent = displayedSpeed.toString().padStart(2, "0");

    renderer.render(scene, camera);
}
animate();
