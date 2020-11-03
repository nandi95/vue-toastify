"use strict";

// eslint-disable-next-line no-unused-vars
import { Wrapper } from "@vue/test-utils";

/**
 * Here you overwrite the original methods of the wrapper as they
 * maybe using in context functions and attributes not
 * available int the Wrapper class
 *
 * @property {Wrapper} wrapper
 */
export default {
    find(selector) {
        return this.wrapper.find(selector);
    },
    findAll(selector) {
        return this.wrapper.findAll(selector);
    },
    emittedByOrder() {
        return this.wrapper.emittedByOrder();
    },
    destroy() {
        return this.wrapper.destroy();
    },
    html() {
        return this.wrapper.html();
    },
    contains(selector) {
        return this.wrapper.contains(selector);
    },
    props() {
        return this.wrapper.props();
    },
    setProps(propsData) {
        this.wrapper.setProps(propsData);

        return this;
    }
};
