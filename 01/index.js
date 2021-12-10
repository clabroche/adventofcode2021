const path = require('path')
const {arraySum, launch} = require('../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split('\n').map(a => +a)
  },

  tutos: [{
    shouldBe: 7,
    exec: (content) => guess(content)
  }, {
    shouldBe: 5,
    exec: (content) => guess(content, 3)
  }],

  parts: [
    (content) => guess(content),
    (content) => guess(content, 3),
  ]
}).catch(console.error)

function guess(floor, windowSize = 1) {
  const values = []
  for (let i = 0; i < floor.length; i++) {
    const window = floor.slice(i, i+windowSize)
    values.push(sum(window))
  }
  return getDecrease(values)
}

function getDecrease(values) {
  return values.filter((a, i, arr) => {
    const increase = a > arr[i - 1]
    const decrease = a < arr[i - 1]
    return increase && !decrease
  }).length
}

function sum(arr) {
  return arr.reduce((a,b) => a + b,0)
}