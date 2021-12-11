const path = require('path')
const {launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split(',').map(input => +input)
  },

  tutos: [{
    shouldBe: 37,
    exec: (content) => getFuelFromMedian(content)
  }, {
    shouldBe: 168,
    exec: (content) => searchFuel(content)
  }, {
    shouldBe: 349357,
    path: 'part1',
    exec: (content) => getFuelFromMedian(content)
  }],

  parts: [
    (content) => getFuelFromMedian(content),
    (content) => searchFuel(content)
  ]
}).catch(err => {console.error(err); process.exit(1)})

function getFuelFromMedian(content) {
  content.sort((a, b) => b - a)
  const median = content.length / 2 | 0
  const horizontal = content[median]
  return content.reduce((a, c) =>
    a + Math.abs(horizontal - c)
  , 0)
}

function searchFuel(content) {
  const {min, abs} = Math
  const max = Math.max(...content)
  const fuels = []
  for (let dest = 0; dest < max; dest++) {
    content.sort((a, b) => min(abs(a - dest)) - min(abs(b - dest)))
    let fuel = 0
    content.forEach((crab, i ) =>{
      const distance = Math.abs(dest - crab)
      fuel += distance
      for (let i = 0; i < distance; i++) {
        fuel += i
      }
    })
    fuels.push(fuel)
  }
  return Math.min(...fuels)
}