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
    <Upload
      v-if="
        uploadStore.legendsxml == null || uploadStore.legendsplusxml == null
      "
    />
    <div v-else>
      <Selector />
    </div>
  </main>
</template>
