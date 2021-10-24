<script>
import { onMounted } from "@vue/runtime-core";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import SkeletonLoader from "./SkeletonLoader.vue";
import DownloadButton from "./DownloadButton.vue";

export default {
  components: { SkeletonLoader, DownloadButton },
  props: {
    video: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();

    const videoDetails = ref({});

    const downloadObj = ref({
      id: props.video.id,
      url: props.video.url,
      isMusic: props.video.isMusic,
      title: "",
      author: "",
      thumbnail: "",
    });

    function getInfo() {
      window.ytdl.getInfo(props.video.url).then((response) => {
        videoDetails.value.thumbnail = downloadObj.value.thumbnail =
          response.videoDetails.thumbnails[0].url;
        videoDetails.value.title = downloadObj.value.title =
          response.videoDetails.title;
        videoDetails.value.author = downloadObj.value.author =
          response.videoDetails.author.name;
      });
    }

    function removeFromList() {
      store.commit("removeFromVideoList", props.video.id);
      window.ipc.send("killDownload", props.video.id);
    }

    const uniqueID = computed(() => {
      return `video-list-item_${Math.floor(Math.random() * 20000)}`;
    });

    onMounted(() => {
      getInfo();
    });

    return {
      videoDetails,
      uniqueID,
      removeFromList,
      downloadObj,
    };
  },
};
</script>

<template>
  <div class="video-list__item" :id="uniqueID">
    <template v-if="videoDetails.thumbnail != null">
      <img :src="videoDetails.thumbnail" alt="video-thumbnail" />

      <div class="video-list__item__details">
        <span class="video-list__item__details__title">{{
          videoDetails.title
        }}</span>
        <span class="video-list__item__details__author">{{
          videoDetails.author
        }}</span>
      </div>

      <font-awesome-icon
        class="video-list__item__type"
        :icon="video.isMusic ? 'music' : 'video'"
      />

      <download-button :downloadObj="downloadObj" />

      <font-awesome-icon
        class="video-list__item__delete"
        icon="trash"
        size="lg"
        @click="removeFromList"
      />
    </template>
    <skeleton-loader :active="videoDetails.thumbnail == null" />
  </div>
</template>

<style lang="scss" scoped>
.video-list__item {
  display: flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  width: 100%;

  img {
    width: 8rem;
    height: 4.5rem;
    margin-right: 1rem;
    border-radius: 0.5rem;
  }

  .video-list__item__details {
    display: flex;
    flex-direction: column;
    width: auto;
    overflow: hidden;

    .video-list__item__details__title {
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 500;
    }

    .video-list__item__details__author {
      font-size: 0.8rem;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .video-list__item__type {
    margin: 0 1rem;
    color: #999;
  }

  .download-button {
    margin-left: auto;
  }

  .video-list__item__delete {
    margin-right: 0.5rem;
    cursor: pointer;

    &:hover {
      color: var(--delete);
    }
  }
}
</style>
