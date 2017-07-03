# ESLint snippets for Atom

[![Build Status](https://travis-ci.org/kamataryo/eslint-snippets.svg?branch=master)](https://travis-ci.org/kamataryo/eslint-snippets)

Snippets of all ESLint rules for [Atom](https://atom.io/) editor.

![image](./image.gif)

## Installation

Run the following command:

```shell
apm install eslint-snippets
```

Alternatively go to `Atom > Preferences > Packages` and search for `eslint-snippets`.

## Usage

  The snippets are available on `*.js` or `*.json`.

1. type..
  - the rule name
  - "eslint-disable" or "eslint-disable-next-line"
2. complete them.

## development

```shell
git clone git@github.com:kamataryo/eslint-snippets.git
cd eslint-snippets
npm install
npm run build
```

## publish (for commiters)

```shell
$ apm publish patch -m"Change log message"
```
