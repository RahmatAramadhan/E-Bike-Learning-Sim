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

