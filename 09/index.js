const path = require('path')
const {arraySum, launch} = require('../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    let cave = Array(fileContent.split('\n').length).fill().map(() => ([]))
    fileContent.split('\n').map((line,y) => {
      return line.split('').map((value, x) => {
        cave[y][x] = new Cell({ x, y, cave, value })
      })
    })
    return cave.flat()
  },

  tutos: [{
    shouldBe: 15,
    exec: (content) => part1(content)
  }, {
    shouldBe: 1134,
    exec: (content) => part2(content)
  }],

  parts: [
    (content) => part1(content),
    (content) => part2(content)
  ]
}).catch(console.error)

function part1(cave) {
  const lowPoints = cave.filter(cell => cell.isLowPoint())
  const risk = lowPoints.reduce((a, cell) => a + cell.getRisk(), 0)
  return risk
}
function part2(cave) {
  const lowPoints = cave.filter(cell => cell.isLowPoint())
  return lowPoints
    .map(cell => cell.getBasinSize())
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1)
}

class Cell {
  constructor({x, y, cave,value}) {
    this.x = x
    this.y = y
    this.cave = cave,
    this.value = +value
  } 
  getNeighbourghs() {
    return {
      bottom: this.cave?.[this.y + 1]?.[this.x],
      top: this.cave?.[this.y - 1]?.[this.x],
      right: this.cave?.[this.y]?.[this.x + 1],
      left: this.cave?.[this.y]?.[this.x - 1],
    }
  }
  isLowPoint() {
    const neigh = this.getNeighbourghs()
    const values = Object.values(neigh).map(cell => cell?.value).filter(a => a != null)
    return values.every(value => value > this.value)
  }
  getRisk() {
    return this.value + 1
  }
  getBasin(basin = [], process = []) {
    if (basin.includes(this)) return basin
    basin.push(this)
    const neigh = this.getNeighbourghs()
    const validCells = Object.values(neigh).filter(cell => cell?.value < 9)
    validCells.forEach(cell => cell.getBasin(basin))
    return this.getBasin(basin)
  }
  getBasinSize() {
    return this.getBasin().length
  }
}