import { default as vToastify } from "./components/VueToastify.vue";

const VueToastify = {
    install(Vue, settings = {}, router = null) {
        let Constructor = Vue.extend(vToastify);
        let ToastContainer = new Constructor();

        if (router) {
            Vue.prototype.$vtRouter = router;
        }

        ToastContainer._props = Object.assign(ToastContainer._props, settings);

        const vm = ToastContainer.$mount();

        document.querySelector("body").appendChild(vm.$el);

        if (typeof window !== "undefined" && window.Vue) {
            window.Vue.use(ToastContainer);
        }

        const vtNotify = (status, title = null) => {
            if (typeof status === "string") {
                status = {
                    body: status
                };
            }
            if (title) {
                status.title = title;
            }
            if (!status.type) {
                status.type = "success";
            }
            return ToastContainer.add(status);
        };
        const toastify = {
            success(status, title = null) {
                return vtNotify(status, title);
            },
            info(status, title = null) {
                if (typeof status === "string") {
                    status = {
                        body: status
                    };
                }
                if (title) {
                    status.title = title;
                }
                status.type = "info";
                return vtNotify(status);
            },
            warning(status, title = null) {
                if (typeof status === "string") {
                    status = {
                        body: status
                    };
                }
                if (title) {
                    status.title = title;
                }
                status.type = "warning";
                return vtNotify(status);
            },
            error(status, title = null) {
                if (typeof status === "string") {
                    status = {
                        body: status
                    };
                }
                if (status.status && status.statusText) {
                    status = {
                        title: status.status.toString(),
                        body: status.statusText
                    };
                }
                if (title) {
                    status.title = title;
                }
                status.type = "error";
                return vtNotify(status);
            },
            loader(status, title = null) {
                if (typeof status === "string") {
                    status = {
                        body: status
                    };
                }
                if (title) {
                    status.title = title;
                }
                status.mode = "loader";
                return vtNotify(status);
            },
            prompt(status, title = null) {
                if (typeof status === "string") {
                    status = {
                        body: status
                    };
                }
                if (title) {
                    status.title = title;
                }
                status.mode = "prompt";
                const id = ToastContainer.add(status);
                return new Promise(resolve => {
                    ToastContainer.$root.$once("vtPromptResponse", payload => {
                        if (payload.id === id) {
                            resolve(payload.response);
                        }
                    });
                });
            },
            stopLoader(id = null) {
                ToastContainer.stopLoader(id);
            },
            getToast(id = null) {
                return ToastContainer.get(id);
            },
            changeToast(id, status) {
                return ToastContainer.set(id, status);
            },
            removeToast(id = null) {
                return ToastContainer.remove(id);
            },
            setSettings(settings) {
                return ToastContainer.setSettings(settings);
            },
            getSettings(setting = null) {
                return ToastContainer.getSettings(setting);
            },
            listen(event, callback) {
                return ToastContainer.$on(event, payload => callback(payload));
            },
            listenOnce(event, callback) {
                return ToastContainer.$once(event, payload => callback(payload));
            }
        };

        if (
            settings.customNotifications &&
            Object.entries(settings.customNotifications).length > 0
        ) {
            Object.entries(settings.customNotifications).forEach(keyValArr => {
                Object.defineProperty(toastify, keyValArr[0], {
                    get() {
                        return (status, title = null) => {
                            let toast = {};
                            toast = Object.assign(toast, keyValArr[1]);
                            if (typeof status === "string") {
                                toast.body = status;
                            } else {
                                toast = { ...keyValArr[1], ...status };
                            }
                            if (title) {
                                toast.title = title;
                            }
                            return vtNotify(toast);
                        };
                    }
                });
            });
        }

        Vue.prototype.$vtNotify = vtNotify;
        Vue.$vtNotify = vtNotify;
        Vue.prototype.$vToastify = toastify;
        Vue.$vToastify = toastify;
    }
};

export default VueToastify;
