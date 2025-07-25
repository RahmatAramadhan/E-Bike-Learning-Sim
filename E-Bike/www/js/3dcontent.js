function initBattery3D() {
    const detailContainer = document.getElementById('battery-3d-container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        detailContainer.clientWidth / detailContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(4, 12, 5);

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

    let mixer;
    let action;
    const clock = new THREE.Clock();

    const loader = new THREE.GLTFLoader();
    loader.load('../assets/models/Battery_Fix.glb', function(gltf) {
        const model = gltf.scene;
        model.rotation.y = THREE.MathUtils.degToRad(-60);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        if (animations && animations.length) {
            action = mixer.clipAction(animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enabled = true;

            document.getElementById('pecah-baterai').addEventListener('click', () => {
                action.reset();
                action.play();
            });
        }

    }, undefined, function(error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}


function initBatteryStringing() {
    const stringingContainer = document.getElementById('battery-stringing-canvas');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        stringingContainer.clientWidth / stringingContainer.clientHeight,
        0.1,
        1000
    );

    camera.position.set(1, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(stringingContainer.clientWidth, stringingContainer.clientHeight);
    stringingContainer.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.AmbientLight(0xffffff, 1);
    light.position.set(0, 5, 0);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

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

    loader.load('../assets/models/Batteryglb.gltf', (gltf) => {
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

        loader.load('../assets/models/Batteryglb.gltf', (gltf) => {
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

    document.getElementById('btn-seri').addEventListener('click', tambahSeri);
    document.getElementById('btn-paralel').addEventListener('click', tambahParalel);
    document.getElementById('btn-reset').addEventListener('click', resetRangkaian);


    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}


function initController3D() {
    const detailContainer = document.getElementById('controller-3d-container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        detailContainer.clientWidth / detailContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(6, 2, 25);

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

    let mixer;
    let action;
    const clock = new THREE.Clock();

    const loader = new THREE.GLTFLoader();
    loader.load('../assets/models/Controller.gltf', function(gltf) {
        const model = gltf.scene;
        model.rotation.y = THREE.MathUtils.degToRad(-60);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        if (animations && animations.length) {
            action = mixer.clipAction(animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enabled = true;

            document.getElementById('pecah-controller').addEventListener('click', () => {
                action.reset();
                action.play();
            });
        }

    }, undefined, function(error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function initDCController3D() {
    const detailContainer = document.getElementById('dc-controller-3d-container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        detailContainer.clientWidth / detailContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(10, 8, 40);

    
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

    let mixer;
    let action;
    const clock = new THREE.Clock();

    const loader = new THREE.GLTFLoader();
    loader.load('../assets/models/Dc to Dc.gltf', function(gltf) {
        const model = gltf.scene;
        model.rotation.y = THREE.MathUtils.degToRad(-60);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        if (animations && animations.length) {
            action = mixer.clipAction(animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enabled = true;

            document.getElementById('pecah-dc-controller').addEventListener('click', () => {
                action.reset();
                action.play();
            });
        }

    }, undefined, function(error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function bms3d() {
    const detailContainer = document.getElementById('bms-3d-container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        detailContainer.clientWidth / detailContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(6, 2, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(detailContainer.clientWidth, detailContainer.clientHeight);
    detailContainer.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    let mixer;
    let action;
    const clock = new THREE.Clock();

    const loader = new THREE.GLTFLoader();
    loader.load('../assets/models/bmsReadyver2.glb', function(gltf) {
        const model = gltf.scene;
        model.rotation.y = THREE.MathUtils.degToRad(-60);
        model.rotation.x = 1;
        model.scale.set(2,2,2);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        if (animations && animations.length) {
            action = mixer.clipAction(animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enabled = true;

            document.getElementById('pecah-bms').addEventListener('click', () => {
                action.reset();
                action.play();
            });
        }

    }, undefined, function(error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function initMotor3D() {
    const detailContainer = document.getElementById('motor-3d-container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        75,
        detailContainer.clientWidth / detailContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(-15, 8, 30);

    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(detailContainer.clientWidth, detailContainer.clientHeight);
    detailContainer.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 5, 0);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    let mixer;
    let action;
    const clock = new THREE.Clock();

    const loader = new THREE.GLTFLoader();
    loader.load('../assets/models/BLDC Motor.glb', function(gltf) {
        const model = gltf.scene;
        model.rotation.y = THREE.MathUtils.degToRad(-60);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        if (animations && animations.length) {
            action = mixer.clipAction(animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enabled = true;

            document.getElementById('pecah-motor').addEventListener('click', () => {
                action.reset();
                action.play();
            });
        }

    }, undefined, function(error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('battery-3d-container')) {
        initBattery3D();
    }

    if (document.getElementById('battery-stringing-canvas')) {
        initBatteryStringing();
    }

    if (document.getElementById('controller-3d-container')) {
        initController3D();
    }
    if (document.getElementById('dc-controller-3d-container')) {
        initDCController3D();
    }
    if (document.getElementById('bms-3d-container')) {
        bms3d();
    }
    if(document.getElementById('motor-3d-container')){
        initMotor3D();
    }
});

