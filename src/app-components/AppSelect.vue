<template>
    <div>
        <label :for="name" class="block text-sm font-medium leading-6 text-gray-900">
            {{ label }}
        </label>
        <select :id="name"
                :name="name"
                :value="modelValue"
                v-bind="$attrs"
                class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset
                       ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                :class="{
                    'text-red-900 placeholder-text-300 ring-red-300 focus:ring-red-500': error
                }"
                @change="e => updateValue(e.target.value)">
            <option v-for="option in options"
                    :key="option.value"
                    :value="option.value"
                    :selected="option.selected"
                    v-text="option.text" />
        </select>
        <p v-if="error" class="mt-2 text-sm text-red-600" v-text="error" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'AppSelect',

    inheritAttrs: false,

    props: {
        modelValue: {
            type: String,
            default: ''
        },

        options: {
            type: Array as PropType<{ value: string; text: string; selected: boolean }[]>,
            required: true
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
