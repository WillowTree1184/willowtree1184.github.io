<script setup lang="ts">
import { usePreloader } from '@/utils/preload';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Vue3Marquee } from 'vue3-marquee';

const visible = ref(true);
const vitrualProgress = ref(0);
const log = ref<{ status: 'INFO' | 'DONE' | 'ERR'; msg: string } | null>(null);
const showSkip = ref(false);
let skipTimer: ReturnType<typeof setTimeout> | null = null;

const router = useRouter();
const { stage, total, isComplete, isSkipped, run, skip } = usePreloader();

const emit = defineEmits(['ready']);

function addLog(status: 'INFO' | 'DONE' | 'ERR', msg: string) {
    log.value = { status, msg };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STAGE_PROGRESS: Record<import('@/utils/preload').PreloadStage, number> = {
    idle: 0,
    dom: 30,
    fonts: 50,
    router: 50,
    images: 50,
    complete: 80,
};

/** 点击 Skip */
function handleSkip() {
    if (!showSkip.value) return;
    showSkip.value = false;
    addLog('INFO', 'Skip requested');
    skip();
}

async function boot() {
    const startTime = Date.now();
    const MIN_LOAD_TIME = 800;

    performance.clearResourceTimings();

    addLog('INFO', 'System initializing...');
    vitrualProgress.value = 10;
    await delay(120);

    try {
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
                        // 图片阶段开始 5s 后显示 Skip
                        skipTimer = setTimeout(() => {
                            if (stage.value === 'images') showSkip.value = true;
                        }, 5000);
                        break;
                    case 'complete':
                        addLog('DONE', 'Image textures ready');
                        vitrualProgress.value = STAGE_PROGRESS.complete;
                        break;
                }
            },

            onImageProgress: (c, t) => {
                if (t === 0 || isSkipped.value) return;
                vitrualProgress.value = 50 + Math.round((c / t) * 30);
            },
        });

        // 清理 timer（图片在 10s 内加载完的情况）
        if (skipTimer) {
            clearTimeout(skipTimer);
            skipTimer = null;
        }
        showSkip.value = false;

        // 被 skip 后快速推进
        if (isSkipped.value) {
            addLog('INFO', 'Skipped remaining assets');
            vitrualProgress.value = 80;
        }

        addLog('INFO', 'Rendering interface...');
        vitrualProgress.value = 95;

        const elapsed = Date.now() - startTime;
        const remain = Math.max(0, MIN_LOAD_TIME - elapsed);
        if (remain > 0) await delay(remain);

        vitrualProgress.value = 100;
        addLog('DONE', 'System ready');
        await delay(800);
        visible.value = false;
    } catch (err) {
        console.error('Boot failed:', err);
        addLog('ERR', 'System failure');
        if (skipTimer) clearTimeout(skipTimer);
        vitrualProgress.value = 100;
        await delay(1000);
        visible.value = false;
    }
}

function onAfterLeave() {
    emit('ready');
    unlockScroll();
}

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

onUnmounted(() => {
    unlockScroll();
    if (skipTimer) clearTimeout(skipTimer);
});
</script>

<template>
    <Transition name="loading-fade" @after-leave="onAfterLeave">
        <div v-if="visible" class="component" aria-busy="true" aria-label="加载中">
            <div class="container text-level-2">
                <div>
                    <p class="text-2">initializing</p>
                    <h1>
                        <p>WillowTree1184's</p>
                        <p>Personal Website</p>
                    </h1>
                    <p class="gap-top-8 text-level-4 flex justify-between align-baseline">
                        <span>
                            <span class="text-3 nowap">{{ log?.status }} |&nbsp;</span>
                            <span class="gap-left-px-4">{{ log?.msg }}&nbsp;</span>
                        </span>
                        <span class="progress-text">{{ vitrualProgress.toFixed(0) }}%</span>
                    </p>

                    <div class="loading-progress">
                        <div class="progress-track">
                            <div class="progress-bar" :style="{ width: `${vitrualProgress}%` }" />
                        </div>
                    </div>

                    <Transition name="skip-btn">
                        <a v-if="showSkip" class="gap-top-8 text-level-4 skip-link interactable hover-fade-1 sub-interactable uppercase" style="position: absolute" @click.prevent="handleSkip">
                            Skip loading image
                            <span class="inline-block hover-move-right-1">&rarr;</span>
                        </a>
                    </Transition>
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

.skip-btn-enter-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease,
        filter 0.25s ease;
}

.skip-btn-enter-from {
    opacity: 0;
    transform: scale(0.98);
    filter: blur(8px);
}
</style>
