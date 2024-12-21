const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle variables
const paddleWidth = 10;
const paddleHeight = 100;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
const playerPaddleSpeed = 6; // Speed for the player's paddle
const aiPaddleSpeed = 5;    // Speed for the AI's paddle

// Ball variables
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Score variables
let player1Score = 0;
let player2Score = 0;

// Key press tracking for smooth movement
let wPressed = false;
let sPressed = false;

// --- Functions ---

// Function to draw paddles
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
}

// Function to draw the ball
function drawBall(x, y, radius) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Function to draw the scores
function drawScores() {
    ctx.font = '30px Arial';
    ctx.fillText(player1Score, canvas.width / 4, 50);
    ctx.fillText(player2Score, 3 * canvas.width / 4, 50);
}

// Function to move the player's paddle
function movePlayerPaddle() {
    if (wPressed && player1Y > 0) {
        player1Y -= playerPaddleSpeed;
    } else if (sPressed && player1Y + paddleHeight < canvas.height) {
        player1Y += playerPaddleSpeed;
    }
}

// Function to move the AI paddle
function moveAIPaddle() {
    // Basic AI: Follow the ball's Y position
    let paddleCenter = player2Y + paddleHeight / 2;
    if (ballY > paddleCenter && player2Y + paddleHeight < canvas.height) {
        player2Y += aiPaddleSpeed;
    } else if (ballY < paddleCenter && player2Y > 0) {
        player2Y -= aiPaddleSpeed;
    }
}

// Function to move the ball
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top/bottom walls
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce off paddles
    if (
        (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Score points and reset ball
    if (ballX - ballRadius < 0) {
        player2Score++;
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        player1Score++;
        resetBall();
    }
}

// Function to reset the ball
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Switch direction
    ballSpeedY = Math.random() * 10 - 5; // Randomize initial vertical speed
}

// --- Event Listeners for paddle movement ---
window.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'W') {
        wPressed = true;
    } else if (event.key === 's' || event.key === 'S') {
        sPressed = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 'W') {
        wPressed = false;
    } else if (event.key === 's' || event.key === 'S') {
        sPressed = false;
    }
});

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawPaddle(0, player1Y, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);
    drawBall(ballX, ballY, ballRadius);
    drawScores();

    // Handle movement
    movePlayerPaddle(); // Player's paddle movement
    moveAIPaddle();     // AI paddle movement
    moveBall();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
