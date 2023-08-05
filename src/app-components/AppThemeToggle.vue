<template>
    <AppToggle v-model="isDark" label="Dark theme" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import AppToggle from './AppToggle.vue';

export default defineComponent({
    name: 'AppThemeToggle',

    components: { AppToggle },

    setup: () => {
        const isDark = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

        watch(
            isDark,
            value => document.documentElement.dataset.theme = value ? 'halloween' : 'emerald'
        );

        return {
            isDark
        };
    }
});
</script>
