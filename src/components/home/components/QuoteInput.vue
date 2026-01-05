<script setup lang="ts">
import { useInputStore } from "@/stores/input";
import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const inputStore = useInputStore();
const { lastEnteredId } = storeToRefs(inputStore);

const quoteStore = useQuoteStore();
const { quoteLetters } = storeToRefs(quoteStore);

function handleInputEnter(inputValue: string, letterId: number) {
  const current = quoteLetters.value.get(letterId);
  const previous = quoteLetters.value.get(letterId - 1);
  const entered = inputValue.charAt(letterId - 1);

  if (!current || !entered) return;

  current.typed = true;
  if (previous && !previous.correct) {
    current.correct = false;
    return;
  }

  current.correct = current.letter === entered;
}

function handleInputDelete(letterId: number) {
  if (lastEnteredId.value && lastEnteredId.value > letterId) {
    for (let i = letterId + 1; i < lastEnteredId.value + 1; i++) {
      const deletedLetter = quoteLetters.value.get(i);
      if (!deletedLetter) return;

      deletedLetter.correct = false;
      deletedLetter.typed = false;
    }

    inputStore.setLastEnteredId(letterId);
    return;
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const letterId = target.value.length;

  handleInputEnter(target.value, letterId);
  handleInputDelete(letterId);

  inputStore.setLastEnteredId(letterId);
  quoteStore.setCaretPosition(letterId + 1);
}

const inputElement = ref<HTMLInputElement>();
onMounted(() => {
  inputElement.value?.focus();
});
</script>

<template>
  <input
    ref="quoteInput"
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
