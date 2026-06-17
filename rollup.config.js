import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/active-now-card.ts',
  output: {
    file: 'dist/active-now-card.js',
    format: 'es',
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser({
      format: { comments: false },
      compress: { passes: 2 },
    }),
  ],
};
