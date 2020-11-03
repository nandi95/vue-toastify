import Icon from "../../src/components/Icon.vue";
import Wrapper from "./Wrapper";

let options = {
    propsData: {
        mode: true,
        type: true,
        icon: false,
        baseIconClass: 1000,
        id: Math.random().toString()
    }
};
jest.useFakeTimers();
const wrapper = new Wrapper(Icon, options);

describe.skip("Icon", () => {
    it("renders", () => {
        wrapper.renders();
    });
});
