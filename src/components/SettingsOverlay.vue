<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

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
      <div class="settings-overlay__form__titlebar">
        <h2>Settings</h2>
        <font-awesome-icon @click="closeOverlay" icon="times" size="lg" />
      </div>
      <h4>Download path</h4>
      <div class="settings-overlay__select-path">
        <input v-model="downloadPath" type="text" />
        <div @click="selectPath">...</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";
@import "@/style/_global";
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $overlay-color;
  z-index: 3;

  .settings-overlay__form {
    width: 20rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: $card-bg-color;
    color: $font-primary-color;
    outline: 3px solid $input-secondary-color;

    h4 {
      margin: 0.5rem 0 0.2rem 0;
    }

    .settings-overlay__form__titlebar {
      display: flex;
      align-items: flex-start;

      h2 {
        margin: 0;
      }

      svg {
        margin-left: auto;
        cursor: pointer;
      }
    }

    .settings-overlay__select-path {
      display: flex;
      border: 1px solid $input-secondary-color;
      border-radius: 0.5rem;
      overflow: hidden;
      width: 100%;

      input[type="text"] {
        border: 0;
        outline: none;
        appearance: none;
        background-color: $input-primary-color;
        pointer-events: none;
        padding-left: 0.5rem;
        flex: 1;
      }

      div {
        font-size: 1.2rem;
        padding: 0 0.5rem;
        background-color: $input-primary-color;
        cursor: pointer;
      }
    }
  }
}
</style>
