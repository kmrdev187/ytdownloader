<script>
import { useStore } from "vuex";
import VideoInput from "./components/VideoInput.vue";
import VideoList from "./components/VideoList.vue";
import BottomBar from "./components/BottomBar.vue";
import HistorySidebar from "./components/HistorySidebar.vue";
import DetectInternet from "./components/DetectInternet.vue";
import { computed } from "@vue/reactivity";

export default {
  components: {
    VideoInput,
    VideoList,
    BottomBar,
    HistorySidebar,
    DetectInternet,
  },
  setup() {
    const store = useStore();

    function newVideo(arg) {
      store.commit("addToVideoList", arg);
    }

    let videoListArray = computed(() => {
      return store.state.videoList;
    });

    return {
      newVideo,
      videoListArray,
    };
  },
};
</script>

<template>
  <detect-internet />
  <video-input @onNewVideo="newVideo" />
  <section class="app__body">
    <video-list />
    <history-sidebar />
  </section>
  <div v-show="videoListArray.length == 0" class="app__drag-drop-text">
    <h3>Drop or paste url</h3>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
      <path d="M13 13l9 3l-4 2l-2 4l-3 -9" />
      <line x1="3" y1="3" x2="3" y2="3.01" />
      <line x1="7" y1="3" x2="7" y2="3.01" />
      <line x1="11" y1="3" x2="11" y2="3.01" />
      <line x1="15" y1="3" x2="15" y2="3.01" />
      <line x1="3" y1="7" x2="3" y2="7.01" />
      <line x1="3" y1="11" x2="3" y2="11.01" />
      <line x1="3" y1="15" x2="3" y2="15.01" />
    </svg>
  </div>
  <bottom-bar />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
@import "./style/_global";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  user-select: none;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: $scrollbar-track;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: $scrollbar-thumb;
  border-radius: 3px;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .app__body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .app__drag-drop-text {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $font-secondary-color;
    z-index: -1;
  }
}
</style>
