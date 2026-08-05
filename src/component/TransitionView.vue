<script setup lang="ts">
import { usePreloader } from '@/utils/preload'
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Vue3Marquee } from 'vue3-marquee'

const visible = ref(false)
const destination = ref<string>('')
const router = useRouter()

// 记录当前正在进行的导航数量，用于处理并发跳转
const activeNavigations = ref(0)

const { stage, total, isComplete, isSkipped, run, skip } = usePreloader();

const removeBeforeEach = router.beforeEach( async (to, from) => {
    visible.value = true
    destination.value = (to.name ?? to.path) as string;
    await new Promise(r => setTimeout(r, 500));
    lockScroll();
    return true
})

const removeAfterEach = router.afterEach(async (to, from, failure) => {
    activeNavigations.value = 0
    try {
        await run(router,
            {
                onStageChange: (stage) => {
                    if (stage == 'complete')
                    {
                        visible.value = false
                    }
                }
            }
        )
    } catch (err) {
        visible.value = false
    }
})

function lockScroll() {
    document.body.style.height = '100svh';
    document.body.style.overflowY = 'hidden';
}

function unlockScroll() {
    document.body.style.height = '';
    document.body.style.overflowY = '';
}

// 组件卸载时移除路由守卫，避免内存泄漏与重复注册
onBeforeUnmount(() => {
  removeBeforeEach()
    removeAfterEach()
    unlockScroll()
})
</script>

<template>
  <Transition name="transition" @after-leave="unlockScroll">
    <div v-if="visible" class="component">
      <div class="container">
        <p class="text-level-2 uppercase"><span class="text-3">Goto</span> {{ destination }}</p>
        <Vue3Marquee :duration="1" :direction="'reverse'" :clone="true">
          <p>&rsaquo;</p>
        </Vue3Marquee>
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
  background: hsla(var(--background-hsl-2), 100%);
  backdrop-filter: blur(50px) brightness(120%);
  inset: 0;
  z-index: 9998;
}

.container {
  width: 100%;
  max-width: 25em;
}

.transition-enter-active,
.transition-leave-active {
  transition: clip-path 0.35s ease-in-out,
            filter 0.5s ease-in-out,
            background 0.5s ease-in-out,
            backdrop-filter 0.5s ease-in-out,
            opacity 0.5s ease-in-out;
  clip-path: inset(0 0 0 0);
}

.transition-enter-from,
.transition-leave-to {
    filter: blur(5px);
    background: hsla(var(--background-hsl-2), 0);
    backdrop-filter: blur(50px);
    opacity: 0;
}

.transition-enter-from {
  clip-path: inset(0 0 0 100%);
}

.transition-leave-to {
    clip-path: inset(0 100% 0 0);
}
</style>