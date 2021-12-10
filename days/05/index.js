const path = require('path')
const {arraySum, launch} = require('../../utilities')

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
    shouldBe: 26,
    exec: (content) => {
      return guess(content)
      return 'ok'
    }
  }],

  parts: [
    // (content) => guess(content, ),
    // (content) => guess(content, )
  ]
}).catch(console.error)

/**
 * 
 * @param {Wind[]} array 
 */
function guess(winds) {
  const graph = new Map()
  winds.map(({x1, x2, y1, y2}) => {
    const rad = Math.atan2(y2 - y1, x2 - x1)
    const deg = radiansToDegrees(rad)
    let direction = 0
    if(deg) direction = deg < 180 ? 1 : -1
    // while(x1 !== x2  || y1 !== y2) {
    //   x1 = x1 + direction
    //   y1 = y1 + (direction * 1/Math.tan(rad))
    //   console.log(rad)
    // }
    console.log(x1, y1, x2, y2)
    process.exit(1)
  })
  console.log(winds)
}

/**
 * @typedef Wind
 * @property {number} x1
 * @property {number} y1
 * @property {number} y1
 * @property {number} y2
 */

function radiansToDegrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}