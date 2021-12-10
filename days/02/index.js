const path = require('path')
const {launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    return fileContent.split('\n').map(a => ({
      command: a.split(' ')[0],
      value: +a.split(' ')[1],
    }))
  },

  tutos: [{
    shouldBe: 150,
    exec: (content) => guess(content)
  }, {
    shouldBe: 900,
    exec: (content) => part2(content)
  }],

  parts: [
    (content) => guess(content),
    (content) => part2(content),
  ]
}).catch(console.error)

function guess(content) {
  let position = {
    horizontal: 0,
    depth: 0,
  }
  content.forEach(control => {
    if (control.command === 'forward') position.horizontal += control.value
    if (control.command === 'up') position.depth -= control.value
    if (control.command === 'down') position.depth += control.value
  });
  return position.depth * position.horizontal
}

function part2(content) {
  let aim = 0
  let position = {
    horizontal: 0,
    depth: 0,
  }
  content.forEach(control => {
    if (control.command === 'forward') {
      position.horizontal += control.value
      position.depth += (aim * control.value)
    }
    if (control.command === 'up') aim -= control.value
    if (control.command === 'down') aim += control.value
  });
  return position.depth * position.horizontal
}