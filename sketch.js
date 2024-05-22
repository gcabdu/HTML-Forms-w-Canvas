let particles= [];

let num = 2200;
let noiseScale = 0.01;
let dia = 15;

let backgroundColor  = "#FFFFFF";
let particleColor = "#000000";

let isPaused= false;
let speedFactor = 1.5;
let changeBackgroundGradually = false;
let bgHue = 0;


window.onload = function () {
    const pane = new Tweakpane.Pane({
        title: "Options",
        expanded: true,
    });

    const params = {
        diameter: 15,
        factor: 13.2,

        color: particleColor,

        background: backgroundColor,
        noiseScale: 0.01,
        particles: 2200,
        speed: 1.5,
        changeBg: false
    };

    pane.addInput(params, 'particles', { min: 500, max: 5000, step: 100 }).on('change', (value) => {
        num = value.value;
        updateParticles();
    });

    pane.addInput(params, 'diameter', { min: 0, max: 25, step: 0.1 }).on('change', (value) => {
        dia = value.value;
    });

    pane.addInput(params, 'noiseScale', { min: 0.005, max: 0.05, step: 0.005 }).on('change', (value) => {
        noiseScale = value.value;
    });

    pane.addInput(params, 'color').on('change', (value) => {
        particleColor = value.value;
        updateParticles(); 
    });

    pane.addInput(params, 'background').on('change', (value) => {
        backgroundColor = value.value;
    });

    pane.addInput(params, 'changeBg').on('change', (value) => {
        changeBackgroundGradually = value;
    });

    pane.addInput({isPaused: false}, 'isPaused').on('change', (value) => {
        isPaused = value;
    });

    pane.addButton({ title: 'Reset' }).on('click', () => {
        resetAnimation();
    });

    pane.addInput(params, 'speed', { min: 0.1, max: 5, step: 0.1 }).on('change', (value) => {
        speedFactor = value.value;
    });
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 255);
    noiseScale = random(0.001, 0.02);
    updateParticles();
    noStroke();
}

function resetAnimation() {
    num = 2200;
    dia = 15;
    backgroundColor = "#000000";

    particleColor = "#FFFFFF";
    noiseScale = random(0.001, 0.02);

    speedFactor = 1.5;
    isPaused = false;
    bgHue = 0;
    updateParticles();
}

function updateParticles() {
    particles = [];
    let x = random(-5, 5);
    let y = random(-5, 5);
    for (let i = 0; i < num; i++) {
        let v = createVector(random(width), random(height));

        let d = createVector(x, y);
        let c = color(particleColor); 
        particles.push(new Particle(v, d, c, dia));
    }
}

function draw() {
    if (changeBackgroundGradually) {
        background(bgHue, 80, 100);
        bgHue = (bgHue + 0.1) % 360;
    } 
    else {
        background(backgroundColor);
    }

    if (!isPaused) {
        
      
      for (let i = 0; i < num; i++) {
            particles[i].move();
        }
    }

    for (let i = 0; i < num; i++) {
        particles[i].display();
    }
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

class Particle {
    constructor(pos, dir, col, dia ) {
        this.pos= pos;
        this.dir = dir;

        this.col = col;
        this.dia = dia;
    }
    move() {
        let n = noise(this.pos.x * noiseScale, this.pos.y * noiseScale);
        let a = TAU * n;
        this.pos.x += cos(a) * ((width * 0.5 - mouseX) * 0.06) * speedFactor;

        this.pos.y += sin(a) * ((height * 0.5 - (height - mouseY)) * 0.06) * speedFactor;
        if (!onScreen(this.pos)) {
            this.pos.x = random(width);
            this.pos.y = random(height);
        }
        this.dia = dia;
    }
    display() {
        fill(this.col);
        circle(this.pos.x, this.pos.y, this.dia);
    }
}
