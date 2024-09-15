import {
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'

const WinModal = ({
    open,
    setOpen,
    word,
    times,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    word: string
    times: number
}) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-fit max-w-md rounded bg-white p-4">
                    <DialogTitle className="text-lg font-bold text-black text-center">
                        You Win!
                    </DialogTitle>
                    <div className="text-sm text-gray-500 flex flex-col justify-center mt-2">
                        <div>
                            The word was:{' '}
                            <span className="font-bold">
                                {word.toLowerCase()}
                            </span>
                        </div>
                        <div>
                            You have tried{' '}
                            <span className="font-bold">
                                {times}
                            </span>{' '}
                            times
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export { WinModal }
