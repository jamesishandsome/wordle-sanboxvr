import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)

    const letterVariants = {
        initial: { opacity: 0, y: 50 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: 'spring',
                stiffness: 120,
            },
        }),
    }

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
    }

    return (
        <div className="h-screen mt-[-64px] bg-gradient-to-b from-primary to-primary-foreground flex flex-col items-center justify-center">
            <motion.h1
                className="text-4xl md:text-6xl font-bold text-primary-foreground mb-8"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Wordle
            </motion.h1>

            <motion.p
                className="text-lg md:text-xl text-primary-foreground text-center mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Guess the hidden word in 6 tries. Each guess
                must be a valid 5-letter word.
            </motion.p>

            <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
            >
                <Button
                    size="lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => {
                        navigate('/task1')
                    }}
                >
                    Start Game
                </Button>
            </motion.div>

            <div className="mt-12 flex space-x-2">
                {['W', 'O', 'R', 'D', 'L', 'E'].map(
                    (letter, index) => (
                        <motion.div
                            key={index}
                            className="w-12 h-12 text-primary flex items-center justify-center text-2xl font-bold rounded"
                            variants={letterVariants}
                            initial="initial"
                            animate="animate"
                            custom={index}
                        >
                            {letter}
                        </motion.div>
                    )
                )}
            </div>

            {isHovered && (
                <motion.p
                    className="absolute top-3/4 mt-4 text-sm text-blue-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Ready to challenge your word skills?
                </motion.p>
            )}
        </div>
    )
}

export { Home }
