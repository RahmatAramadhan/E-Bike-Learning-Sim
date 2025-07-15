import {destroyScene, initRodaScene} from './Style.js';

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
    '-': { status: null, connectedTo: null }, 

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
    battery : null, kontak : null, kontakOn : null,
    kontaktor : null
};

const keyRotator = document.getElementById('key-rotator');
const keyStatusText = document.getElementById('key-status-text');
let locked = true;
allComponents.kontakOn = false;

keyRotator.addEventListener('click', () => {
    locked = !locked;
    keyRotator.classList.toggle('unlocked', !locked);
    keyStatusText.textContent = locked ? 'LOCKED' : 'UNLOCKED';
    allComponents.kontakOn = !allComponents.kontakOn;
    checkAllConnection();
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
    checkAllConnection();
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

let roda = false;

function checkAllConnection() {

    Object.keys(connections).forEach(component => {
        const allTrue = Object.values(connections[component]).every(value => {return value && value.status === 'connected' && value.connectedTo !== null;});
        allComponents[component] = allTrue;
        
    });

    const overallConnections = Object.values(allComponents).every(val => val === true);

    const rodaSekarang = allComponents.monitor;
    const kecepatanDiv = document.getElementById('kecepatan');
    const indicator = document.querySelector('.indicator-status');

    if (allComponents.battery && allComponents.kontaktor && allComponents.kontak && allComponents.kontakOn && allComponents.monitor) {
        kecepatanDiv.textContent = "00";
        if (allComponents.battery && allComponents.kontaktor && allComponents.kontak && allComponents.kontakOn && allComponents.monitor && allComponents.motor && allComponents.transmisi && allComponents.pedal) {
            console.log("sudah masuk sini");
            initRodaScene('wheel-cycle', 'pedal-button', 'kecepatan', true);
        }else{
            console.log("malah masuk sini");
            destroyScene("wheel-cycle", "kecepatan");
        }
    }else{
        kecepatanDiv.textContent = "--";
    }
    roda = rodaSekarang;
}

