import { isObject, isString } from "../js/utils";

export default {
    computed: {
        tag() {
            if (!this.hasUrl) {
                return "div";
            }
            return "a";
        },
        hasUrl() {
            return (
                (isString(this.status.url) && this.status.url.length > 0) ||
                (isObject(this.status.url) &&
                    (this.routerRouteExits || !!this.status.url.href))
            );
        },
        urlTarget() {
            if (this.status.url) {
                if (isString(this.status.url)) {
                    if (!this.routerRouteExits) {
                        return { href: this.status.url };
                    }
                    return {
                        href: this.$vtRouter.resolve(this.status.url).href
                    };
                }
                if (isObject(this.status.url)) {
                    if (!this.isRouterLinkObject && this.status.url.href) {
                        return this.status.url;
                    }

                    if (this.routerRouteExits) {
                        return {
                            href: this.$vtRouter.resolve(this.status.url).href
                        };
                    }
                    return {};
                }
            }
            return {};
        },
        isRouterLinkObject() {
            return !!this.status.url.path || !!this.status.url.name;
        },
        routerRouteExits() {
            if (this.$vtRouter) {
                return !!this.$vtRouter.options.routes.find(
                    route =>
                        route.path === "/" + this.status.url.path ||
                        route.path === this.status.url.path ||
                        route.name === this.status.url.name
                );
            }
            return false;
        }
    },
    methods: {
        handleRedirect(event) {
            if (this.hasUrl) {
                // if it's a browser level link
                if (
                    (isObject(this.status.url) && this.status.url.href) ||
                    (isString(this.status.url) && !this.routerRouteExits)
                ) {
                    return;
                }
                event.preventDefault();
                if (this.$vtRouter) {
                    this.$vtRouter.push(this.status.url);
                }
            }
        }
    }
};
