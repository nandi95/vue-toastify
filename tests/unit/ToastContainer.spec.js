import { shallowMount } from "@vue/test-utils";
import VueToastify from "@/components/VueToastify.vue";

describe("VueToastify.vue", () => {
  it("updates settings", () => {
    // Arrange
    const wrapper = shallowMount(VueToastify, {
      propsData: {
        singular: false
      }
    });

    // Act
    wrapper.vm.setSettings({ singular: true });

    // Assert
    expect(wrapper.attributes("singular")).toBe(true);
  });
});
