<template>
    <div>
        <label :for="name" class="label">
            {{ label }}
        </label>
        <div class="mt-2">
            <input :id="name"
                   :value="modelValue"
                   :name="name"
                   type="text"
                   class="input"
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
