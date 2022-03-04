<script setup lang="ts"></script>

<template>
  <div class="list-view-item">
    <div class="list-view-item-inner placeload-wrap is-flex">
      <div class="placeload-avatar loads is-medium is-rounded-full"></div>
      <div class="content-shape-group mx-2">
        <div class="content-shape loads"></div>
        <div class="content-shape loads"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.placeload-avatar.is-rounded-full {
  border-radius: 50%;
}
.placeload-avatar {
  display: block;
  width: 40px;
  min-width: 40px;
  height: 40px;

  .is-medium {
    width: 50px;
    min-width: 50px;
    height: 50px;
  }
}
.content-shape-group {
  width: 100%;
  max-width: 100%;
  .content-shape:not(:last-child) {
    margin-bottom: 0.5rem;
  }
  .content-shape:last-child {
    width: 60%;
  }
}
</style>
