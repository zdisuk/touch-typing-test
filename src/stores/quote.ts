import { getQuote } from "@/services/quotes";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Letter {
  id: number;
  letter: string;
  typed: boolean;
  correct: boolean;
}

export const useQuoteStore = defineStore("quoteStore", () => {
  const input = ref("");
  const lastEnteredId = ref<number | null>(null);
  const quote = ref("");
  const quoteLetters = ref<Map<number, Letter>>(new Map());

  function setInput(newInput: string) {
    input.value = newInput;
  }

  function setLastEnteredId(newId: number) {
    lastEnteredId.value = newId;
  }

  function splitQuote(quoteText: string) {
    quoteText.split("").forEach((letter, index) => {
      quoteLetters.value.set(index + 1, {
        letter: letter,
        typed: false,
        id: index + 1,
        correct: false,
      });
    });
  }

  async function load() {
    const response = await getQuote();
    const data = await response.json();
    quote.value = data.text;
  }

  return {
    quoteLetters,
    splitQuote,
    input,
    setInput,
    lastEnteredId,
    setLastEnteredId,
    load,
    quote,
  };
});
