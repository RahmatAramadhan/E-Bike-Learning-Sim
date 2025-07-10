let selectedPin = null;

const connections = {
    motor: {
        '+': null, '-': null, A: null, B: null, C: null, U: null, V: null, W: null
    },
    transmisi: {
        P: null, R: null, '1': null, '3': null, GND: null, SPORT: null
    },
    pedal: {
        '+5V': null, App: null, '-': null, REM: null, '12V': null
    },
    battery: {
        C: null, P: null, B: null
    },
    converter: {
        '+48V': null, '-48V': null
    },
    kontak: {
        X: null
    }
};

const allComponents = {
    motor : null, transmisi : null, pedal : null,
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

        const isSameGroup = group1 === group2 && pin1 !== pin2;
        const isControllerConnection = device1 === 'controller' || device2 === 'controller';
        const targetDevice = device1 === 'controller' ? device2 : device1;

        if(!isSameGroup || !isControllerConnection || targetDevice === 'controller'){
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
        indicator.textContent = allComponents.motor;
        indicator.style.backgroundColor = "red";
    }
}
