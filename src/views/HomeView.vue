<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import favicon from '@/assets/favicon.svg';
import { computed } from 'vue';

const photographyWorkGlobs = import.meta.glob(
  '@/assets/photography-work/*.*',
  { eager: true }
)

console.log(Object.values(photographyWorkGlobs).map((module: any) => module.default));

const photographyWorks = computed(() => {
    return Object.values(photographyWorkGlobs).map((module: any) => module.default);
})

// 2. 配置
const GALLERY_ROWS = 4  // 分成 4 个 Marquee

// 3. 交错分配：第 i 张图 → 第 i % ROWS 行
// 效果：相邻图片分散到不同行，视觉更丰富
const galleryMarqueeGroups = computed(() => {
    const groups: string[][] = Array.from({ length: GALLERY_ROWS }, () => []);

    photographyWorks.value.forEach((src, idx) => {
        groups[idx % GALLERY_ROWS]?.push(src)
    })

    return groups.filter(g => g.length > 0)
})
</script>

<template>
    <div id="hero" class="flex align-center">
        <div class="flex justify-between half-w right">
            <div class="half-w">
                <img alt="logo" :src="favicon" height="100"/>
            </div>
            &nbsp;&nbsp;&nbsp;
        </div>
        <div class="half-w">
            <p class="text-2 gap-left-px-2">WillowTree1184's</p>
            <h1>Personal Website</h1>
            <p class="text-2 text-level-4 gap-left-px-1">[ beta-v1 ]</p>
        </div>
    </div>
    <div id="about">
        <p class="text-2 uppercase"> Earth Online Player Document</p>
        <div class="gap-left-px-1">
            <h2 class="flex justify-between align-baseline"><b>WillowTree</b> <span class="text-2 text-level-3">#1184</span></h2>
            <p class="text-2 text-level-2 uppercase sub-interactable">&boxvr;&boxh; <span class="hover-fade-1">Age: <span class="inline-block hover-move-right-2">16</span></span></p>
            <p class="text-2 text-level-2 uppercase sub-interactable">&boxvr;&boxh; <span class="hover-fade-1">Sex: <span class="inline-block hover-move-right-2">Male</span></span></p>
            <p class="text-2 text-level-2 uppercase sub-interactable">&boxur; <span class="hover-fade-1">MBTI: <span class="inline-block hover-move-right-2">INTP Turbulent</span></span></p>
        </div>
    </div>
    <div id="favourite" class="gap-left-px-1 gap-top-em-2">
        <p class="text-4 text-level-3 uppercase">Document#001</p>
        <h3 class="flex justify-between align-center gap-left-px-2"><b>涉猎的领域</b> <span class="text-3 text-level-4 uppercase">Favourite</span></h3>
        <div class="gap-top-4 marquee-fullwidth text-2 uppercase">
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <a href="#tech-stack">计算机科学 Computer Science&nbsp;</a>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>心理学 Psychology&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>家庭教育学 Family Education&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>脑神经科学 Brain Neuroscience&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-2">
                <a href="#gallery">摄影 Photography&nbsp;</a>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>平面设计 Graphic Design&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>人造意识体 Tulpamamcy&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>猫娘 Nekomusume&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-2">
                <p>哲学 Philosophy&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :direction="'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                <p>音乐 Music&nbsp;</p>
            </Vue3Marquee>
            <Vue3Marquee :duration="20" :clone="true" :pause-on-hover="true" class="interactable hover-fade-2">
                <p>创造 Create&nbsp;</p>
            </Vue3Marquee>
        </div>
    </div>

    <div id="tech-stack" class="gap-left-px-1 gap-top-em-2">
        <p class="text-4 text-level-3 uppercase">Document#002</p>
        <h3 class="flex justify-between align-baseline"><b>用过的技术栈</b><span class="text-3 text-level-4 uppercase">Tech stack</span></h3>
        <div>
            <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                <p><b>.NET</b></p>
                <div class="right text-2">
                    <p>C#</p>
                    <p>VB</p>
                    <p>Unity</p>
                    <p>Asp.Net</p>
                    <p>Blazor</p>
                    <p>WPF</p>
                </div>
            </div>
            <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                <p><b>npm</b></p>
                <div class="right text-2">
                    <p>js</p>
                    <p>ts</p>
                    <p>vue</p>
                </div>
            </div>
            <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                <p><b>Bare Metal</b></p>
                <div class="right text-2">
                    <p>C</p>
                    <p>C++</p>
                    <p>EDKII</p>
                </div>
            </div>
        </div>
    </div>
    <div id="gallery" class="gap-left-px-1 gap-top-em-2">
        <p class="text-4 text-level-3 uppercase">Document#003</p>
        <h3><b>摄影作品</b><p class="text-3 text-level-4 uppercase">Gallery</p></h3>
        <div class="gap-top-8 photography-works-vp">
            <div class="marquee-fullwidth interactable hover-fade-1 photography-works">
                <Vue3Marquee v-for="(group, i) in galleryMarqueeGroups" :key="i" :duration="20" :direction="i % 2 === 0 ? 'normal' : 'reverse'" :clone="true">
                    <img v-for="(src, i) in group" :key="i" :src="src" style="height: 5em; margin: 0.5em"/>
                </Vue3Marquee>
            </div>
        </div>
    </div>
    <div class="gap-left-px-1 gap-top-em-1 right">
        <b class="text-4 text-level-3 uppercase">Coming Soon</b>
        <p>该网站正在狠狠地被构建，请耐心等待</p>
    </div>
    <div class="gap-left-px-1 gap-top-em-1"></div>
</template>

<style scoped>
#hero {
    min-height: 90svh;
}

.marquee-fullwidth {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 120svw;
    overflow: hidden;
    margin-bottom: 0.5rem;
    
}

.photography-works {
    position: relative;
    transform: translateX(-50%) rotate(-5deg);
    transform-origin: center center;
}
</style>