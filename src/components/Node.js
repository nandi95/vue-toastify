import Vue from "vue";
export default Vue.component("VNode", {
    functional: true,
    props: ["node"],
    render(h, context) {
        const { node } = context.props;
        return typeof node === "function" ? node(h) : node;
    }
});
