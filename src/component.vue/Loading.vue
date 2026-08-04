<script setup lang="ts">
import { usePreloader, type PreloadStage } from '@/utils/preload';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Vue3Marquee } from 'vue3-marquee';

const visible = ref(true);
const vitrualProgress = ref(0);
const log = ref<{ status: 'INFO' | 'DONE' | 'ERR'; msg: string } | null>(null);

const router = useRouter();
// 只解构模板中需要的，progress 由 run() 内部管理，不在模板直接使用
const { stage, current, total, run } = usePreloader();

const emit = defineEmits(['ready']);

function addLog(status: 'INFO' | 'DONE' | 'ERR', msg: string) {
    log.value = { status, msg };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 阶段基准进度：images 阶段内由真实图片进度驱动 50% → 80%
const STAGE_PROGRESS: Record<PreloadStage, number> = {
    idle: 0,
    dom: 30,
    fonts: 50,
    router: 50,
    images: 50,
    complete: 95,
};

async function boot() {
    const startTime = Date.now();
    const MIN_LOAD_TIME = 800;

    // 清空历史性能数据，避免收集到导航前的资源
    performance.clearResourceTimings();

    // 初始化动画
    addLog('INFO', 'System initializing...');
    vitrualProgress.value = 10;
    await delay(120);

    try {
        // 核心：await run()，所有阶段通过回调精确通知
        await run(router, {
            includeCssImages: true,
            injectPreloadLinks: true,

            onStageChange: (s) => {
                switch (s) {
                    case 'dom':
                        addLog('DONE', 'Core modules loaded');
                        vitrualProgress.value = STAGE_PROGRESS.dom;
                        break;
                    case 'fonts':
                        addLog('DONE', 'Font assets loaded');
                        vitrualProgress.value = STAGE_PROGRESS.fonts;
                        break;
                    case 'images':
                        addLog('INFO', 'Decoding image assets...');
                        // 进度交给 onImageProgress 接管
                        break;
                    case 'complete':
                        addLog('DONE', 'Image textures ready');
                        vitrualProgress.value = STAGE_PROGRESS.complete;
                        break;
                }
            },

            onImageProgress: (c, t) => {
                if (t === 0) return;
                // images 阶段：50% 为起点，45% 为浮动区间，真实进度驱动
                vitrualProgress.value = 50 + Math.round((c / t) * 45);
            },

            onImageLoad: (url) => console.log('[Preload] OK:', url),
            onImageError: (url) => console.warn('[Preload] ERR:', url),
        });

        // 渲染界面
        addLog('INFO', 'Rendering interface...');
        vitrualProgress.value = 95;

        // 保证最小加载时间，避免"闪一下"就消失
        const elapsed = Date.now() - startTime;
        const remain = Math.max(0, MIN_LOAD_TIME - elapsed);
        if (remain > 0) await delay(remain);

        // 完成
        vitrualProgress.value = 100;
        addLog('DONE', 'System ready');
        await delay(800); // 让用户看到 100%
        visible.value = false;
    } catch (err) {
        console.error('Boot failed:', err);
        addLog('ERR', 'System failure');
        vitrualProgress.value = 100;
        await delay(1000);
        visible.value = false;
    }
}

function onAfterLeave() {
    emit('ready');
    unlockScroll();
}

// 滚动控制
function lockScroll() {
    document.body.style.height = '100svh';
    document.body.style.overflowY = 'hidden';
}

function unlockScroll() {
    document.body.style.height = '';
    document.body.style.overflowY = '';
}

onMounted(() => {
    lockScroll();
    boot();
});

// 保险：组件卸载时一定恢复滚动
onUnmounted(() => {
    unlockScroll();
});
</script>

<template>
    <Transition name="loading-fade" @after-leave="onAfterLeave">
        <div
            v-if="visible"
            class="component"
            aria-busy="true"
            aria-label="加载中"
        >
            <div class="container text-level-2">
                <p class="text-2">initializing</p>
                <h1>
                    <p>WillowTree1184's</p>
                    <p>Personal Website</p>
                </h1>
                <p
                    class="gap-top-8 text-level-4 flex justify-between align-baseline"
                >
                    <span>
                        <span class="text-3 nowap"
                            >{{ log?.status }} |&nbsp;</span
                        >
                        <span class="gap-left-px-4">{{ log?.msg }}&nbsp;</span>
                    </span>
                    <span class="progress-text"
                        >{{ vitrualProgress.toFixed(0) }}%</span
                    >
                </p>

                <div class="loading-progress">
                    <div class="progress-track">
                        <div
                            class="progress-bar"
                            :style="{ width: `${vitrualProgress}%` }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.component {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: var(--background-1);
    z-index: 9999;
}

.container {
    width: 100%;
    max-width: 25em;
}

.loading-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.progress-track {
    flex: 1;
    height: 2px;
    background: var(--background-4);
    position: relative;
    overflow: hidden;
}

.progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--text-1);
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 过渡动画 */
.loading-fade-leave-active {
    transition:
        opacity 0.6s ease,
        transform 0.6s ease,
        filter 0.6s ease;
}

.loading-fade-leave-to {
    opacity: 0;
    transform: scale(0.98);
    filter: blur(15px);
}
</style>
