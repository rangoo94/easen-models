import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')

export default {
  entry: 'src/index.js',
  plugins: [ buble(), uglify(), commonjs() ],
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'EasenModels',
      exports: 'named',
      sourceMap: true
    }
  ]
}
