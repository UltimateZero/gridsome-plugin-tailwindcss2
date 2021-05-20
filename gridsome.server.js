const path = require("path");
const fs = require("fs");
const tailwindCompiler = require("tailwindcss/lib/cli/compile").default;
const ExtraWatchWebpackPlugin = require("extra-watch-webpack-plugin");
const crypto = require("crypto");

const getHash = (data) => {
  return crypto.createHash("sha1").update(data).digest("hex");
};

const RunFuncPlugin = function (cb, cbConditional) {
  this.apply = function (compiler) {
    if (compiler.hooks) {
      if (compiler.hooks.watchRun) {
        compiler.hooks.watchRun.tapPromise("run-func-plugin", cbConditional);
      }
      if (compiler.hooks.run) {
        compiler.hooks.run.tapPromise("run-func-plugin", cb);
      }
    }
  };
};

let oldHash = "";
function TailwindPlugin(api, options) {
  let { tailwindConfigFile, mainCssFile } = options;
  tailwindConfigFile = path.resolve(tailwindConfigFile);
  mainCssFile = path.resolve(mainCssFile);
  const tailwindCssFile = path.resolve(__dirname, "./tailwind.css");
  const compilerPlugins = [
    require("tailwindcss")(tailwindConfigFile),
    require("autoprefixer"),
  ];

  oldHash = getHash(fs.readFileSync(tailwindCssFile))

  const buildTailwind = async () => {
    const result = await tailwindCompiler({
      inputFile: mainCssFile,
      outputFile: tailwindCssFile,
      plugins: compilerPlugins,
    });
    const newHash = getHash(result.css);
    if (oldHash !== newHash) {
      fs.writeFileSync(tailwindCssFile, result.css);
    }
    oldHash = newHash;
  };

  const buildTailwindConditional = (tailwindCssFile) => async (comp) => {
    const changedFiles = Object.keys(comp.watchFileSystem.watcher.mtimes);
    if (!(changedFiles.length === 1 && changedFiles[0] === tailwindCssFile)) {
      return buildTailwind();
    }
  };

  api.configureWebpack((config) => {
    return {
      ...config,
      plugins: [
        new RunFuncPlugin(
          buildTailwind,
          buildTailwindConditional(tailwindCssFile)
        ),
        new ExtraWatchWebpackPlugin({
          files: [mainCssFile, tailwindConfigFile],
        }),
        ...config.plugins,
      ],
    };
  });
}

TailwindPlugin.defaultOptions = () => ({
  tailwindConfigFile: "./tailwind.config.js",
  mainCssFile: "",
});

module.exports = TailwindPlugin;
