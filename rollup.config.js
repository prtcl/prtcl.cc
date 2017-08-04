
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'app/app.js',
  dest: 'www/assets/app.js',
  moduleName: 'app',
  format: 'iife',
  plugins: [
    resolve({
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      babelrc: false,
      presets: ['es2015-rollup']
    })
  ]
};
