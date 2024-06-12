<script setup lang="ts">
import RefreshToken from "@/utils/RefreshToken";
import VueMarkdown from "vue-markdown-render";
import { ref, onMounted } from "vue";
import { useUploadStore } from "@/stores/upload";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
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
      Authorization: `JWT ${cookies.get("access_token")}`,
    },
    body: JSON.stringify({
      prompt: objData.value,
    }),
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.message === "Invalid token" || data.code === "token_not_valid") {
        const refresh: any = await RefreshToken();
        console.log(refresh);
        if (refresh.message === "Token refreshed") selectEvent(event);
        else alert("Please log in again");
      }
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

    <div class="gridContainer">
      <div class="grid">
        <div v-if="generation">
          <h2>Generated Text</h2>
          <VueMarkdown :source="generation" />
        </div>
        <!-- if no type is selected, show all types -->
        <div
          v-else-if="!selectedType && !generation"
          v-for="type in Object.keys(typeCounts)"
          :key="type"
          class="box cell is-col-span-2"
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

.gridContainer {
  display: flex;
  justify-content: center;
  width: 100%;
}
.grid {
  width: 100%;
}
</style>
