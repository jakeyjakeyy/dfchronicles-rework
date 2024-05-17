import { defineStore } from "pinia";
import { ref } from "vue";

export const useUploadStore = defineStore("upload", () => {
  let legendsxml = null;
  const legendsfilename = ref("");
  let legendsplusxml = null;
  const legendsplusfilename = ref("");

  const handleFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      if (target.name === "legends") {
        legendsxml = file;
        legendsfilename.value = file.name;
      } else {
        legendsplusxml = file;
        legendsplusfilename.value = file.name;
      }
    }
  };

  return {
    legendsxml,
    legendsfilename,
    legendsplusxml,
    legendsplusfilename,
    handleFile,
  };
});
