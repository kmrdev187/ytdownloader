<script>
import { computed, ref } from "@vue/reactivity";
import gsap from "gsap";
import HistorySidebarItem from "./HistorySidebarItem.vue";
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  components: { HistorySidebarItem },
  setup() {
    const isVisible = ref(false);
    const store = useStore();
    const historyArray = computed(() => {
      return store.state.history;
    });

    onMounted(() => {
      if (
        localStorage.getItem("history") !== null &&
        localStorage.getItem("history").length !== 0
      ) {
        store.commit(
          "initHistory",
          JSON.parse(localStorage.getItem("history"))
        );
      }
      const sidebarElement = document.querySelector(".history-sidebar");
      document.addEventListener("click", (event) => {
        if (
          isVisible.value &&
          !getParents(event.target).includes(sidebarElement)
        ) {
          toggleSidebar();
        }
      });
    });

    function getParents(elem) {
      let parents = [];
      for (; elem && elem !== document; elem = elem.parentNode) {
        parents.push(elem);
      }
      return parents;
    }

    function toggleSidebar() {
      if (isVisible.value) {
        gsap.to(".history-sidebar__content", {
          width: 0,
          onComplete: () => {
            isVisible.value = false;
          },
        });
      } else {
        gsap.to(".history-sidebar__content", {
          width: 550,
          onComplete: () => {
            isVisible.value = true;
          },
        });
      }
    }

    function clearHistory() {
      if (
        localStorage.getItem("history") !== null &&
        localStorage.getItem("history").length !== 0
      ) {
        let historyArray = JSON.parse(localStorage.getItem("history"));
        historyArray.splice(0, historyArray.length);
        store.commit("initHistory", historyArray);
        localStorage.setItem("history", JSON.stringify(historyArray));
      }
    }

    return {
      toggleSidebar,
      isVisible,
      historyArray,
      clearHistory,
    };
  },
};
</script>

<template>
  <section class="history-sidebar">
    <div @click="toggleSidebar" class="history-sidebar__button">
      <font-awesome-icon
        size="lg"
        :icon="isVisible ? 'chevron-right' : 'chevron-left'"
      />
    </div>
    <div class="history-sidebar__content">
      <div class="history-sidebar__content__titlebar">
        <h2>History</h2>
        <span @click="clearHistory">clear</span>
      </div>
      <history-sidebar-item
        v-for="item in historyArray"
        :key="item.id"
        :itemData="item"
      />
      <div
        v-show="historyArray.length == 0"
        class="history-sidebar__content__empty-text"
      >
        <font-awesome-icon size="2x" icon="search" />
        <h2>Nothing in history</h2>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/style/_global";
.history-sidebar {
  position: relative;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  z-index: 2;

  .history-sidebar__button {
    height: 5rem;
    width: 1.5rem;
    border-radius: 0.5rem;
    background-color: $input-primary-color;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $font-secondary-color;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: $sidebar-button-hover-shadow;
    }
  }

  .history-sidebar__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 0;
    background-color: $input-primary-color;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    overflow-y: auto;
    overflow-x: hidden;

    .history-sidebar__content__titlebar {
      display: flex;
      align-items: center;
      padding: 0.5rem;

      h2 {
        margin: 0;
      }

      span {
        margin-left: auto;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: $input-secondary-color;
        }
      }
    }

    .history-sidebar__content__empty-text {
      overflow: hidden;
      width: inherit;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $font-secondary-color;

      h2 {
        margin: 0 0 0 1rem;
        white-space: nowrap;
      }
    }
  }
}
</style>
