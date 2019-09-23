import { default as vToastify } from "./components/VueToastify";

const VueToastify = {
  install(Vue, settings = {}) {
    let Constructor = Vue.extend(vToastify);
    let Notification = new Constructor();

    Notification._props = Object.assign(Notification._props, settings);

    let vm = Notification.$mount();

    document.querySelector("body").appendChild(vm.$el);

    if (typeof window !== "undefined" && window.Vue) {
      window.Vue.use(Notification);
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
      return Notification.add(status);
    };
    Vue.prototype.$vToastify = {
      success(status, title = null) {
        if (typeof status === "string") {
          status = {
            body: status
          };
          if (title) {
            status.title = title;
          }
          status.type = "success";
        }
        return this.$vtNotify(status);
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
        return this.$vtNotify(status);
      },
      stopLoader(id = null) {
        Notification.stopLoader(id);
      },
      getToasts(id = null) {
        return Notification.get(id);
      },
      changeToast(id, status) {
        Notification.set(id, status);
      },
      setSettings(settings) {
        Notification.setSettings(settings);
      }
    };
    Vue.component(vToastify.name, Notification);
  }
};

export default VueToastify;
