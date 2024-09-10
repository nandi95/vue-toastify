<template>
    <div>
        <label :for="name" class="label">
            {{ label }}
        </label>
        <select :id="name"
                :name="name"
                :value="modelValue"
                v-bind="$attrs"
                class="select select-bordered"
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
