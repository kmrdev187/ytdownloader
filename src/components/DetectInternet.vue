<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    const isConnected = ref(true);

    onMounted(() => {
      window.ipc.receive("connection", (args) => {
        args ? (isConnected.value = true) : (isConnected.value = false);
      });
    });

    return {
      isConnected,
    };
  },
};
</script>

<template>
  <section v-show="!isConnected" class="detect-internet">
    <div class="detect-internet__card">
      <font-awesome-icon icon="wifi" size="2x" />
      <h2>No internet connection</h2>
      <h3>Please connect to the internet to use the app</h3>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/style/_global";
.detect-internet {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $overlay-color;
  z-index: 3;

  .detect-internet__card {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    text-align: center;
    outline: 3px solid $error-color;
    color: $error-color;
  }
}
</style>
