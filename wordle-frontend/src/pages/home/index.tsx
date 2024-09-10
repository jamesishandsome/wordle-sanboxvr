"use client";

import { useState, useEffect } from "react";
import { Button, ButtonGroup } from "@nextui-org/react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const KEYBOARD_LETTERS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const TARGET_WORD = "REACT"; // In a real game, this would be randomly selected

const WordleGame = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_GUESSES).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (currentGuess === TARGET_WORD) {
      setGameOver(true);
    } else if (currentGuessIndex === MAX_GUESSES) {
      setGameOver(true);
    }
  }, [currentGuess, currentGuessIndex]);

  const handleKeyPress = (letter: string) => {
    if (gameOver) return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (
      currentGuess.length === WORD_LENGTH &&
      currentGuessIndex < MAX_GUESSES
    ) {
      const newGuesses = [...guesses];
      newGuesses[currentGuessIndex] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuessIndex((prev) => prev + 1);
      setCurrentGuess("");
    }
  };

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (TARGET_WORD[index] === letter) {
      return "bg-green-500";
    } else if (TARGET_WORD.includes(letter)) {
      return "bg-yellow-500";
    } else {
      return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Wordle</h1>
      <div className="grid grid-rows-6 gap-1 mb-8">
        {guesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="grid grid-cols-5 gap-1">
            {Array.from({ length: WORD_LENGTH }).map((_, letterIndex) => {
              const letter = guess[letterIndex] || "";
              const color =
                guessIndex < currentGuessIndex
                  ? getLetterColor(letter, letterIndex, guess)
                  : "bg-white";
              return (
                <div
                  key={letterIndex}
                  className={`w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold ${color}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-3 gap-1 mb-4">
        {KEYBOARD_LETTERS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((letter) => (
              <Button
                key={letter}
                onClick={() => handleKeyPress(letter)}
                className="w-10 h-10 text-lg font-semibold"
              >
                {letter}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDelete} className="px-4 py-2">
          Delete
        </Button>
        <Button onClick={handleSubmit} className="px-4 py-2">
          Submit
        </Button>
      </div>
      {gameOver && (
        <div className="mt-8 text-2xl font-bold">
          {currentGuess === TARGET_WORD
            ? "You won!"
            : `Game Over! The word was ${TARGET_WORD}`}
        </div>
      )}
    </div>
  );
};

export { WordleGame };
