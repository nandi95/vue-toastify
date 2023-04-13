<template>
    <div class="flex">
        <label class="cursor-pointer label">
            <input v-model="model" type="checkbox" class="toggle toggle-primary">
            <span class="label-text ml-2">{{ label }}</span>
        </label>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

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
        const model = computed({
            get: () => props.modelValue,
            set: (value: boolean) => {
                emit('update:modelValue', value);
                emit('change', value);
            }
        });

        return {
            model
        };
    }
});
</script>
