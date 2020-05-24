document.addEventListener('DOMContentLoaded', () => {
    // Initial setup to find elements in the page
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    const miniWidth = 4
    let timerId = null
    let score = 0
    let isGameOver = true

    //The Tetrominoes setup
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ]

    const rTetromino = [
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, 2],
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, width*2]
    ]

    const zTetromino = [
        [1, width+2, width+1, width*2+2],
        [width, width+1, 1, 2],
        [1, width+2, width+1, width*2+2],
        [width, width+1, 1, 2]
    ]

    const sTetromino = [
        [1, width, width+1, width*2],
        [width+1, width, width*2+2, width*2+1],
        [1, width, width+1, width*2],
        [width+1, width, width*2+2, width*2+1]
    ]

    const tTetromino = [
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
        [1, width, width+1, width+2]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+2, width+3, width+1],
        [1, width+1, width*2+1, width*3+1],
        [width+1, width+2, width+3, width]
    ]

    const tetrominoes = [lTetromino, rTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
    // End of tetromino setup

    // Position/rotation setup
    let currentRotation = 0
    let currentPosition = 4
    let random = Math.floor(Math.random()*tetrominoes.length)
    let nextRandom = Math.floor(Math.random()*tetrominoes.length)
    let current = tetrominoes[random][currentRotation]

    // function to draw the current shape
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }


    // function to remove the current shape
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    function clearGrid() {
        for(let i=0; i<200; i++){
            squares[i].classList.remove('takenTetromino')
            squares[i].classList.remove('taken')
        }
    }

    // make the tetromino move down every second, made obsolete by start button
    // timerId = setInterval(moveDown, 1000)

    //assign functions to keycodes
    function control(e) {
        if(timerId){
            if(e.keyCode === 37) {
                moveLeft()
            }
            else if(e.keyCode === 39){
                moveRight()
            }
            else if(e.keyCode === 38){
                rotate()
            }
            else if(e.keyCode === 40){
                moveDown()
            }
        }
    }
    document.addEventListener('keyup', control)

    // function to move down one line
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }


    // freeze function  
    function freeze() {
        if(isTaken()) {
            undraw()
            currentPosition -= width
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            current.forEach(index => squares[currentPosition + index].classList.add('takenTetromino'))
            //check for game over
            if(currentPosition < 10){
                gameOver()
                return
            }
            //check for full rows
            addScore()
            //start a new tetromino falling
            updateTetromino()
        }
    }

    function updateTetromino() {
        random = nextRandom
        nextRandom = Math.floor(Math.random()*tetrominoes.length)
        current = tetrominoes[random][currentRotation]
        currentPosition = 4
        updatePreview()
        draw()
    }

    // function to move left, unless it's at the edge or there is a blockage
    function moveLeft() {
        undraw()
        if(!isAtLeft()) currentPosition -= 1
        if(isTaken()) {
            currentPosition += 1
        }
        draw()
    }

    // function to move right, unless it's at the edge or there is a blockage
    function moveRight() {
        undraw()
        if(!isAtRight()) currentPosition += 1
        if(isTaken()) {
            currentPosition -= 1
        }
        draw()
    }

    // for moving pieces, checks if the new position is taken. returns true if not allowed to move there
    function isTaken() {
        let answer = current.some(index => squares[currentPosition+index].classList.contains('taken'))
        return answer
    }

    // checks if the part is at the left hand edge of the grid
    function isAtLeft() {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        return isAtLeftEdge
    }

    // checks if the part is at the right hand edge of the grid
    function isAtRight() {
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        return isAtRightEdge
    }

    // function to rotate, unless there is a blockage
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            // makes the rotation go back to 0 if it reaches the maximum number
            currentRotation = 0
        }

        // updates position
        current = tetrominoes[random][currentRotation]
        
        // after rotation is complete, checks if it is a valid position
        if(isTaken() || (isAtLeft() && isAtRight())){
            currentRotation--
            if(currentRotation < 0) {
                currentRotation = 4
            }
            current = tetrominoes[random][currentRotation]
        }
        draw()
    }

    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 3
    let displayIndex = 0

    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],                // lTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*2+2], // rTetromino
        [1, displayWidth+2, displayWidth+1, displayWidth*2+2],   // zTetromino
        [1, displayWidth, displayWidth+1, displayWidth*2],       // sTetromino
        [1, displayWidth+1, displayWidth+2, displayWidth*2+1],   // tTetromino
        [0, 1, displayWidth, displayWidth+1],                    // oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]  // iTetromino
    ]

    //display the shape on the mini-grid
    function updatePreview() {
        // clear the grid first
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    // controls for the start/pause button
    startBtn.addEventListener('click', () => {
        if (isGameOver) {
            isGameOver = false
            score = 0
            scoreDisplay.innerHTML = score
            clearGrid()
            updateTetromino()
        }
        if (timerId){
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
        for (let i=0; i<199; i+=width ){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index=> {
                    row.forEach(index => squares[index].classList.remove('taken'))
                    row.forEach(index => squares[index].classList.remove('takenTetromino'))
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
    }
})