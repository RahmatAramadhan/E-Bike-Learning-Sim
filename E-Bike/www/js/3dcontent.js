const detailContainer = document.getElementById('battery-3d-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, detailContainer.clientWidth / detailContainer.clientHeight, 0.1, 1000);
camera.position.set(4, 1, 15);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(detailContainer.clientWidth, detailContainer.clientHeight);
detailContainer.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.AmbientLight(0xffffff, 1);
light.position.set(0, 5, 0);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const loader = new THREE.GLTFLoader();
loader.load('../../../Assets/3d/Battery_Fix.glb', function(gltf) {
    scene.add(gltf.scene);
}, undefined, function(error) {
    console.error('An error occurred while loading the GLTF model:', error);
})

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

