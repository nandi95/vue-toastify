import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const config: Parameters<typeof defineConfig>[0] = {
        plugins: [vue()],
        define: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __VUE_OPTIONS_API__: false
        }
    };

    if (mode === 'library') {
        config.build = {
            minify: true,
            copyPublicDir: false,
            lib: {
                entry: 'src/index.ts',
                name: 'vue-toastify',
                fileName: (format) => `index.${format}.js`,
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    },
                    assetFileNames: assetInfo => assetInfo.name === 'style.css' ? 'index.css' :assetInfo.name!,
                    exports: 'named'
                }
            }
        };
    }

    return config;
});
