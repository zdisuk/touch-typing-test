<script setup lang="ts">
import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const quoteStore = useQuoteStore();
const { prevInput } = storeToRefs(quoteStore);

function handleInput(event: InputEvent) {
  event.preventDefault();
  const target = event.target as HTMLInputElement;
  quoteStore.processInput(target.value);
}

const inputElement = ref<HTMLElement>();
onMounted(() => {
  inputElement.value?.focus();
});
</script>

<template>
  <input
    ref="inputElement"
    :value="prevInput"
    type="text"
    class="quote-input"
    @input="handleInput"
  />
</template>

<style scoped>
.quote-input {
  width: 100%;
  max-width: 800px;
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: #333;
}

.quote-input:focus {
  outline: none;
}
</style>
