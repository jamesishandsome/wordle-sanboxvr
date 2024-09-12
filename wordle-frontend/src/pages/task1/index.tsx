import { useEffect, useRef, useState } from 'react'
import { Button } from '@nextui-org/react'
import { Transition } from '@headlessui/react'
import { useKeyPress } from 'ahooks'
import wordList from './wordle.json'
const WORD_LENGTH = 5
const MAX_GUESSES = 6
const ANSWER = 'HELLO'
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
    const initialGuesses = Array.from({ length: MAX_GUESSES }, () =>
        Array.from({ length: WORD_LENGTH }, () => '')
    )
    const [started, setStarted] = useState(false)
    const [paused, setPaused] = useState(false)
    const [guesses, setGuesses] = useState<string[][]>(initialGuesses)
    const [word, setWord] = useState(ANSWER)
    const [currentGuess, setCurrentGuess] = useState([0, 0])

    const shake = async (index: string) => {
        // span under row0
        setPaused(true)
        // after 1 second
        setTimeout(() => {
            setPaused(false)
        }, 600)
        // animate(`#row${index} span`, { color: 'red', duration: 0 })
        document.querySelectorAll(`#row${index} span`).forEach((span) => {
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
        document.querySelectorAll(`#row${index} span`).forEach((span) => {
            //     remove classname text-red-400
            span.classList.remove('text-red-400')
        })
        // animate(`#row${index} span`, { color: 'black', duration: 0 })
    }
    const initGame = () => {
        setGuesses(initialGuesses)
        setCurrentGuess([0, 0])
        // set all background color to white
        document.querySelectorAll('div[id^=row] div').forEach((block) => {
            const divBlock = block as HTMLDivElement
            divBlock.style.backgroundColor = 'white'
            divBlock.style.color = 'black'
        })
        setWord(ANSWER)
        setStarted(true)
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
            newGuesses[currentGuess[0]][currentGuess[1]] = letter
            setGuesses(newGuesses)
            setCurrentGuess((prev) => [prev[0], prev[1] + 1])
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
        newGuesses[currentGuess[0]][currentGuess[1] - 1] = ''
        setGuesses(newGuesses)
        setCurrentGuess((prev) => [prev[0], Math.max(prev[1] - 1, 0)])
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
            (word) => word === guesses[currentGuess[0]].join('').toLowerCase()
        )
        if (!valid) {
            await shake(currentGuess[0].toString())
            return
        }

        //TODO: check if word is correct
        if (guesses[currentGuess[0]].join('').toUpperCase() === word) {
            const fiveBlocks = document.querySelectorAll(
                `#row${currentGuess[0]} div`
            ) as NodeListOf<HTMLDivElement>
            fiveBlocks.forEach((block) => {
                // block.style.backgroundColor = COLOR_CORRECT
                animate(block, {
                    backgroundColor: COLOR_CORRECT,
                    color: 'white',
                })
            })
            return
        }
        if (currentGuess[0] === MAX_GUESSES - 1) {
            alert('Game Over')
        } else {
            // the word is not correct
            const thisGuess = guesses[currentGuess[0]].join('').toUpperCase()
            // correct:0, position:1, not exist:2
            const res = thisGuess.split('').map((letter, index) => {
                if (word.includes(letter)) {
                    return word[index] === letter ? 0 : 1
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
                        backgroundColor: COLOR_CORRECT,
                        color: 'white',
                    })
                }
                if (item === 1) {
                    // fiveBlocks[index].style.backgroundColor = COLOR_WRONG_POS
                    animate(fiveBlocks[index], {
                        backgroundColor: COLOR_WRONG_POS,
                        color: 'white',
                    })
                }
                if (item === 2) {
                    // fiveBlocks[index].style.backgroundColor = COLOR_NOT_EXIST
                    animate(fiveBlocks[index], {
                        backgroundColor: COLOR_NOT_EXIST,
                        color: 'white',
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
            <h1 className="text-4xl font-bold mb-8 text-black">Wordle</h1>
            <div ref={ref} className="grid grid-rows-6 gap-1 mb-8">
                {Array.from({ length: MAX_GUESSES }).map((_, index) => (
                    <div key={index} id={`row${index}`} className="flex gap-1">
                        {Array.from({ length: WORD_LENGTH }).map(
                            (_, index1) => (
                                <div
                                    key={index1}
                                    id={`guess-${index}`}
                                    className={`w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded-md text-black`}
                                >
                                    <Transition
                                        show={guesses[index][index1] !== ''}
                                    >
                                        <span
                                            className={
                                                'transition duration-300 ease-in data-[closed]:opacity-0'
                                            }
                                        >
                                            {guesses[index][index1]}
                                        </span>
                                    </Transition>
                                </div>
                            )
                        )}
                    </div>
                ))}
            </div>
            <div className="grid grid-rows-3 gap-1 mb-4">
                {KEYBOARD_LETTERS.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map((letter) => (
                            <Button
                                key={letter}
                                onPress={() => handleKeyPress(letter)}
                                className="w-10 h-10 text-lg font-semibold"
                            >
                                {letter}
                            </Button>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Button className="px-4 py-2" onPress={handleDelete}>
                    Delete
                </Button>
                <Button className="px-4 py-2" onPress={handleSubmit}>
                    Submit
                </Button>
                <Button className={'px-4 py-2'} onPress={initGame}>
                    Restart
                </Button>
            </div>
        </div>
    )
}

export { WordleGame }
