import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: 'src/index.ts',
    format: 'esm',
    dts: true,
    sourcemap: true,
    clean: true,
  },
  {
    entry: { index: 'src/cjs.ts' },
    format: 'cjs',
    dts: false,
    sourcemap: true,
  },
]);
