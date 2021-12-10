const path = require('path')
const {arraySum, launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split('\n').map(a => a.split(''))
  },

  tutos: [
    {
    shouldBe: 26397,
    exec: (content) => part1(content)
  },
    // {
    //   shouldBe: 288957,
    //   exec: (content) => part2(content)
    // }
  ],

  parts: [
    (content) => part1(content),
    (content) => part2(content)
  ]
}).catch(console.error)

function part1(content) {
  const summary = {
    ')': { score: 3, nb: 0 },
    ']': { score: 57, nb: 0 },
    '}': { score: 1197, nb: 0 },
    '>': { score: 25137, nb: 0 },
  }
  getCorrupted(content, summary, true)
  const score = Object.values(summary).reduce((a, wrongChar) =>
    a + (wrongChar.score * wrongChar.nb)
  , 0)
  return score
}

function part2(content) {
  const summary = {
    ')': { score: 1, nb: 0 },
    ']': { score: 2, nb: 0 },
    '}': { score: 3, nb: 0 },
    '>': { score: 4, nb: 0 },
  }
  const correctLines = getCorrupted(content, summary, false)
  const scoreByLines = correctLines.map(line => line.reduce((prev, wrongChar) =>
      (prev * 5) + summary[wrongChar].score
    , 0))
    .sort((a, b) => a - b)
  return scoreByLines[(scoreByLines.length / 2 | 0)]
}

function getCorrupted(content, summary, breakOnFirst = false) {
  const openCharacters = ['(', '[', '{', '<']
  const closeCharacters = [')', ']', '}', '>']
  const isOpenCharacter = char => openCharacters.includes(char)
  const isCloseCharacter = char => closeCharacters.includes(char)
  const getCloseCharacter = openChar => closeCharacters[openCharacters.indexOf(openChar)]
  const incompleteLines = []
  content.forEach(line => {
    const lineRes = {line, char: null, shouldBeCloseCharacters: []}
    for (const char of line) {
      if (isOpenCharacter(char)) lineRes.shouldBeCloseCharacters.push(getCloseCharacter(char))
      if (isCloseCharacter(char)) {
        const shouldChar = lineRes.shouldBeCloseCharacters.pop()
        if (shouldChar !== char) {
          summary[char].nb++
          lineRes.char = char
          if(breakOnFirst) break
        }
      }
    }
    if(!lineRes.char) incompleteLines.push(lineRes.shouldBeCloseCharacters.reverse())
  });
  return incompleteLines
}
