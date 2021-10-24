<script>
import VideoListItem from "./VideoListItem.vue";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";

export default {
  components: { VideoListItem },
  setup() {
    let store = useStore();

    let videoList = computed(() => {
      return store.state.videoList;
    });

    return {
      videoList,
    };
  },
};
</script>

<template>
  <div class="video-list">
    <video-list-item v-for="item in videoList" :key="item.id" :video="item" />
  </div>
</template>

<style lang="scss" scoped>
.video-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
