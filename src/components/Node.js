import Vue from "vue";
export default Vue.component("VNodes", {
    functional: true,
    props: ["node"],
    render(h, context) {
        return context.props.node;
    }
});
