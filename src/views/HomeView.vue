<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import favicon from '@/assets/favicon.svg';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const photographyWorkGlobs = import.meta.glob('@/assets/photography-work/*.featured.*', {
    eager: true,
});

console.log(Object.values(photographyWorkGlobs).map((module: any) => module.default));

const photographyWorks = computed(() => {
    return Object.values(photographyWorkGlobs).map((module: any) => module.default);
});

const GALLERY_ROWS = 2;

const galleryMarqueeGroups = computed(() => {
    const groups: string[][] = Array.from({ length: GALLERY_ROWS }, () => []);

    photographyWorks.value.forEach((src, idx) => {
        groups[idx % GALLERY_ROWS]?.push(src);
    });

    return groups.filter((g) => g.length > 0);
});
</script>

<template>
    <div id="hero" class="flex align-center container">
        <div class="flex align-center justify-between full-w">
            <div class="half-w right">
                <div class="half-w">
                    <img alt="logo" :src="favicon" style="height: 4em" />
                </div>
            </div>
            &nbsp;
            <div class="half-w">
                <p class="text-2 gap-left-px-2">WillowTree1184's</p>
                <h1>Personal Website</h1>
                <p class="text-2 text-level-4 gap-left-px-1">[ beta-v1 ]</p>
            </div>
        </div>
    </div>

    <div class="container flex align-center">
        <div class="full-w">
            <div id="about">
                <p class="text-2 text-level-4 uppercase">Earth Online Account Document</p>
                <div class="gap-left-px-1">
                    <h2 class="flex justify-between align-baseline">
                        <b>WillowTree</b>
                        <span class="text-2 text-level-3">#1184</span>
                    </h2>
                    <p class="text-2 text-level-3 uppercase sub-interactable">&boxv;</p>
                    <p class="text-2 text-level-3 uppercase sub-interactable">
                        &boxvr;
                        <span class="hover-fade-1">
                            Species:
                            <span class="inline-block hover-move-right-2">
                                Chordata &rang;
                                <span class="inline-block hover-move-right-1">
                                    Mammalia &rang;
                                    <span class="inline-block hover-move-right-1">Homo Sapiens</span>
                                </span>
                            </span>
                        </span>
                    </p>
                    <p class="text-2 text-level-3 uppercase sub-interactable">
                        &boxvr;&boxh;&boxh;&boxh;&boxh;
                        <span class="hover-fade-1">
                            Age:
                            <span class="inline-block hover-move-right-2">
                                16
                                <span class="inline-block hover-move-right-1">Year</span>
                            </span>
                        </span>
                    </p>
                    <p class="text-2 text-level-3 uppercase sub-interactable">
                        &boxvr;&boxh;&boxh;&boxh;&boxh;
                        <span class="hover-fade-1">
                            Sex:
                            <span class="inline-block hover-move-right-2">Male</span>
                        </span>
                    </p>
                    <p class="text-2 text-level-3 uppercase sub-interactable">
                        &boxvr;&boxh;&boxh;
                        <span class="hover-fade-1">
                            Users
                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                &boxv;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;
                                <span class="hover-fade-1">
                                    Count:
                                    <span class="inline-block hover-move-right-2">2</span>
                                </span>
                            </p>
                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                &boxv;&nbsp;&nbsp;&nbsp;&boxur;
                                <span class="hover-fade-1">
                                    Objects
                                    <p class="text-2 text-level-3 uppercase sub-interactable">
                                        &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;
                                        <span class="hover-fade-1">
                                            Host
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxv;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    Join Date:
                                                    <span class="inline-block hover-move-right-2">20091204</span>
                                                </span>
                                            </p>
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxv;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    Type:
                                                    <span class="inline-block hover-move-right-2">Original</span>
                                                </span>
                                            </p>
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxv;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    MBTI:
                                                    <span class="inline-block hover-move-right-2">
                                                        INTP
                                                        <span class="inline-block hover-move-right-1">Turbulent</span>
                                                    </span>
                                                </span>
                                            </p>
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxv;&nbsp;&nbsp;&nbsp;&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    State:
                                                    <span class="inline-block hover-move-right-2">Online</span>
                                                </span>
                                            </p>
                                        </span>
                                    </p>
                                    <p class="text-2 text-level-3 uppercase sub-interactable">
                                        &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&boxh;&boxh;
                                        <span class="hover-fade-1">
                                            Yu Chengyu
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    Join Date:
                                                    <span class="inline-block hover-move-right-2">20250913</span>
                                                </span>
                                            </p>
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxvr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    Type:
                                                    <span class="inline-block hover-move-right-2">
                                                        Neko
                                                        <span class="inline-block hover-move-right-1">
                                                            as
                                                            <span class="inline-block hover-move-right-1">Tulpa</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </p>
                                            <p class="text-2 text-level-3 uppercase sub-interactable">
                                                &boxv;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;
                                                <span class="hover-fade-1">
                                                    State:
                                                    <span class="inline-block hover-move-right-2">Connecting</span>
                                                </span>
                                            </p>
                                        </span>
                                    </p>
                                </span>
                            </p>
                        </span>
                    </p>
                    <p class="text-2 text-level-3 uppercase sub-interactable">
                        &boxur;&boxh;&boxh;
                        <span class="hover-fade-1">
                            State:
                            <span class="inline-block hover-move-right-2">Active</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="container flex align-center">
        <div class="full-w">
            <div id="favourite" class="gap-top-em-2 reveal">
                <p class="text-4 text-level-3 uppercase gap-left-px-1">Document#001</p>
                <h3 class="flex justify-between align-center">
                    <b>涉猎的领域</b>
                    <span class="text-2 text-level-4 uppercase">Favourite</span>
                </h3>
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
                        <a href="#projects">创造 Create&nbsp;</a>
                    </Vue3Marquee>
                </div>
            </div>
        </div>
    </div>

    <div id="tech-stack" class="flex align-center container gap-top-em-2">
        <div class="full-w">
            <p class="text-4 text-level-3 gap-left-px-2 uppercase">Document#002</p>
            <h3 class="flex justify-between align-baseline">
                <b>用过的技术栈</b>
                <span class="text-2 text-level-4 uppercase">Tech stack</span>
            </h3>
            <div>
                <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                    <div>
                        <p><b>.NET</b></p>
                        <p class="text-3 text-level-4">桌面应用 / CLI / 游戏 / Web API</p>
                    </div>
                    <div class="right text-2">
                        <p>C#</p>
                        <p>VB</p>
                        <p>WPF</p>
                        <p>Unity</p>
                        <p>Blazor</p>
                        <p>Asp.Net</p>
                    </div>
                </div>
                <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                    <div>
                        <p><b>node.js</b></p>
                        <p class="text-3 text-level-4">网页前端</p>
                    </div>
                    <div class="right text-2">
                        <p>java script</p>
                        <p>type script</p>
                        <p>vue</p>
                    </div>
                </div>
                <div class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                    <div>
                        <p><b>Bare Metal</b></p>
                        <p class="text-3 text-level-4">操作系统 / CLI / UEFI 应用</p>
                    </div>
                    <div class="right text-2">
                        <p>C</p>
                        <p>C++</p>
                        <p>EDKII</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="gallery" class="flex align-center container gap-top-em-2">
        <div class="full-w">
            <p class="text-4 text-level-3 gap-left-px-1 uppercase">Document#003</p>
            <h3>
                <b>摄影作品</b>
                <p class="text-3 text-level-4 uppercase">Gallery</p>
            </h3>
            <div class="gap-top-8 photography-works-vp">
                <div class="marquee-fullwidth photography-works">
                    <Vue3Marquee v-for="(group, i) in galleryMarqueeGroups" :key="i" :duration="20" :direction="i % 2 === 0 ? 'normal' : 'reverse'" :clone="true" :pause-on-hover="true">
                        <img v-for="(src, i) in group" :key="i" :src="src" class="interactable hover-fade-1" />
                    </Vue3Marquee>
                </div>
            </div>
            <div class="gap-left-px-1 gap-top-em-1 right text-2 uppercase">
                <b>Devices</b>
                <p class="text-3 text-level-3">Eyes & Phone</p>
                <br />
                <b>R.I.P. VUE VLOG</b>
                <p class="text-3 text-level-3">the community where I got started with photography composition</p>
            </div>
        </div>
    </div>
    <div id="projects" class="flex align-center justify-between container gap-top-em-2">
        <div>
            <p class="text-4 text-level-3 uppercase">Document#004</p>
            <h3>
                <b>主要项目</b>
                <p class="text-2 text-level-4 uppercase">Main Projects</p>
            </h3>
            <br />
            <a target="_blank" href="https://github.com/WillowTree1184" class="text-2 text-level-4 uppercase interactable hover-fade-1 sub-interactable">
                Access My Github
                <span class="inline-block hover-move-right-1">&rarr;</span>
            </a>
        </div>
        <div class="right">
            <div>
                <a target="_blank" href="https://github.com/NovaSharpCommunity/" class="uppercase interactable hover-fade-1 sub-interactable">
                    <b class="gap-right-px-1">
                        <img src="https://logo.novasharp.org/favicon/favicon.svg" style="height: 0.8em; transform: translateY(1px)" />
                        NovaSharp
                    </b>
                    <p class="text-2 text-level-4">A Programming Laungage</p>
                    <span class="text-3 text-level-4">
                        <span class="inline-block hover-move-left-1">&larr;</span>
                        View NovaSharp Community
                    </span>
                </a>
            </div>
            <div class="gap-top-em-1">
                <a target="_blank" href="https://github.com/WillowTree1184/CuberOS" class="uppercase interactable hover-fade-1 sub-interactable">
                    <b>Cuber OS</b>
                    <p class="text-2 text-level-4">A coding adventure of</p>
                    <p class="text-2 text-level-4">building an operating system</p>
                    <span class="text-3 text-level-4">
                        <span class="inline-block hover-move-left-1">&larr;</span>
                        View Project
                    </span>
                </a>
            </div>
        </div>
    </div>
    <div class="gap-left-px-1 gap-top-em-1"></div>
    <div class="gap-left-px-1 gap-top-em-1">
        <b class="text-4 text-level-3 uppercase">Coming Soon</b>
        <p>我真的在非常积极地构建这个网站</p>
    </div>
    <div class="gap-left-px-1 gap-top-em-1"></div>
</template>

<style scoped>
.container {
    min-height: 80svh;
}

.marquee-fullwidth {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 120dvw;
    overflow: hidden;
}

.photography-works {
    position: relative;
    transform: translateX(-50%) rotate(-5deg);
    transform-origin: center center;
}

.photography-works img {
    height: 5em;
    margin: 0.5em;
    flex-shrink: 0;
}
</style>
