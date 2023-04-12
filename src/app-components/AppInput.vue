<template>
    <div>
        <label :for="name" class="block text-sm font-medium leading-6 text-gray-900">
            {{ label }}
        </label>
        <div class="mt-2">
            <input :id="name"
                   :value="modelValue"
                   :name="name"
                   type="text"
                   class="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset px-2
                          ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                          sm:text-sm sm:leading-6"
                   v-bind="$attrs"
                   :class="{
                       'text-red-900 placeholder-text-300 ring-red-300 focus:ring-red-500': error
                   }"
                   @input="e => updateValue(e.target.value)">
        </div>
        <p v-if="error" class="mt-2 text-sm text-red-600" v-text="error" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppInput',

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
