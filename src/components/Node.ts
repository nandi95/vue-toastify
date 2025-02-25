import type { VNode } from 'vue';
export default function Node(props: { node: VNode | string }) {
    return props.node;
}
