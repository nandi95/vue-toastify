import typescript from "@rollup/plugin-typescript";
import commonjs from 'rollup-plugin-commonjs';
import VuePlugin from 'rollup-plugin-vue';
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        }
    ],
    plugins: [
        commonjs(),
        VuePlugin()
    ],
    external: ['vue']
}
