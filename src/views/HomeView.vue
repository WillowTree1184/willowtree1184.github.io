<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import favicon from '@/assets/favicon.svg';
import { computed } from 'vue';
import AccountRecordView from '@/component/AccountRecordView.vue';
import { accountRecords } from '@/data/account-record';
import { favouriteRecords, isFavouriteRecord } from '@/data/favourite-record';
import { techStackRecords } from '@/data/tech-stack-record';

// const photographyWorkGlobs = import.meta.glob('@/assets/photography-work/*.featured.*', {
//     eager: true,
// });

const photographyWorkGlobs = import.meta.glob('@/assets/photography-work/*.*', {
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
    <div id="hero" class="flex align-center">
        <div class="flex align-center justify-between full-w">
            <div>
                <img alt="logo" :src="favicon" style="height: 4em" />
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
                    <div class="text-2 text-level-3 uppercase">
                        <p>&boxv;</p>
                        <AccountRecordView :record="accountRecords"></AccountRecordView>
                    </div>
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
                    <Vue3Marquee v-for="(record, i) in favouriteRecords" :duration="20" :direction="i % 2 === 0 ? 'normal' : 'reverse'" :clone="true" :pause-on-hover="true" class="interactable hover-fade-1">
                        <span v-if="isFavouriteRecord(record)">
                            <router-link v-if="record.isRouterLink ?? false" :to="record.link">{{ record.name }}&nbsp;</router-link>
                            <a v-else :href="record.link">{{ record.name }}&nbsp;</a>
                        </span>
                        <p v-else>{{ record }}&nbsp;</p>
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
                <div v-for="record in techStackRecords" class="gap-top-8 flex align-center justify-between interactable hover-fade-1">
                    <div>
                        <p>
                            <b>{{ record.name }}</b>
                        </p>
                        <p class="text-3 text-level-4">{{ record.usage }}</p>
                    </div>
                    <div class="right text-2">
                        <p v-for="item in record.items">{{ item }}</p>
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
</template>

<style scoped>
#hero {
    min-height: 100svh;
}

.container {
    min-height: 50svh;
    padding-top: 25svh;
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
