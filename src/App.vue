<template>
    <div>
        <header class="flex justify-center text-center flex-col flex-no-wrap mb-10 pt-3">
            <h2 class="text-blue-800 font-bold text-3xl mb-2">Vue Toastify</h2>
            <p class="text-gray-600">A fuss free notification component.</p>
        </header>
        <main class="px-2">
            <div class="flex xl:justify-center justify-around flex-wrap flex-row">
                <div class="flex flex-col w-auto sm:max-w-50 sm:mr-2">
                    <div
                        class="
                            font-mono
                            border-gray-200
                            bg-gray-800
                            text-gray-400
                            p-5
                            rounded-lg
                            shadow-xl
                            mx-auto
                            max-w-md
                            mb-8
                            break-words
                        "
                    >
                        <p>status: {</p>
                        <p v-if="status.title" class="ml-8">
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
                                    status.mode ||
                                    status.answers ||
                                    status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.type" class="ml-8">
                            type: "<span v-text="status.type">success</span><span>"</span>
                            <span
                                v-if="
                                    status.duration ||
                                    status.icon ||
                                    status.defaultTitle ||
                                    status.canTimeout ||
                                    status.canPause ||
                                    status.mode ||
                                    status.answers ||
                                    status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.canPause" class="ml-8">
                            canPause: <span v-text="status.canPause"></span>
                            <span
                                v-if="
                                    status.duration ||
                                    status.icon ||
                                    status.defaultTitle ||
                                    status.canTimeout ||
                                    status.mode ||
                                    status.answers ||
                                    status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.canTimeout" class="ml-8">
                            canTimeout: <span v-text="status.canTimeout"></span>
                            <span
                                v-if="
                                    status.duration ||
                                    status.icon ||
                                    status.defaultTitle ||
                                    status.mode ||
                                    status.answers ||
                                    status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.defaultTitle" class="ml-8">
                            defaultTitle:
                            <span v-text="status.defaultTitle"></span
                            ><span
                                v-if="
                                    status.duration ||
                                    status.icon ||
                                    status.mode ||
                                    status.answers ||
                                    status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.mode" class="ml-8">
                            mode: "<span v-text="status.mode"></span><span>"</span
                            ><span
                                v-if="
                                    status.duration || status.icon || status.answers || status.url
                                "
                                >,</span
                            >
                        </p>
                        <p v-if="status.answers" class="ml-8">
                            answers: <span v-text="status.answers"></span
                            ><span v-if="status.duration || status.icon || status.url">,</span>
                        </p>
                        <p v-if="status.duration" class="ml-8">
                            duration:
                            <span v-text="status.duration"></span>
                            <span v-if="status.icon || status.url">,</span>
                        </p>
                        <p v-if="status.icon" class="ml-8">
                            icon: "<span v-text="status.icon"></span><span>"</span>
                            <span v-if="status.url">,</span>
                        </p>
                        <p v-if="status.url" class="ml-8">
                            url: "<span v-text="status.url"></span><span>"</span>
                        </p>
                        <p>}</p>
                    </div>
                    <div class="w-full mx-auto">
                        <div class="flex justify-between align-middle items-center mb-5">
                            <label for="title">Title:</label>
                            <input
                                id="title"
                                v-model="status.title"
                                type="text"
                                class="input w-3/4 sm:w-2/3 md:w-4/5"
                            />
                        </div>
                        <div class="flex justify-between align-middle items-center mb-5">
                            <label for="body">Body:</label>
                            <textarea
                                id="body"
                                v-model="status.body"
                                class="input w-3/4 sm:w-2/3 md:w-4/5"
                                placeholder="Html is also accepted."
                                :class="{ invalid: status.body < 1 }"
                            ></textarea>
                        </div>
                        <div class="flex justify-between align-middle items-center mb-5">
                            <label for="type">Type:</label>
                            <select
                                id="type"
                                v-model="status.type"
                                class="input text-center"
                                :disabled="status.mode === 'loader' || status.mode === 'prompt'"
                            >
                                <option value="" class="text-gray-800 font-hairline">
                                    Leave empty
                                </option>
                                <option value="success" class="text-gray-800 font-hairline">
                                    Success
                                </option>
                                <option value="error" class="text-gray-800 font-hairline">
                                    Error
                                </option>
                                <option value="warning" class="text-gray-800 font-hairline">
                                    Warning
                                </option>
                                <option value="info" class="text-gray-800 font-hairline">
                                    Info
                                </option>
                            </select>
                        </div>
                        <div class="flex justify-between align-middle items-center mb-5">
                            <label for="type">Mode:</label>
                            <select
                                id="mode"
                                v-model="status.mode"
                                class="input text-center"
                                @change="disableProps"
                            >
                                <option value="" class="text-gray-800 font-hairline">
                                    Leave empty
                                </option>
                                <option value="prompt" class="text-gray-800 font-hairline">
                                    Prompt
                                </option>
                                <option value="loader" class="text-gray-800 font-hairline">
                                    Loader
                                </option>
                            </select>
                        </div>
                        <div
                            v-if="status.mode === 'prompt'"
                            class="flex justify-between align-middle items-center mb-5"
                        >
                            <label for="type">Answers:</label>
                            <textarea
                                id="answers"
                                v-model="status.answers"
                                class="input w-3/4 sm:w-2/3 md:w-4/5"
                                placeholder="eg.: {Yes: true, No: false}"
                            >
                            </textarea>
                        </div>
                        <div class="flex justify-between align-middle items-center mb-5">
                            <label for="url">Url:</label>
                            <input
                                id="url"
                                v-model="status.url"
                                type="text"
                                class="input w-3/4 sm:w-2/3 md:w-4/5"
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>
                </div>
                <div class="w-full sm:w-1/2 xl:w-1/4 sm:max-w-50 sm:ml-2">
                    <div class="w-1/2 mx-auto lg:w-2/3 xl:w-1/2 mb-12">
                        <div class="flex justify-between align-middle items-center my-1">
                            <p>Can Be Paused:</p>
                            <div>
                                <input
                                    id="can-pause"
                                    v-model="status.canPause"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
                                    @change="checkTimingProps"
                                />
                                <label for="can-pause" class="toggle"><span></span></label>
                            </div>
                        </div>
                        <div class="flex justify-between align-middle items-center my-1">
                            <p>Can Timeout:</p>
                            <div>
                                <input
                                    id="can-timeout"
                                    v-model="status.canTimeout"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
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
                                    id="default-title"
                                    v-model="status.defaultTitle"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
                                    @change="disableProps"
                                />
                                <label for="default-title" class="toggle"><span></span></label>
                            </div>
                        </div>
                        <div class="flex justify-between align-middle items-center my-1">
                            <p>Use Light Theme:</p>
                            <div>
                                <input
                                    id="light-theme"
                                    v-model="lightTheme"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
                                />
                                <label for="light-theme" class="toggle"><span></span></label>
                            </div>
                        </div>
                        <div class="flex justify-between align-middle items-center my-1">
                            <p>With backdrop:</p>
                            <div>
                                <input
                                    id="with-backdrop"
                                    v-model="withBackdrop"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
                                    @change="checkIfLoading"
                                />
                                <label for="with-backdrop" class="toggle"><span></span></label>
                            </div>
                        </div>
                        <div class="flex justify-between align-middle items-center my-1">
                            <p>One notification at a time:</p>
                            <div>
                                <input
                                    id="singular"
                                    v-model="singular"
                                    type="checkbox"
                                    class="cbx"
                                    style="display: none"
                                    @change="checkIfLoading"
                                />
                                <label for="singular" class="toggle"><span></span></label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-around w-full">
                        <div
                            class="
                                flex flex-row
                                justify-between
                                align-middle
                                items-center
                                w-3/4
                                md:w-2/3
                                lg:w-10/12
                                mx-auto
                            "
                        >
                            <label for="duration">Duration:</label>
                            <input
                                id="duration"
                                v-model="status.duration"
                                type="number"
                                class="input w-1/2 md:w-auto"
                                min="1"
                                step="1"
                                :class="{ disabled: !status.canTimeout }"
                                :disabled="!status.canTimeout"
                                placeholder="ms"
                            />
                        </div>
                        <div
                            class="
                                flex flex-row
                                justify-between
                                align-middle
                                items-center
                                w-3/4
                                md:w-2/3
                                lg:w-10/12
                                mt-3
                                mx-auto
                            "
                        >
                            <label for="icon">Icon:</label>
                            <textarea
                                id="icon"
                                v-model="status.icon"
                                class="input w-auto sm:w-3/4 md:w-auto"
                                placeholder="Html is expected"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-around items-center align-middle flex-wrap my-4">
                <iframe
                    src="https://ghbtns.com/github-btn.html?user=nandi95&repo=vue-toastify&type=star&count=true&size=large"
                    frameborder="0"
                    scrolling="0"
                    width="180px"
                    height="30px"
                ></iframe>
                <button v-if="status.mode === 'loader'" class="btn" @click="loadStop">
                    Call .stopLoader()
                </button>
                <button class="btn" @click="addToastify">Toastify!</button>
            </div>
        </main>
        <transition name="warning">
            <div
                v-if="showWarning"
                class="bg-gray-200 rounded-lg shadow-lg px-4 py-3 warning absolute text-center"
                style="z-index: 51"
            >
                <h3 class="font-bold">With backdrop the rest of the page is inaccessible.</h3>
                <h4 class="text-sm mb-3">
                    Make sure to also cancel the loading if your process has failed.
                </h4>
                <button class="btn" @click="loadStop">Call .stopLoader()</button>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            status: {
                title: "Toastified!",
                body: "This is the body.",
                type: null,
                canPause: false,
                canTimeout: false,
                defaultTitle: true,
                duration: null,
                icon: null,
                mode: "",
                answers: null,
                url: ""
            },
            lightTheme: false,
            defaultTitle: true,
            withBackdrop: false,
            singular: false,
            body: null,
            showWarning: false,
            loading: false
        };
    },
    watch: {
        withBackdrop: function (newValue) {
            this.$vToastify.setSettings({ withBackdrop: newValue });
        },
        lightTheme: function (newValue) {
            this.$vToastify.setSettings({ theme: newValue ? "light" : "dark" });
        },
        defaultTitle: function (newValue) {
            this.$vToastify.setSettings({ defaultTitle: newValue });
        },
        singular: function (newValue) {
            this.$vToastify.setSettings({ singular: newValue });
        }
    },
    mounted() {
        this.$vtNotify(this.status);
    },
    methods: {
        addToastify() {
            if (this.status.body.length > 0) {
                if (this.status.mode === "prompt") {
                    try {
                        const answersString = this.status.answers;
                        this.status.answers = eval("(" + answersString + ")");
                        this.$vToastify.prompt(this.status).then(value => {
                            console.info("The answer was:");
                            console.log(
                                "%c%s",
                                "color: #10bd0a;",
                                value + " (" + typeof value + ")"
                            );
                        });
                        this.status.answers = answersString;
                    } catch (error) {
                        this.$vToastify.error(
                            "Invalid answers object. More info can be found in the console."
                        );
                        console.error(error);
                    }
                } else {
                    this.$vtNotify(this.status);
                    if (this.status.mode === "loader") {
                        this.loading = true;
                        if (this.withBackdrop) {
                            this.showWarning = true;
                        }
                    }
                }
            } else {
                this.$vToastify.error("The body has to be present.", "😠");
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
        loadStop() {
            this.$vToastify.stopLoader();
            this.loading = false;
            this.showWarning = false;
        },
        checkIfLoading() {
            if (this.$vToastify.getToast().length < 1) {
                this.withBackdrop = false;
            }
            if (this.loading) {
                this.showWarning = true;
            }
        }
    }
};
</script>

<style lang="scss">
@import "./assets/styles";
.transition-all {
    transition: all 0.2s ease-out;
}
.input {
    @apply rounded-bl-sm h-10 p-2 bg-gray-200 shadow w-auto;
    &:focus {
        box-shadow: inset 0 0 7px 0 rgba(0, 0, 0, 0.05);
        background-color: #eeeeee;
        border-left: 4px solid rgba(46, 80, 138, 0.79);
        border-right: none;
        border-top: none;
        border-bottom: none;
        outline: none;
        transition: all 0.2s ease-out;
    }
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-out;
    min-height: 42px;
}
.disabled {
    cursor: not-allowed;
    background-color: #d0d0d0;
    transition: all 0.2s ease-out;
}
.invalid {
    background-color: #c8847d;
    transition: all 0.2s ease-out;
    &::placeholder {
        color: #2d3748;
    }
}
* {
    font-family: "Poppins", sans-serif;
}
html {
    min-height: 100%;
}
body {
    background: rgb(246, 246, 246);
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
    background: linear-gradient(180deg, rgba(246, 246, 246, 1) 0%, rgba(226, 226, 226, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f6f6f6",endColorstr="#e2e2e2",GradientType=1);
}
#app {
    margin: auto;
}
.btn {
    @apply shadow-md rounded bg-blue-800 text-gray-200 px-5 py-3 bg-blue-700 bg-blue-500;
    transition: all 0.2s ease-out;
    &:hover {
        @apply bg-blue-700;
        transition: all 0.2s ease-out;
    }
    &:active {
        @apply bg-blue-800;
        transition: all 0.2s ease-out;
    }
}
.warning {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.warning-enter-active {
    transition: all 150ms ease-out;
    transition-delay: 150ms;
}
.warning-leave-active {
    transition: all 100ms ease-in;
}
.warning-enter,
.warning-leave-to {
    opacity: 0;
}
</style>
