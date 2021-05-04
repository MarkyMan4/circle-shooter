const colors = ['Orange', 'DodgerBlue', 'Tomato', 'MediumSeaGreen', 'SlateBlue'];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors[Math.round(Math.random() * colors.length)];
        this.radius = Math.random() * 10;
        this.xVel = (Math.random() < 0.5? 1 : -1) * Math.random() * 3;
        this.yVel = (Math.random() < 0.5? 1 : -1) * Math.random() * 3;
    }

    updatePos() {
        this.x += this.xVel;
        this.y += this.yVel;

        if(this.radius > 0.2)
            this.radius -= 0.1;
    }
}
