import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import VueToastify from "@/components/VueToastify.vue";

describe("VueToastify.vue", () => {
  it("renders props.status when passed", () => {
    const status = { title: "title", body: "body", type: "success" };
    const wrapper = shallowMount(VueToastify, {
      propsData: { status }
    });
    expect(wrapper.text()).to.include(status.title);
  });
});
