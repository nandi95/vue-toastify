<template>
  <div id="app">
    <VueToastify
      :status="status"
      :can-pause="canPause"
      :event-handler="eventHandler"
      :light-theme="lightTheme"
      :with-backdrop="withBackdrop"
      :default-title="defaultTitle"
      :error-duration="errorDuration"
      :success-duration="successDuration"
      :alert-info-duration="alertInfoDuration"
      :body-max-width="bodyMaxWidth"
      :position="position"
      :position-x-distance="positionXDistance"
      :position-y-distance="positionYDistance"
      :initial-delay="initialDelay"
    />
    <header
      class="flex justify-center text-center flex-col flex-no-wrap mb-10 mt-4"
    >
      <h2 class="text-blue-800 font-bold text-3xl mb-2">Vue Toastify</h2>
      <p class="text-gray-600">A fuss free notification component.</p>
    </header>
    <main>
      <div class="flex xl:justify-center justify-around flex-wrap flex-row">
        <div class="flex flex-col w-auto sm:max-w-50 sm:mr-2">
          <div
            class="font-mono border-gray-200 bg-gray-800 text-gray-400 p-5 rounded-lg shadow-xl mx-auto max-w-md mb-8 break-words"
          >
            <p>status: {</p>
            <p class="ml-8" v-if="status.title">
              title: "<span v-text="status.title"></span>",
            </p>
            <p class="ml-8">
              body: "<span v-text="status.body"></span><span>"</span>
              <span
                v-if="
                  status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.canPause ||
                    status.type ||
                    status.mode
                "
                >,</span
              >
            </p>
            <p class="ml-8" v-if="status.type">
              type: "<span v-text="status.type">success</span><span>"</span>
              <span
                v-if="
                  status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.canPause ||
                    status.mode
                "
                >,</span
              >
            </p>
            <p class="ml-8" v-if="status.canPause">
              canPause: <span v-text="status.canPause"></span>
              <span
                v-if="
                  status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.canTimeout ||
                    status.mode
                "
                >,</span
              >
            </p>
            <p class="ml-8" v-if="status.canTimeout">
              canTimeout: <span v-text="status.canTimeout"></span>
              <span
                v-if="
                  status.duration ||
                    status.icon ||
                    status.defaultTitle ||
                    status.mode
                "
                >,</span
              >
            </p>
            <p class="ml-8" v-if="status.defaultTitle">
              defaultTitle: <span v-text="status.defaultTitle"></span
              ><span v-if="status.duration || status.icon || status.mode"
                >,</span
              >
            </p>
            <p class="ml-8" v-if="status.mode">
              mode: "<span v-text="status.mode"></span><span>"</span
              ><span v-if="status.duration || status.icon">,</span>
            </p>
            <p class="ml-8" v-if="status.duration">
              duration:
              <span v-text="status.duration"></span>
              <span v-if="status.icon">,</span>
            </p>
            <p v-if="status.icon" class="ml-8">
              icon: <span v-text="status.icon"></span>
            </p>
            <p>}</p>
          </div>
          <div class="w-full mx-auto">
            <div class="flex justify-between align-middle items-center mb-5">
              <label for="title">Title:</label>
              <input
                type="text"
                v-model="status.title"
                class="input w-3/4 sm:w-2/3 md:w-4/5"
                id="title"
              />
            </div>
            <div class="flex justify-between align-middle items-center mb-5">
              <label for="body">Body:</label>
              <textarea
                id="body"
                class="input w-3/4 sm:w-2/3 md:w-4/5"
                v-model="status.body"
                style="min-height: 42px"
                placeholder="Html is also accepted."
                @change="checkBody"
              ></textarea>
            </div>
            <div class="flex justify-between align-middle items-center mb-5">
              <label for="type">Type:</label>
              <select
                class="input text-center"
                v-model="status.type"
                id="type"
                :disabled="status.mode === 'loader' || status.mode === 'prompt'"
              >
                <option value="" class="text-gray-800 font-hairline"
                  >Leave empty</option
                >
                <option value="success" class="text-gray-800 font-hairline"
                  >Success</option
                >
                <option value="error" class="text-gray-800 font-hairline"
                  >Error</option
                >
                <option value="alert" class="text-gray-800 font-hairline"
                  >Alert</option
                >
                <option value="info" class="text-gray-800 font-hairline"
                  >Info</option
                >
              </select>
            </div>
            <div class="flex justify-between align-middle items-center mb-5">
              <label for="type">Mode:</label>
              <select
                class="input text-center"
                v-model="status.mode"
                id="mode"
                @change="disableProps"
              >
                <option value="" class="text-gray-800 font-hairline"
                  >Leave empty</option
                >
                <option value="prompt" class="text-gray-800 font-hairline"
                  >Prompt</option
                >
                <option value="loader" class="text-gray-800 font-hairline"
                  >Loader</option
                >
              </select>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-1/2 xl:w-1/4 sm:max-w-50 sm:ml-2">
          <div class="w-1/2 mx-auto lg:w-2/3 xl:w-1/2 mb-12">
            <div class="flex justify-between align-middle items-center my-1">
              <p>Can Be Paused:</p>
              <div>
                <input
                  type="checkbox"
                  class="cbx"
                  style="display: none"
                  id="can-pause"
                  @change="checkTimingProps"
                  v-model="status.canPause"
                />
                <label for="can-pause" class="toggle"><span></span></label>
              </div>
            </div>
            <div class="flex justify-between align-middle items-center my-1">
              <p>Can Timeout:</p>
              <div>
                <input
                  type="checkbox"
                  class="cbx"
                  style="display: none"
                  id="can-timeout"
                  v-model="status.canTimeout"
                  @change="
                    checkTimingProps();
                    disableProps();
                  "
                />
                <label for="can-timeout" class="toggle"><span></span></label>
              </div>
            </div>
            <div class="flex justify-between align-middle items-center my-1">
              <p>Use Default Title:</p>
              <div>
                <input
                  type="checkbox"
                  class="cbx"
                  style="display: none"
                  id="default-title"
                  v-model="status.defaultTitle"
                  @change="disableProps"
                />
                <label for="default-title" class="toggle"><span></span></label>
              </div>
            </div>
            <div class="flex justify-between align-middle items-center my-1">
              <p>Use Light Theme:</p>
              <div>
                <input
                  type="checkbox"
                  class="cbx"
                  style="display: none"
                  id="light-theme"
                  v-model="lightTheme"
                />
                <label for="light-theme" class="toggle"><span></span></label>
              </div>
            </div>
            <div class="flex justify-between align-middle items-center my-1">
              <p>With backdrop:</p>
              <div>
                <input
                  type="checkbox"
                  class="cbx"
                  style="display: none"
                  id="with-backdrop"
                  v-model="withBackdrop"
                />
                <label for="with-backdrop" class="toggle"><span></span></label>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-around w-full">
            <div
              class="flex justify-around align-middle items-center w-3/4 sm:w-2/3 md:w-4/5 lg:w-auto"
            >
              <label for="duration">Duration:</label>
              <input
                type="number"
                class="input w-1/2 md:w-auto"
                min="1"
                step="1"
                id="duration"
                :class="{ disabled: !status.canTimeout }"
                :disabled="!status.canTimeout"
                v-model="status.duration"
                placeholder="ms"
              />
            </div>
            <div
              class="flex flex-row justify-around align-middle items-center w-3/4 sm:w-2/3 md:w-4/5 lg:w-auto mt-3"
            >
              <label for="icon">Icon:</label>
              <textarea
                class="input w-auto sm:w-3/4 md:w-auto"
                style="min-height: 42px"
                id="icon"
                v-model="status.icon"
                placeholder="Html is expected"
              ></textarea>
            </div>
            <div
              class="flex flex-col justify-start text-gray-700 text-center mt-5"
            >
              <hr class="border-gray-800 opacity-25 border w-4/5 sm:w-11/12" />
              <h4 class="font-bold">Additional properties:</h4>
              <p class="mb-3">The following can only be set on initial load</p>
              <div
                class="flex justify-around align-middle leading-normal flex-wrap xs:flex-no-wrap sm:flex-wrap md:flex-no-wrap"
              >
                <ul class="ml-5 w-1/2">
                  <li>-&nbsp;eventHandler</li>
                  <li>-&nbsp;eventName</li>
                  <li>-&nbsp;errorDuration</li>
                  <li>-&nbsp;successDuration</li>
                  <li>-&nbsp;alertInfoDuration</li>
                </ul>
                <ul class="ml-5 w-1/2">
                  <li>-&nbsp;bodyMaxWidth</li>
                  <li>-&nbsp;position</li>
                  <li>-&nbsp;positionXDistance</li>
                  <li>-&nbsp;positionYDistance</li>
                </ul>
              </div>
              <p class="my-3 text-blue-900">
                More information on:
                <a
                  target="_blank"
                  href="https://github.com/nandi95/vue-toastify"
                  class="transition underline hover:no-underline text-blue-500 hover:text-blue-900"
                  >Github</a
                >
              </p>
              <hr class="border-gray-800 opacity-25 border w-4/5 sm:w-11/12" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-around items-center align-middle flex-wrap mb-4">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=nandi95&repo=vue-toastify&type=star&count=true&size=large"
          frameborder="0"
          scrolling="0"
          width="180px"
          height="30px"
        ></iframe>
        <button
          v-if="status.mode === 'loader'"
          @click="loadStop"
          class="shadow-md rounded bg-blue-800 text-gray-200 px-5 py-3 hover:bg-blue-700 transition active:bg-blue-500"
        >
          Fire 'vtLoadStop'
        </button>
        <button
          @click="addToastify"
          class="shadow-md rounded bg-blue-800 text-gray-200 px-5 py-3 hover:bg-blue-700 transition active:bg-blue-500"
        >
          Toastify!
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import VueToastify from "./components/VueToastify";
// todo - fix tailwind export for production
export default {
  name: "app",
  components: {
    VueToastify
  },
  data() {
    return {
      //status that can be passed as a prop or an event
      status: {
        title: "toastified!",
        body: "This is the body.",
        type: null,
        canPause: false,
        canTimeout: false,
        defaultTitle: true,
        duration: null,
        icon: null,
        mode: ""
      },
      //props that can be set on initial load
      eventHandler: "EventBus",
      canPause: false,
      lightTheme: false,
      defaultTitle: true,
      withBackdrop: false,
      errorDuration: 8000,
      successDuration: 4000,
      alertInfoDuration: 6000,
      bodyMaxWidth: 250,
      initialDelay: 750,
      position: "bottom-right",
      positionXDistance: "10px",
      positionYDistance: "10px",
      //example site specific
      body: null
    };
  },
  mounted() {
    this.body = document.getElementById("body");
    window[this.eventHandler].$on("vtPrompt", response => {
      console.info("The response was:");
      console.log(response);
    });
  },
  methods: {
    addToastify() {
      if (this.status.body) {
        window[this.eventHandler].$emit("vtNotify", this.status);
      } else {
        window[this.eventHandler].$emit("vtNotify", {
          title: "😠",
          body: "The body has to be present.",
          type: "error"
        });
      }
    },
    checkTimingProps() {
      if (!this.status.canTimeout) {
        this.status.duration = null;
        this.status.canPause = false;
        setTimeout(() => {
          document.getElementById("can-pause").checked = false;
        }, 75);
      }
    },
    disableProps() {
      if (this.status.mode === "prompt" || this.status.mode === "loader") {
        this.status.duration = null;
        this.status.defaultTitle = false;
        this.status.canPause = false;
        this.status.canTimeout = false;
        this.status.type = "";
        setTimeout(() => {
          document.getElementById("can-pause").checked = false;
          document.getElementById("can-timeout").checked = false;
          document.getElementById("default-title").checked = false;
        }, 75);
      }
    },
    checkBody() {
      if (this.body.value.length === 0) {
        this.body.classList.add("invalid");
      } else {
        this.body.classList.remove("invalid");
      }
    },
    loadStop() {
      window[this.eventHandler].$emit("vtLoadStop");
    }
  }
};
</script>

<style lang="scss">
@import "./assets/styles";
.input {
  @apply rounded-bl-sm h-10 transition p-2 bg-gray-200 shadow w-auto;
  &:focus {
    box-shadow: inset 0 0 7px 0 rgba(0, 0, 0, 0.05);
    background-color: #eeeeee;
    border-left: 4px solid rgba(46, 80, 138, 0.79);
    border-right: none;
    border-top: none;
    border-bottom: none;
    outline: none;
  }
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease-out;
}
.disabled {
  cursor: not-allowed;
  background-color: #d0d0d0;
  transition: all 0.2s ease-out;
}
.invalid {
  background-color: #c8847d;
  transition: all 0.2s ease-out;
}
* {
  font-family: "Poppins", sans-serif;
}
html {
  min-height: 100%;
}
body {
  background: rgb(246, 246, 246);
  /*min-height: 100%;*/
  width: 100%;
  height: auto;
  background: -moz-linear-gradient(
    180deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(226, 226, 226, 1) 100%
  );
  background: -webkit-linear-gradient(
    180deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(226, 226, 226, 1) 100%
  );
  background: linear-gradient(
    180deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(226, 226, 226, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f6f6f6",endColorstr="#e2e2e2",GradientType=1);
}
#app {
  margin: auto;
}
</style>
