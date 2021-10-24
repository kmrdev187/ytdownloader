import { createStore } from "vuex";

const store = createStore({
  state: {
    videoList: [],
    history: [],
  },
  mutations: {
    addToVideoList(state, newVideo) {
      state.videoList.push(newVideo);
    },
    removeFromVideoList(state, videoId) {
      for (let i = state.videoList.length - 1; i >= 0; i--) {
        if (state.videoList[i].id == videoId) {
          state.videoList.splice(i, 1);
        }
      }
    },
    initHistory(state, history) {
      state.history = history;
    },
    addToHistory(state, newHistory) {
      state.history.push(newHistory);
    },
    removeFromHistory(state, historyId) {
      for (let i = 0; i <= state.history.length - 1; i++) {
        if (state.history[i].id == historyId) {
          state.history.splice(i, 1);
        }
      }
    },
  },
});

export default store;
