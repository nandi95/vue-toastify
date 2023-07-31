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
                  class="textarea"
                  :class="{
                      'text-red-900 placeholder-text-300 ring-red-300 focus:ring-red-500': error
                  }"
                  @input="e => updateValue(e.target.value)" />
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
        const updateValue = (value: string) => {
            emit('update:modelValue', value);
            emit('change', value);
        };

        return {
            updateValue
        };
    }
});
</script>
