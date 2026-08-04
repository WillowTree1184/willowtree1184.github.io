/**
 * Preload.js
 * Vue 3 + Vue Router 专用资源预加载工具
 * 执行顺序：DOM Ready → Fonts Ready → Router Ready → Images Ready
 */

import { ref, nextTick, type Ref } from 'vue';
import type { Router, RouteLocationNormalized } from 'vue-router';

// ==================== 类型定义 ====================

export type PreloadStage =
    'idle' | 'dom' | 'fonts' | 'router' | 'images' | 'complete';

export interface PreloadOptions {
    /** 扫描容器，默认 document（建议传入 router-view 挂载点以精确扫描当前视图） */
    container?: HTMLElement | Document;
    /** 是否包含 CSS 背景图 */
    includeCssImages?: boolean;
    /** 是否解析 img/srcset 和 source/srcset */
    includeSrcSet?: boolean;
    /** 是否注入 <link rel="preload"> 标签（HTTP/2 提前下载） */
    injectPreloadLinks?: boolean;
    /** 目标路由路径，不传则等待当前路由就绪 */
    targetRoute?: string | RouteLocationNormalized;
}

export interface PreloadCallbacks {
    /** 阶段变化回调 */
    onStageChange?: (stage: PreloadStage) => void;
    /** 图片加载进度回调 (current, total) */
    onImageProgress?: (current: number, total: number) => void;
    /** 单张图片加载成功 */
    onImageLoad?: (url: string) => void;
    /** 单张图片加载失败 */
    onImageError?: (url: string) => void;
}

export interface PreloadResult {
    success: string[];
    failed: string[];
    total: number;
}

export interface PreloaderState {
    stage: Ref<PreloadStage>;
    progress: Ref<number>;
    current: Ref<number>;
    total: Ref<number>;
    failed: Ref<string[]>;
    success: Ref<string[]>;
    isRunning: Ref<boolean>;
    isComplete: Ref<boolean>;
    isSkipped: Ref<boolean>;
}

// ==================== 核心工具函数 ====================

/**
 * 预加载单张图片
 */
export function preloadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            if ('decode' in img) {
                img.decode()
                    .then(() => resolve(src))
                    .catch(() => resolve(src));
            } else {
                resolve(src);
            }
        };
        img.onerror = () => reject(src);
    });
}

/**
 * 从 CSS 值中提取所有 url(...)
 */
function extractUrls(cssValue: string): string[] {
    if (!cssValue || cssValue === 'none') return [];
    const matches: string[] = [];
    for (const match of cssValue.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        matches.push(match[1] as string);
    }
    return matches;
}

/**
 * 统一 URL 格式（绝对路径 + 去重）
 */
function normalizeUrl(url: string): string | null {
    if (!url || url.startsWith('data:')) return null;
    try {
        return new URL(url, location.href).href;
    } catch {
        return url;
    }
}

/**
 * 从指定容器收集图片 URL
 * 支持限制扫描范围，避免扫描到全局导航栏等无关图片
 */
export function collectImageUrls(
    options: Pick<
        PreloadOptions,
        'container' | 'includeCssImages' | 'includeSrcSet'
    > = {},
): string[] {
    const {
        container = document,
        includeCssImages = true,
        includeSrcSet = true,
    } = options;

    const urls = new Set<string>();
    const addUrl = (raw: string) => {
        const url = normalizeUrl(raw);
        if (url) urls.add(url);
    };

    // 1. Performance API：浏览器已发起的图片请求
    try {
        const entries = performance.getEntriesByType(
            'resource',
        ) as PerformanceResourceTiming[];
        for (const entry of entries) {
            const isImage =
                entry.initiatorType === 'img' ||
                entry.initiatorType === 'css-image' ||
                entry.initiatorType === 'image' ||
                /\.(jpg|jpeg|png|gif|webp|svg|avif|ico|bmp)(\?.*)?$/i.test(
                    entry.name,
                );
            if (isImage) addUrl(entry.name);
        }
    } catch {
        /* ignore */
    }

    const root =
        container instanceof Document ? document.documentElement : container;

    // 2. DOM <img>
    root.querySelectorAll('img').forEach((img) => {
        if (img.src) addUrl(img.src);
        if (includeSrcSet && img.srcset) {
            img.srcset.split(',').forEach((s) => {
                const src = s.trim().split(/\s+/)[0];
                if (src) addUrl(src);
            });
        }
    });

    // 3. <picture> source
    root.querySelectorAll<HTMLSourceElement>('picture source').forEach(
        (source) => {
            if (source.srcset) {
                source.srcset.split(',').forEach((s) => {
                    const src = s.trim().split(/\s+/)[0];
                    if (src) addUrl(src);
                });
            }
        },
    );

    // 4. CSS 背景图
    if (includeCssImages) {
        // 4.1 容器内联 style
        root.querySelectorAll('[style*="background-image"]').forEach((el) => {
            const style = (el as HTMLElement).style.backgroundImage;
            extractUrls(style).forEach(addUrl);
        });

        // 4.2 全局样式表（无法按容器过滤，只抓 background-image）
        try {
            Array.from(document.styleSheets).forEach((sheet) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule) => {
                        if (rule instanceof CSSStyleRule) {
                            extractUrls(rule.style.backgroundImage).forEach(
                                addUrl,
                            );
                            extractUrls(rule.style.listStyleImage).forEach(
                                addUrl,
                            );
                        }
                    });
                } catch {
                    /* 跨域样式表跳过 */
                }
            });
        } catch {
            /* ignore */
        }
    }

    return Array.from(urls);
}

/**
 * 注入 <link rel="preload" as="image"> 到 <head>
 * 用于 GitHub Pages 等 HTTP/2 环境提前并行下载
 */
export function injectPreloadLinks(imageUrls: string[]): void {
    const head = document.head;
    const existing = new Set(
        Array.from(
            head.querySelectorAll('link[rel="preload"][as="image"]'),
        ).map((el) => (el as HTMLLinkElement).href),
    );

    imageUrls.forEach((url) => {
        if (existing.has(url)) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        head.appendChild(link);
    });
}

// ==================== 阶段等待函数 ====================

/**
 * 阶段 1：等待 DOM 加载完成
 */
export function waitForDOMReady(): Promise<void> {
    return new Promise((resolve) => {
        if (document.readyState !== 'loading') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => resolve(), {
                once: true,
            });
        }
    });
}

/**
 * 阶段 2：等待字体加载完成
 */
export function waitForFonts(): Promise<void> {
    if ('fonts' in document) {
        return document.fonts.ready.then(() => undefined);
    }
    return Promise.resolve();
}

/**
 * 阶段 3：等待 Router 就绪
 * 等待 Vue Router 初始导航完成，并确保 DOM 已更新（nextTick）
 */
export function waitForRouter(router: Router): Promise<void> {
    return router.isReady().then(() => nextTick());
}

/**
 * 阶段 3（变体）：等待特定路由
 * 如果当前不在目标路由，会监听后续导航直到匹配
 */
export function waitForRoute(
    router: Router,
    target: string | RouteLocationNormalized,
): Promise<void> {
    const targetPath = typeof target === 'string' ? target : target.path;

    return new Promise((resolve) => {
        const check = () => {
            if (router.currentRoute.value.path === targetPath) {
                nextTick(() => {
                    unwatch();
                    resolve();
                });
            }
        };

        const unwatch = router.afterEach(check);
        check(); // 立即检查当前路由
    });
}

// ==================== 阶段 4：图片加载 ====================

/**
 * 加载指定容器内的所有图片
 * 支持进度回调，返回成功/失败明细
 */
export async function preloadContainerImages(
    options: PreloadOptions & PreloadCallbacks = {},
): Promise<PreloadResult> {
    const {
        container = document,
        injectPreloadLinks: shouldInject = false,
        onImageProgress,
        onImageLoad,
        onImageError,
        ...collectOptions
    } = options;

    const urls = collectImageUrls({
        container,
        includeCssImages: collectOptions.includeCssImages,
        includeSrcSet: collectOptions.includeSrcSet,
    });

    if (shouldInject) {
        injectPreloadLinks(urls);
    }

    const success: string[] = [];
    const failed: string[] = [];
    const total = urls.length;
    let current = 0;

    await Promise.all(
        urls.map((src) =>
            preloadImage(src)
                .then(() => {
                    success.push(src);
                    current++;
                    onImageProgress?.(current, total);
                    onImageLoad?.(src);
                })
                .catch(() => {
                    failed.push(src);
                    current++;
                    onImageProgress?.(current, total);
                    onImageError?.(src);
                }),
        ),
    );

    return { success, failed, total };
}

// ==================== 组合式 API（给 Loader.vue 用） ====================

/**
 * Vue 3 Composition API Hook
 * 暴露完整状态和进度，供 Loader.vue 组件渲染
 */
export function usePreloader(): PreloaderState & {
    run: (
        router: Router,
        options?: PreloadOptions & PreloadCallbacks,
    ) => Promise<PreloadResult>;
    reset: () => void;
    skip: () => void; // ← 新增
} {
    const stage = ref<PreloadStage>('idle');
    const progress = ref(0);
    const current = ref(0);
    const total = ref(0);
    const failed = ref<string[]>([]);
    const success = ref<string[]>([]);
    const isRunning = ref(false);
    const isComplete = ref(false);
    const isSkipped = ref(false); // ← 新增

    let skipCtrl: AbortController | null = null;

    const reset = () => {
        stage.value = 'idle';
        progress.value = 0;
        current.value = 0;
        total.value = 0;
        failed.value = [];
        success.value = [];
        isRunning.value = false;
        isComplete.value = false;
        isSkipped.value = false;
        skipCtrl = null;
    };

    /** 外部调用：跳过图片加载 */
    const skip = () => {
        if (isSkipped.value || !skipCtrl) return;
        isSkipped.value = true;
        skipCtrl.abort();
    };

    const run = async (
        router: Router,
        options: PreloadOptions & PreloadCallbacks = {},
    ): Promise<PreloadResult> => {
        if (isRunning.value) throw new Error('Preloader is already running');
        reset();
        isRunning.value = true;

        const {
            onStageChange,
            onImageProgress,
            onImageLoad,
            onImageError,
            ...preloadOptions
        } = options;

        try {
            // 阶段 1: DOM
            await waitForDOMReady();
            stage.value = 'dom';
            onStageChange?.('dom');

            // 阶段 2: Fonts
            await waitForFonts();
            stage.value = 'fonts';
            onStageChange?.('fonts');

            // 阶段 3: Router
            await waitForRouter(router);
            stage.value = 'router';
            onStageChange?.('router');

            // 阶段 4: Images（可中断）
            skipCtrl = new AbortController();
            stage.value = 'images';
            onStageChange?.('images');

            const routerView =
                document.querySelector('.router-view') ||
                document.querySelector('[class*="router-view"]') ||
                document.querySelector('#app > div') ||
                document;

            const imagePromise = preloadContainerImages({
                ...preloadOptions,
                container: routerView as HTMLElement,
                onImageProgress: (c, t) => {
                    if (skipCtrl?.signal.aborted) return;
                    current.value = c;
                    total.value = t;
                    progress.value = t > 0 ? Math.round((c / t) * 100) : 0;
                    onImageProgress?.(c, t);
                },
                onImageLoad: (url) => {
                    if (skipCtrl?.signal.aborted) return;
                    success.value.push(url);
                    onImageLoad?.(url);
                },
                onImageError: (url) => {
                    if (skipCtrl?.signal.aborted) return;
                    failed.value.push(url);
                    onImageError?.(url);
                },
            });

            // 等待：要么图片全加载完，要么被 skip()
            await Promise.race([
                imagePromise,
                new Promise<void>((resolve) => {
                    skipCtrl?.signal.addEventListener(
                        'abort',
                        () => resolve(),
                        {
                            once: true,
                        },
                    );
                }),
            ]);

            // 如果被 skip，用已加载的部分构造结果；否则等 imagePromise 真正完成
            const result: PreloadResult = skipCtrl.signal.aborted
                ? {
                      success: success.value,
                      failed: failed.value,
                      total: total.value,
                  }
                : await imagePromise;

            // 阶段 5: Complete
            stage.value = 'complete';
            onStageChange?.('complete');
            isComplete.value = true;
            return result;
        } catch (err) {
            stage.value = 'idle';
            throw err;
        } finally {
            isRunning.value = false;
        }
    };

    return {
        stage,
        progress,
        current,
        total,
        failed,
        success,
        isRunning,
        isComplete,
        isSkipped,
        run,
        reset,
        skip,
    };
}
// ==================== 默认导出 ====================

export default {
    preloadImage,
    collectImageUrls,
    injectPreloadLinks,
    waitForDOMReady,
    waitForFonts,
    waitForRouter,
    waitForRoute,
    preloadContainerImages,
    usePreloader,
};
