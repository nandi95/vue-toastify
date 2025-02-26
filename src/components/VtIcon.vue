<template>
    <div class="vt-icon-container" :class="containerClasses">
        <template v-if="userIcon">
            <component :is="userIcon.tag"
                       v-if="userIcon.type==='icon'"
                       class="vt-icon"
                       :class="userIcon.class"
                       v-html="userIcon.ligature" />
            <div v-else class="vt-icon">
                <Node :node="userIcon.node" />
            </div>
        </template>
        <div v-else-if="mode === 'loader'" class="vt-spinner" />
        <div v-else-if="mode === 'prompt'" class="vt-icon">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path d="M10,19H13V22H10V19M12,2C17.35,2.22 19.68,7.62 16.5,11.67C15.67,12.67 14.33,13.33
                       13.67,14.17C13,15 13,16 13,17H10C10,15.33 10,13.92 10.67,12.92C11.33,11.92 12.67,11.33
                       13.5,10.67C15.92,8.43 15.32,5.26 12,5A3,3 0 0,0 9,8H6A6,6 0 0,1 12,2Z" />
            </svg>
        </div>
        <div v-else-if="containerClasses['vt-success']" class="vt-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="36"
                 height="36"
                 viewBox="0 0 24 24">
                <path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41
                         0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z" />
            </svg>
        </div>
        <div v-else-if="containerClasses['vt-error']" class="vt-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="36"
                 height="36"
                 viewBox="0 0 24 24">
                <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02
                         0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89
                         4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </svg>
        </div>
        <div v-else-if="containerClasses['vt-warning']" class="vt-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="36"
                 height="36"
                 viewBox="0 0 24 24">
                <circle cx="12" cy="19" r="2" />
                <path d="M12 3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
        </div>
        <div v-else-if="containerClasses['vt-info']" class="vt-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
                 style="transform: rotate(180deg)"
                 width="36"
                 height="36"
                 viewBox="0 0 24 24">
                <path d="M12 3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <circle cx="12" cy="19" r="2" />
            </svg>
        </div>
    </div>
</template>

<script lang="ts">
import { isObject } from '../utils';
import { computed, defineComponent, isVNode } from 'vue';
import type { PropType, VNode } from 'vue';
import type { Icon } from '../type';
import Node from './Node';

export default defineComponent({
    name: 'VtIcon',
    components: { Node },

    props: {
        mode: { type: String },
        type: { type: String },
        icon: { type: [Object, String] as PropType<Icon | string | VNode> },
        baseIconClass: { type: String, default: '' }
    },


    setup: (props) => {
        const userIcon = computed(() => {
            if (!props.icon) {
                return false;
            }

            let icon: {type: 'icon'; tag: string; ligature: string; class: string} | {type: 'node'; node: VNode} = {
                type:'icon',
                tag: 'i',
                ligature: '',
                class: props.baseIconClass
            };

            if (typeof props.icon === 'string') {
                if (props.icon.toLowerCase().includes('<svg')) {
                    icon.tag = 'div';
                    icon.ligature = props.icon;
                } else {
                    icon.class = icon.class + ' ' + props.icon;
                }
            } else if (isVNode(props.icon)){
                icon = { type:'node', node: props.icon };
            } else if (isObject(props.icon)) {
                icon = Object.assign(icon, props.icon);
            }

            return icon;
        });

        const containerClasses = computed(() => {
            const obj: Record<string, boolean> = {};

            if (props.mode !== 'loader') {
                obj['vt-circle'] = !props.icon;
            }

            obj['vt-prompt'] = props.mode === 'prompt';

            if (props.mode === undefined || props.mode.length === 0) {
                obj['vt-' + (props.type ? props.type : 'info')] = true;
            }

            return obj;
        });

        return {
            userIcon,
            containerClasses
        };
    }
});
</script>
