<script>
import { computed, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import gsap from "gsap";

export default {
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    onMounted(() => {
      window.ipc.send("toMain", "initPath");
      window.ipc.receive("fromMain", (event) => {
        downloadPath.value = event;
      });
    });

    //checkbox v-model
    const alwaysHighest = ref(false);
    //qualites
    const formats = ["360p", "480p", "720p", "1080p"];
    //select v-model
    const selectedQuality = ref(formats[0]);
    //download path input v-model
    const downloadPath = ref("");

    function closeOverlay() {
      emit("update:modelValue", false);
    }

    function selectPath() {
      //open select directory dialog
      window.ipc.send("toMain", "openDialog");
    }

    return {
      closeOverlay,
      downloadPath,
      selectPath,
    };
  },
};
</script>

<template>
  <div v-show="modelValue" class="settings-overlay">
    <div class="settings-overlay__form">
      <h2>Settings</h2>
      <h4>Download path</h4>
      <div class="settings-overlay__select-path">
        <input v-model="downloadPath" type="text" />
        <div @click="selectPath">...</div>
      </div>
      <div class="settings-overlay__form__options">
        <div class="settings-overlay-button --cancel" @click="closeOverlay">
          cancel
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(black, 0.2);
  z-index: 3;

  .settings-overlay__form {
    width: 20rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    color: black;

    h4 {
      margin: 0.5rem 0 0.2rem 0;
    }

    .settings-overlay__select-path {
      display: flex;
      border: 1px solid var(--input-secondary);
      border-radius: 0.5rem;
      overflow: hidden;
      width: max-content;

      input[type="text"] {
        border: 0;
        outline: none;
        appearance: none;
        background-color: var(--input-primary);
        pointer-events: none;
        padding-left: 0.5rem;
      }

      div {
        font-size: 1.2rem;
        padding: 0 0.5rem;
        background-color: var(--input-primary);
        cursor: pointer;
      }
    }

    .settings-overlay__form__options {
      display: flex;
      width: 100%;
      margin-top: 2rem;

      .settings-overlay-button {
        position: relative;
        padding: 0 0.5rem;
        background-color: var(--input-primary);
        border-radius: 0.5rem;
        cursor: pointer;
        overflow: hidden;

        .settings-overlay-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-300%, -50%);
        }

        .settings-overlay-button__text {
          display: block;
        }
      }

      .--cancel {
        border: 1px solid var(--input-secondary);
        margin-left: auto;
      }
    }
  }
}
</style>
