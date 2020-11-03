"use strict";

import { shallowMount, mount } from "@vue/test-utils";
// eslint-disable-next-line no-unused-vars
import { Component } from "vue";
import assertions from "./mixins/assertions";
import actions from "./mixins/actions";
import overwrites from "./mixins/overwrites";

export default class {
    /**
     * The class constructor.
     *
     * @param {Component} component
     * @param {Object} mountOptions
     * @param {Boolean} fullMount
     */
    constructor(component, mountOptions = {}, fullMount = false) {
        this.component = component;
        this.mountOptions =
            Object(mountOptions) === mountOptions &&
            Object.keys(mountOptions).length
                ? mountOptions
                : {};
        this.fullMount = fullMount;

        this.reset();

        // assign mixins
        Object.assign(this, assertions);
        Object.assign(this, actions);
        Object.assign(this, overwrites);

        return this;
    }

    /**
     * Remount the wrapper.
     *
     * @param {Object} options
     * @param {Boolean} fullMount
     */
    reset(options = {}, fullMount = null) {
        options =
            Object(options) === options && Object.keys(options).length
                ? Object.assign({}, this.mountOptions, options)
                : this.mountOptions;
        fullMount = typeof fullMount === "boolean" ? fullMount : this.fullMount;
        jest.clearAllTimers();

        if (fullMount) {
            this.wrapper = mount(this.component, options);
        } else {
            this.wrapper = shallowMount(this.component, options);
        }

        return this;
    }

    /**
     * While developing you may list the available methods by calling this.
     * Methods names should be self-explanatory.
     *
     * @return {Array}
     */
    availableMethods() {
        const getMethods = obj => {
            let properties = new Set();
            let currentObj = obj;
            do {
                Object.getOwnPropertyNames(currentObj).map(item =>
                    properties.add(item)
                );
            } while ((currentObj = Object.getPrototypeOf(currentObj)));
            return [...properties.keys()].filter(
                item => typeof obj[item] === "function"
            );
        };

        // remove the last elements that are built in class functions
        return getMethods(this)
            .slice(0, -10)
            .sort();
    }

    /**
     * Getter for the underlying vm property.
     *
     * @return {*}
     */
    get vm() {
        return this.wrapper.vm;
    }

    /**
     * Getter for the underlying element property.
     *
     * @return {*}
     */
    get element() {
        return this.wrapper.element;
    }

    /**
     * Getter for the underlying options property.
     *
     * @return {*}
     */
    get options() {
        return this.wrapper.options;
    }
}
