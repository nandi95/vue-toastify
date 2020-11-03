import { createLocalVue } from "@vue/test-utils";
import Wrapper from "./Wrapper";
import VueToastify from "../../src/VueToastify";

const localVue = createLocalVue();
localVue.use(VueToastify);

global.crypto = require("@trust/webcrypto");

const Test = {
    name: "Test",
    render: function(createElement) {
        return createElement("div");
    },
    methods: {
        callPlugin(
            options = "<i id='content'>easy-peasy</i>",
            name = "$vToastify"
        ) {
            this.$vToastify(options);
        }
    }
};

const wrapper = new Wrapper(Test, {
    localVue,
    methods: {
        uuidv4() {
            return Math.random();
        }
    },
    attachToDocument: true
});


describe("Plugin", () => {
    it("loads the plugin", () => {
        const localVue = createLocalVue();
        expect(localVue.$vToastify).toBeFalsy();
        localVue.use(VueToastify);
        expect(localVue.$vToastify).toBeTruthy();
    });
});

describe("Component", () => {
    it("renders", () => {
        wrapper.renders();
    });

    it("can call the plugin", () => {
        wrapper.vm.$vToastify.success("<i id='content'>easy-peasy</i>");
        // wrapper.vm.callPlugin();
        wrapper.see("easy-peasy");
    });
});

describe.skip("VueToastify.js", () => {
    it("renders", () => {
        wrapper.renders();
    });
});
