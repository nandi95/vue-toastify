import { default as vToastify } from "./components/VueToastify.vue";

const VueToastify = {
  install(Vue, settings = {}) {
    let Constructor = Vue.extend(vToastify);
    let ToastContainer = new Constructor();

    ToastContainer._props = Object.assign(ToastContainer._props, settings);

    const vm = ToastContainer.$mount();

    document.querySelector("body").appendChild(vm.$el);

    if (typeof window !== "undefined" && window.Vue) {
      window.Vue.use(ToastContainer);
    }

    const vtNotify = (Vue.prototype.$vtNotify = (status, title = null) => {
      if (typeof status === "string") {
        status = {
          body: status
        };
      }
      if (title) {
        status.title = title;
      }
      if (!status.hasOwnProperty("type") || !status.type) {
        status.type = "success";
      }
      return ToastContainer.add(status);
    });
    Vue.prototype.$vToastify = {
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
        if (
          status.hasOwnProperty("status") &&
          status.hasOwnProperty("statusText")
        ) {
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
      }
    };

    if (
      settings.hasOwnProperty("customNotifications") &&
      Object.entries(settings.customNotifications).length > 0
    ) {
      Object.entries(settings.customNotifications).forEach(keyValArr => {
        Object.defineProperty(Vue.prototype.$vToastify, keyValArr[0], {
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
              vtNotify(toast);
            };
          }
        });
      });
    }
  }
};

export default VueToastify;
