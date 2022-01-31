const path = require('path')
const fs = require('fs')
const postcss = require('postcss')

// From https://github.com/tailwindlabs/tailwindcss/blob/v2.1.2/src/cli/compile.js


/**
 * Compiler options
 *
 * @typedef {Object} CompileOptions
 * @property {string} inputFile
 * @property {string} outputFile
 * @property {array} plugins
 */

const defaultOptions = {
  inputFile: null,
  outputFile: null,
  plugins: [],
}

/**
 * Compiles CSS file.
 *
 * @param {CompileOptions} options
 * @return {Promise}
 */
module.exports = function compile(options = {}) {
  const config = { ...defaultOptions, ...options }

  const css = config.inputFile
    ? fs.readFileSync(config.inputFile, 'utf-8')
    : `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

  return new Promise((resolve, reject) => {
    postcss(config.plugins)
      .process(css, {
        from: config.inputFile || path.resolve(__dirname, '../../tailwind.css'),
        to: config.outputFile,
      })
      .then(resolve)
      .catch(reject)
  })
}