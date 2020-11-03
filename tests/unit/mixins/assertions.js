"use strict";

// eslint-disable-next-line no-unused-vars
import { Wrapper } from "@vue/test-utils";

/**
 * @property {Function} expect
 * @property {Object|Wrapper} wrapper
 */
export default {
    /**
     * Check to see the text/html is found on the element.
     *
     * @param {string} text
     * @param {string|null} selector
     *
     * @return {self}
     */
    see(text, selector = null) {
        let wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.html()).toContain(text);

        return this;
    },

    /**
     * On the whole component the following is not visible.
     *
     * @param {string} text
     *
     * @return {self}
     */
    doNotSee(text) {
        // content hidden by visibility/display: none will still be in the html
        expect(this.wrapper.html()).not.toContain(text);

        return this;
    },

    /**
     * Check that the input value is the same as the given value.
     *
     * @param {string} text
     * @param {string} selector
     *
     * @return {self}
     */
    inputValueIs(text, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.value).toBe(text);

        return this;
    },

    /**
     * Checks that the input value is not the same as the given value.
     *
     * @param {string} text
     * @param {string} selector
     *
     * @return {self}
     */
    inputValueIsNot(text, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.value).not.toBe(text);

        return this;
    },

    /**
     * Check that the input element is checked.
     *
     * @param {string} selector
     *
     * @return {self}
     */
    isChecked(selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.checked).toBeTruthy();

        return this;
    },

    /**
     * Check that the input element is not checked.
     *
     * @param {string} selector
     *
     * @return {self}
     */
    isNotChecked(selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.checked).toBeFalsy();

        return this;
    },

    /**
     * Check  whether the element is focused or not.
     *
     * @param {string} selector
     *
     * @return {default}
     */
    isFocused(selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(document.activeElement.isSameNode(wrapper.element)).toBeTruthy();

        return this;
    },

    /**
     * Check whether the element is is in the dom.
     *
     * @param {string} selector
     *
     * @return {self}
     */
    domHas(selector) {
        expect(this.wrapper.contains(selector)).toBe(true);

        return this;
    },

    /**
     * Checks whether the element is not in the dom.
     *
     * @param selector
     *
     * @return {self}
     */
    domHasNot(selector) {
        expect(this.wrapper.contains(selector)).toBe(false);

        return this;
    },

    /**
     * Check that there ar the same number of elements as expected.
     *
     * @param {string} selector
     * @param {number} length
     *
     * @return {self}
     */
    domHasLength(selector, length) {
        expect(this.wrapper.findAll(selector).length).toBe(length);

        return this;
    },

    /**
     * Check that the element display is set to none.
     *
     * @param selector
     *
     * @return {self}
     */
    isVisible(selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.style.display).not.toEqual("none");

        return this;
    },

    /**
     * Check that the element display is not set to none.
     *
     * @param selector
     *
     * @return {self}
     */
    isHidden(selector) {
        let element = this.wrapper.find(selector).element;
        let isHidden = false;

        //recursively find a parent which has display: none
        while (element.parentElement && !isHidden) {
            element = element.parentElement;
            isHidden = element.style.display === "none";
        }

        expect(isHidden).toBe(true);

        return this;
    },

    /**
     * Attribute is present on the element
     *
     * @param {string} attribute
     * @param {string} selector
     *
     * @return {self}
     */
    hasAttribute(attribute, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.attributes()[attribute]).toBeTruthy();

        return this;
    },

    /**
     * Attribute is absent on the element
     *
     * @param {string} attribute
     * @param {string} selector
     *
     * @return {self}
     */
    doesntHaveAttribute(attribute, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.attributes()[attribute]).not.toBeTruthy();

        return this;
    },

    /**
     * Attribute equals the given value
     *
     * @param {string} attribute
     * @param {any} value
     * @param {string} selector
     *
     * @return {self}
     */
    attributeEquals(attribute, value, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(
            String(wrapper.attributes()[attribute]) === String(value)
        ).toBeTruthy();

        return this;
    },

    /**
     * The element has the inline style property
     *
     * @param {String} property
     * @param {String} selector
     *
     * @return {self}
     */
    hasStyle(property, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.style[property]).toBeDefined();

        return this;
    },

    /**
     * The element doesn't have the inline style property
     *
     * @param {String} property
     * @param {String} selector
     *
     * @return {self}
     */
    doesntHaveStyle(property, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.element.style[property]).not.toBeDefined();

        return this;
    },

    /**
     * The inline style equals
     *
     * @param {String} property
     * @param {String} value
     * @param {String} selector
     *
     * @return {self}
     */
    styleEquals(property, value, selector) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(
            String(wrapper.element.style[property]) === String(value)
        ).toBeTruthy();

        return this;
    },

    /**
     * The component can mount without error occurring.
     *
     * @return {self}
     */
    renders() {
        expect(this.wrapper).toBeDefined();
        expect(this.wrapper.exists()).toBe(true);

        return this;
    },

    /**
     * The component emits an event.
     *
     * @param {string} event
     *
     * @return {self}
     */
    emits(event) {
        expect(this.wrapper.emitted()[event]).toBeTruthy();

        return this;
    },

    /**
     * The component does not emits the event.
     *
     * @param {string} event
     *
     * @return {self}
     */
    doesNotEmits(event) {
        expect(this.wrapper.emitted()[event]).toBeFalsy();

        return this;
    },

    /**
     * The event's payload is the same as the given object.
     *
     * @param {string} event
     * @param {any} payload
     *
     * @return {self}
     */
    payloadEquals(event, payload) {
        expect(this.wrapper.emitted()[event].pop()[0] === payload).toBe(true);

        return this;
    },

    /**
     * The event's payload is the same as the given object.
     *
     * @param {string} event
     * @param {any} payload
     *
     * @return {self}
     */
    payloadDoesNotEquals(event, payload) {
        expect(this.wrapper.emitted()[event].pop()[0] === payload).toBe(false);

        return this;
    },

    /**
     * The element has the class.
     *
     * @param {string} className
     * @param {string|null} selector
     *
     * @return {self}
     */
    hasClass(className, selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.classes().toContain(className);

        return this;
    },

    /**
     * The element does not have the class.
     *
     * @param {string} className
     * @param {string|null} selector
     *
     * @return {self}
     */
    notHaveClass(className, selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        wrapper.classes().not.toContain(className);

        return this;
    },

    /**
     * The element has the disabled attribute as truthy.
     *
     * @param {string|null} selector
     *
     * @return {self}
     */
    isDisabled(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.attributes().disabled).toBeTruthy();

        return this;
    },

    /**
     * The element does not have the disabled attribute or is falsy.
     *.
     * @param {string|null} selector
     *
     * @return {self}
     */
    isNotDisabled(selector = null) {
        const wrapper = selector ? this.wrapper.find(selector) : this.wrapper;
        expect(wrapper.attributes().disabled).toBeFalsy();

        return this;
    }
};
