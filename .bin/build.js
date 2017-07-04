
const fileSelectors = [
  '.source.js',
  '.source.json',
]

const result = Object.keys(require('eslint/conf/eslint-all').rules)
.reduce((prev, rule) => {

  const docs = require(`eslint/lib/rules/${rule}`).meta.docs
  const { description } = docs
  const leftLabel = docs.category
  const descriptionMoreURL = `http://eslint.org/docs/rules/${rule}`

  // comment syntax
  prev[fileSelectors[0]][`eslint-disable ${rule}`] = {
    prefix: `${rule} eslint-disable`,
    body: `/* eslint-disable ${rule} */\n$1\n/* eslint-enable ${rule} */`,
    leftLabel,
    description,
    descriptionMoreURL,
  }
  prev[fileSelectors[0]][`eslint-disable-next-line ${rule}`] = {
    prefix: `${rule} eslint-disable-next-line`,
    body: `// eslint-disable-next-line ${rule}\n$1`,
    leftLabel,
    description,
    descriptionMoreURL,
  }
  // only rules
  prev[fileSelectors[0]][`eslint-rule/${rule}`] =
  prev[fileSelectors[1]][`eslint-rule/${rule}`] = {
    prefix : rule,
    body   : rule,
    leftLabel,
    description,
    descriptionMoreURL,
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
  description: 'disable specific rules between the inline comments',
  descriptionMoreURL: 'http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments',
}
result[fileSelectors[0]][`eslint-disable-next-line`] = {
  prefix: `eslint-disable-next-line`,
  body: `// eslint-disable-next-line $1`,
  description: 'disable specific rules on a specific line',
  descriptionMoreURL: 'http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments',
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
