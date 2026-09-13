import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      extensions: ['.js', '.jsx'],
    }),
    postcss({
      extract: 'toast.css',
      minimize: true,
      sourceMap: true,
    }),
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: 'dist' },
      ],
    }),
  ],
};
