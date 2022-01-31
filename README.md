# gridsome-plugin-tailwindcss2

This plugin will add latest version of [Tailwind](http://tailwindcss.com) (currently v2) to your
[Gridsome](http://gridsome.org) project.

## What's the difference between this plugin and [gridsome-plugin-tailwindcss](https://github.com/brandonpittman/gridsome-plugin-tailwindcss)?

This plugin lets you use the full power of the latest TailwindCSS (~~with JIT mode and all the good stuff~~ It seems that the compatibility build now also supports JIT and is identical to the PostCSS 8 build). The other plugin relies on TailwindCSS PostCSS7 compatibility build.



## Install

`yarn add -D gridsome-plugin-tailwindcss2 tailwindcss@latest postcss@latest autoprefixer@latest` 


## Usage

Have a main CSS file with the following:

```postcss
@tailwind base;
@tailwind components;
@tailwind utilities;
// rest of the file
```

**If you need to create `tailwind.config.js`, run `./node_modules/.bin/tailwind init` to create one.**

[plugins]: https://tailwindcss.com/docs/plugins/#app

## Customize

Set any options you want to set in `gridsome.config.js`.

```javascript
module.exports = {
  plugins: [
    {
      use: "gridsome-plugin-tailwindcss2",
      options: {
        tailwindConfigFile: './tailwind.config.js',
        mainCssFile: './src/assets/css/main.css',
      }
    },
    // ...
  ],
};
```

## Credits

 - [gridsome-plugin-tailwindcss](https://github.com/brandonpittman/gridsome-plugin-tailwindcss)
