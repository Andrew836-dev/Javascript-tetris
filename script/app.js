document.addEventListener('DOMContentLoaded', () => {
    // Initial setup to find elements in the page
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisply = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10
    const miniWidth = 4

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

    // make the tetromino move down every second
    timerId = setInterval(moveDown, 1000)

    //assign functions to keycodes
    function control(e) {
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
            draw()
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*tetrominoes.length)
            current = tetrominoes[random][currentRotation]
            currentPosition = 4
            updatePreview()
            draw()
        }
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
        [1, displayWidth+1, displayWidth*2+1, 2],         // lTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*2+2], // rTetromino
        [1, displayWidth+2, displayWidth+1, displayWidth*2+2],   // zTetromino
        [1, displayWidth, displayWidth+1, displayWidth*2],       // sTetromino
        [1, displayWidth+1, displayWidth+2, displayWidth*2+1],   // tTetromino
        [0, 1, displayWidth, displayWidth+1],             // oTetromino
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
})