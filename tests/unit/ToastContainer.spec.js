import { expect } from "chai";
import Vue from "vue";
import { mount } from "@vue/test-utils";
import VueToastify from "@/components/VueToastify.vue";

describe("VueToastify.vue", () => {
  it("updates settings", () => {
    // Arrange
    const vm = mount(VueToastify);
    expect(vm.data().singular).toBe(false);

    // Act
    vm.setSettings({ singular: true });

    // Assert
    expect(vm.data().singular).toBe(true);
  });
});
