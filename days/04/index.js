const path = require('path')
const {launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    const lines = fileContent.split('\n')
    let boards = []
    let boardIndex = -1
    fileContent.split('\n').forEach((line, i) => {
      if(i === 0) return 
      if(line ==="") return boardIndex++
      if (!boards[boardIndex]) boards[boardIndex] = ''
      boards[boardIndex] += (line.trim() + '\n')
    })
    return {
      numbers: lines[0].split(',').map(a => +a),
      boards: boards.map(b => new Board(b))
    }
  },

  tutos: [{
    shouldBe: 4512,
    exec: (content) => part1(content)
  }, {
    shouldBe: 1924,
    exec: (content) => part2(content)
  }],

  parts: [
    (content) => part1(content),
    (content) => part2(content),
  ]
}).catch(console.error)

function part1(content) {
  const winBoards = launchGame(content)
  const winBoard = winBoards[0]
  return winBoard.score
}
function part2(content) {
  const winBoards = launchGame(content, true)
  winBoards.sort((a, b) => b.i - a.i)
  const winBoard = winBoards[0]
  return winBoard?.score
}

function launchGame(content, multiple) {
  const winBoards = []
  for (let i = 0; i < content.numbers.length; i++) {
    const number = content.numbers[i];
    for (let j = 0; j < content.boards.length; j++) {
      const board = content.boards[j];
      board.guess(number)
      if (board.isWin() && !winBoards.find(b => b.board === board)) winBoards.push({
        board, number, score: board.getScore() * number, i
      })
    }
    if(!multiple && winBoards.length) return winBoards
  }
  return winBoards
}

class Board {
  constructor(cells) {
    let board = Array(cells.split('\n').filter(a => a).length).fill().map(() => ([]))
    cells.split('\n').filter(a=>a).map((line, y) => {
      return line.trim().split(' ').filter(a=>a).map((value, x) => {
        board[y][x] = new Cell({ x, y, board, value })
      })
    })
    this.board = board
    this.h = this.board.length
    this.w = this.board[0].length
  }
  guess(number) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const cell = this.board[y][x]
        if(cell.value === number) cell.marked = true
      }
    }
  }
  getScore() {
    let score = 0
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const cell = this.board[y][x]
        if(!cell.marked) score += cell.value
      }
    }
    return score
  }
  isWin() {
    for (let y = 0; y < this.h; y++) {
      const line = []
      for (let x = 0; x < this.w; x++) {
        line.push(this.board[y][x])
      }
      if (line.every(cell => cell.marked)) return true
    }
    for (let y = 0; y < this.w; y++) {
      const line = []
      for (let x = 0; x < this.h; x++) {
        line.push(this.board[x][y])
      }
      if (line.every(cell => cell.marked)) return true
    }
    return false
  }
}
class Cell {
  constructor({ x, y, board, value }) {
    this.x = x
    this.y = y
    this.board = board,
    this.value = +value
    this.marked = false 
  }
  getLine(){
    return 
  }
  getNeighbourghs() {
    return {
      bottom: this.board?.[this.y + 1]?.[this.x],
      top: this.board?.[this.y - 1]?.[this.x],
      right: this.board?.[this.y]?.[this.x + 1],
      left: this.board?.[this.y]?.[this.x - 1],
    }
  }
}