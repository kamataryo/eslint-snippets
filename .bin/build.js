const fs = require('fs')
const cson = require('cson')
const rules = Object.keys(require('eslint/conf/eslint-all').rules)
const fileSelector = [
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml',
  '.source.js',
  '.source.jsx',
].join(', ')

console.log(fileSelector)

const result = rules.reduce((prev, rule) => {
  prev[fileSelector][`eslint/${rule}`] = {
    prefix: rule,
    body: rule,
    description: require(`eslint/lib/rules/${rule}`).meta.docs.description
  }
  return prev
}, { [fileSelector] : {} })

fs.writeFile('./snippets/eslint.cson', cson.stringify(result), err => {
  if (err) {
    throw err
  }
  console.log('done')
})
