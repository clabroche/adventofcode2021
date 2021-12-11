const path = require('path')
const {launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  format(fileContent) {
    return fileContent.split('\n').map(line => {
      const [begin, end] = line.split(' -> ')
      const [x1, y1] = begin.split(',')
      const [x2, y2] = end.split(',')
      return {
        x1: +x1,
        x2: +x2,
        y1: +y1,
        y2: +y2
      }
    })
  },
  tutos: [{
    shouldBe: 5,
    exec: (content) => {
      return guess(content)
    }
  }, {
      shouldBe: 12,
      exec: (content) => {
        return guess(content, true)
      }
    }],

  parts: [
    (content) => guess(content, ),
    (content) => guess(content, true)
  ]
}).catch(err => {console.error(err); process.exit(1)})

function guess(winds, keepDiagonal= false) {
  const graph = new Map()
  winds.map(({x1, x2, y1, y2}) => {
    if (x1 === x2) {
      const min = y1 < y2 ? y1 : y2
      const max = y1 > y2 ? y1 : y2
      for (let y = min; y <= max; y++) {
        increaseGraphValue(graph, x1, y)
      }
    } else if (y1 === y2) {
      const min = x1 < x2 ? x1 : x2
      const max = x1 > x2 ? x1 : x2
      for (let x = min; x <= max; x++) {
        increaseGraphValue(graph, x, y1)
      }
    } else if(keepDiagonal){
      const minPoint = x1 < x2 ? { x:x1, y:y1 } : { x:x2, y:y2 }
      const maxPoint = x1 > x2 ? { x:x1, y:y1 } : { x:x2, y:y2 }
      const direction = minPoint.y > maxPoint.y ? -1 : 1
      let y = minPoint.y
      increaseGraphValue(graph, minPoint.x, minPoint.y)
      for (let x = minPoint.x + 1; x <= maxPoint.x; x++) {
        increaseGraphValue(graph, x, y += direction)
      }
    }
  })
  const nbOverlaps = [...graph.values()].filter((a) => a >= 2).length
  return nbOverlaps
}

function increaseGraphValue(graph, x, y) {
  const key = `${x}:${y}`
  graph.set(key, graph.get(key) + 1 || 1)
}
/**
 * @typedef Wind
 * @property {number} x1
 * @property {number} y1
 * @property {number} y1
 * @property {number} y2
 */