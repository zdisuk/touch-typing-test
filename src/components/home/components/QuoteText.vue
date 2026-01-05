<script setup lang="ts">
import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";

const quoteStore = useQuoteStore();
const { quoteLetters, caret } = storeToRefs(quoteStore);

function letterClass(letter) {
  if (letter.typed === false) return;

  return letter.correct ? "correct" : "wrong";
}
</script>

<template>
  <div class="quote-container">
    <span
      v-for="[id, letter] in quoteLetters"
      :id="`${id}`"
      :key="id"
      class="quote-letter"
      :class="letterClass(letter)"
      >{{ letter.letter }}
    </span>
    <div ref="caret" class="caret" />
  </div>
</template>

<style scoped>
.quote-container {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #333;
  position: relative;
}

.quote-letter {
  font-size: 1.3rem;
  color: rgb(255, 242, 219);
}

.caret {
  position: absolute;
  width: 2px;
  background-color: paleturquoise;
}

.correct {
  color: #69ca6c;
}

.wrong {
  background-color: #f44336;
}
</style>
