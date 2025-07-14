const container = document.getElementById('batteryCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040));

const loader = new THREE.GLTFLoader();

let bateraiList = [];
let jumlahSeri = 0;
let jumlahParalel = 0;
let voltPerBattery = 3.7;
let kapasitasPerBattery = 2.5;
const seriMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });  
const paralelMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); 

function updateLabel() {
  const totalVolt = jumlahSeri * voltPerBattery;
  const totalAh = jumlahParalel * kapasitasPerBattery;
  document.getElementById("totalVolt").textContent = totalVolt;
  document.getElementById("totalAh").textContent = totalAh;
}

const spacingX = 0.24; 
const spacingZ = 0.24; 
const spacingY = 0.55; 

const bateraiPerBaris = 10;

function tambahSeri() {
  const total = jumlahSeri;
  const row = Math.floor(total / bateraiPerBaris);
  const col = total % bateraiPerBaris;

  const xOffset = col * spacingX;
  const yOffset = -row * spacingY;
  const zOffset = 0; 

  loader.load('../../Assets/3d/Batteryglb.gltf', (gltf) => {
    const battery = gltf.scene.clone();
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
  });
}

function tambahParalel() {
  if (jumlahSeri === 0) return;

  const currentSeri = jumlahSeri;
  const rowCount = Math.ceil(currentSeri / bateraiPerBaris);
  const zOffset = -jumlahParalel * spacingZ;

  for (let i = 0; i < currentSeri; i++) {
    const row = Math.floor(i / bateraiPerBaris);
    const col = i % bateraiPerBaris;
    const xOffset = col * spacingX;
    const yOffset = -row * spacingY;

    loader.load('Model/Batteryglb.gltf', (gltf) => {
      const battery = gltf.scene.clone();
      battery.scale.set(0.5, 0.5, 0.5);
      battery.position.set(xOffset, yOffset, zOffset);
      battery.traverse((child) => {
        if (child.isMesh) child.material = paralelMaterial;
      });
      scene.add(battery);
      bateraiList.push(battery);
      updateLabel();
    });
  }

  jumlahParalel++;
}


function resetRangkaian() {
  bateraiList.forEach(b => scene.remove(b));
  bateraiList = [];
  jumlahSeri = 0;
  jumlahParalel = 0;
  updateLabel();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Re-render canvas saat tab dibuka
document.getElementById('rangkaian-tab').addEventListener('shown.bs.tab', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Buat global agar bisa diakses dari HTML onclick
window.tambahSeri = tambahSeri;
window.tambahParalel = tambahParalel;
window.resetRangkaian = resetRangkaian;
