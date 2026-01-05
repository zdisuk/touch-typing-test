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
  const quote = ref("");
  async function load() {
    const response = await getQuote();
    const data = await response.json();
    quote.value = data.text;
  }

  const quoteLetters = ref<Map<number, Letter>>(new Map());
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

  const caret = ref<HTMLElement>();
  function setCaretPosition(letterId: number) {
    const letter: HTMLElement | null = document.getElementById(`${letterId}`);
    if (!letter || !caret.value) return;

    const { offsetHeight, offsetTop, offsetLeft } = letter;

    caret.value.style.height = offsetHeight + "px";
    caret.value.style.top = offsetTop + "px";
    caret.value.style.left = offsetLeft + "px";
  }

  return {
    quote,
    load,
    quoteLetters,
    splitQuote,
    caret,
    setCaretPosition,
  };
});
