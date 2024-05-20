import { defineStore } from "pinia";
import { ref } from "vue";
import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser();
export const useUploadStore = defineStore("upload", () => {
  const legendsxml = ref<any | null>(null);
  const legendsfilename = ref("");
  const legendsplusxml = ref<any | null>(null);
  const legendsplusfilename = ref("");

  const handleFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      file.text().then((text) => {
        let data = parser.parse(text);
        if (target.name === "legends") {
          legendsxml.value = data;
          legendsfilename.value = file.name;
        } else {
          legendsplusxml.value = data;
          legendsplusfilename.value = file.name;
        }
      });
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
