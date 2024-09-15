import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { Transition } from '@headlessui/react'
import {
    useKeyPress,
    useLatest,
    useLocalStorageState,
} from 'ahooks'
import { LoseModal } from '../../components/loseModal.tsx'
import { io } from 'socket.io-client'
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
const ROOM_ID = '12345'
import { animate } from 'framer-motion'
import { WinModal } from '../../components/winModal.tsx'
import { Button } from '@nextui-org/react'
import { WaitingConnectionModal } from './components/waitingConnection.tsx'
import { StartGameModal } from './components/startGameModal.tsx'
// import { StartGameModal } from './components/startGameModal.tsx'

const WordleGameTask4 = () => {
    const ref = useRef(null)
    const initialGuesses = Array.from(
        { length: MAX_GUESSES },
        () => Array.from({ length: WORD_LENGTH }, () => '')
    )
    const enemyInitialGuesses = Array.from(
        { length: MAX_GUESSES },
        () => Array.from({ length: WORD_LENGTH }, () => '')
    )
    const [started, setStarted] = useState(false)
    const [paused, setPaused] = useState(false)
    const [guesses, setGuesses] =
        useState<string[][]>(initialGuesses)
    const [word, setWord] = useState('')
    const [currentGuess, setCurrentGuess] = useState([0, 0])
    const [enemyGuesses, setEnemyGuesses] = useState<
        string[][]
    >(enemyInitialGuesses)
    const [enemyCurrentGuess, setEnemyCurrentGuess] =
        useState([0, 0])

    const latestEnemyGuesses = useLatest(enemyGuesses)
    const latestEnemyCurrentGuess = useLatest(
        enemyCurrentGuess
    )
    const [yourTurn, setYourTurn] = useState(false)
    const [bothConnected, setBothConnected] = useState(true)
    const [gameStart, setGameStart] = useState(false)

    const [winOpen, setWinOpen] = useState(false)
    const [loseOpen, setLoseOpen] = useState(false)
    const [userId, setUserId] = useLocalStorageState(
        'userId',
        { defaultValue: '' }
    )

    // websocket
    const socket = io(import.meta.env.VITE_TASK_WS_URL)
    const [isConnected, setIsConnected] = useState(
        socket.connected
    )

    useEffect(() => {
        if (isConnected) {
            console.log('connected')
        } else {
            console.log('disconnected')
        }
    }, [isConnected])
    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
        }
    }, [])

    useEffect(() => {
        console.log(enemyGuesses, enemyCurrentGuess)
    }, [enemyCurrentGuess, enemyGuesses])

    useLayoutEffect(() => {
        if (!userId) {
            const id =
                Math.random()
                    .toString(36)
                    .substring(2, 15) +
                Math.random().toString(36).substring(2, 15)
            setUserId(id)
        }
        console.log('userId', userId)
    }, [setUserId, userId])

    useEffect(() => {
        //     when receiving from io
        socket.on(
            'startGame',
            async (wordIndex: number) => {
                const thisWord = wordList[wordIndex]
                console.log(thisWord)
                setWord(thisWord.toUpperCase())
                setBothConnected(true)
                sendWhoFirst()
            }
        )
        socket.on(
            'whoFirst',
            async (firstUserId: string) => {
                if (firstUserId === userId) {
                    setYourTurn(true)
                } else {
                    setYourTurn(false)
                }
                setStarted(true)
                setGameStart(true)
            }
        )

        socket.on('action', async (data: any) => {
            console.log('receive data', data)
            // TODO: if it is not your userId, which means it's your enemy's then show it on your enemy's board
            if (data.userId !== userId) {
                const thisGuess = data.word
                const thisGuessArray = thisGuess.split('')
                const res = data.res

                const fiveBlocks =
                    document.querySelectorAll(
                        `#enemyRow${latestEnemyCurrentGuess.current[0]} div`
                    ) as NodeListOf<HTMLDivElement>

                res.map((item: number, index: number) => {
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

                console.log(
                    'current',
                    latestEnemyCurrentGuess.current[0]
                )
                setEnemyCurrentGuess([
                    latestEnemyCurrentGuess.current[0] + 1,
                    0,
                ])
                setEnemyGuesses(
                    latestEnemyGuesses.current.map(
                        (guess, index) => {
                            if (
                                index ===
                                latestEnemyCurrentGuess
                                    .current[0]
                            ) {
                                return thisGuessArray
                            } else {
                                return guess
                            }
                        }
                    )
                )
                setYourTurn(true)

                console.log(latestEnemyCurrentGuess.current)
                console.log(latestEnemyGuesses)
            }
        })
    }, [socket, userId])

    const sendWhoFirst = () => {
        socket.emit('whoFirst', { roomId: ROOM_ID, userId })
    }
    const sendUserId = () => {
        socket.emit('createRoom', ROOM_ID)
        setBothConnected(false)
    }

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
        if (!yourTurn) {
            console.log('not your turn')
            return
        }
        if (!started) {
            console.log('game not started')
            return
        }
        if (paused) {
            console.log('game paused')
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
        if (!yourTurn) {
            return
        }
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

    const handleSendAction = async (
        thisGuess: string,
        res: number[]
    ) => {
        const action = {
            userId: userId,
            action: 'send',
            word: thisGuess,
            res: res,
            roomId: ROOM_ID,
        }
        socket.emit('action', action)
    }

    const handleSubmit = async () => {
        if (!yourTurn) {
            return
        }
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
        setYourTurn(false)

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
            await handleSendAction(thisGuess, res)
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
            <div className="w-full flex justify-between px-10">
                <div className="basis-1/2 mr-4 flex flex-col items-center">
                    <Button
                        className={'fixed top-20 right-10'}
                        disabled={started}
                        onClick={sendUserId}
                    >
                        Start
                    </Button>
                    {/*<StartGameModal />*/}
                    <LoseModal
                        open={loseOpen}
                        setOpen={setLoseOpen}
                        word={word}
                    />
                    <WinModal
                        open={winOpen}
                        setOpen={setWinOpen}
                        word={word}
                    />
                    <WaitingConnectionModal
                        open={!bothConnected}
                        setOpen={setBothConnected}
                    />
                    <StartGameModal
                        open={gameStart}
                        setOpen={setGameStart}
                    />

                    <h1 className="text-4xl font-bold mb-8 text-black">
                        Your Game
                    </h1>
                    {/* 玩家的游戏界面 */}
                    <div
                        ref={ref}
                        className="grid grid-rows-6 gap-1 mb-8"
                    >
                        {Array.from({
                            length: MAX_GUESSES,
                        }).map((_, index) => (
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
                                                guesses[
                                                    index
                                                ][
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
                                                    ][
                                                        index1
                                                    ]
                                                }
                                            </span>
                                        </Transition>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-rows-3 gap-1 mb-4">
                        {KEYBOARD_LETTERS.map(
                            (row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex justify-center gap-1"
                                >
                                    {row.map((letter) => (
                                        <div
                                            key={letter}
                                            data-key={
                                                letter
                                            }
                                            onClick={() =>
                                                handleKeyPress(
                                                    letter
                                                )
                                            }
                                            className="w-14 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black"
                                        >
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
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
                            className="w-20 h-10 text-lg font-semibold flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out text-black"
                            onClick={initGame}
                        >
                            Restart
                        </div>
                    </div>
                </div>

                <div className="basis-1/2 mr-4 flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-8 text-black">
                        Enemy's Game
                    </h1>
                    {/* 敌人的游戏界面 */}
                    <div className="grid grid-rows-6 gap-1 mb-8">
                        {Array.from({
                            length: MAX_GUESSES,
                        }).map((_, index) => (
                            <div
                                key={index}
                                id={`enemyRow${index}`}
                                className="flex gap-1"
                            >
                                {Array.from({
                                    length: WORD_LENGTH,
                                }).map((_, index1) => (
                                    <div
                                        key={index1}
                                        id={`enemyGuess-${index}`}
                                        className={`w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded-md text-black`}
                                    >
                                        {
                                            enemyGuesses[
                                                index
                                            ][index1]
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { WordleGameTask4 }
