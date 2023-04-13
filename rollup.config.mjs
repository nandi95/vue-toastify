import typescript from "@rollup/plugin-typescript";
import vue from 'rollup-plugin-vue';
import pkg from './package.json' assert { type: 'json' };

const banner = `
/*! ================================
${pkg.name} v${pkg.version}
(c) 2020-present ${pkg.author}
Released under ${pkg.license} License
================================== */
`;

/**
 * @type {import('rollup/dist/rollup').RollupOptions}
 */
const config = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
            banner
        }
    ],
    plugins: [
        vue(),
        typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: ['vue']
}

export default config;
