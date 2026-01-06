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

  const quoteLetters = ref<Array<Letter>>([]);
  function splitQuote(quoteText: string) {
    quoteText.split("").forEach((letter, index) => {
      quoteLetters.value.push({
        letter: letter,
        typed: false,
        id: index,
        correct: false,
      });
    });
  }
  function setLetterState<T extends keyof Letter>(
    letter: Letter,
    key: T,
    value: Letter[T],
  ) {
    const letterToUpdate = quoteLetters.value[letter.id];
    if (!letterToUpdate) return;
    letterToUpdate[key] = value;
  }

  const caret = ref<HTMLElement>();
  function calculateCaretPosition() {
    const letter: HTMLElement | null = document.getElementById(
      `${caretPosition.value}`,
    );
    if (!letter || !caret.value) return;
    const { offsetHeight, offsetTop, offsetLeft } = letter;
    caret.value.style.height = offsetHeight + "px";
    caret.value.style.top = offsetTop + "px";
    caret.value.style.left = offsetLeft + "px";
  }

  const caretPosition = ref<Letter["id"]>(0);
  function setCaretPosition(letterId: number) {
    caretPosition.value = letterId;
    calculateCaretPosition();
  }

  function moveCaretForward() {
    caretPosition.value++;
    calculateCaretPosition();
  }

  const prevInput = ref("");
  function processInput(currentInput: string) {
    if (currentInput.length > prevInput.value.length) {
      handleInsert(currentInput);
    } else {
      handleDelete(currentInput);
    }
  }
  function handleInsert(currentInput: string) {
    const enteredLetter = currentInput.charAt(currentInput.length - 1);
    const current = quoteLetters.value[caretPosition.value];
    const previous = quoteLetters.value[caretPosition.value - 1];
    if (!current) return;
    setLetterState(current, "typed", true);
    if (previous && !previous.correct) {
      setLetterState(current, "correct", false);
    } else {
      setLetterState(current, "correct", enteredLetter === current.letter);
    }
    if (
      previous &&
      previous.correct &&
      current.letter === " " &&
      current.correct
    ) {
      prevInput.value = "";
    } else {
      prevInput.value = currentInput;
    }
    moveCaretForward();
  }

  function handleDelete(currentInput: string) {
    const lengthDifference = prevInput.value.length - currentInput.length;
    const positionToMove = caretPosition.value - lengthDifference;
    resetLettersInRange(positionToMove, caretPosition.value);
    setCaretPosition(positionToMove);
    prevInput.value = currentInput;
  }

  function resetLettersInRange(from: number, to: number) {
    for (let i = from; i <= to; i++) {
      const letter = quoteLetters.value[i];
      if (!letter) continue;
      setLetterState(letter, "typed", false);
      setLetterState(letter, "correct", false);
    }
  }

  return {
    quote,
    load,
    quoteLetters,
    splitQuote,
    caret,
    caretPosition,
    setCaretPosition,
    moveCaretForward,
    processInput,
    prevInput,
  };
});
