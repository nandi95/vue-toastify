<template>
    <div class="bg-gradient-to-br from-base-100/25 to-base-300/75 pb-2 min-h-screen">
        <header class="navbar flex-wrap sm:flex-nowrap bg-base-300/20 mb-10">
            <div class="navbar-start">
                <AppThemeToggle />
            </div>
            <div
                class="w-full order-first sm:w-auto sm:order-1 navbar-center flex justify-center text-center flex-col flex-no-wrap"
            >
                <h2 class="text-primary font-bold text-3xl mb-2">Vue Toastify</h2>
                <p class="text-base-content">A fuss free notification component.</p>
            </div>
            <div class="navbar-end order-last">
                <a href="https://github.com/nandi95/vue-toastify/">
                    <svg
                        width="98"
                        height="96"
                        style="transform: scale(35%)"
                        class="text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            fill="currentColor"
                            clip-rule="evenodd"
                            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059
                     3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59
                     2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015
                     4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378
                     3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778
                     5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1
                     12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97
                     11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548
                     3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52
                     33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        />
                    </svg>
                </a>
            </div>
        </header>
        <main class="px-2">
            <div class="flex gap-2 xl:justify-center justify-around flex-wrap flex-row">
                <div class="flex flex-col w-auto sm:max-w-50 sm:mr-2">
                    <AppStatusDisplay :status="status" />
                    <div class="w-full mx-auto">
                        <AppInput v-model="status.title" name="title" label="Title" />
                        <AppTextarea
                            v-model="status.body"
                            name="body"
                            :label="jsx ? 'JSX string body' : 'Body'"
                            :error="status.body.length < 1 ? 'Needs to have length' : ''"
                        />
                        <AppSelect
                            v-model="status.type"
                            name="type"
                            label="Type"
                            :options="typeOptions"
                            :disabled="status.mode === 'loader' || status.mode === 'prompt'"
                        />
                        <AppSelect
                            v-model="status.mode"
                            name="mode"
                            label="Mode"
                            :options="modeOptions"
                            @change="disableProps"
                        />
                        <AppTextarea
                            v-if="status.mode === 'prompt'"
                            v-model="answers"
                            name="answers"
                            label="Answers"
                            :error="jsonError"
                            placeholder='eg.: &apos;{"Yes":true,"No":false}&apos;'
                            @update:model-value="updateAnswers"
                        />
                    </div>
                </div>
                <div class="w-full sm:w-1/2 xl:w-1/4 sm:max-w-50 sm:ml-2">
                    <div class="w-1/2 md:mx-auto lg:w-2/3 xl:w-1/2 mt-12 md:mt-0 mb-12 space-y-1">
                        <AppToggle
                            v-model="status.pauseOnHover"
                            :disabled="!status.canTimeout"
                            label="Can be Paused"
                            @change="checkTimingProps"
                        />
                        <AppToggle
                            v-model="status.canTimeout"
                            label="Can Timeout"
                            @change="
                                checkTimingProps();
                                disableProps();
                            "
                        />
                        <AppToggle v-model="status.defaultTitle" label="Use Default Title" @change="disableProps" />
                        <AppToggle v-model="lightTheme" label="Use Light Theme" />
                        <AppToggle v-model="withBackdrop" label="With Backdrop" @change="checkIfLoading" />
                        <AppToggle v-model="singular" label="One notification at a time" @change="checkIfLoading" />
                        <AppToggle
                            v-model="oneTypeAtAtime"
                            :disabled="singular"
                            label="One type at a time"
                            @change="checkIfLoading"
                        />
                        <AppToggle v-model="jsx" label="Use JSX" />
                    </div>
                    <div class="flex flex-col justify-around w-full">
                        <AppInput
                            v-model="status.duration"
                            name="duration"
                            label="Duration"
                            :disabled="!status.canTimeout"
                            placeholder="ms"
                            type="number"
                            min="1"
                            step="1"
                        />
                        <AppTextarea
                            v-model="status.icon"
                            name="icon"
                            label="Icon"
                            placeholder="Html is expected"
                            :disabled="jsx"
                        />
                    </div>
                </div>
            </div>
            <div class="flex justify-around items-center align-middle flex-wrap mt-2">
                <button v-if="status.mode === 'loader'" class="btn btn-primary" @click="loadStop">
                    Call .stopLoader()
                </button>
                <button class="btn btn-primary my-4 md:my-0" @click="addToast">Toastify!</button>
            </div>
        </main>
        <transition name="warning">
            <div
                v-if="showWarning"
                class="bg-gray-200 rounded-lg shadow-lg px-4 py-3 warning absolute text-center"
                style="z-index: 51"
            >
                <h3 class="font-bold">With backdrop the rest of the page is inaccessible.</h3>
                <h4 class="text-sm mb-3">Make sure to also cancel the loading if your process has failed.</h4>
                <button class="btn btn-primary" @click="loadStop">Call .stopLoader()</button>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, onMounted, reactive, ref, watch, h } from "vue";
import { ToastOptions } from "./type";
import { useToast } from "./index";
import AppToggle from "./app-components/AppToggle.vue";
import AppInput from "./app-components/AppInput.vue";
import AppSelect from "./app-components/AppSelect.vue";
import AppTextarea from "./app-components/AppTextarea.vue";
import AppStatusDisplay from "./app-components/AppStatusDisplay.vue";
import { isObject } from "./utils";
import AppThemeToggle from "./app-components/AppThemeToggle.vue";

export default defineComponent({
    name: "App",
    components: { AppThemeToggle, AppStatusDisplay, AppTextarea, AppSelect, AppInput, AppToggle },

    setup: () => {
        const status = reactive<
            Omit<ToastOptions, "body" | "icon" | "duration"> & { body: string; icon?: string; duration?: string }
        >({
            title: "Toastified!",
            body: "This is the body.",
            type: undefined,
            pauseOnHover: false,
            canTimeout: false,
            defaultTitle: true,
            duration: undefined,
            icon: undefined,
            mode: undefined,
            answers: undefined,
        });
        const lightTheme = ref(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
        const defaultTitle = ref(true);
        const withBackdrop = ref(false);
        const singular = ref(false);
        const body = ref(null);
        const showWarning = ref(false);
        const toast = useToast();
        const jsonError = ref("");
        const modeOptions = markRaw([
            { value: "", text: "Leave empty", selected: true },
            { value: "prompt", text: "Prompt", selected: false },
            { value: "loader", text: "Loader", selected: false },
        ]);
        const typeOptions = markRaw([
            { value: "", text: "Leave empty", selected: true },
            { value: "info", text: "Info", selected: false },
            { value: "success", text: "Success", selected: false },
            { value: "warning", text: "Warning", selected: false },
            { value: "error", text: "Error", selected: false },
        ]);
        const answers = ref('{"Yes":true,"No":false}');
        const oneTypeAtAtime = ref(false);
        const jsx = ref(false);

        const updateAnswers = (val: string) => {
            if (!val) {
                return "Required";
            }

            let object;
            // '{"Yes":true,"No":false}' => {Yes: true, No: false
            try {
                object = JSON.parse(val);
            } catch (e) {
                jsonError.value = "Must be a valid JSON";
                return;
            }

            if (!isObject(object)) {
                jsonError.value = "Must be a valid object";
                return;
            }

            if (Object.keys(object).length < 2) {
                jsonError.value = "At least 2 answers are required";
                return;
            }

            status.answers = object;
        };

        watch(() => answers.value, updateAnswers);

        onMounted(() => {
            addToast();
        });

        watch(
            () => withBackdrop.value,
            (val) => {
                if (val && toast.getToasts().find((t) => t.mode === "loader")) {
                    showWarning.value = true;
                }
                toast.settings({ withBackdrop: val });
            }
        );
        watch(
            () => lightTheme.value,
            (val) => toast.settings({ theme: val ? "light" : "dark" }),
            { immediate: true }
        );
        watch(
            () => defaultTitle.value,
            (val) => {
                toast.settings({ defaultTitle: val });
            }
        );
        watch(
            () => singular.value,
            (val) => {
                toast.settings({ singular: val });
            }
        );
        watch(
            () => oneTypeAtAtime.value,
            (val) => {
                toast.settings({ oneType: val });
            }
        );

        const addToast = () => {
            if (status.body.length > 0) {
                const options: ToastOptions = {
                    ...status,
                    duration: status.duration ? Number(status.duration) : undefined,
                };
                if (status.mode === "prompt" && jsonError.value.length) {
                    toast.error(jsonError.value, "😠");
                } else {
                    if (jsx.value) {
                        options.body = h("div", null, [
                            h("p", null, "This is a JSX element. HTML in the body text will be escaped."),
                            h("p", null, status.body),
                        ]);
                        options.icon = h(
                            "div",
                            {
                                style: {
                                    padding: "5px",
                                    border: "2px solid currentColor",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                },
                            },
                            "jsx"
                        );
                    }
                    toast.notify(options);
                    if (status.mode === "loader" && withBackdrop.value) {
                        showWarning.value = true;
                    }
                }
            } else {
                toast.error("The body has to be present.", "😠");
            }
        };
        const checkTimingProps = () => {
            if (!status.canTimeout) {
                status.duration = undefined;
                status.pauseOnHover = false;
            }
        };
        const disableProps = () => {
            if (status.mode === "prompt" || status.mode === "loader") {
                status.duration = undefined;
                status.defaultTitle = false;
                status.pauseOnHover = false;
                status.canTimeout = false;
                status.type = undefined;
            }
        };
        const loadStop = () => {
            toast.stopLoader();
            showWarning.value = false;
        };
        const checkIfLoading = () => {
            if (toast.getToasts().length < 1) {
                withBackdrop.value = false;
            }
        };

        return {
            status,
            lightTheme,
            defaultTitle,
            withBackdrop,
            singular,
            body,
            showWarning,
            addToast,
            checkTimingProps,
            disableProps,
            loadStop,
            checkIfLoading,
            jsonError,
            updateAnswers,
            typeOptions,
            modeOptions,
            answers,
            oneTypeAtAtime,
            jsx,
        };
    },
});
</script>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

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

.warning-enter-from,
.warning-leave-to {
    opacity: 0;
}
</style>
