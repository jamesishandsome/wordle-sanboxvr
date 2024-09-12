import {
    Description,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'

const LoseModal = ({
    open,
    setOpen,
    word,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    word: string
}) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded bg-white p-4">
                    <DialogTitle className="text-lg font-bold">
                        You Lose!
                    </DialogTitle>
                    <Description className="text-sm text-gray-500">
                        The word was: {word}
                    </Description>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export { LoseModal }
