import {destroyScene, initRodaScene} from './Style.js';

let selectedPin = null;

const connections = {
    monitor: {
        IG:   { status: 'connected', connectedTo: 'controllerIG' },
        LIN:  { status: 'connected', connectedTo: 'controllerLIN' },
        '-':  { status: 'connected', connectedTo: 'controllerMinKanan' }
    },
    motor: {
        '+':  { status: 'connected', connectedTo: 'controller+' },
        '-':  { status: 'connected', connectedTo: 'controllerMinKiri' },
        A:    { status: 'connected', connectedTo: 'controllerA' },
        B:    { status: 'connected', connectedTo: 'controllerB' },
        C:    { status: 'connected', connectedTo: 'controllerC' },
        U:    { status: 'connected', connectedTo: 'controllerU' },
        V:    { status: 'connected', connectedTo: 'controllerV' },
        W:    { status: 'connected', connectedTo: 'controllerW' }
    },
    transmisi: {
        P:     { status: 'connected', connectedTo: 'controllerP' },
        R:     { status: 'connected', connectedTo: 'controllerR' },
        '1':   { status: 'connected', connectedTo: 'controller1' },
        '3':   { status: 'connected', connectedTo: 'controller3' },
        GND:   { status: 'connected', connectedTo: 'controllerGND' },
        SPORT: { status: 'connected', connectedTo: 'controllerSPORT' }
    },
    pedal: {
        '+5V': { status: 'connected', connectedTo: 'controller+5v' },
        App:   { status: 'connected', connectedTo: 'controllerApp' },
        '-':   { status: 'connected', connectedTo: 'controllerMinKanan' },
        REM:   { status: 'connected', connectedTo: 'controllerREM' }
    },
    battery: {
        S0:  { status: 'connected', connectedTo: 'bmsS0' },
        S1:  { status: 'connected', connectedTo: 'bmsS1' },
        S2:  { status: 'connected', connectedTo: 'bmsS2' },
        S3:  { status: 'connected', connectedTo: 'bmsS3' },
        S4:  { status: 'connected', connectedTo: 'bmsS4' },
        S5:  { status: 'connected', connectedTo: 'bmsS5' },
        S6:  { status: 'connected', connectedTo: 'bmsS6' },
        S7:  { status: 'connected', connectedTo: 'bmsS7' },
        S8:  { status: 'connected', connectedTo: 'bmsS8' },
        S9:  { status: 'connected', connectedTo: 'bmsS9' },
        S10: { status: 'connected', connectedTo: 'bmsS10' },
        S11: { status: 'connected', connectedTo: 'bmsS11' },
        S12: { status: 'connected', connectedTo: 'bmsS12' },
        S13: { status: 'connected', connectedTo: 'bmsS13' }
    },
    bms: {
        S0:  { status: 'connected', connectedTo: 'batteryS0' },
        S1:  { status: 'connected', connectedTo: 'batteryS1' },
        S2:  { status: 'connected', connectedTo: 'batteryS2' },
        S3:  { status: 'connected', connectedTo: 'batteryS3' },
        S4:  { status: 'connected', connectedTo: 'batteryS4' },
        S5:  { status: 'connected', connectedTo: 'batteryS5' },
        S6:  { status: 'connected', connectedTo: 'batteryS6' },
        S7:  { status: 'connected', connectedTo: 'batteryS7' },
        S8:  { status: 'connected', connectedTo: 'batteryS8' },
        S9:  { status: 'connected', connectedTo: 'batteryS9' },
        S10: { status: 'connected', connectedTo: 'batteryS10' },
        S11: { status: 'connected', connectedTo: 'batteryS11' },
        S12: { status: 'connected', connectedTo: 'batteryS12' },
        S13: { status: 'connected', connectedTo: 'batteryS13' }
    },
    kontak: {
        IG: { status: 'connected', connectedTo: 'controllerIG' }
    },
    controller : {
    '+': { status: 'connected', connectedTo: 'motor+' },
    'A': { status: 'connected', connectedTo: 'motorA' },
    'B': { status: 'connected', connectedTo: 'motorB' },
    'C': { status: 'connected', connectedTo: 'motorC' },
    '-': { status: 'connected', connectedTo: 'motor-' }, 

    'U': { status: 'connected', connectedTo: 'motorU' },
    'V': { status: 'connected', connectedTo: 'motorV' },
    'W': { status: 'connected', connectedTo: 'motorW' },

    'LIN': { status: 'connected', connectedTo: 'monitorLIN' },
    'P': { status: 'connected', connectedTo: 'transmisiP' },
    'R': { status: 'connected', connectedTo: 'transmisiR' },
    '1': { status: 'connected', connectedTo: 'transmisi1' },
    '3': { status: 'connected', connectedTo: 'transmisi3' },
    'SPORT': { status: 'connected', connectedTo: 'transmisiSPORT' },
    '+5V': { status: 'connected', connectedTo: 'pedal+5V' },
    'App': { status: 'connected', connectedTo: 'pedalApp' },
    'REM': { status: 'connected', connectedTo: 'pedalMin' },
    'IG': { status: 'connected', connectedTo: 'kontakIG' },
    'GND': { status: 'connected', connectedTo: 'transmisiGND' }
    }
};


const allComponents = {
    monitor : null, motor : null, transmisi : null, pedal : null,
    battery : null, kontak : null, kontakOn : null,
    kontaktor : null
};


const knob = document.getElementById('knob');
const positions = ['P', 'R', 'D'];
let currentIndex = 0;
let maksimal = 20;

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
    checkAllConnection(currentIndex, maksimal);
    updateKnob();
});

document.getElementById('rightBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % positions.length;
    checkAllConnection(currentIndex, maksimal);
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
    switchKnob.style.left = `${positionsLabel[current]}px`;
    label.textContent = labels[current];
    if (current === 1)maksimal = 40;
    if (current === 2)maksimal = 60;
    checkAllConnection(currentIndex, maksimal);
});

checkPinConnection();

const keyRotator = document.getElementById('key-rotator');
const keyStatusText = document.getElementById('key-status-text');
let locked = true;
allComponents.kontakOn = false;

keyRotator.addEventListener('click', () => {
    locked = !locked;
    keyRotator.classList.toggle('unlocked', !locked);
    keyStatusText.textContent = locked ? 'LOCKED' : 'UNLOCKED';
    allComponents.kontakOn = !allComponents.kontakOn;
    checkAllConnection(currentIndex, maksimal);
});

const sw = document.getElementById('switch');
const status = document.getElementById('status');
let isOn = true;
allComponents.kontaktor = true;

sw.addEventListener('click', () => {
    isOn = !isOn;
    sw.classList.toggle('off', !isOn);
    status.textContent = isOn ? 'ON' : 'OFF';
    allComponents.kontaktor = !allComponents.kontaktor;
    checkAllConnection(currentIndex, maksimal);
});

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
            checkAllConnection(currentIndex, maksimal);
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
        checkAllConnection(currentIndex, maksimal);
    });
});

function checkPinConnection(){
    for (const device in connections) {
        for (const group in connections[device]) {
            const pinData = connections[device][group];
            document.getElementById(connections[device][group].connectedTo).classList.add('connected');

            const el = document.querySelector(`.pin[data-device="${device}"][data-group="${group}"]`);

            if (!el) continue;

            if (pinData.status === 'connected') {
                el.classList.add('connected');
            }
        }
        
    }
}

function checkAllConnection(knop, maksimal) {

    Object.keys(connections).forEach(component => {
        const allTrue = Object.values(connections[component]).every(value => {return value && value.status === 'connected' && value.connectedTo !== null;});
        allComponents[component] = allTrue;
        
    });

    const rodaSekarang = allComponents.monitor;
    const kecepatanDiv = document.getElementById('kecepatan');
    const indicator = document.querySelector('.indicator-status');

    if (allComponents.battery && allComponents.kontaktor && allComponents.kontak && allComponents.kontakOn && allComponents.monitor) {
        kecepatanDiv.textContent = "00";
        if (allComponents.battery && allComponents.kontaktor && allComponents.kontak && allComponents.kontakOn && allComponents.monitor && allComponents.motor && allComponents.transmisi && allComponents.pedal) {
            destroyScene("wheel-cycle", "kecepatan");
            initRodaScene('wheel-cycle', 'pedal-button', 'kecepatan', true, knop, maksimal);
        }else{
            destroyScene("wheel-cycle", "kecepatan");
        }
    }else{
        destroyScene("wheel-cycle", "kecepatan");
        kecepatanDiv.textContent = "--";
    }
}

