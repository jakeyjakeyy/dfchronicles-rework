<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";
import { ref, onMounted } from "vue";
import { useUploadStore } from "@/stores/upload";
const uploadStore = useUploadStore();
let typeCounts: Record<string, number> = {};
const selectedType = ref<string | null>(null);
const selection = ref<any | null>(null);
const objData = ref<any | null>(null);
const generation = ref<any | null>(null);
import loadHistoricalEventCollections from "../utils/historicaleventcol";

const countTypes = () => {
  uploadStore.legendsxml.df_world.historical_event_collections.historical_event_collection.forEach(
    (collection: any) => {
      if (typeCounts[collection.type] === undefined) {
        typeCounts[collection.type] = 1;
      } else {
        typeCounts[collection.type]++;
      }
    }
  );
};
onMounted(countTypes);
function selectType(type: any) {
  selectedType.value = String(type);
}

function selectEvent(event: any) {
  selection.value = event;
  objData.value = loadHistoricalEventCollections(
    event,
    uploadStore.legendsxml.df_world,
    uploadStore.legendsplusxml.df_world
  );
  console.log(objData.value);
  const prompt = JSON.stringify(objData.value);
  const data = fetch("http://localhost:8000/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: objData.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      generation.value = data.generation.generation;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
</script>

<template>
  <div>
    <h1>{{ uploadStore.legendsplusxml.df_world.name }}</h1>
    <h2>{{ uploadStore.legendsplusxml.df_world.altname }}</h2>

    <div class="grid">
      <div v-if="generation">
        <h2>Generated Text</h2>
        <VueMarkdown :source="generation" />
      </div>
      <!-- if no type is selected, show all types -->
      <div
        v-if="!selectedType"
        v-for="type in Object.keys(typeCounts)"
        :key="type"
        class="box cell"
        @click="selectType(type)"
      >
        <div>{{ type }}</div>
        <p>{{ typeCounts[type] }}</p>
      </div>
      <!-- if a type is selected, show the events of that type -->
      <div v-else>
        <h2>{{ selectedType }}</h2>
        <button @click="selectedType = null">Back</button>
        <div
          v-for="collection in uploadStore.legendsxml.df_world
            .historical_event_collections.historical_event_collection"
          :key="collection.id"
        >
          <div
            v-if="collection.type === selectedType"
            @click="selectEvent(collection)"
          >
            <p>{{ collection.name ? collection.name : "Unnamed Event" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  margin: 1rem;
  justify-content: space-between;
  cursor: pointer;
}
</style>
