const gameArea = document.getElementById("game-area")
const player = document.getElementById("player")
const ceobe = document.getElementById("ceobe")
const audio = document.querySelector('audio')

let playerSpeed = 0  
let ceobeSpeed = 0 
let ceobeSpeedIncrement = 0
let lastSpeedUpdateTime = 0  // Tiempo del último incremento de velocidad de Ceobe

audio.play()

function setDifficulty(level) {
    switch (level) {
        case 'easy':
            playerSpeed = 50
            ceobeSpeed = 1
            ceobeSpeedIncrement = 0
            break
        case 'medium':
            playerSpeed = 40
            ceobeSpeed = 2
            ceobeSpeedIncrement = 0  
            break
        case 'hard':
            playerSpeed = 35
            ceobeSpeed = 2
            ceobeSpeedIncrement = 0.5  // Incremento moderado
            break
        case 'extreme':
            playerSpeed = 30
            ceobeSpeed = 3
            ceobeSpeedIncrement = 1  // Incremento mayor
            break
    }
    
    // Oculta el menú y muestra el área de juego
    document.getElementById('menu').style.display = 'none'
    document.getElementById('game-area').style.display = 'block'
    
    gameLoop()
}

let playerPosition = { x: 0, y: 0 }
let ceobePosition = { x: 300, y: 300 }
let isPlaying = true

function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - ceobePosition.x)
    const deltaY = Math.abs(playerPosition.y - ceobePosition.y)

    if (deltaX <= 50 && deltaY <= 50) {
        if (confirm('Kay te atrapó! Rápido, dale algo de comer o no te comera a ti')) {
            playerPosition.x = Math.floor(Math.random() * (gameArea.clientWidth - 70))
            playerPosition.y = Math.floor(Math.random() * (gameArea.clientHeight - 70))
        } else {
            alert('te comieron')
            isPlaying = false
            audio.pause()
        }
    }
}

let isPaused = false;

document.getElementById('pause-game').addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        gameLoop();
        document.getElementById('pause-game').textContent = 'Pausar Juego';
    } else {
        isPaused = true;
        document.getElementById('pause-game').textContent = 'Reanudar Juego';
    }
});

function gameLoop(timestamp) {
    if (isPlaying && !isPaused) {
        moveCeobe();
        if (timestamp - lastSpeedUpdateTime >= 5000 && ceobeSpeedIncrement > 0) {
            ceobeSpeed += ceobeSpeedIncrement
            lastSpeedUpdateTime = timestamp
        }
        requestAnimationFrame(gameLoop)
    }
}


function moveCeobe() {
    if (ceobePosition.x < playerPosition.x) 
        ceobePosition.x += ceobeSpeed
    else if (ceobePosition.x > playerPosition.x)
        ceobePosition.x -= ceobeSpeed

    if (ceobePosition.y < playerPosition.y) 
        ceobePosition.y += ceobeSpeed
    else if (ceobePosition.y > playerPosition.y)
        ceobePosition.y -= ceobeSpeed

    updatePosition()
    detectCollision()
}

function movePlayer(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (playerPosition.y >= 25) 
                playerPosition.y -= playerSpeed
            break
        case 'ArrowDown':
            if (playerPosition.y < gameArea.clientHeight - 70)
                playerPosition.y += playerSpeed
            break
        case 'ArrowLeft':
            if (playerPosition.x >= 25) 
                playerPosition.x -= playerSpeed
            break
        case 'ArrowRight':
            if (playerPosition.x < gameArea.clientWidth - 70)
                playerPosition.x += playerSpeed
            break
    }

    updatePosition()
}

function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`
    ceobe.style.transform = `translate(${ceobePosition.x}px, ${ceobePosition.y}px)`
}

window.addEventListener('keydown', movePlayer)

window.addEventListener('load', () => {

    // Código para alternar el sonido de la música
document.getElementById('toggle-sound').addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        document.getElementById('toggle-sound').textContent = 'Silenciar Música' 
    } else {
        audio.pause()
        document.getElementById('toggle-sound').textContent = 'Reproducir Música' 
    }
});


    document.getElementById('toggle-dark-mode').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode')
        

        const button = document.getElementById('toggle-dark-mode')
        if (document.documentElement.classList.contains('dark-mode')) {
            button.textContent = 'Modo Claro'
        } else {
            button.textContent = 'Modo Oscuro'
        }
    })
})
