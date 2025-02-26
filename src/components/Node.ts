import type { VNode } from 'vue';
// This is a JSX component - Pascal-case tends to be the norm
// eslint-disable-next-line @typescript-eslint/naming-convention
export default function Node(props: { node: VNode | string }): VNode|string {
    return props.node;
}
