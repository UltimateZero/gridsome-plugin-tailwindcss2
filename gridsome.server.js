const path = require("path")
const fs = require('fs')
const tailwindCompiler = require('tailwindcss/lib/cli/compile').default
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

const RunFuncPlugin = function(cb, cbConditional){
  this.apply = function(compiler) {
    // console.log("Comp", compiler.watchFileSystem.watcherOptions);
    if(compiler.hooks) {
      // if(compiler.hooks.watchRun) {
      //   compiler.hooks.watchRun.tapPromise('run-func-plugin', cb)
      // }
      if(compiler.hooks.run) {
        compiler.hooks.run.tapPromise('run-func-plugin', cb)
      }
      if(compiler.hooks.invalid) {
        compiler.hooks.invalid.tap('run-func-plugin', cbConditional)
      }

    }
  }
}



function TailwindPlugin(api, options) {
  let { tailwindConfigFile, mainCssFile } = options;
  tailwindConfigFile = path.resolve(tailwindConfigFile)
  mainCssFile = path.resolve(mainCssFile)
  const tailwindCssFile = path.resolve(__dirname, './tailwind.css')


  const buildTailwind = async () => {
    // console.log("Compiling Tailwind CSS");
    const result = await tailwindCompiler({
      inputFile: mainCssFile,
      outputFile: tailwindCssFile,
      plugins: [require('tailwindcss')(tailwindConfigFile), require('autoprefixer')]
    })

    fs.writeFileSync(tailwindCssFile, result.css)
  }

  const buildTailwindConditional = (tailwindCssFile)=>(fileName) =>{
    // console.log("filename", fileName);
    if(fileName === tailwindCssFile) {
      // console.log("not rebuilding");
    } else {
      return buildTailwind()
    }
  }

  api.configureWebpack((config) => {
    // console.log("config", config);
    return {
      ...config,
      plugins: [
        new RunFuncPlugin(buildTailwind, buildTailwindConditional(tailwindCssFile)),
        new ExtraWatchWebpackPlugin({
          files: [ mainCssFile, tailwindConfigFile ],
        }),

        ...config.plugins,
      ],
     
     
    };
  });

}

TailwindPlugin.defaultOptions = () => ({
  tailwindConfigFile: "./tailwind.config.js",
  mainCssFile: ''
});

module.exports = TailwindPlugin;
