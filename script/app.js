document.addEventListener('DOMContentLoaded', () => {
    // Initial setup to find elements in the page
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisply = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10

    //The Tetrominoes setup
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width+1, width, width*2+1],
        [width, width+1, width*2+1, width*2+2],
        [0, width+1, width, width*2+1],
        [width, width+1, width*2+1, width*2+2]
    ]

    const sTetromino = [
        [1, width, width+1, width*2],
        [width+1, width+2, width*2, width*2+1],
        [1, width, width+1, width*2],
        [width+1, width+2, width*2, width*2+1]
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
        [0, width, width*2, width*3],
        [width+1, width+2, width+3, width+4],
        [0, width, width*2, width*3],
        [width+1, width+2, width+3, width+4]
    ]

    const tetrominoes = [lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
    // End of tetromino setup

    // Position/rotation setup
    let currentRotation = 0
    let currentPosition = 4
    let random = Math.floor(Math.random()*tetrominoes.length)
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
            //rotate()
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
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            undraw()
            currentPosition -= width
            draw()
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = Math.floor(Math.random()*tetrominoes.length)
            current = tetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

    // function to move left, unless it's at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // function to move right, unless it's at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index + 1) % width === 0)
        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    // // function to rotate, unless there is a blockage
    // function rotate() {
    //     undraw()
    //     let nextRotation =
    // }

    draw()

})