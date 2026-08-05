import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import combine from 'postcss-combine-duplicated-selectors';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        vue(),
        mode === 'development' && vueDevTools(),
        // visualizer({ open: true, gzipSize: true, brotliSize: true }),
        viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
        viteCompression({ algorithm: 'gzip', ext: '.gz' }),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80, progressive: true },
            jpg: { quality: 80, progressive: true },
            webp: { quality: 80, effort: 6 },
            avif: { quality: 70, effort: 4 },
            svg: {
                multipass: true,
                plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs' }],
            },
        }),
    ],
    css: {
        postcss: {
            plugins: [
                postcssPresetEnv({
                    stage: 2,
                    browsers: ['last 2 versions', '> 1%'],
                    features: {
                        'custom-properties': true,
                        'nesting-rules': true,
                        'color-functional-notation': true,
                    },
                }),
                autoprefixer(),
                combine({
                    removeDuplicatedProperties: true,
                    removeDuplicatedValues: true as any,
                }),
            ],
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    optimizeDeps: {
        include: ['vue', 'vue-router'],
        exclude: ['某些不需要预构建的包'],
    },
    build: {
        // target: 'esnext',
        // cssTarget: 'chrome61',
        // 激进代码分割
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('/vue/') || id.includes('/@vue/') || id.includes('/vue-router/') || id.includes('/lenis/')) {
                            return 'core';
                        }

                        // 其他第三方库
                        const match = id.match(/node_modules\/(?!\.pnpm\/)([^/]+)/);
                        if (match) {
                            // return `${match[1].replace('@', '')}`
                            return 'vendor'
                        }
                    }
                },
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.names?.[0] ?? '';
                    const ext = name.split('.').pop() || '';

                    // 图片资源
                    if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
                        return 'img/[name]-[hash][extname]';
                    }
                    // 字体资源
                    if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
                        return 'fonts/[name]-[hash][extname]';
                    }
                    // CSS
                    if (ext === 'css') {
                        return 'css/[name]-[hash][extname]';
                    }
                    // 默认
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },

        // 减小 chunk 大小阈值，更细粒度拆分
        chunkSizeWarningLimit: 200,

        // CSS 代码分割
        cssCodeSplit: true,

        // 移除 console 和 debugger
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                dead_code: true,
                unused: true,
                evaluate: true,
                booleans: true,
                conditionals: true,
                if_return: true,
                join_vars: true,
                loops: true,
                properties: true,
                keep_fargs: false,
                keep_classnames: false,
                keep_fnames: false,
                arrows: true,
                comparisons: true,
                reduce_funcs: true,
                reduce_vars: true,
                sequences: true,
                side_effects: true,
                typeofs: true,
                global_defs: {
                    __VUE_PROD_DEVTOOLS__: false,
                    __VUE_OPTIONS_API__: false,
                },
                passes: 5,
            },
            format: {
                comments: false,
                beautify: false,
            },
            mangle: {
                // 混淆属性名（⚠️ 有风险，需要配合 reserved 使用）
                properties: false,
                // 混淆顶级作用域变量
                toplevel: true,
                // 保留特定变量名（防止外部依赖被改坏）
                reserved: [],
            },
            sourceMap: false,
        },

        // 资源内联阈值调低，小文件直接内联
        assetsInlineLimit: 4096,
    },
}));
