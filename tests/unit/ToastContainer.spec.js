import Vue from "vue";
import ToastContainer from "@/components/VueToastify.vue";
import VueToastify from "../../src/VueToastify";
import { mount, createLocalVue } from "@vue/test-utils";

Vue.use(VueToastify);
const vm = new Vue({
  template: "<body></body>"
});

describe("VueToastify.js", () => {
  it("updates settings", () => {
    // Arrange
    const wrapper = mount(ToastContainer, { vm });

    // Act
    vm.$vToastify.setSettings({ singular: true });
    console.log(wrapper.vm.singular);

    // Assert
    // expect(wrapper.singular).toBe(true);
    expect(vm.$vToastify.getSettings().singular).toBe(true);
  });
});
