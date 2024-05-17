<script setup lang="ts">
import { useUploadStore } from "@/stores/upload";
import Upload from "@/components/Upload.vue";
const uploadStore = useUploadStore();
</script>

<template>
  <main>
    <Upload
      v-if="
        uploadStore.legendsxml == null || uploadStore.legendsplusxml == null
      "
    />
    <div v-else>
      <h1>Home</h1>
      <p>Upload successful!</p>
    </div>
  </main>
</template>
