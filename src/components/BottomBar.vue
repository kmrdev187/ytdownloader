<script>
import { ref } from "@vue/reactivity";
import SettingsOverlay from "./SettingsOverlay.vue";

export default {
  components: { SettingsOverlay },
  setup() {
    const overlay = ref(false);

    return {
      overlay,
    };
  },
};
</script>

<template>
  <footer class="bottom-bar">
    <settings-overlay v-model="overlay" />
    <div class="settings-button" @click="overlay = !overlay">
      <font-awesome-icon icon="cog" size="lg" />
      Settings
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/style/_global";
.bottom-bar {
  position: relative;
  width: 100%;
  z-index: 2;
  color: $font-secondary-color;

  .settings-button {
    width: max-content;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $input-secondary-color;
    }
  }
}
</style>
