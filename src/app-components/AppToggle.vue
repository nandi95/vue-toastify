<template>
    <div class="flex">
        <label class="cursor-pointer label">
            <input v-model="model"
                   type="checkbox"
                   :disabled="disabled"
                   class="toggle toggle-primary">
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
            default:false
        },

        label: {
            type: String,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const model = computed({
            get: () => props.modelValue,
            set: (value: boolean) => {
                console.log('set', value);
                emit('update:modelValue', value);
                emit('change', value);
                console.log(props.modelValue);
            }
        });

        return {
            model
        };
    }
});
</script>
