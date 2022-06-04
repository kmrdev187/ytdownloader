<script>
import { computed, ref } from "@vue/reactivity";
import gsap from "gsap";
import { useStore } from "vuex";

export default {
  props: {
    downloadObj: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    //unique IDs for animated elements
    const downloadIconId = computed(() => {
      return `dlicon-${Math.floor(Math.random() * 30000)}`;
    });

    const progressId = computed(() => {
      return `dlprogress-${Math.floor(Math.random() * 30000)}`;
    });

    const doneIconId = computed(() => {
      return `dldone-${Math.floor(Math.random() * 30000)}`;
    });

    //gsap timelines
    let tl = gsap.timeline();
    let tl2 = gsap.timeline();

    //progress bar values
    const progressValue = ref(0),
      progressMax = ref(0);

    function startDownload() {
      //first animation timeline (it shows a progress bar)
      tl.to(`#${downloadIconId.value}`, {
        top: "150%",
      }).to(`#${progressId.value}`, {
        top: "50%",
      });

      //args for download processes
      const args = {
        url: props.downloadObj.url,
        id: props.downloadObj.id,
        title: props.downloadObj.title.replace(/[&/\\#,+$~%.|'":*<>?{}]/g, ""),
      };

      props.downloadObj.isMusic
        ? window.ipc.send("toDownloadAudio", args)
        : window.ipc.send("toDownload", args);

      //download progress from electron.js
      //item's id is the ipc channel (id added to item in VideoInput component)
      window.ipc.receive(props.downloadObj.id, (event) => {
        progressMax.value = event.total;
        progressValue.value = event.downloaded;

        //when the download is complete, the second timeline will start
        //and when the second timeline is done, item will be added to local storage and history array in vuex
        if (event.downloaded == event.total) {
          tl2
            .to(`#${progressId.value}`, {
              top: "150%",
            })
            .to(`#${doneIconId.value}`, {
              top: "50%",
              onComplete: () => {
                //history object
                let storageObject = {
                  id: props.downloadObj.id,
                  url: props.downloadObj.url,
                  thumbnail: props.downloadObj.thumbnail,
                  title: props.downloadObj.title,
                  author: props.downloadObj.author,
                  isMusic: props.downloadObj.isMusic,
                };
                if (
                  localStorage.getItem("history") == null ||
                  localStorage.getItem("history").length == 0
                ) {
                  localStorage.setItem(
                    "history",
                    JSON.stringify([storageObject])
                  );
                  store.commit("addToHistory", storageObject);
                } else {
                  let historyArray = JSON.parse(
                    localStorage.getItem("history")
                  );
                  historyArray.push(storageObject);
                  localStorage.setItem("history", JSON.stringify(historyArray));
                  store.commit("initHistory", historyArray);
                }
              },
            });
        }
      });
    }

    return {
      startDownload,
      doneIconId,
      downloadIconId,
      progressId,
      progressMax,
      progressValue,
    };
  },
};
</script>

<template>
  <div @click.prevent="startDownload" class="download-button">
    <font-awesome-icon
      :id="downloadIconId"
      class="download-button__download-icon"
      icon="arrow-down"
      size="lg"
    />
    <progress
      :id="progressId"
      class="download-button__progress"
      :max="progressMax"
      :value="progressValue"
    ></progress>
    <font-awesome-icon
      :id="doneIconId"
      class="download-button__done-icon"
      icon="check-circle"
      size="lg"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";
@import "@/style/_global";
$progressHeight: 0.5rem;

.download-button {
  position: relative;
  min-width: 50px;
  max-width: 50px;
  height: 30px;
  overflow: hidden;
  margin-right: 0.5rem;

  .download-button__download-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .download-button__done-icon {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $input-secondary-color;
  }

  .download-button__progress {
    appearance: none;
    position: absolute;
    top: -10px;
    left: 0;
    height: $progressHeight;
    transform: translate(0, -50%);
    width: 50px;

    &::-webkit-progress-bar {
      overflow: hidden;
      border-radius: math.div($progressHeight, 2);
      background-color: $input-primary-color;
    }

    &::-webkit-progress-value {
      background-color: $input-secondary-color;
    }
  }
}
</style>
