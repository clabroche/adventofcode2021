const path = require('path')
const {launch} = require('../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split('\n').map(a => a.split('').map(a => +a))
  },

  tutos: [{
    shouldBe: 198,
    exec: (content) => part1(content)
  },{
  shouldBe: 230,
  exec: (content) => part2(content)
  }],

  parts: [
    (content) => part1(content),
    (content) => part2(content),
  ]
}).catch(console.error)

function part1(content) {
  const gamma = getBit(content.slice())
  const epsilon = getBit(content.slice(), true)
  return epsilon * gamma
}

function getBit(content, bitReverse = false) {
  const nbBits = content[0].length
  let gammaBits = ''
  for (let position = 0; position < nbBits; position++) {
    let max = getMax(content, position)
    if (bitReverse) max = 1 - max
    gammaBits += max
  }
  return parseInt(gammaBits, 2)
}

function part2(content) {
  let oxygen = reduceBits(content.slice())
  let co2 = reduceBits(content.slice(), true)
  return co2 * oxygen
}

function getMax(content, position, preference = 0) {
  let nbOne = 0
  let nbZero = 0
  content.forEach(bits => {
    if (bits[position]) nbOne++
    else nbZero++
  });
  if (nbOne > nbZero) return 1
  if (nbOne < nbZero) return 0
  return preference
}

function reduceBits(bits, bitReverse = false) {
  const nbBits = bits[0].length
  for (let position = 0; position < nbBits; position++) {
    let max = getMax(bits, position, 1)
    if(bitReverse) max = 1 - max
    bits = bits.filter(b => b[position] === max)
    if (bits.length === 1) break
  }
  return parseInt(bits[0].join(''), 2)
}