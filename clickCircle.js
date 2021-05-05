class ClickCircle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = 'white';
    }

    update() {
        this.radius += 1.5;
    }
}