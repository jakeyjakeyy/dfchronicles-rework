<script setup lang="ts">
import { ref } from "vue";
let legendsxml = null;
const legendsfilename = ref("");
let legendsplusxml = null;
const legendsplusfilename = ref("");

const handleFile = (event: Event) => {
  console.log(event);
  const target = event.target as HTMLInputElement;
  const file = target.files?.item(0);
  if (file) {
    if (target.name === "legends") {
      legendsxml = file;
      legendsfilename.value = file.name;
      console.log(legendsxml);
    } else {
      legendsplusxml = file;
      legendsplusfilename.value = file.name;
      console.log(legendsplusxml);
    }
  }
};
</script>

<template>
  <div>
    <h1>Upload</h1>
    <div class="file has-name is-boxed" id="legends" @change="handleFile">
      <label class="file-label">
        <input class="file-input" type="file" name="legends" />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">Upload a file...</span>
        </span>
        <span class="file-name">{{
          legendsfilename ? legendsfilename : "legends.xml"
        }}</span>
      </label>
    </div>

    <div class="file has-name is-boxed" id="legendsplus" @change="handleFile">
      <label class="file-label">
        <input
          class="file-input"
          type="file"
          name="legendsplus"
          @change="handleFile"
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">Upload a file...</span>
        </span>
        <span class="file-name">{{
          legendsplusfilename ? legendsplusfilename : "legends_plus.xml"
        }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped></style>
