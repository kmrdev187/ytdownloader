<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  props: {
    itemData: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const type = ref(props.itemData.isMusic);

    function removeFromStorage(itemId) {
      let historyArray = JSON.parse(localStorage.getItem("history"));
      for (let i = 0; i <= historyArray.length - 1; i++) {
        if (historyArray[i].id == itemId) {
          historyArray.splice(i, 1);
        }
      }
      localStorage.setItem("history", historyArray);
      store.commit("removeFromHistory", itemId);
    }

    function addToList() {
      store.commit("addToVideoList", {
        id: props.itemData.id,
        url: props.itemData.url,
        isMusic: type.value,
      });
      removeFromStorage(props.itemData.id);
    }

    return {
      addToList,
      type,
    };
  },
};
</script>

<template>
  <div class="history-sidebar__item">
    <img :src="itemData.thumbnail" alt="video-thumbnail" />
    <div class="history-sidebar__item__details">
      <span class="history-sidebar__item__details__title">{{
        itemData.title
      }}</span>
      <span class="history-sidebar__item__details__author">{{
        itemData.author
      }}</span>
    </div>
    <div class="history-sidebar__item__type-select">
      <font-awesome-icon
        @click="type = !type"
        :icon="type ? 'music' : 'video'"
      />
    </div>
    <font-awesome-icon
      class="history-sidebar__item__redo"
      @click="addToList"
      icon="redo-alt"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/style/_global";
.history-sidebar__item {
  display: flex;
  align-items: center;
  margin: 0 0 0.5rem 0.5rem;

  img {
    width: 8rem;
    height: 4.5rem;
    margin-right: 1rem;
    border-radius: 0.5rem;
  }

  .history-sidebar__item__details {
    display: flex;
    flex-direction: column;
    width: auto;
    overflow: hidden;

    .history-sidebar__item__details__title {
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 500;
    }

    .history-sidebar__item__details__author {
      font-size: 0.8rem;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .history-sidebar__item__type-select {
    margin: 0 1rem;
    cursor: pointer;
  }

  .history-sidebar__item__redo {
    margin: 0 1rem 0 auto;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $input-secondary-color;
    }
  }
}
</style>
