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

let scene, camera, renderer, mixer, model;
const clock = new THREE.Clock();

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);

    const container = document.getElementById('wheel-cycle');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement)

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(light);

    const loader = new THREE.GLTFLoader();
    loader.load('../../Assets/3d/Roda/Wheel.gltf', (gltf) => {
      model = gltf.scene;
      scene.add(model);
      model.position.set(0, 0, 0);

      // Setup animation
      mixer = new THREE.AnimationMixer(model);
      if (gltf.animations.length > 0) {
        const action = mixer.clipAction(gltf.animations[0]);
        document.getElementById('btnAnimate').onclick = () => {
          action.reset();
          action.play();
        };
      }
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}


