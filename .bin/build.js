
const fileSelectors = [
  '.source.js',
  '.source.json',
]

const result = Object.keys(require('eslint/conf/eslint-all').rules)
.reduce((prev, rule) => {

  const { description } = require(`eslint/lib/rules/${rule}`).meta.docs

  // comment syntax
  prev[fileSelectors[0]][`eslint-disable ${rule}`] = {
    prefix: `${rule} eslint-disable`,
    body: `/* eslint-disable ${rule} */\n$1\n/* eslint-enable ${rule} */`,
    description,
  }
  prev[fileSelectors[0]][`eslint-disable-next-line ${rule}`] = {
    prefix: `${rule} eslint-disable-next-line`,
    body: `// eslint-disable-next-line ${rule}\n$1`,
    description,
  }
  // only rules
  prev[fileSelectors[0]][`eslint-rule/${rule}`] =
  prev[fileSelectors[1]][`eslint-rule/${rule}`] = {
    prefix : rule,
    body   : rule,
    description
  }

  return prev
}, {
  [fileSelectors[0]] : {}, // for .js
  [fileSelectors[1]] : {}, // for .json
})

// comment syntax only
result[fileSelectors[0]][`eslint-disable`] = {
  prefix: `eslint-disable`,
  body: `/* eslint-disable $1 */\n$2\n/* eslint-enable $1 */`,
}
result[fileSelectors[0]][`eslint-disable-next-line`] = {
  prefix: `eslint-disable-next-line`,
  body: `// eslint-disable-next-line $1`,
}

require('fs').writeFile(
  './snippets/eslint.cson',
  require('cson').stringify(result, null, ' '), err => {
    if (err) {
      process.stderr.write(err)
      process.exit(1)
    } else {
      process.stdout.write('success')
      process.exit(0)
    }
  }
)
