let selectedPin = null;

const connections = {
    monitor: {
        IG : null, LIN : null, '-' : null
    },
    motor: {
        '+': null, '-': null, A: null, B: null, C: null, U: null, V: null, W: null
    },
    transmisi: {
        P: null, R: null, '1': null, '3': null, GND: null, SPORT: null
    },
    pedal: {
        '+5V': null, App: null, '-': null, REM: null
    },
    battery: {
        S0 : null, S1 : null, S2 : null, S3 : null, S4 : null, S5 : null, S6 : null, S7 : null, S8 : null, S9 : null, S10 : null, S11 : null, S12 : null, S13 : null
    },
    bms: {
        S0 : null, S1 : null, S2 : null, S3 : null, S4 : null, S5 : null, S6 : null, S7 : null, S8 : null, S9 : null, S10 : null, S11 : null, S12 : null, S13 : null
    },
    converter: {
        '+48V': null, '-48V': null
    },
    kontak: {
        X: null
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

            if(device !== 'controller'){
                if (connections[device][group]) {
                    connections[device][group] = null;
                    document.querySelectorAll(`.pin[data-group="${group}"]`).forEach(p => {
                        p.classList.remove('connected');
                    });       
                }
            }

            pin1.classList.remove('selected');
            selectedPin = null;
            checkAllConnection();
            return;
        }

        const group1 = pin1.dataset.group;
        const group2 = pin2.dataset.group;
        const device1 = pin1.dataset.device;
        const device2 = pin2.dataset.device;

        const isSameGroup = group1 === group2;
        const isControllerConnection = device1 === 'controller' || device2 === 'controller' || (device1 === 'bms' && device2 === 'battery') || (device1 === 'battery' && device2 === 'bms');
        
        const targetDevice = device1 === 'controller' ? device2 : device1;

        if(!isSameGroup || !isControllerConnection || (device1 === 'controller' && device2 === 'controller')) {
            alert("Pin tidak cocok atau tidak berasal dari controller");
            pin1.classList.remove('selected');
            selectedPin = null;
            return;
        }

        if (connections[targetDevice][group1]) {
            connections[targetDevice][group1] = null;
            pin1.classList.remove('connected');
            pin2.classList.remove('connected');
        }else{
            connections[targetDevice][group1] = true;
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
        const allTrue = Object.values(connections[component]).every(value => value === true);
        allComponents[component] = allTrue;
        if (!allTrue) overallConnections = false;
    });

    const indicator = document.querySelector('.indicator-status');
    if (overallConnections) {
        indicator.textContent = "All motors connected";
        indicator.style.backgroundColor = "limegreen";
    }else{
        indicator.textContent = "motor : " + allComponents.motor + "transmisi : " + allComponents.transmisi + "pedal : " +  allComponents.pedal + "converter : " + allComponents.converter + "battery : " + allComponents.battery + "kontak : " + allComponents.kontak ;
        indicator.style.backgroundColor = "red";
    }
}
