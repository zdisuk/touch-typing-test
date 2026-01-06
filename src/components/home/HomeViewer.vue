<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import QuoteText from "./components/QuoteText.vue";
import QuoteInput from "./components/QuoteInput.vue";

import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";

const quoteStore = useQuoteStore();
const { quote } = storeToRefs(quoteStore);

async function initQuote() {
  await quoteStore.load();
  quoteStore.splitQuote(quote.value);
  nextTick(() => {
    quoteStore.setCaretPosition(0);
  });
}

onMounted(() => {
  initQuote();
});
</script>

<template>
  <div class="page-container">
    <QuoteText />
    <QuoteInput />
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
