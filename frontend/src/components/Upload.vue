<script setup lang="ts">
import { useUploadStore } from "@/stores/upload";
const uploadStore = useUploadStore();
</script>

<template>
  <div>
    <h2>Upload</h2>
    <div
      class="file has-name is-boxed"
      id="legends"
      @change="uploadStore.handleFile"
    >
      <label class="file-label">
        <input class="file-input" type="file" name="legends" />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">Upload</span>
        </span>
        <span class="file-name">{{
          uploadStore.legendsfilename
            ? uploadStore.legendsfilename
            : "legends.xml"
        }}</span>
      </label>
    </div>

    <div
      class="file has-name is-boxed"
      id="legendsplus"
      @change="uploadStore.handleFile"
    >
      <label class="file-label">
        <input
          class="file-input"
          type="file"
          name="legendsplus"
          @change="uploadStore.handleFile"
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">Upload</span>
        </span>
        <span class="file-name">{{
          uploadStore.legendsplusfilename
            ? uploadStore.legendsplusfilename
            : "legends_plus.xml"
        }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped></style>
