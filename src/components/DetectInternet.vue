<script>
import { ref } from "@vue/reactivity";
import dns from "dns";
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
      <h2>No internet connection</h2>
      <h3>Please connect to the internet to use this app</h3>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.detect-internet {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(black, 0.2);
  z-index: 3;

  .detect-internet__card {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    text-align: center;
  }
}
</style>
