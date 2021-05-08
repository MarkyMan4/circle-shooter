const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameOver = false;

let isMouseDown = false;
let particles = [];
let bullets = [];
let enemies = [];
let clickCircles = [];
let animatedTexts = [];

let stars = [];

let timeBetweenEnemySpawns = 1000;

const playerRadius = 20;
const playerX = canvas.width / 2;
const playerY = canvas.height / 2;

const gameOverBtnWidth = 150;
const gameOverBtnHeight = 50;
const gameOverBtnX = (canvas.width / 2) - (gameOverBtnWidth / 2);
const gameOverBtnY = (canvas.height / 2) + gameOverBtnHeight;

let shotgunPowerup = false;
let shotgunShotsRemaining = 0;

document.addEventListener('mousedown', (event) => {
    if(!gameOver) {
        bullets.push(new Bullet(playerX, playerY, event.x, event.y, 10));
        
        // if they have the shotgun powerup, add several bullets going in the
        // general direction of the mouse click
        if(shotgunPowerup) {
            for(let i = 0; i < 10; i++) {
                const randX = event.x + (Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
                const randY = event.y + (Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
                bullets.push(new Bullet(playerX, playerY, randX, randY, (Math.random() * 10) + 5));
            }

            shotgunShotsRemaining -= 1;

            if(shotgunShotsRemaining <= 0) 
                shotgunPowerup = false;
        }

        clickCircles.push(new ClickCircle(event.x, event.y));
    }
    else {
        if(event.x >= gameOverBtnX && event.x <= gameOverBtnX + gameOverBtnWidth
            && event.y >= gameOverBtnY && event.y <= gameOverBtnY + gameOverBtnHeight) {
                reset();
            }
    }
});

// set the initial interval for spawning enemies
let interval = setInterval(() => {
    enemies.push(new Enemy(playerX, playerY, false));
}, timeBetweenEnemySpawns);

// every 30 seconds, decrease the time between enemy spawns by 25 ms
// don't let spawn rate go below 400 ms
setInterval(() => {
    console.log(timeBetweenEnemySpawns);
    if(timeBetweenEnemySpawns > 400) {
        clearInterval(interval);
        timeBetweenEnemySpawns -= 100;
        interval = setInterval(() => {
            // make enemies sometimes go in a random direction
            if(Math.random() > 0.3) {
                enemies.push(new Enemy(playerX, playerY, false));
            }
            else {
                let enemyDropsPowerup = true;

                if(shotgunPowerup)
                    enemyDropsPowerup = false;

                enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, enemyDropsPowerup))

                if(enemyDropsPowerup)
                    shotgunShotsRemaining = 10;
            }
        }, timeBetweenEnemySpawns);
    }
}, 10000);

// reset the game
function reset() {
    score = 0;
    gameOver = false;
    isMouseDown = false;
    particles = [];
    bul = [];
    enemies = [];
    clickCircles = [];
    stars = [];
    timeBetweenEnemySpawns = 1000;
    shotgunPowerup = false;

    clearInterval(interval);
    interval = setInterval(() => {
        enemies.push(new Enemy(playerX, playerY));
    }, timeBetweenEnemySpawns);

    initStars();
    animate();
}

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
        ctx.strokeStyle = 'black';
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

                score += 100;

                if(enemies[j].hasPowerup && !shotgunPowerup) {
                    shotgunPowerup = true;
                    animatedTexts.push(new AnimatedText('+10 Shotgun Shells', '40px', 'white', canvas.width / 2, (canvas.height / 2) + 50));
                }

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

function drawClickCircles() {
    for(let i = 0; i < clickCircles.length; i++) {
        ctx.beginPath();
        ctx.arc(clickCircles[i].x, clickCircles[i].y, clickCircles[i].radius, 0, 2 * Math.PI);
        ctx.strokeStyle = clickCircles[i].color;
        ctx.stroke();

        clickCircles[i].update();
    }
}

// remove click circles when their radius goes over 30
function removeClickCircles() {
    let indicesToRemove = [];

    for(let i = 0; i < clickCircles.length; i++) {
        if(clickCircles[i].radius >= 30)
            indicesToRemove.push(i);
    }

    for(let i = 0; i < indicesToRemove.length; i++) {
        clickCircles.splice(indicesToRemove[i], 1);
    }
}

function drawScore() {
    ctx.font = 'bold 40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, (canvas.width / 2), 40);
    ctx.strokeStyle = 'black';
    ctx.strokeText(`Score: ${score}`, (canvas.width / 2), 40);
}

// check if an enemy collided with the player
// set gameOver to true if they did
function checkPlayerCollision() {
    for(let i = 0; i < enemies.length; i++) {
        const distance = Math.sqrt(Math.pow(playerX - enemies[i].x, 2) + Math.pow(playerY - enemies[i].y, 2));
            
        if(distance < playerRadius + enemies[i].radius) {
            gameOver = true;
        }
    }
}

function drawShotsRemaining() {
    ctx.font = 'bold 30px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`Shots remaining: ${shotgunShotsRemaining}`, (canvas.width / 2), 80);
    ctx.strokeStyle = 'black';
    ctx.strokeText(`Shots remaining: ${shotgunShotsRemaining}`, (canvas.width / 2), 80);
}

function drawAnimatedTexts() {
    for(let i = 0; i < animatedTexts.length; i++) {
        ctx.font = animatedTexts[i].fontsize + ' Courier New';
        ctx.textAlign = 'center';
        ctx.fillStyle = animatedTexts[i].color;
        ctx.fillText(animatedTexts[i].text, animatedTexts[i].x, animatedTexts[i].y);
        ctx.strokeStyle = 'black';
        ctx.strokeText(animatedTexts[i].text, animatedTexts[i].x, animatedTexts[i].y);

        animatedTexts[i].updatePos();
    }
}

function removeAnimatedTexts() {
    let indicesToRemove = [];

    for(let i = 0; i < animatedTexts.length; i++) {
        if(animatedTexts[i].y < playerY - 75)
            indicesToRemove.push(i);
    }

    for(let i = 0; i < indicesToRemove.length; i++) {
        animatedTexts.splice(indicesToRemove[i], 1);
    }
}

function drawGameOverScreen() {
    ctx.font = 'bolder 100px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeText('Game Over', canvas.width / 2, canvas.height / 2);

    // draw restart button
    ctx.beginPath();
    ctx.rect(gameOverBtnX, gameOverBtnY, gameOverBtnWidth, gameOverBtnHeight);
    ctx.fillStyle = 'MediumSeaGreen';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke;

    ctx.font = '30px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Restart', canvas.width / 2, (canvas.height / 2) + 85);
}

function animate() {
    if(gameOver) {
        drawGameOverScreen();
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawStars();
        drawScore();

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

        if(clickCircles.length > 0) {
            drawClickCircles();
            removeClickCircles();
        }

        if(animatedTexts.length > 0) {
            drawAnimatedTexts();
            removeAnimatedTexts();
        }

        if(shotgunPowerup) {
            drawShotsRemaining();
        }

        checkPlayerCollision();

        requestAnimationFrame(animate);
    }
}

initStars();
animate();
