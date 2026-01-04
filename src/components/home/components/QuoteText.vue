<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { useQuoteStore } from "@/stores/quote";
import { storeToRefs } from "pinia";

const quoteStore = useQuoteStore();
const { input, quoteLetters, lastEnteredId } = storeToRefs(quoteStore);

const carret = ref<HTMLElement>(null as unknown as HTMLElement);

watch(
  quoteLetters,
  () => {
    nextTick(() => {
      calculateCarretPosition(1);
    });
  },
  { once: true, deep: true },
);

function calculateCarretPosition(letterId: number) {
  const letter: HTMLElement | null = document.getElementById(`${letterId}`);
  if (!letter) return;

  carret.value.style.height = letter.offsetHeight + "px";
  carret.value.style.top = letter.offsetTop + "px";
  carret.value.style.left = letter.offsetLeft + "px";
}

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

    quoteStore.setLastEnteredId(letterId);
    return;
  }
}

watch(input, inputValue => {
  const letterId = inputValue.length;

  handleInputEnter(inputValue, letterId);
  handleInputDelete(letterId);

  calculateCarretPosition(letterId + 1);
  quoteStore.setLastEnteredId(letterId);
});

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
    <div ref="carret" class="carret" />
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

.carret {
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
