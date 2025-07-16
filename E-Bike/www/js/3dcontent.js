const seriMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const paralelMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const spacingX = 0.24;
const spacingZ = 0.24;
const spacingY = 0.55;
const bateraiPerBaris = 10;

let bateraiList = [];
let jumlahSeri = 0;
let jumlahParalel = 0;
let voltPerBattery = 3.7;
let kapasitasPerBattery = 2.5;
let batteryModel = null;

const loader = new THREE.GLTFLoader();

loader.load('../../../Assets/3d/Batteryglb.gltf', (gltf) => {
  batteryModel = gltf.scene;
});

function updateLabel() {
  const totalVolt = jumlahSeri * voltPerBattery;
  const totalAh = jumlahParalel * kapasitasPerBattery;
  document.getElementById("totalVolt").textContent = totalVolt;
  document.getElementById("totalAh").textContent = totalAh;
}

function tambahSeri() {
  if (!batteryModel) {
    console.warn("Battery model belum siap.");
    return;
  }

  const total = jumlahSeri;
  const row = Math.floor(total / bateraiPerBaris);
  const col = total % bateraiPerBaris;

  const xOffset = col * spacingX;
  const yOffset = -row * spacingY;
  const zOffset = 0;

  const battery = batteryModel.clone(true);
  battery.scale.set(0.5, 0.5, 0.5);
  battery.position.set(xOffset, yOffset, zOffset);
  battery.traverse((child) => {
    if (child.isMesh) child.material = seriMaterial;
  });

  scene.add(battery);
  bateraiList.push(battery);
  jumlahSeri++;
  if (jumlahParalel === 0) jumlahParalel = 1;
  updateLabel();
}

function tambahParalel() {
  if (!batteryModel) {
    console.warn("Battery model belum siap.");
    return;
  }

  if (jumlahSeri === 0) {
    tambahSeri();
    setTimeout(() => tambahParalel(), 200);
    return;
  }

  const currentSeri = jumlahSeri;
  const zOffset = -jumlahParalel * spacingZ;

  for (let i = 0; i < currentSeri; i++) {
    const row = Math.floor(i / bateraiPerBaris);
    const col = i % bateraiPerBaris;
    const xOffset = col * spacingX;
    const yOffset = -row * spacingY;

    const battery = batteryModel.clone(true);
    battery.scale.set(0.5, 0.5, 0.5);
    battery.position.set(xOffset, yOffset, zOffset);
    battery.traverse((child) => {
      if (child.isMesh) child.material = paralelMaterial;
    });

    scene.add(battery);
    bateraiList.push(battery);
  }

  jumlahParalel++;
  updateLabel();
}

function resetRangkaian() {
  bateraiList.forEach(b => scene.remove(b));
  bateraiList = [];
  jumlahSeri = 0;
  jumlahParalel = 0;
  updateLabel();
}

// ================= Scene Kiri (Detail) ================= //
const detailContainer = document.getElementById('batteryDetailCanvas');
const detailScene = new THREE.Scene();
detailScene.background = new THREE.Color(0xf5f5f5);

const detailCamera = new THREE.PerspectiveCamera(
  50,
  detailContainer.clientWidth / detailContainer.clientHeight,
  0.1,
  1000
);
detailCamera.position.set(7, 5, 8); // Geser ke kanan objek (sumbu X+)
detailCamera.lookAt(0, 1.5, 0);  

const detailRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
detailRenderer.setSize(detailContainer.clientWidth, detailContainer.clientHeight);
detailContainer.appendChild(detailRenderer.domElement);

const detailControls = new THREE.OrbitControls(detailCamera, detailRenderer.domElement);
detailControls.enableDamping = true;

const detailLight = new THREE.DirectionalLight(0xffffff, 0.8);
detailLight.position.set(3, 3, 3);
detailScene.add(detailLight);
detailScene.add(new THREE.AmbientLight(0x404040));

let mixer = null;
let clock = new THREE.Clock();
let animationReady = false;

const detailLoader = new THREE.GLTFLoader();
detailLoader.load('../../../Assets/3d/Battery_fix.glb', (gltf) => {
  const object = gltf.scene;
  object.scale.set(0.5, 0.5, 0.5);
  object.position.set(0, 0, 0);
  detailScene.add(object);

  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(gltf.animations[0]);
    action.setLoop(THREE.LoopOnce);  
    action.clampWhenFinished = true; 
    action.paused = true;            
    action.play();
  
    mixer.addEventListener('finished', () => {
      action.paused = true;
    });
  
    animationReady = true;
  }
  
});

function animateDetail() {
  requestAnimationFrame(animateDetail);

  const delta = clock.getDelta();
  if (mixer && animationReady) {
    mixer.update(delta);
  }

  detailControls.update();
  detailRenderer.render(detailScene, detailCamera);
}
animateDetail();

window.addEventListener('resize', () => {
  detailCamera.aspect = detailContainer.clientWidth / detailContainer.clientHeight;
  detailCamera.updateProjectionMatrix();
  detailRenderer.setSize(detailContainer.clientWidth, detailContainer.clientHeight);
});

// ================= Trigger animasi lewat tombol ================= //
document.getElementById('detailing-baterai').addEventListener('click', () => {
  if (mixer && mixer._actions.length > 0) {
    mixer._actions[0].paused = false; // jalankan animasi ketika tombol ditekan
  }
});



// expose functions
window.tambahSeri = tambahSeri;
window.tambahParalel = tambahParalel;
window.resetRangkaian = resetRangkaian;
