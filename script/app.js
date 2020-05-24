document.addEventListener('DOMContentLoaded', () => {
    // Initial setup to find elements in the page
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisply = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10

    //The Tetrominoes
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

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let current = tetrominoes[4][1]

    // function to draw the shapes
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        });
    }

})