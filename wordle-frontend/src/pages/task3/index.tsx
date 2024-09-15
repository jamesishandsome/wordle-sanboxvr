import { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import { useKeyPress } from 'ahooks'
import { LoseModal } from '../../components/loseModal.tsx'
import wordList from './answerlist.json'
const WORD_LENGTH = 5
const MAX_GUESSES = 1
const KEYBOARD_LETTERS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]
const COLOR_WRONG_POS = '#c9b458'
const COLOR_NOT_EXIST = '#787c7e'
const COLOR_CORRECT = '#6aaa64'
import { animate } from 'framer-motion'
import { WinModal } from '../../components/winModalTask3.tsx'
import init, {
    filter_wordlist,
} from './wasm/wasm-module/pkg'

const WordleGame3 = () => {
    const ref = useRef(null)
    const initialGuesses = Array.from(
        { length: MAX_GUESSES },
        () => Array.from({ length: WORD_LENGTH }, () => '')
    )
    const [started, setStarted] = useState(false)
    const [paused, setPaused] = useState(false)
    const [maxGuess, setMaxGuess] = useState(MAX_GUESSES)
    const [guesses, setGuesses] =
        useState<string[][]>(initialGuesses)
    const [word, setWord] = useState('')
    const [leftWordList, setLeftWordList] =
        useState(wordList)
    const [currentGuess, setCurrentGuess] = useState([0, 0])
    const [winOpen, setWinOpen] = useState(false)
    const [loseOpen, setLoseOpen] = useState(false)

    useEffect(() => {
        console.log('word', word)
    }, [word])
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
        setMaxGuess(MAX_GUESSES)
        setGuesses(initialGuesses)
        setCurrentGuess([0, 0])
        setLeftWordList(wordList)
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
        setWord('')
        setStarted(true)
    }

    const handleWin = () => {
        setStarted(false)
        setWinOpen(true)
    }

    // const handleLose = () => {
    //     setStarted(false)
    //     setLoseOpen(true)
    // }

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

        //TODO: if word is correct
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
        // won't lose
        // if (currentGuess[0] === maxGuess - 1) {
        //     handleLose()}
        else {
            // the word is not correct
            // correct:5, position:1, not exist:0
            const thisGuess = guesses[currentGuess[0]]
                .join('')
                .toUpperCase()
            // go through all left word list and generate a list that no such word in the list contains any letter in thisGuess
            init().then(() => {
                const noHitList = filter_wordlist(
                    thisGuess.toLowerCase(),
                    leftWordList
                )
                console.log('noHitList', noHitList)
                if (noHitList.length) {
                    setLeftWordList(noHitList)
                    const res = thisGuess
                        .split('')
                        .map((letter, index) => {
                            if (
                                noHitList[0]
                                    .toUpperCase()
                                    .includes(letter)
                            ) {
                                return noHitList[0].toUpperCase()[
                                    index
                                ] === letter
                                    ? 5
                                    : 1
                            } else {
                                return 0
                            }
                        })
                    const fiveBlocks =
                        document.querySelectorAll(
                            `#row${currentGuess[0]} div`
                        ) as NodeListOf<HTMLDivElement>

                    res.map((item, index) => {
                        if (item === 5) {
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
                        if (item === 0) {
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
                    setMaxGuess(maxGuess + 1)
                    setGuesses([
                        ...guesses,
                        new Array(WORD_LENGTH).fill(''),
                    ])

                    setCurrentGuess([
                        currentGuess[0] + 1,
                        0,
                    ])
                } else {
                    // if there is no nohitlist, use leftWordList logic 1: each exact match letter counts 2 point and each contains letter counts 1 point. sort the list and retur
                    const scoreList = leftWordList.map(
                        (word) => {
                            //     compare thisGuess and word
                            const res = thisGuess
                                .split('')
                                .map((letter, index) => {
                                    if (
                                        word
                                            .toUpperCase()
                                            .includes(
                                                letter
                                            )
                                    ) {
                                        return word.toUpperCase()[
                                            index
                                        ] === letter
                                            ? 5
                                            : 1
                                    } else {
                                        return 0
                                    }
                                })
                            return {
                                word,
                                score: res,
                            }
                        }
                    )
                    console.log('scoreList', scoreList)
                    // in scoreList, group them according to score
                    const groupedScoreList: {} =
                        scoreList.reduce((acc, cur) => {
                            const key = cur.score.join('')
                            if (!acc[key]) {
                                acc[key] = []
                            }
                            acc[key].push(cur.word)
                            return acc
                        }, {})
                    console.log(
                        'groupedScoreList',
                        groupedScoreList
                    )
                    // find the lowest score and return the first pair
                    // '44444' is 20 and '55555' is 25 so '44444' is the lowest
                    const lowestScore = Object.keys(
                        groupedScoreList
                    ).sort(
                        (a, b) =>
                            a
                                .split('')
                                .reduce((acc, cur) => {
                                    return (
                                        acc + parseInt(cur)
                                    )
                                }, 0) -
                            b
                                .split('')
                                .reduce((acc, cur) => {
                                    return (
                                        acc + parseInt(cur)
                                    )
                                }, 0)
                    )
                    // groupedScoreList['44444']
                    const chosenList =
                        groupedScoreList[lowestScore[0]]
                    console.log(chosenList)
                    setLeftWordList(chosenList)
                    if (chosenList.length === 1) {
                        setWord(chosenList[0].toUpperCase())
                    }
                    const res = thisGuess
                        .split('')
                        .map((letter, index) => {
                            if (
                                chosenList[0]
                                    .toUpperCase()
                                    .includes(letter)
                            ) {
                                return chosenList[0].toUpperCase()[
                                    index
                                ] === letter
                                    ? 0
                                    : 1
                            } else {
                                return 2
                            }
                        })
                    const fiveBlocks =
                        document.querySelectorAll(
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
                    setMaxGuess(maxGuess + 1)
                    setGuesses([
                        ...guesses,
                        new Array(WORD_LENGTH).fill(''),
                    ])

                    setCurrentGuess([
                        currentGuess[0] + 1,
                        0,
                    ])
                }
            })
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
        <div className="flex flex-col items-center justify-center min-h-full h-fit w-full bg-gray-100 overflow-auto">
            <LoseModal
                open={loseOpen}
                setOpen={setLoseOpen}
                word={word}
            />
            <WinModal
                open={winOpen}
                setOpen={setWinOpen}
                word={word}
                times={maxGuess}
            />
            <h1 className="text-4xl font-bold mb-8 text-black">
                Wordle Task3
            </h1>
            <div
                ref={ref}
                className="grid grid-rows gap-1 mb-8 h-fit"
            >
                {Array.from({ length: maxGuess }).map(
                    (_, index) => (
                        <div
                            key={index}
                            id={`row${index}`}
                            className="flex gap-1 h-fit"
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

export { WordleGame3 }
