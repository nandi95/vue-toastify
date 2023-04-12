<template>
    <div
        class="font-mono border-gray-200 bg-gray-800 text-gray-400 p-5 rounded-lg shadow-xl mx-auto max-w-md mb-8 break-words">
        <p>status: {</p>
        <p v-if="status.title" class="ml-8">
            title: "<span v-text="status.title" />",
        </p>
        <p class="ml-8">
            body: "<span v-text="status.body" /><span>"</span>
            <span v-if="
                status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.pauseOnHover ||
                    status.type ||
                    status.mode ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.type" class="ml-8">
            type: "<span v-text="status.type" /><span>"</span>
            <span v-if="
                status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.pauseOnHover ||
                    status.mode ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.pauseOnHover" class="ml-8">
            pauseOnHover: <span v-text="status.pauseOnHover" />
            <span v-if="
                status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.mode ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.canTimeout" class="ml-8">
            canTimeout: <span v-text="status.canTimeout" />
            <span v-if="
                status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.mode ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.defaultTitle" class="ml-8">
            defaultTitle:
            <span v-text="status.defaultTitle" /><span v-if="
                status.duration ||
                    status.icon ||
                    status.mode ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.mode" class="ml-8">
            mode: "<span v-text="status.mode" /><span>"</span><span v-if="
                status.duration ||
                    status.icon ||
                    status.answers ||
                    status.url
            ">,</span>
        </p>
        <p v-if="status.answers" class="ml-8">
            answers: <span v-text="status.answers" /><span v-if="
                status.duration || status.icon || status.url
            ">,</span>
        </p>
        <p v-if="status.duration" class="ml-8">
            duration:
            <span v-text="status.duration" />
            <span v-if="status.icon || status.url">,</span>
        </p>
        <p v-if="status.icon" class="ml-8">
            icon: "<span v-text="status.icon" /><span>"</span>
            <span v-if="status.url">,</span>
        </p>
        <p v-if="status.url" class="ml-8">
            url: "<span v-text="status.url" /><span>"</span>
        </p>
        <p>}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ToastOptions } from '../type';

export default defineComponent({
    name: 'AppStatusDisplay',

    props: {
        status: {
            type: Object as PropType<ToastOptions>,
            required: true
        }
    }
});
</script>
