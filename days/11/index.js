const path = require('path')
const { launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return new Board(fileContent)
  },

  tutos: [
    {
      shouldBe: 1656,
      exec: (content) => part1(content)
    }, {
      shouldBe: 195,
      exec: (content) => part2(content)
    },
  ],

  parts: [
    (content) => part1(content),
    (content) => part2(content)
  ]
}).catch(err => {console.error(err); process.exit(1)})

function part1(content) {
  for (let i = 0; i < 100; i++) {
    content.walkthrough((cell) => cell.flash())
    content.walkthrough((cell) => cell.marked = false)
  }
  return content.allFlashing
}

function part2(content) {
  for (let i = 1; i > 0; i++) {
    content.walkthrough((cell) => cell.flash())
    if (content.board.flat().every(cell => cell.marked)) return i
    content.walkthrough((cell) => cell.marked = false)
  }
}



class Board {
  constructor(cells) {
    this.allFlashing = 0
    let board = Array(cells.split('\n').filter(a => a).length).fill().map(() => ([]))
    cells.split('\n').filter(a => a).map((line, y) => {
      return line.trim().split('').filter(a => a).map((value, x) => {
        board[y][x] = new Cell({ x, y, board, value })
        board[y][x].on('flashing', ()=> this.allFlashing++)
      })
    })
    console.
    this.board = board
    this.h = this.board.length
    this.w = this.board[0].length
  }
  walkthrough(cb) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        cb(this.board[y][x])
      }
    }
  }
}

const EventEmitter = require('events');
const { all } = require('bluebird')
class MyEmitter extends EventEmitter { }
class Cell {
  constructor({ x, y, board, value }) {
    this.x = x
    this.y = y
    this.board = board,
    this.value = +value
    this.marked = false
    this.flashing = 0
    const emitter = new MyEmitter();
    this.emit = emitter.emit
    this.on = emitter.on
  }
  flash() {
    if(this.marked) return
    this.value++
    if(this.value > 9) {
      this.emit('flashing')
      this.value = 0
      this.marked = true
      const neighbourghs = Object.values(this.getNeighbourghs()).filter(a => a)
      neighbourghs.forEach(cell => cell.flash())
    }
  }
  getNeighbourghs() {
    return {
      bottom: this.board?.[this.y + 1]?.[this.x],
      bottomRight: this.board?.[this.y + 1]?.[this.x + 1],
      bottomLeft: this.board?.[this.y + 1]?.[this.x - 1],
      top: this.board?.[this.y - 1]?.[this.x],
      topRight: this.board?.[this.y - 1]?.[this.x + 1],
      topLeft: this.board?.[this.y - 1]?.[this.x - 1],
      right: this.board?.[this.y]?.[this.x + 1],
      left: this.board?.[this.y]?.[this.x - 1],
    }
  }
}