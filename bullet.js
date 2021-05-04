class Bullet {
    constructor(fromX, fromY, toX, toY, speed) {
        const slope = (toY - fromY) / (toX - fromX);
        const theta = Math.atan(slope);
        
        // speed is the radius of our circle that the line segment is intersecting with
        this.xVel = Math.cos(theta) * speed;
        this.yVel = Math.sin(theta) * speed;

        // this is kind of hacky, might find a better solution for this later
        if(toX < fromX) {
            this.xVel *= -1;
            this.yVel *= -1;
        }

        this.x = fromX;
        this.y = fromY;
        this.radius = 10;
    }

    updatePos() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
}