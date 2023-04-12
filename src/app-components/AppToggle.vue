<template>
    <div class="flex items-center">
        <button type="button"
                class="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2
                       border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
                       focus:ring-indigo-600 focus:ring-offset-2"
                :class="{ 'bg-indigo-600': modelValue }"
                role="switch"
                :aria-checked="modelValue"
                @click="toggle">
            <span aria-hidden="true"
                  class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                         ring-0 transition duration-200 ease-in-out"
                  :class="{ 'translate-x-5': modelValue }" />
        </button>
        <span class="ml-3 text-sm">
            <span class="font-medium text-gray-900">{{ label }}</span>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppToggle',

    props: {
        modelValue: {
            type: Boolean,
            required: true
        },

        label: {
            type: String,
            required: true
        }
    },

    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const toggle = () => {
            emit('update:modelValue', !props.modelValue);
            emit('change', !props.modelValue);
        };

        return {
            toggle
        };
    }
});
</script>
