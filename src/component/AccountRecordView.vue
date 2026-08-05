<script setup lang="ts">
import { type Component, defineComponent, h, type PropType } from 'vue';
import { type AccountRecord } from '@/data/account-record';

const props = defineProps<{
    record: AccountRecord[];
    prefix?: string; // 祖先留下的前缀，如 "│   " 或 "    "
}>();
</script>

<script lang="ts">
const ArrayValue: any = defineComponent({
    props: {
        parts: { type: Array as PropType<string[]>, required: true },
        isRawValue: { type: Boolean, default: false }, // 新增
    },
    setup(props) {
        return () => {
            if (!props.parts.length) return null;

            const [first, ...rest] = props.parts;

            // isRawValue 为 true 时使用 innerHTML（即 v-html）
            const firstNode = props.isRawValue ? h('span', { innerHTML: first }) : first;

            return h('span', [
                firstNode,
                rest.length > 0
                    ? h(
                          'span',
                          { class: 'inline-block hover-move-right-1' },
                          h(ArrayValue, {
                              parts: rest,
                              isRawValue: props.isRawValue, // 递归传递
                          }),
                      )
                    : null,
            ]);
        };
    },
});
</script>

<template>
    <p v-for="(record, i) in $props.record as AccountRecord[]">
        <span class="sub-interactable">
            <span>
                <pre style="display: inline" v-html="`${prefix ?? ''}${i === $props.record.length - 1 ? '&boxur;&boxh; ' : '&boxvr;&boxh; '}`"></pre>
            </span>
            <span class="hover-fade-1">
                {{ record.key }}
                <span v-if="record.value && !Array.isArray(record.value)" class="inline-block hover-move-right-2">
                    {{ record.value }}
                </span>
                <span v-if="record.value && Array.isArray(record.value)" class="inline-block hover-move-right-2">
                    <ArrayValue :parts="record.value" :isRawValue="record.isRawValue" />
                </span>
            </span>
        </span>
        <AccountRecordView v-if="record.children && record.children?.length" :record="record.children" :prefix="($props.prefix ?? '') + (i === $props.record.length - 1 ? '&nbsp;&nbsp;&nbsp;' : '&boxv;&nbsp;&nbsp;')" />
    </p>
</template>
