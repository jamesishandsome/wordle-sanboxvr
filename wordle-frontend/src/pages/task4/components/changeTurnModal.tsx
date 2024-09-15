import {
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'

const ChangeTurnModal = ({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: (open: boolean) => void
}) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-fit max-w-md rounded bg-white p-4">
                    <DialogTitle className="text-lg font-bold text-black text-center">
                        It's Your Turn!
                    </DialogTitle>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export { ChangeTurnModal }
