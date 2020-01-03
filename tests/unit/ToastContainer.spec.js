import { mount } from "@vue/test-utils";
import VueToastify from "@/components/VueToastify.vue";

describe("VueToastify.vue", () => {
  const wrapper = mount(VueToastify);
  it("updates settings", () => {
    // Arrange
    expect(wrapper.attributes().singular).toBe(false);

    // Act
    wrapper.vm.setSettings({ singular: true });

    // Assert
    expect(wrapper.attributes("singular")).toBe(true);
  });
});
