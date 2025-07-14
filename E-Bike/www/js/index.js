import { initRodaScene } from './Style.js';

let selectedPin = null;

const connections = {
    monitor: {
        IG:   { status: null, connectedTo: null },
        LIN:  { status: null, connectedTo: null },
        '-':  { status: null, connectedTo: null }
    },
    motor: {
        '+':  { status: null, connectedTo: null },
        '-':  { status: null, connectedTo: null },
        A:    { status: null, connectedTo: null },
        B:    { status: null, connectedTo: null },
        C:    { status: null, connectedTo: null },
        U:    { status: null, connectedTo: null },
        V:    { status: null, connectedTo: null },
        W:    { status: null, connectedTo: null }
    },
    transmisi: {
        P:     { status: null, connectedTo: null },
        R:     { status: null, connectedTo: null },
        '1':   { status: null, connectedTo: null },
        '3':   { status: null, connectedTo: null },
        GND:   { status: null, connectedTo: null },
        SPORT: { status: null, connectedTo: null }
    },
    pedal: {
        '+5V': { status: null, connectedTo: null },
        App:   { status: null, connectedTo: null },
        '-':   { status: null, connectedTo: null },
        REM:   { status: null, connectedTo: null }
    },
    battery: {
        S0:  { status: null, connectedTo: null },
        S1:  { status: null, connectedTo: null },
        S2:  { status: null, connectedTo: null },
        S3:  { status: null, connectedTo: null },
        S4:  { status: null, connectedTo: null },
        S5:  { status: null, connectedTo: null },
        S6:  { status: null, connectedTo: null },
        S7:  { status: null, connectedTo: null },
        S8:  { status: null, connectedTo: null },
        S9:  { status: null, connectedTo: null },
        S10: { status: null, connectedTo: null },
        S11: { status: null, connectedTo: null },
        S12: { status: null, connectedTo: null },
        S13: { status: null, connectedTo: null }
    },
    bms: {
        S0:  { status: null, connectedTo: null },
        S1:  { status: null, connectedTo: null },
        S2:  { status: null, connectedTo: null },
        S3:  { status: null, connectedTo: null },
        S4:  { status: null, connectedTo: null },
        S5:  { status: null, connectedTo: null },
        S6:  { status: null, connectedTo: null },
        S7:  { status: null, connectedTo: null },
        S8:  { status: null, connectedTo: null },
        S9:  { status: null, connectedTo: null },
        S10: { status: null, connectedTo: null },
        S11: { status: null, connectedTo: null },
        S12: { status: null, connectedTo: null },
        S13: { status: null, connectedTo: null }
    },
    kontak: {
        IG: { status: null, connectedTo: null }
    },
    controller : {
    '+': { status: null, connectedTo: null },
    'A': { status: null, connectedTo: null },
    'B': { status: null, connectedTo: null },
    'C': { status: null, connectedTo: null },
    '-': { status: null, connectedTo: null }, // digunakan oleh MinKiri dan MinKanan

    'U': { status: null, connectedTo: null },
    'V': { status: null, connectedTo: null },
    'W': { status: null, connectedTo: null },

    'LIN': { status: null, connectedTo: null },
    'P': { status: null, connectedTo: null },
    'R': { status: null, connectedTo: null },
    '1': { status: null, connectedTo: null },
    '3': { status: null, connectedTo: null },
    'SPORT': { status: null, connectedTo: null },
    '+5V': { status: null, connectedTo: null },
    'App': { status: null, connectedTo: null },
    'REM': { status: null, connectedTo: null },
    'IG': { status: null, connectedTo: null },
    'GND': { status: null, connectedTo: null },

    '+48V': { status: null, connectedTo: null },
    '-48V': { status: null, connectedTo: null }
    }
};


const allComponents = {
    monitor : null, motor : null, transmisi : null, pedal : null,
    converter : null, battery : null, kontak : null
};

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', function(){
        if(!selectedPin){
            selectedPin = pin;
            pin.classList.add('selected');
            return;
        }

        const pin1 = selectedPin;
        const pin2 = pin;

        if(pin1 === pin2){
            const group = pin1.dataset.group;
            const device = pin1.dataset.device;
            const conn = connections[device][group];
            const connectedId = conn?.connectedTo;
            
            if (conn && conn.status=== 'connected' && connectedId) {
                conn.status = null;
                conn.connectedTo = null;

                const targetPin = document.getElementById(connectedId);
                if (targetPin) {
                    const targetDevice = targetPin.dataset.device;
                    const targetGroup = targetPin.dataset.group;
                    const targetConn = connections[targetDevice]?.[targetGroup];
                    if (targetConn && targetConn.connectedTo === pin1.id) {
                        targetConn.status = null;
                        targetConn.connectedTo = null;
                    }
                    
                }
                pin1.classList.remove('connected');
                let stillConnected = false;
                for (const comp in connections) {
                    for (const pin in connections[comp]) {
                        const connection = connections[comp][pin];
                        if (connection && connection.connectedTo === connectedId) {
                            stillConnected = true;
                            break;
                        }
                    }
                    if (stillConnected) break;
                }

                if (!stillConnected) {
                    const targetPin = document.getElementById(connectedId);
                    if (targetPin) {
                        targetPin.classList.remove('connected');
                    }
                }
            }
        
            let stillConnected = false;
            for (const comp in connections) {
                for (const pin in connections[comp]) {
                    const connection = connections[comp][pin];
                    if (connection && connection.connectedTo === pin1.id) {
                        stillConnected = true;
                        break;
                    }
                }
                if (stillConnected) break;
            }
            if (!stillConnected) {
                pin1.classList.remove('connected');
            }

            pin1.classList.remove('selected');
            selectedPin = null;
            checkAllConnection();
            return;
        }

        const group1 = pin1.dataset.group;
        const group2 = pin2.dataset.group;
        const id1 = pin1.id;
        const device1 = pin1.dataset.device;
        const device2 = pin2.dataset.device;
        const id2 = pin2.id;

        const isSameGroup = group1 === group2;
        const isControllerConnection = device1 === 'controller' || device2 === 'controller' || (device1 === 'bms' && device2 === 'battery') || (device1 === 'battery' && device2 === 'bms');
        
        const targetDevice = device1 === 'controller' ? device2 : device1;

        if(!isSameGroup || !isControllerConnection || (device1 === 'controller' && device2 === 'controller')) {
            alert("Pin tidak cocok atau tidak berasal dari controller");
            pin1.classList.remove('selected');
            selectedPin = null;
            return;
        }
        const conn1 = connections[device1][group1];
        const conn2 = connections[device2][group2];
        if (conn1 && conn1.status === 'connected') {
            conn1.status = null;
            conn1.connectedTo = null;
            conn2.status = null;
            conn2.connectedTo = null;
            pin1.classList.remove('connected');
            pin2.classList.remove('connected');
        }else{
            conn1.status = 'connected';
            conn1.connectedTo = id2;
            conn2.status = 'connected';
            conn2.connectedTo = id1;

            pin1.classList.add('connected');
            pin2.classList.add('connected');
        }

        pin1.classList.remove('selected');
        selectedPin = null;
        checkAllConnection();
    });
});

function checkAllConnection() {
    let overallConnections = true; 

    Object.keys(connections).forEach(component => {
        const allTrue = Object.values(connections[component]).every(value => {return value && value.status === 'connected' && value.connectedTo !== null;});
        allComponents[component] = allTrue;
        if (!allTrue) overallConnections = false;
    });

    const indicator = document.querySelector('.indicator-status');
    if (overallConnections) {
        indicator.textContent = "All motors connected";
        indicator.style.backgroundColor = "limegreen";
    }else{
        indicator.textContent = "motor : " + allComponents.motor + " transmisi : " + allComponents.transmisi + " pedal : " +  allComponents.pedal + " battery : " + allComponents.battery + " kontak : " + allComponents.kontak + " monitor : " + allComponents.monitor ;
        indicator.style.backgroundColor = "red";
    }
}

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

// ========== ANIMASI RODA ==========
let mixer;
let action;
let speed = 0;
const acceleration = 0.01;
const deceleration = 0.008;
const maxSpeed = 3;
let isPressed = false;

// DOM untuk animasi roda
const container = document.getElementById("wheel-cycle");
const pedalBtn = document.getElementById("pedal-button");
const kecepatanDiv = document.getElementById("kecepatan");

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e7efff');

// Kamera
const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(120, 20, 120);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Pencahayaan
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Load model roda
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

// Event tekan tombol pedal
pedalBtn.addEventListener("mousedown", () => isPressed = true);
pedalBtn.addEventListener("mouseup", () => isPressed = false);
pedalBtn.addEventListener("mouseleave", () => isPressed = false);
pedalBtn.addEventListener("touchstart", () => isPressed = true);
pedalBtn.addEventListener("touchend", () => isPressed = false);

// Responsive resize
window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animasi render loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Perubahan kecepatan
    if (isPressed) {
        if (speed < maxSpeed) speed += acceleration;
    } else {
        if (speed > 0) speed -= deceleration;
        if (speed < 0) speed = 0;
    }

    if (action) action.timeScale = -speed;

    const displayedSpeed = Math.round((speed / maxSpeed) * 60);
    kecepatanDiv.textContent = displayedSpeed.toString().padStart(2, "0");

    renderer.render(scene, camera);
}
animate();

// ========== MODAL BATTERY DETAIL ==========
const btn = document.getElementById("battery-detail");
const modal = document.getElementById("popupModal");
const iframe = document.getElementById("modal-iframe");
const closeBtn = document.querySelector(".modal .close");

btn.addEventListener("click", () => {
    iframe.src = "pages/Battery.html";
    modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    setTimeout(() => { iframe.src = ""; }, 300);
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
        setTimeout(() => { iframe.src = ""; }, 300);
    }
});
