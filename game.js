const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: undefined,
    y: undefined
};

let isMouseDown = false;
let particles = [];
let bullets = [];
let enemies = [];

let stars = [];

const playerRadius = 20;
const playerX = (canvas.width / 2) - (playerRadius / 2);
const playerY = (canvas.height / 2) - (playerRadius / 2);

document.addEventListener('mousedown', (event) => {
    bullets.push(new Bullet(playerX, playerY, event.x, event.y, 10));
});

window.setInterval(() => {
    enemies.push(new Enemy(playerX, playerY));
}, 500);

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function initStars() {
    for(let i = 0; i < 1000; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2
        });
    }
}

function drawStars() {
    for(let i = 0; i < 1000; i++) {
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function drawBullets() {
    for(let i = 0; i < bullets.length; i++) {
        bullets[i].updatePos();

        ctx.beginPath();
        ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function drawEnemies() {
    for(let i = 0; i < enemies.length; i++) {
        enemies[i].updatePos();

        ctx.beginPath();
        ctx.arc(enemies[i].x, enemies[i].y, enemies[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = enemies[i].color;
        ctx.fill();
        ctx.stroke();
    }
}

function createParticles(x, y) {
    for(let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y));
    }
}

function drawParticles() {
    for(let i = 0; i < particles.length; i++) {
        particles[i].updatePos();

        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = particles[i].color;
        ctx.fill();
    }
}

function removeSmallParticles() {
    let newParticles = [];

    for(let i = 0; i < particles.length; i++) {
        if(particles[i].radius >= 0.2)
            newParticles.push(particles[i]);
    }

    particles = newParticles;
}

function checkEnemyCollision() {
    let bulletIndexToRemove = -1;
    let enemyIndexToRemove = -1;

    for(let i = 0; i < bullets.length; i++) {
        for(let j = 0; j < enemies.length; j++) {
            const distance = Math.sqrt(Math.pow(bullets[i].x - enemies[j].x, 2) + Math.pow(bullets[i].y - enemies[j].y, 2));
            
            if(distance < bullets[i].radius + enemies[j].radius) {
                createParticles(enemies[j].x, enemies[j].y);
                bulletIndexToRemove = i;
                enemyIndexToRemove = j;

                // can break because a bullet can only collied with one enemy
                break;
            }
        }
    }

    if(bulletIndexToRemove !== -1 && enemyIndexToRemove !== -1) {
        bullets.splice(bulletIndexToRemove, 1);
        enemies.splice(enemyIndexToRemove, 1);
    }
}

function removeOutOfBoundsBullets() {
    let bulletIndicesToRemove = [];

    for(let i = 0; i < bullets.length; i++) {
        if(bullets[i].x - bullets[i].radius < 0 || bullets[i].y - bullets[i].radius < 0
            || bullets[i].x - bullets[i].radius > canvas.width || bullets[i].y - bullets[i].radius > canvas.height) {
                bulletIndicesToRemove.push(i);
            }
    }

    for(let i = 0; i < bulletIndicesToRemove.length; i++) {
        bullets.splice(bulletIndicesToRemove[i], 1);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawStars();

    console.log(bullets.length);

    if(bullets.length > 0) {
        drawBullets();
        checkEnemyCollision();
        removeOutOfBoundsBullets();
    }

    if(enemies.length > 0) {
        drawEnemies();
    }

    if(particles.length > 0) {
        drawParticles();
        removeSmallParticles();
    }

    requestAnimationFrame(animate);
}

initStars();
animate();
