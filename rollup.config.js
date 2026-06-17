import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const plugins = () => [
  resolve(),
  typescript({ tsconfig: './tsconfig.json' }),
  terser({ format: { comments: false }, compress: { passes: 2 } }),
];

const card = (input, file) => ({
  input,
  output: { file, format: 'es', inlineDynamicImports: true, sourcemap: false },
  plugins: plugins(),
});

export default [
  card('src/active-now-card.ts', 'dist/active-now-card.js'),
  card('src/home-dashboard-card.ts', 'dist/home-dashboard-card.js'),
];
