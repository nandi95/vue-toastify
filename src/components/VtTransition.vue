<template>
    <transition-group :name="typeof transition!=='string' ?  transition?.name : transition"
                      :css="true"
                      tag="div"
                      :move-class="(typeof transition!=='string' ? transition?.moveClass : null )??'vt-move'"
                      @leave="leave"
                      @before-enter="beforeEnter"
                      @after-enter="afterEnter"
                      @before-leave="beforeLeave">
        <slot />
    </transition-group>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import useSettings from '../composables/useSettings';
import type { Settings, XPosition, YPosition, Position } from '../type';
import type { PropType } from 'vue';

export default defineComponent({
    name: 'VtTransition',

    props: {
        transition: {
            type: [String, Object] as PropType<Required<Settings['transition']> | string>,
            required: true
        },

        position: {
            type: String as PropType<Position>,
            required: true
        }
    },

    setup: (props) => {
        const { settings } = useSettings();
        const instance = getCurrentInstance();

        const leave = (el: Element) => {
            if (
                settings.singular ||
                (settings.oneType && el.parentNode!.childNodes.length === 1)
                || !(el instanceof HTMLElement)
            ) {
                return;
            }
            const position = props.position.split('-') as [YPosition, XPosition];
            // https://forum.vuejs.org/t/transition-group-move-class-not-occuring-in-the-array/6381/5
            // these rules ensure the toast stays where it is
            const { height, width, marginBottom } = window.getComputedStyle(el);

            // when the last toast removed the container collapses hence the need for the width subtraction
            el.style.left =
                String(el.offsetLeft - (el.parentNode!.childNodes.length === 1 ? parseInt(width) / 2 : 0)) + 'px';
            el.style.top = String(el.offsetTop) + 'px';

            if (position[0] === 'center') {
                el.style.top =
                    String(parseInt(el.style.top) -
                    parseInt(height) / 2 -
                    parseInt(marginBottom) / 2) +
                    'px';
            }

            if (position[0] === 'bottom') {
                el.style.top =
                    String(parseInt(el.style.top) - parseInt(height) - parseInt(marginBottom)) + 'px';
            }

            // an absolute position may mess with the width, so let's set to initial
            el.style.width = width;
            el.style.position = 'absolute';
        };

        const beforeEnter = (el: HTMLDivElement) => {
            const toastContainer = instance?.vnode.el as HTMLDivElement;

            for (let i = 0; i < toastContainer.children.length; i++) {
                delete (toastContainer.children.item(i) as HTMLDivElement).dataset.delayed;
            }

            if (el.dataset.delayed) {
                el.classList.add('vt-move', 'vt-will-change');
            }
        };

        const afterEnter = (el: HTMLDivElement) => {
            el.removeAttribute('data-delayed');
            el.classList.remove('vt-move', 'vt-will-change');
        };

        const beforeLeave = (el: HTMLDivElement) => {
            el.classList.add('vt-will-change');

            // this ensures that notifications won't move until the other has been removed
            for (let i = 0; i < el.parentNode!.childNodes.length; i++) {
                if (el.parentNode!.childNodes[i].isSameNode(el)) {
                    continue;
                }

                (el.parentElement!.children[i] as HTMLDivElement).dataset.delayed = 'true';
            }
        };

        return {
            beforeEnter,
            afterEnter,
            beforeLeave,
            leave
        };
    }
});
</script>
