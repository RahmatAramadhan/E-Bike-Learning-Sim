// ========== SWITCH (ON/OFF) ==========
const sw = document.getElementById('switch');
const status = document.getElementById('status');
let isOn = true;

sw.addEventListener('click', () => {
    isOn = !isOn;
    sw.classList.toggle('off', !isOn);
    status.textContent = isOn ? 'ON' : 'OFF';
});

// ========== KEY LOCK TOGGLE ==========
const keyRotator = document.getElementById('key-rotator');
const keyStatusText = document.getElementById('key-status-text');
let locked = true;

keyRotator.addEventListener('click', () => {
    locked = !locked;
    keyRotator.classList.toggle('unlocked', !locked);
    keyStatusText.textContent = locked ? 'LOCKED' : 'UNLOCKED';
});

// ========== GEAR SELECTOR (KNOB) ==========
const knob = document.getElementById('knob');
const positions = ['P', 'R', 'D'];
let currentIndex = 0;

const angleMap = {
    0: -40,
    1: 0,
    2: 40
};

function updateKnob() {
    knob.style.transform = `rotate(${angleMap[currentIndex]}deg)`;
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

// ========== SWITCH MODE (I / O / II) ==========
const switchKnob = document.getElementById('switchKnob');
const label = document.getElementById('knobLabel');

const positionsLabel = [2, 31, 60];
const labels = ['I', 'O', 'II'];
let current = 0;

switchKnob.addEventListener('click', () => {
    current = (current + 1) % positionsLabel.length;
    switchKnob.style.left = `${positionsLabel[current]}px`;
    label.textContent = labels[current];
    console.log("Mode:", labels[current]);
});

export function initRodaScene(containerId, pedalButtonId, kecepatanId, aktifkanAnimasi = true) {
    let mixer;
    let action;
    let speed = 0;
    const acceleration = 0.01;
    const deceleration = 0.008;
    const maxSpeed = 3;
    let isPressed = false;

    const container = document.getElementById(containerId);
    const pedalBtn = document.getElementById(pedalButtonId);
    const kecepatanDiv = document.getElementById(kecepatanId);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e7efff');

    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(120, 20, 120);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const loader = new THREE.GLTFLoader();
    loader.setPath('../../Assets/3d/');
    loader.load('Roda.glb', (gltf) => {
        const object = gltf.scene;
        object.position.set(0, 0, 0);
        object.rotation.y = -0.8;
        object.scale.set(1, 1, 1);
        scene.add(object);

        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(object);
            action = mixer.clipAction(gltf.animations[0]);
            action.play();
            action.timeScale = 0;
        }
    }, undefined, (error) => {
        console.error('GLB Load Error:', error);
    });

    if (aktifkanAnimasi) {
        pedalBtn.addEventListener("mousedown", () => isPressed = true);
        pedalBtn.addEventListener("mouseup", () => isPressed = false);
        pedalBtn.addEventListener("mouseleave", () => isPressed = false);
        pedalBtn.addEventListener("touchstart", () => isPressed = true);
        pedalBtn.addEventListener("touchend", () => isPressed = false);
    }

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        if (aktifkanAnimasi) {
            if (isPressed) {
                if (speed < maxSpeed) speed += acceleration;
            } else {
                if (speed > 0) speed -= deceleration;
                if (speed < 0) speed = 0;
            }

            if (action) action.timeScale = -speed;

            const displayedSpeed = Math.round((speed / maxSpeed) * 60);
            kecepatanDiv.textContent = displayedSpeed > 0
                ? displayedSpeed.toString().padStart(2, "0")
                : "00"; 
        } else {
            kecepatanDiv.textContent = "--";
        }

        renderer.render(scene, camera);
    }

    animate();
}



