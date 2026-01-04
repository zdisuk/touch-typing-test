<script setup lang="ts">
import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const quoteStore = useQuoteStore();
const { input } = storeToRefs(quoteStore);

function handleQuoteInput(event: Event) {
  const target = event.target as HTMLInputElement;
  quoteStore.setInput(target.value);
}

const quoteInput = ref<HTMLInputElement>();
onMounted(() => {
  quoteInput.value?.focus();
});
</script>

<template>
  <input
    ref="quoteInput"
    type="text"
    class="quote-input"
    :value="input"
    @input="handleQuoteInput"
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
