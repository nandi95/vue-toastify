<template>
    <div class="bg-gradient-to-br from-base-100 to-base-300 py-2 min-h-screen">
        <header
            class="flex justify-center text-center flex-col flex-no-wrap mb-10 pt-3">
            <h2 class="text-primary font-bold text-3xl mb-2">
                Vue Toastify
            </h2>
            <p class="text-primary-content/80">
                A fuss free notification component.
            </p>
        </header>
        <main class="px-2">
            <div
                class="flex xl:justify-center justify-around flex-wrap flex-row">
                <div class="flex flex-col w-auto sm:max-w-50 sm:mr-2">
                    <AppStatusDisplay :status="status" />
                    <div class="w-full mx-auto">
                        <AppInput v-model="status.title" name="title" label="Title" />
                        <AppTextarea v-model="status.body"
                                     name="body"
                                     label="Body"
                                     :error="status.body < 1 ? 'Needs to have length' : ''" />
                        <AppSelect v-model="status.type"
                                   name="type"
                                   label="Type"
                                   :options="typeOptions"
                                   :disabled="
                                       status.mode === 'loader' ||
                                           status.mode === 'prompt'
                                   " />
                        <AppSelect v-model="status.mode"
                                   name="mode"
                                   label="Mode"
                                   :options="modeOptions"
                                   @change="disableProps" />
                        <AppTextarea v-if="status.mode === 'prompt'"
                                     v-model="answers"
                                     name="answers"
                                     label="Answers"
                                     :error="jsonError"
                                     placeholder="eg.: '{&quot;Yes&quot;:true,&quot;No&quot;:false}'"
                                     @update:model-value="updateAnswers" />
                        <AppInput v-model="status.url"
                                  name="url"
                                  label="Url"
                                  placeholder="https://www.example.com" />
                    </div>
                </div>
                <div class="w-full sm:w-1/2 xl:w-1/4 sm:max-w-50 sm:ml-2">
                    <div class="w-1/2 mx-auto lg:w-2/3 xl:w-1/2 mb-12 space-y-1">
                        <AppToggle v-model="status.pauseOnHover" label="Can be Paused" @change="checkTimingProps" />
                        <AppToggle v-model="status.canTimeout"
                                   label="Can Timeout"
                                   @change="
                                       checkTimingProps();
                                       disableProps();
                                   " />
                        <AppToggle v-model="status.defaultTitle"
                                   label="Use Default Title"
                                   @change="disableProps" />
                        <AppToggle v-model="lightTheme"
                                   label="Use Light Theme" />
                        <AppToggle v-model="withBackdrop"
                                   label="With Backdrop"
                                   @change="checkIfLoading" />
                        <AppToggle v-model="singular"
                                   label="One notification at a time"
                                   @change="checkIfLoading" />
                        <AppToggle v-model="oneTypeAtAtime"
                                   label="One type at a time"
                                   @change="checkIfLoading" />
                    </div>
                    <div class="flex flex-col justify-around w-full">
                        <AppInput v-model="status.duration"
                                  name="duration"
                                  label="Duration"
                                  :disabled="!status.canTimeout"
                                  placeholder="ms"
                                  type="number"
                                  min="1"
                                  step="1" />
                        <AppTextarea v-model="status.icon"
                                     name="icon"
                                     label="Icon"
                                     placeholder="Html is expected" />
                    </div>
                </div>
            </div>
            <div class="flex justify-around items-center align-middle flex-wrap mt-2">
                <button v-if="status.mode === 'loader'"
                        class="btn"
                        @click="loadStop">
                    Call .stopLoader()
                </button>
                <button class="btn" @click="addToast">
                    Toastify!
                </button>
            </div>
        </main>
        <transition name="warning">
            <div v-if="showWarning"
                 class="bg-gray-200 rounded-lg shadow-lg px-4 py-3 warning absolute text-center"
                 style="z-index: 51">
                <h3 class="font-bold">
                    With backdrop the rest of the page is inaccessible.
                </h3>
                <h4 class="text-sm mb-3">
                    Make sure to also cancel the loading if your process has
                    failed.
                </h4>
                <button class="btn" @click="loadStop">
                    Call .stopLoader()
                </button>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, onMounted, reactive, ref, watch } from 'vue';
import { ToastOptions } from './type';
import { useToast } from './index';
import AppToggle from './app-components/AppToggle.vue';
import AppInput from './app-components/AppInput.vue';
import AppSelect from './app-components/AppSelect.vue';
import AppTextarea from './app-components/AppTextarea.vue';
import AppStatusDisplay from './app-components/AppStatusDisplay.vue';
import { isObject } from './utils';

export default defineComponent({
    name: 'App',
    components: { AppStatusDisplay, AppTextarea, AppSelect, AppInput, AppToggle },

    setup: () => {
        const status = reactive<ToastOptions>({
            title: 'Toastified!',
            body: 'This is the body.',
            type: undefined,
            pauseOnHover: false,
            canTimeout: false,
            defaultTitle: true,
            duration: undefined,
            icon: undefined,
            mode: undefined,
            answers: undefined,
            url: ''
        });
        const lightTheme = ref(false);
        const defaultTitle = ref(true);
        const withBackdrop = ref(false);
        const singular = ref(false);
        const body = ref(null);
        const showWarning = ref(false);
        const loading = ref(false);
        const toast = useToast();
        const jsonError = ref('');
        const modeOptions = markRaw([
            { value: '', text: 'Leave empty', selected: true },
            { value: 'prompt', text: 'Prompt', selected: false },
            { value: 'loader', text: 'Loader', selected: false }
        ]);
        const typeOptions = markRaw([
            { value: '', text: 'Leave empty', selected: true },
            { value: 'info', text: 'Info', selected: false },
            { value: 'success', text: 'Success', selected: false },
            { value: 'warning', text: 'Warning', selected: false },
            { value: 'error', text: 'Error', selected: false }
        ]);
        const answers = ref('{"Yes":true,"No":false}');
        const oneTypeAtAtime = ref(false);

        const updateAnswers = (val: string) => {
            if (!val) {
                return 'Required';
            }

            let object;
            // '{"Yes":true,"No":false}' => {Yes: true, No: false
            try {
                object = JSON.parse(val);
            } catch (e) {
                jsonError.value = 'Must be a valid JSON';
                return;
            }

            if (!isObject(object)) {
                jsonError.value = 'Must be a valid object';
                return;
            }

            if (Object.keys(object).length < 2) {
                jsonError.value = 'At least 2 answers are required';
                return;
            }

            status.answers = object;
        };

        watch(() => answers.value, updateAnswers);

        onMounted(() => {
            toast.notify(status);
        });

        watch(() => withBackdrop.value, val => {
            toast.settings({ withBackdrop: val });
        });
        watch(() => lightTheme.value, val => {
            toast.settings({ theme: val ? 'light' : 'dark' });
        });
        watch(() => defaultTitle.value, val => {
            toast.settings({ defaultTitle: val });
        });
        watch(() => singular.value, val => {
            toast.settings({ singular: val });
        });
        watch(() => oneTypeAtAtime.value, val => {
            toast.settings({ oneType: val });
        });

        const addToast = () => {
            if (status.body.length > 0) {
                if (status.mode === 'prompt' && jsonError.value.length) {
                    toast.error(jsonError.value, '😠');
                } else {
                    toast.notify(status);
                    if (status.mode === 'loader') {
                        loading.value = true;
                        if (withBackdrop.value) {
                            showWarning.value = true;
                        }
                    }
                }
            } else {
                toast.error('The body has to be present.', '😠');
            }
        };
        const checkTimingProps = () => {
            if (!status.canTimeout) {
                status.duration = undefined;
                status.pauseOnHover = false;
            }
        };
        const disableProps = () => {
            if (status.mode === 'prompt' || status.mode === 'loader') {
                status.duration = undefined;
                status.defaultTitle = false;
                status.pauseOnHover = false;
                status.canTimeout = false;
                status.type = undefined;
            }
        };
        const loadStop = () => {
            toast.stopLoader();
            loading.value = false;
            showWarning.value = false;
        };
        const checkIfLoading = () => {
            if (toast.getToasts().length < 1) {
                withBackdrop.value = false;
            }
            if (loading.value) {
                showWarning.value = true;
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
            loading,
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
            oneTypeAtAtime
        };
    }
});
</script>

<style lang="scss">
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
