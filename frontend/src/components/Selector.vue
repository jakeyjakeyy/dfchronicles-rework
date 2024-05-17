<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUploadStore } from "@/stores/upload";
const uploadStore = useUploadStore();
let typeCounts: Record<string, number> = {};
const selectedType = ref<string | null>(null);

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
  console.log(typeCounts);
};
onMounted(countTypes);
function selectType(type: any) {
  selectedType.value = String(type);
}
</script>

<template>
  <div>
    <h1>{{ uploadStore.legendsplusxml.df_world.name }}</h1>
    <h2>{{ uploadStore.legendsplusxml.df_world.altname }}</h2>

    <div class="grid">
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
          <div v-if="collection.type === selectedType">
            <h3>{{ collection.name ? collection.name : "Unnamed Event" }}</h3>
            <p>{{ collection.description }}</p>
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