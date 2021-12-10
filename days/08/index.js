const path = require('path')
const {arraySum, launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split('\n').map(line => {
      const [begin, end] = line.split(' | ')
      const segments = begin.split(' ').map(segment => segment.split('').sort((a,b) => a.localeCompare(b)).join(''))
      const guess = end.split(' ').map(segment => segment.split('').sort((a, b) => a.localeCompare(b)).join(''))
      return {
        segments: segments,
        guess: guess
      }
    })
  },

  tutos: [
    {
      shouldBe: 26,
      exec: (content) => guess(content, [1, 4, 7, 8])
    }, 
    {
      shouldBe: 61229,
      exec: (content) => guess2(content)
    }
  ],

  parts: [
    (content) => guess(content, [1, 4, 7, 8]),
    (content) => guess2(content)
  ]
}).catch(console.error)

const guesses = {
  1: (input) => input.length === 2,
  4: (input) => input.length === 4,
  7: (input) => input.length === 3,
  8: (input) => input.length === 7,
  2: (input, dict) => {
    if (!dict[4]) return 
    const miss = missing(input)
    const intersect = intersection(input.split(''), dict[4].split(''))
    return miss.length === 2 && intersect.length === 2
  },
  9: (input, dict) => {
    if (!dict[4] || input.length !== 6) return 
    const intersect = intersection(input.split(''), dict[4].split(''))
    return input.length === 6 && intersect.length === 4
  },
  6: (input, dict) => {
    if (!dict[1] || input.length !== 6) return
    const intersect = intersection(input.split(''), dict[1].split(''))
    return input.length === 6 && intersect.length === 1
  },
  3: (input, dict) => {
    if (!dict[1] || input.length !== 5) return
    const intersect = intersection(input.split(''), dict[1].split(''))
    return input.length === 5 && intersect.length === 2
  },
  0: (input, dict) => {
    return dict[6] && dict[9] && input.length === 6
  },
  5: (input, dict) => {
    return dict[0] &&
      dict[1] &&
      dict[2] &&
      dict[3] &&
      dict[4] &&
      dict[6] &&
      dict[7] && 
      dict[8] && 
      dict[9] && !dict.includes(input)
  },
}
function guess(content, search) {
  let nb = 0
  content.forEach(line => {
    const dict = []
    let nbFound = 0
    while (nbFound < 10) {
      line.segments.forEach(segment => {
        Object.keys(guesses).forEach(key => {
          if (dict[key]) return
          const condition = guesses[key]
          const guess = condition(segment, dict)
          if (guess && !dict.includes(segment)) {
            dict[key] = segment
            nbFound++
            return
          }
        })
      });
    }
    const validSegments = dict.filter((segment, i) => search.includes(i))
    nb += line.guess.filter(segment => validSegments.includes(segment)).length
  });
  return nb
}

function guess2(content) {
  let nb = 0
  content.forEach(line => {
    const dict = []
    let nbFound = 0
    while (nbFound < 10) {
      line.segments.forEach(segment => {
        Object.keys(guesses).forEach(key => {
          if (dict[key]) return
          const condition = guesses[key]
          const guess = condition(segment, dict)
          if (guess && !dict.includes(segment)) {
            dict[key] = segment
            nbFound++
            return
          }
        })
      });
    }
    const stringversion = line.guess.map(segment => dict.indexOf(segment)).join('')
    nb += +stringversion
  });
  return nb
}

function missing (segment) {
  let missing = []
  if (!segment.includes('a')) missing.push('a')
  if (!segment.includes('b')) missing.push('b')
  if (!segment.includes('c')) missing.push('c')
  if(!segment.includes('d')) missing.push('d')
  if (!segment.includes('e')) missing.push('e')
  if (!segment.includes('f')) missing.push('f')
  if (!segment.includes('g')) missing.push('g')
  return missing
}
function intersection(a, b) {
  return a.filter(value => b.includes(value));
}