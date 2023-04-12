<template>
    <div>
        <label :for="name" class="block text-sm font-medium leading-6 text-gray-900">
            {{ label }}
        </label>
        <div class="mt-2">
            <textarea :id="name"
                      rows="4"
                      :name="name"
                      :value="modelValue"
                      v-bind="$attrs"
                      class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                             placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5
                             sm:text-sm sm:leading-6"
                      :class="{
                          'text-red-900 placeholder-text-300 ring-red-300 focus:ring-red-500': error
                      }"
                      @input="e => updateValue(e.target.value)" />
            <p v-if="error" class="mt-2 text-sm text-red-600" v-text="error" />
        </div>
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
