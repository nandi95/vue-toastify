import { default as vToastify } from "./components/VueToastify";

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

    Vue.prototype.$vtNotify = (status, title = null) => {
      if (typeof status === "string") {
        status = {
          body: status,
          type: "success"
        };
        if (title) {
          status.title = title;
        }
      }
      return ToastContainer.add(status);
    };
    Vue.prototype.$vToastify = {
      success(status, title = null) {
        return this.$vtNotify(status, title);
      },
      info(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.type = "info";
        }
        return this.$vtNotify(status);
      },
      warning(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.type = "warning";
        }
        return this.$vtNotify(status);
      },
      error(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.type = "error";
        }
        return this.$vtNotify(status);
      },
      loader(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.mode = "loader";
        }
        return this.$vtNotify(status);
      },
      prompt(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.mode = "prompt";
        }
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
        ToastContainer.set(id, status);
      },
      removeToast(id = null) {
        return ToastContainer.remove(id);
      },
      setSettings(settings) {
        ToastContainer.setSettings(settings);
      }
    };
  }
};

export default VueToastify;
