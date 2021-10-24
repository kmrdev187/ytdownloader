<script>
import { ref } from "@vue/reactivity";
import { v4 as uuid } from "uuid";
import { onMounted } from "@vue/runtime-core";

export default {
  name: "VideoInput",
  emits: ["onNewVideo"],
  setup(props, { emit }) {
    let videoOrMusic = ref(false);

    onMounted(() => {
      const root = document.querySelector("#app");
      root.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      root.addEventListener("drop", (event) => {
        let url = event.dataTransfer.getData("text");
        const protocol = "https://";
        //fix chrome link drag
        if (!url.includes(protocol)) url = protocol + url;

        const isValid = window.ytdl.validate(url);

        if (isValid) {
          emit("onNewVideo", {
            id: uuid(),
            url: url,
            isMusic: videoOrMusic.value,
          });
        }
      });
    });

    function handleKeydown(e) {
      //ctrl + v
      if (e.ctrlKey && (e.key === "V" || e.key === "v")) {
        //get text from clipboard
        navigator.clipboard.readText().then((r) => {
          const isValid = window.ytdl.validate(r);

          if (isValid) {
            emit("onNewVideo", {
              id: uuid(),
              url: e.target.value,
              isMusic: videoOrMusic.value,
            });
          }

          e.target.value = "";
        });
      } else {
        e.preventDefault();
      }
    }

    return {
      handleKeydown,
      videoOrMusic,
    };
  },
};
</script>

<template>
  <section class="video-input">
    <div class="video-input__switch">
      <div
        :class="['video-input__switch__knob', videoOrMusic ? '--checked' : '']"
        @click="videoOrMusic = !videoOrMusic"
      >
        <font-awesome-icon :icon="videoOrMusic ? 'music' : 'video'" size="xs" />
      </div>
    </div>
    <input
      placeholder="Paste YouTube URL here"
      type="text"
      class="video-input__url"
      @keydown="handleKeydown"
      @drop.stop.prevent
    />
  </section>
</template>

<style lang="scss" scoped>
@use "sass:math";

$inputHeight: 1.8rem;
$switchKnobSize: 1.4rem;
$switchWidth: 3rem;

.video-input {
  display: flex;
  margin: 1rem 0.5rem;

  .video-input__switch {
    position: relative;
    height: $inputHeight;
    width: $switchWidth;
    background-color: var(--input-primary);
    border-radius: math.div($inputHeight, 2);
    margin-right: 0.5rem;

    .video-input__switch__knob {
      position: absolute;
      top: math.div(($inputHeight - $switchKnobSize), 2);
      left: math.div(($inputHeight - $switchKnobSize), 2);
      width: $switchKnobSize;
      height: $switchKnobSize;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--input-secondary);
      color: white;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .--checked {
      transform: translateX(1rem);
    }
  }
  .video-input__url {
    outline: none;
    padding: 0 0.5rem;
    border: 0;
    border-radius: math.div($inputHeight, 2);
    height: $inputHeight;
    line-height: $inputHeight;
    width: 100%;
    background-color: var(--input-primary);

    &::-webkit-input-placeholder {
      color: var(--input-secondary);
      font-size: 1rem;
    }
  }
}
</style>
