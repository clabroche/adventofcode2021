const path = require('path')
const {arraySum, launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    const arr = fileContent.split(',').map(input => +input)
    return [
      arr.reduce((acc, curr) => {
        acc[curr] = acc[curr] + 1
        return acc
      }, [0, 0, 0, 0, 0, 0, 0 ]),
      [0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ]
  },

  tutos: [{
    shouldBe: 26,
    exec: (content) => guess(content, 18)
  }, {
    shouldBe: 5934,
    exec: (content) => guess(content, 80)
  }],

  parts: [
    (content) => guess(content, 80),
    (content) => guess(content, 256)
  ]
}).catch(err => {console.error(err); process.exit(1)})

function guess([original, newFishes, ...others], turn) {
  for (let i = 0; i < turn; i++) {
    const originalShift = original.shift()
    const newShift = newFishes.shift()
    original.push(originalShift + newShift)
    newFishes.push(newShift + originalShift)
  }
  return arraySum([...original, ...newFishes])
}
