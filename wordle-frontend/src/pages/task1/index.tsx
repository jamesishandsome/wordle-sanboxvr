import { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import { useKeyPress } from 'ahooks'
import { LoseModal } from '../../components/loseModal.tsx'
import wordList from './wordle.json'
import answerList from './answerlist.json'
const WORD_LENGTH = 5
const MAX_GUESSES = 6
const KEYBOARD_LETTERS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]
const COLOR_WRONG_POS = '#c9b458'
const COLOR_NOT_EXIST = '#787c7e'
const COLOR_CORRECT = '#6aaa64'
import { animate } from 'framer-motion'

const WordleGame = () => {
    const ref = useRef(null)
    const initialGuesses = Array.from(
        { length: MAX_GUESSES },
        () => Array.from({ length: WORD_LENGTH }, () => '')
    )
    const [started, setStarted] = useState(false)
    const [paused, setPaused] = useState(false)
    const [guesses, setGuesses] =
        useState<string[][]>(initialGuesses)
    const [word, setWord] = useState('')
    const [currentGuess, setCurrentGuess] = useState([0, 0])
    const [winOpen, setWinOpen] = useState(false)
    const [loseOpen, setLoseOpen] = useState(false)

    const shake = async (index: string) => {
        // span under row0
        setPaused(true)
        // after 1 second
        setTimeout(() => {
            setPaused(false)
        }, 600)
        // animate(`#row${index} span`, { color: 'red', duration: 0 })
        document
            .querySelectorAll(`#row${index} span`)
            .forEach((span) => {
                //     add classname text-red-400
                span.classList.add('text-red-400')
            })
        await animate(
            `#row${index} span`,
            { x: [0, -100, 100, -100, 100, -100, 100, 0] },
            {
                type: 'keyframes',
                duration: 0.6,
            }
        )
        document
            .querySelectorAll(`#row${index} span`)
            .forEach((span) => {
                //     remove classname text-red-400
                span.classList.remove('text-red-400')
            })
        // animate(`#row${index} span`, { color: 'black', duration: 0 })
    }
    const initGame = () => {
        setGuesses(initialGuesses)
        setCurrentGuess([0, 0])
        // set all background color to white
        document
            .querySelectorAll('div[id^=row] div')
            .forEach((block) => {
                const divBlock = block as HTMLDivElement
                animate(
                    divBlock,
                    {
                        backgroundColor: '#FFF',
                        color: '#000000',
                    },
                    { duration: 0 }
                )
            })
        // randomly get one ward from answerlist
        const randomWord =
            answerList[
                Math.floor(Math.random() * 2306)
            ].toUpperCase()
        setWord(randomWord)
        setStarted(true)
    }

    const handleWin = () => {
        setStarted(false)
        setWinOpen(true)
    }

    const handleLose = () => {
        setStarted(false)
        setLoseOpen(true)
    }

    const handleKeyPress = (letter: string) => {
        if (!started) {
            return
        }
        if (paused) {
            return
        }
        if (currentGuess[1] < WORD_LENGTH) {
            const newGuesses = [...guesses]
            newGuesses[currentGuess[0]][currentGuess[1]] =
                letter
            setGuesses(newGuesses)
            setCurrentGuess((prev) => [
                prev[0],
                prev[1] + 1,
            ])
        }
    }

    const handleDelete = () => {
        if (!started) {
            return
        }
        if (paused) {
            return
        }
        if (currentGuess[1] === 0) {
            return
        }
        const newGuesses = [...guesses]
        newGuesses[currentGuess[0]][currentGuess[1] - 1] =
            ''
        setGuesses(newGuesses)
        setCurrentGuess((prev) => [
            prev[0],
            Math.max(prev[1] - 1, 0),
        ])
    }

    const handleSubmit = async () => {
        if (!started) {
            return
        }
        if (paused) {
            return
        }
        if (currentGuess[1] !== WORD_LENGTH) {
            return
        }
        //TODO: check if word is valid
        console.log(guesses[currentGuess[0]].join(''))
        const valid = wordList.find(
            (word) =>
                word ===
                guesses[currentGuess[0]]
                    .join('')
                    .toLowerCase()
        )
        if (!valid) {
            await shake(currentGuess[0].toString())
            return
        }

        //TODO: check if word is correct
        if (
            guesses[currentGuess[0]]
                .join('')
                .toUpperCase() === word
        ) {
            const fiveBlocks = document.querySelectorAll(
                `#row${currentGuess[0]} div`
            ) as NodeListOf<HTMLDivElement>
            fiveBlocks.forEach((block) => {
                // block.style.backgroundColor = COLOR_CORRECT
                animate(block, {
                    backgroundColor: COLOR_CORRECT,
                    color: '#FFF',
                })
            })
            handleWin()
            return
        }
        if (currentGuess[0] === MAX_GUESSES - 1) {
            alert('Game Over')
            handleLose()
        } else {
            // the word is not correct
            const thisGuess = guesses[currentGuess[0]]
                .join('')
                .toUpperCase()
            // correct:0, position:1, not exist:2
            const res = thisGuess
                .split('')
                .map((letter, index) => {
                    if (word.includes(letter)) {
                        return word[index] === letter
                            ? 0
                            : 1
                    } else {
                        return 2
                    }
                })
            const fiveBlocks = document.querySelectorAll(
                `#row${currentGuess[0]} div`
            ) as NodeListOf<HTMLDivElement>

            res.map((item, index) => {
                if (item === 0) {
                    // fiveBlocks[index].style.backgroundColor = COLOR_CORRECT
                    animate(fiveBlocks[index], {
                        backgroundColor: [
                            '#FFF',
                            COLOR_CORRECT,
                        ],
                        color: '#FFF',
                    })
                }
                if (item === 1) {
                    // fiveBlocks[index].style.backgroundColor = COLOR_WRONG_POS
                    animate(fiveBlocks[index], {
                        backgroundColor: [
                            '#FFF',
                            COLOR_WRONG_POS,
                        ],
                        color: '#FFF',
                    })
                }
                if (item === 2) {
                    // fiveBlocks[index].style.backgroundColor = COLOR_NOT_EXIST
                    animate(fiveBlocks[index], {
                        backgroundColor: [
                            '#FFF',
                            COLOR_NOT_EXIST,
                        ],
                        color: '#FFF',
                    })
                }
            })

            setCurrentGuess([currentGuess[0] + 1, 0])
        }
    }

    useKeyPress(KEYBOARD_LETTERS.flat(), (event) => {
        handleKeyPress(event.key.toUpperCase())
    })

    // backspace
    useKeyPress('Backspace', handleDelete)

    // enter
    useKeyPress('Enter', handleSubmit)

    useEffect(() => {
        initGame()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
            <LoseModal
                open={loseOpen}
                setOpen={setLoseOpen}
                word={word}
            />
            <h1 className="text-4xl font-bold mb-8 text-black">
                Wordle
            </h1>
            <div
                ref={ref}
                className="grid grid-rows-6 gap-1 mb-8"
            >
                {Array.from({ length: MAX_GUESSES }).map(
                    (_, index) => (
                        <div
                            key={index}
                            id={`row${index}`}
                            className="flex gap-1"
                        >
                            {Array.from({
                                length: WORD_LENGTH,
                            }).map((_, index1) => (
                                <div
                                    key={index1}
                                    id={`guess-${index}`}
                                    className={`w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded-md text-black`}
                                >
                                    <Transition
                                        show={
                                            guesses[index][
                                                index1
                                            ] !== ''
                                        }
                                    >
                                        <span
                                            className={
                                                'transition duration-300 ease-in data-[closed]:opacity-0'
                                            }
                                        >
                                            {
                                                guesses[
                                                    index
                                                ][index1]
                                            }
                                        </span>
                                    </Transition>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
            <div className="grid grid-rows-3 gap-1 mb-4">
                {KEYBOARD_LETTERS.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex justify-center gap-1"
                    >
                        {row.map((letter) => (
                            <div
                                key={letter}
                                data-key={letter}
                                onClick={() => {
                                    handleKeyPress(letter)
                                }}
                                className="w-14 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black"
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <div
                    className="w-20 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black"
                    onClick={handleDelete}
                >
                    Delete
                </div>
                <div
                    className="w-20 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black"
                    onClick={handleSubmit}
                >
                    Submit
                </div>
                <div
                    className={
                        'w-20 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black'
                    }
                    onClick={initGame}
                >
                    Restart
                </div>
            </div>
        </div>
    )
}

export { WordleGame }
