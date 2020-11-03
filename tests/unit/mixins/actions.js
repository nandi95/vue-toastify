"use strict";

// eslint-disable-next-line no-unused-vars
import { Wrapper, createWrapper } from "@vue/test-utils";

/**
 * @property {Function} expect
 * @property {Object|Wrapper} wrapper
 */
export default {
    /**
     * Trigger typing for the selected input
     *
     * @param {string} text
     * @param {string|null} selector
     *
     * @return {self}
     */
    type(text, selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.element.value = text;
        wrapper.trigger("input");

        return this;
    },

    /**
     * Click the element.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    click(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.trigger("click");

        return this;
    },

    /**
     * Click outside of the element.
     *
     * @return {self}
     */
    clickOutside() {
        wrapper = createWrapper(document.body);
        wrapper.trigger("click");

        return this;
    },

    /**
     * Trigger key down on the element.
     *
     * @param {string|number} keyCode
     * @param {string|null} selector
     */
    pressKey(keyCode, selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.trigger("keydown", {
            key: keyCode
        });

        return this;
    },

    /**
     * Blur away from the element.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    blur(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.element.blur();

        return this;
    },

    /**
     * Focus on the element.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    focus(selector = null) {
        // tip: if the element isn't an input or has no tabindex it cannot be focused
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.element.focus();

        return this;
    },

    /**
     * Hover on the element.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    hover(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.find(selector).trigger("hover");

        return this;
    },

    /**
     * Trigger submit on the element.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    submit(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.find(selector).trigger("submit");

        return this;
    },

    /**
     * Clear the input.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    clear(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.element.value = "";
        wrapper.trigger("input");

        return this;
    },

    /**
     * Emit event on the vue component.
     *
     * @param {string} evt
     * @param {string|null} selector
     *
     * @return {self}
     */
    emit(evt, selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.vm.$emit(evt);

        return this;
    },

    /**
     * Call the given method on the component.
     *
     * All arguments after the method name
     * added as an argument to the called method.
     *
     * @param methodName
     *
     * @return {self}
     */
    callMethod(methodName) {
        const args = Array.from(arguments).slice(1);
        this.wrapper.vm[methodName](...args);

        return this;
    }
};
