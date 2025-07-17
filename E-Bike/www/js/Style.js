let currentAnimationFrameId = null;
let currentRenderer = null;
let currentContainer = null;

export function initRodaScene(containerId, pedalButtonId, kecepatanId, aktifkanAnimasi, speeds, maksimal) {
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
    if (aktifkanAnimasi) {
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
    }

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
        currentAnimationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        if (speeds !== 0) {
            if (aktifkanAnimasi) {
                if (isPressed) {
                    if (speed < maxSpeed) speed += acceleration;
                } else {
                    if (speed > 0) speed -= deceleration;
                    if (speed < 0) speed = 0;
                }

                if (speeds === 1) {
                    if (action) action.timeScale = speed;
                }else if(speeds === 2){
                    if (action) action.timeScale = -speed;

                }

                const displayedSpeed = Math.round((speed / maxSpeed) * maksimal);
                kecepatanDiv.textContent = displayedSpeed > 0
                    ? displayedSpeed.toString().padStart(2, "0")
                    : "00"; 
            } else {
                kecepatanDiv.textContent = "--";
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    currentRenderer = renderer;
    currentContainer = container;
}

export function destroyScene(containerId, kecepatanId){
    const container = document.getElementById(containerId);

    if(currentAnimationFrameId){
        cancelAnimationFrame(currentAnimationFrameId);
        currentAnimationFrameId = null;
    }

    if(currentRenderer && currentContainer){
        currentRenderer.dispose?.();
        currentContainer.innerHTML = '';
    }

    currentRenderer = null;
    currentContainer = null;
}

document.getElementById('battery-detail').addEventListener('click', function () {
    const modal = document.getElementById('popupModal');
    const iframe = document.getElementById('modal-iframe');
    
    iframe.src = 'pages/Battery.html'; 
    modal.classList.add('show'); 
});

document.querySelector('.modal .close').addEventListener('click', function () {
    const modal = document.getElementById('popupModal');
    const iframe = document.getElementById('modal-iframe');
    
    modal.classList.remove('show'); 
    iframe.src = ''; 
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('popupModal');
    const iframe = document.getElementById('modal-iframe');
    
    if (event.target === modal) {
        modal.classList.remove('show');
        iframe.src = '';
    }
});

