const fs = require('fs')
const cson = require('cson')
const rules = Object.keys(require('eslint/conf/eslint-all').rules)
const fileSelector = [
  '.source.js',
].join(', ')

const result = rules.reduce((prev, rule) => {

  const description = require(`eslint/lib/rules/${rule}`).meta.docs.description

  // comment syntax
  prev[fileSelector][`eslint-comment-syntax: eslint-enable`] = {
    prefix: `eslint-enable`,
    body: `/* eslint-enable $1 */`,
  }
  prev[fileSelector][`eslint-comment-syntax: eslint-disable`] = {
    prefix: `eslint-disable`,
    body: `/* eslint-disable $1 */`,
  }
  prev[fileSelector][`eslint-comment-syntax: eslint-disable-next-line`] = {
    prefix: `eslint-disable-next-line`,
    body: `// eslint-disable-next-line $1`,
  }

  // rules
  prev[fileSelector][`eslint-rule: ${rule}`] = {
    prefix : `eslint/${rule}`,
    body   : rule,
    description
  }

  // rules with comment syntax
  // comment syntax
  prev[fileSelector][`eslint-disable-rule: ${rule}`] = {
    prefix : `eslint-${rule}`,
    body   : `/* eslint-disable ${rule} */\n$1`,
  }
  prev[fileSelector][`eslint-enable-rule: ${rule}`] = {
    prefix : `eslint-${rule}`,
    body   : `/* eslint-enable ${rule} */\n$1`,
  }
  prev[fileSelector][`eslint-enable-rule-in-block: ${rule}`] = {
    prefix : `eslint-${rule}`,
    body   : `/* eslint-disable ${rule} */\n$1\n/* eslint-enable ${rule} */`,
  }
  prev[fileSelector][`eslint-disable-rule-at-next-line: ${rule}`] = {
    prefix : `eslint-${rule}`,
    body   : `// eslint-disable-next-line ${rule} $1`,
  }

  return prev
}, { [fileSelector] : {} })

fs.writeFile('./snippets/eslint.cson', cson.stringify(result, null, ' '), err => {
  if (err) {
    throw err
  }
  console.log('done')
})
