<template>
    <div class="mockup-code max-w-lg overflow-x-auto">
        <pre data-prefix="1"><code>// status object</code></pre>
        <pre v-for="(line, i) in lines" :key="i" :data-prefix="i + 2"><code>{{ line }}</code></pre>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ToastOptions } from '../type';

export default defineComponent({
    name: 'AppStatusDisplay',

    props: {
        status: {
            type: Object as PropType<ToastOptions>,
            required: true
        }
    },

    setup: (props) => {
        const lines = computed(() => {
            const clone: Partial<ToastOptions> = {};

            (Object.keys(props.status) as (keyof ToastOptions)[]).forEach(key => {
                if (props.status[key] === undefined || props.status[key] === false || props.status[key] === '') {
                    return;
                }

                clone[key] = props.status[key];
            });

            return JSON.stringify(clone, null, 4)
                .split('\n')
                .map(line => line
                    .replace('"', '')
                    .replace('"', '')
                    .replace(/"(\d+)"/g, '$1')
                );
        });

        return {
            lines
        };
    }
});
</script>
