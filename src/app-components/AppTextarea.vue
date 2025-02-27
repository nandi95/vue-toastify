<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">{{ label }}</span>
        </label>
        <textarea :id="name"
                  rows="4"
                  :name="name"
                  :value="modelValue"
                  v-bind="$attrs"
                  class="textarea textarea-bordered"
                  :class="{
                      'text-red-900 placeholder-text-300 ring-red-300 focus:ring-red-500': error
                  }"
                  @input="updateValue" />
        <p v-if="error" class="mt-2 text-sm text-red-600" v-text="error" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppTextarea',

    inheritAttrs: false,

    props: {
        modelValue: {
            type: String,
            default: ''
        },

        label: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        error: {
            type: String,
            default: ''
        }
    },

    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const updateValue = (e: Event) => {
            const el = e.currentTarget as HTMLTextAreaElement;
            const value = el.value;
            emit('update:modelValue', value);
            emit('change', value);
        };

        return {
            updateValue
        };
    }
});
</script>
