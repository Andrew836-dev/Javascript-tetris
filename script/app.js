document.addEventListener('DOMContentLoaded', () => {
    // Initial setup to find elements in the page
    const grid = document.querySelector('.grid')
    const upArrow = document.querySelector('#up')
    const downArrow = document.querySelector('#down')
    const leftArrow = document.querySelector('#left')
    const rightArrow = document.querySelector('#right')
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    var timerId = null
    var score = 0
    var isGameOver = true
    
    // create the play area
    for (var i = 0; i < 200; i++) {
        let gridDiv = document.createElement('div');
        grid.appendChild(gridDiv);
    }
    for (var i = 0; i < 10; i++) {
        let takenGridDiv = document.createElement('div');
        takenGridDiv.classList.add('taken');
        grid.appendChild(takenGridDiv);
    }
    for (var i = 0; i < 12; i++) {
        let miniGridDiv = document.createElement('div');
        document.querySelector('.mini-grid').appendChild(miniGridDiv);
    }
    const displaySquares = Array.from(document.querySelectorAll('.mini-grid div'))
    let squares = Array.from(document.querySelectorAll('.grid div'))

    //The Tetrominoes setup
    const lTetromino = {
        rotation: [
            [1, width + 1, width * 2 + 1, 2],
            [width, width + 1, width + 2, width * 2 + 2],
            [1, width + 1, width * 2, width * 2 + 1],
            [width, width * 2, width * 2 + 1, width * 2 + 2]
        ],
        color: 'red'
    }

    const rTetromino = {
        rotation: [
            [1, width + 1, width * 2 + 1, width * 2 + 2],
            [width, width + 1, width + 2, 2],
            [0, 1, width + 1, width * 2 + 1],
            [width, width + 1, width + 2, width * 2]
        ],
        color: 'orange'
    }

    const zTetromino = {
        rotation: [
            [1, width + 2, width + 1, width * 2 + 2],
            [width, width + 1, 1, 2],
            [1, width + 2, width + 1, width * 2 + 2],
            [width, width + 1, 1, 2]
        ],
        color: 'yellow'
    }

    const sTetromino = {
        rotation: [
            [1, width, width + 1, width * 2],
            [width + 1, width, width * 2 + 2, width * 2 + 1],
            [1, width, width + 1, width * 2],
            [width + 1, width, width * 2 + 2, width * 2 + 1]
        ],
        color: 'green'
    }

    const tTetromino = {
        rotation: [
            [1, width + 1, width + 2, width * 2 + 1],
            [width, width + 1, width + 2, width * 2 + 1],
            [1, width, width + 1, width * 2 + 1],
            [1, width, width + 1, width + 2]
        ],
        color: 'blue'
    }

    const oTetromino = {
        rotation: [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ],
        color: 'indigo'
    }

    const iTetromino = {
        rotation: [
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width, width + 2, width + 3, width + 1],
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width + 1, width + 2, width + 3, width]
        ],
        color: 'violet'
    }

    const tetrominoes = [lTetromino, rTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
    // End of tetromino setup

    // Position/rotation setup
    let currentRotation = 0
    let currentPosition = 4
    let random = Math.floor(Math.random() * tetrominoes.length)
    let nextRandom = Math.floor(Math.random() * tetrominoes.length)
    let currentTetromino = tetrominoes[random]

    // function to draw the current shape
    function draw() {
        currentTetromino.rotation[currentRotation].forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = currentTetromino.color
        })
    }


    // function to remove the current shape
    function undraw() {
        currentTetromino.rotation[currentRotation].forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    function clearGrid() {
        for (let i = 0; i < 200; i++) {
            squares[i].classList.remove('taken', 'tetromino')
            squares[i].style.backgroundColor = ''
        }
    }

    // make the tetromino move down every second, made obsolete by start button
    // timerId = setInterval(moveDown, 1000)

    //assign functions to keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        }
        else if (e.keyCode === 39) {
            moveRight()
        }
        else if (e.keyCode === 38) {
            rotate()
        }
        else if (e.keyCode === 40) {
            drop()
        }

    }
    document.addEventListener('keyup', control)
    upArrow.addEventListener('touchstart', rotate)
    downArrow.addEventListener('touchstart', drop)
    leftArrow.addEventListener('touchstart', moveLeft)
    rightArrow.addEventListener('touchstart', moveRight)


    // freeze function  
    function freeze() {
        if (isTaken()) {
            // undraw()
            if (currentPosition > 10) {
                currentPosition -= width
            }
            currentTetromino.rotation[currentRotation].forEach(index => squares[currentPosition + index].classList.add('taken'))
            currentTetromino.rotation[currentRotation].forEach(index => squares[currentPosition + index].style.backgroundColor = currentTetromino.color)
            //check for game over
            if (currentPosition < 10) {
                gameOver()
                return
            }
            //check for full rows
            addScore()
            //start a new tetromino falling
            sendNextTetromino()
        }
    }

    function sendNextTetromino() {
        random = nextRandom
        nextRandom = Math.floor(Math.random() * tetrominoes.length)
        currentTetromino = tetrominoes[random]
        currentRotation = 0
        currentPosition = 4
        updatePreview()
        freeze()
        draw()
    }

    // function to move left, unless it's at the edge or there is a blockage
    function moveLeft() {
        if (timerId) {
            undraw()
            if (!isAtLeft())
                currentPosition -= 1
            if (isTaken())
                currentPosition += 1
            draw()
        }
    }

    // function to move right, unless it's at the edge or there is a blockage
    function moveRight() {
        if (timerId) {
            undraw()
            if (!isAtRight()) currentPosition += 1
            if (isTaken()) {
                currentPosition -= 1
            }
            draw()
        }
    }

    // function to move down one line
    function moveDown() {
        undraw()
        currentPosition += width
        freeze()
        draw()
    }

    // function to drop all the way to the lowest possible point
    function drop() {
        if (timerId) {
            moveDown()
            if (currentPosition > 9) {
                drop()
            }
        }
    }

    // for moving pieces, checks if the new position is taken. returns true if not allowed to move there
    function isTaken() {
        let answer = currentTetromino.rotation[currentRotation].some(index => squares[currentPosition + index].classList.contains('taken'))
        return answer
    }

    // checks if the part is at the left hand edge of the grid
    function isAtLeft() {
        var isAtLeftEdge = currentTetromino.rotation[currentRotation].some(index => (currentPosition + index) % width === 0)
        return isAtLeftEdge
    }

    // checks if the part is at the right hand edge of the grid
    function isAtRight() {
        var isAtRightEdge = currentTetromino.rotation[currentRotation].some(index => (currentPosition + index) % width === width - 1)
        return isAtRightEdge
    }

    // function to rotate, unless there is a blockage
    function rotate() {
        if (timerId) {
            undraw()
            currentRotation++
            if (currentRotation === currentTetromino.rotation.length) {
                // makes the rotation go back to 0 if it reaches the maximum number
                currentRotation = 0
            }

            // after rotation is complete, checks if it is a valid position
            if (isTaken() || (isAtLeft() && isAtRight())) {
                currentRotation--
                if (currentRotation < 0) {
                    currentRotation = 4
                }
            }
            draw()
        }
    }

    //show up-next tetromino in mini-grid
    const displayWidth = 3
    const displayIndex = 0

    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],                // lTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], // rTetromino
        [1, displayWidth + 2, displayWidth + 1, displayWidth * 2 + 2],   // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth * 2],       // sTetromino
        [1, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1],   // tTetromino
        [0, 1, displayWidth, displayWidth + 1],                    // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]  // iTetromino
    ]

    //display the shape on the mini-grid
    function updatePreview() {
        // clear the grid first
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = tetrominoes[nextRandom].color
        })
    }

    // controls for the start/pause button
    startBtn.addEventListener('click', () => {
        if (isGameOver) {
            isGameOver = false
            score = 0
            scoreDisplay.innerHTML = score
            clearGrid()
            sendNextTetromino()
        }
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            updatePreview()
        }
    })

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    row.forEach(index => squares[index].classList.remove('taken'))
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over!
    function gameOver() {
        clearInterval(timerId)
        timerId = null
        isGameOver = true
        scoreDisplay.innerHTML = 'Your final score was ' + scoreDisplay.innerHTML + '. Game over, Try again!'
        for (let i = 0; i < 199; i++) {
            squares[i].classList.add('game-over')
            // squares[i].style.backgroundColor = 'black'
        }
    }
})