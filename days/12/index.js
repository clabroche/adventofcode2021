const { all } = require('bluebird')
const { cp } = require('fs')
const path = require('path')
const { launch} = require('../../utilities')

launch({
  inputsDir: path.resolve(__dirname, 'inputs'),
  
  format(fileContent) {
    const links = {}
    const smallCaves = []
    const largeCaves = []
    fileContent.split('\n').forEach(link => {
      const [cave1, cave2] = link.split('-')
      if (!links[cave1]) links[cave1] = []
      if (!links[cave2]) links[cave2] = []
      links[cave1].push(cave2)
      links[cave2].push(cave1)
      if (cave1 === 'start' || cave2 === 'end') return
      if (cave1.toUpperCase() === cave1) largeCaves.push(cave1)
      else smallCaves.push(cave1)
      if (cave2.toUpperCase() === cave2) largeCaves.push(cave2)
      else smallCaves.push(cave2)
    })
    return {
      smallCaves,
      largeCaves,
      links,
    }
  },

  tutos: [
    {
      shouldBe: 10,
      exec: (content) => part1(content)
    }, {
      shouldBe: 36,
      exec: (content) => part2(content)
    },{
      path: 'tuto2',
      shouldBe: 19,
      exec: (content) => part1(content)
    }, {
      path: 'tuto3',
      shouldBe: 226,
      exec: (content) => part1(content)
    },
  ],

  parts: [
    (content) => part1(content),
    (content) => part2(content)
  ]
}).catch(err => {console.error(err); process.exit(1)})

function part1(content) {
  const result = recursive(Object.assign({}, content.links), { path: 'start', used: {} })
  return result.length
}
function part2(content) {
  const result = recursive2(Object.assign({}, content.links), {path: 'start', used: {}})
  return result.length
}
function recursive(links, conf, result = []) {
  const lastCave = conf.path.split('-').pop()
  const newCaves = links[lastCave]
  const allPossiblePaths = []
  newCaves.forEach(newCave => {
    if (newCave === 'start') return
    const used = Object.assign({}, conf.used)
    if (newCave === 'end') return result.push(conf.path + '-' + newCave)
    if (isSmallCave(newCave)) {
      if (used[newCave]) return
      if (!used[newCave]) used[newCave] = 0
      used[newCave]++
    }
    allPossiblePaths.push({ path: conf.path + '-' + newCave, used })
  });
  allPossiblePaths.forEach(conf => recursive(links, conf, result))
  return result
}

function recursive2(links, conf, result = []) {
  const lastCave = conf.path.split('-').pop()
  const newCaves = links[lastCave]
  const allPossiblePaths = []
  newCaves.forEach(newCave => {
    if (newCave === 'start') return
    const used = Object.assign({}, conf.used)
    if (newCave === 'end') return result.push(conf.path + '-' + newCave)
    if (isSmallCave(newCave)) {
      if (used[newCave] > 1) return
      if (!used[newCave]) used[newCave] = 0
      used[newCave]++
      const cantMoreThan1 = Object.values(used).filter(a => a === 2).length > 1
      if (cantMoreThan1) return
    }
    allPossiblePaths.push({ path: conf.path + '-' + newCave, used })
  });
  allPossiblePaths.forEach(conf => recursive2(links, conf, result))
  return result
}

function isLargeCave(cave) {
  return cave.toUpperCase() === cave
}
function isSmallCave(cave) {
  return !isLargeCave(cave)
}

const verif = ['start-A-b-A-b-A-c-A-end',
  'start-A-b-A-b-A-end',
  'start-A-b-A-b-end',
  'start-A-b-A-c-A-b-A-end',
  'start-A-b-A-c-A-b-end',
  'start-A-b-A-c-A-c-A-end',
  'start-A-b-A-c-A-end',
  'start-A-b-A-end',
  'start-A-b-d-b-A-c-A-end',
  'start-A-b-d-b-A-end',
  'start-A-b-d-b-end',
  'start-A-b-end',
  'start-A-c-A-b-A-b-A-end',
  'start-A-c-A-b-A-b-end',
  'start-A-c-A-b-A-c-A-end',
  'start-A-c-A-b-A-end',
  'start-A-c-A-b-d-b-A-end',
  'start-A-c-A-b-d-b-end',
  'start-A-c-A-b-end',
  'start-A-c-A-c-A-b-A-end',
  'start-A-c-A-c-A-b-end',
  'start-A-c-A-c-A-end',
  'start-A-c-A-end',
  'start-A-end',
  'start-b-A-b-A-c-A-end',
  'start-b-A-b-A-end',
  'start-b-A-b-end',
  'start-b-A-c-A-b-A-end',
  'start-b-A-c-A-b-end',
  'start-b-A-c-A-c-A-end',
  'start-b-A-c-A-end',
  'start-b-A-end',
  'start-b-d-b-A-c-A-end',
  'start-b-d-b-A-end',
  'start-b-d-b-end',
  'start-b-end'
]