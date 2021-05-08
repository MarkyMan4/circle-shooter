class AnimatedText {
    constructor(text, fontsize, color, x, y) {
        this.text = text;
        this.fontsize = fontsize;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    updatePos() {
        this.y -= 2;
    }
}