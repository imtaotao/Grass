const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const cleanup = require('rollup-plugin-cleanup')
const resolve = require('rollup-plugin-node-resolve')

const esm = {
  input: 'src/index.js',
  output: {
    file: 'dist/grass.esm.js',
    format: 'es',
  }
}

const umd = {
  input: 'src/index.js',
  output: {
    file: 'dist/grass.min.js',
    format: 'umd',
    name: 'Grass',
  }
}

const cjs = {
  input: 'src/index.js',
  output: {
    file: 'dist/grass.common.js',
    format: 'cjs',
  }
}

async function build (cfg) {
  const bundle = await rollup.rollup({
    input: cfg.input,
    plugins: [
      cleanup(),
      // resolve(),
      babel({
        include: 'node_modules/virtual-dom',
        presets: ['es2015-rollup'],
      }),
    ]
  })
  await bundle.generate(cfg.output)
  await bundle.write(cfg.output)
}

build(esm)
build(cjs)
build(umd)