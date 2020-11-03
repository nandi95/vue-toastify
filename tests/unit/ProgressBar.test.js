import ProgressBar from "../../src/components/ProgressBar.vue";
import Wrapper from "./Wrapper";

let options = {
    propsData: {
        canPause: true,
        canTimeout: true,
        isHovered: false,
        duration: 1000,
        id: Math.random().toString()
    }
};
jest.useFakeTimers();
const wrapper = new Wrapper(ProgressBar, options);

describe.skip("ProgressBar", () => {
    it("renders", () => {
        wrapper.renders();
    });
});
