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
            type: Object as PropType<Omit<ToastOptions,'duration'> & {duration?: string}>,
            required: true
        }
    },

    setup: (props) => {
        const lines = computed(() => {
            const clone = Object.fromEntries(Object.entries(props.status).flatMap(([key,value])=>{
                if(value===undefined || value ===false || value==='') return [];
                return [[key,value]];
            }))

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
