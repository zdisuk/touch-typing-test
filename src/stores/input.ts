import { defineStore } from "pinia";
import { ref } from "vue";

export const useInputStore = defineStore("inputStore", () => {
  const lastEnteredId = ref<number | null>(null);
  function setLastEnteredId(newId: number) {
    lastEnteredId.value = newId;
  }

  return {
    lastEnteredId,
    setLastEnteredId,
  };
});
