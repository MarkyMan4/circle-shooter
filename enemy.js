const enemyColors = ['Orange', 'DodgerBlue', 'Tomato', 'MediumSeaGreen', 'SlateBlue'];

class Enemy {
    constructor(toX, toY) {
        if(Math.random() > 0.5) {
            this.x = Math.random() > 0.5 ? 0 : window.innerWidth;
            this.y = Math.random() * window.innerHeight;
        }
        else {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() > 0.5 ? 0 : window.innerHeight;
        }

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = (Math.random() * 10) + 20;
        this.speed = (Math.random() * 5) + 1;

        const slope = (toY - this.y) / (toX - this.x);
        const theta = Math.atan(slope);
        
        // speed is the radius of our circle that the line segment is intersecting with
        this.xVel = Math.cos(theta) * this.speed;
        this.yVel = Math.sin(theta) * this.speed;

        if(toX < this.x) {
            this.xVel *= -1;
            this.yVel *= -1;
        }
    }

    updatePos() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
}