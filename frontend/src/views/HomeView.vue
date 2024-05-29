<script setup lang="ts">
import { useUploadStore } from "@/stores/upload";
import Upload from "@/components/Upload.vue";
import Selector from "@/components/Selector.vue";
import Nav from "@/components/Nav.vue";
const uploadStore = useUploadStore();
</script>

<template>
  <main>
    <Nav />
    <div
      class="homeContainer"
      v-if="
        uploadStore.legendsxml == null || uploadStore.legendsplusxml == null
      "
    >
      <Upload />
    </div>
    <div class="homeContainer" v-else>
      <Selector />
    </div>
  </main>
</template>

<style scoped>
.homeContainer {
  padding: 0 10px;
}
</style>
