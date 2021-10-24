<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
};
</script>

<template>
  <div v-show="active" class="skeleton-loader">
    <span class="skeleton-loader__image"></span>
    <span class="skeleton-loader__text"></span>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-loader {
  width: 100%;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--input-primary);
  display: flex;
  align-items: flex-start;

  .skeleton-loader__image {
    display: block;
    width: 8rem;
    height: 4.5rem;
    background-color: #999;
    border-radius: 0.5rem;
    margin-right: 0.5rem;
  }

  .skeleton-loader__text {
    height: 2rem;
    width: 100%;
    background-color: #999;
    border-radius: 0.5rem;
  }
}
</style>
