import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className={'w-screen h-screen'}>
            <header className="bg-white">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center justify-end md:justify-between">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75"
                                        href="/task1"
                                    >
                                        {' '}
                                        Task1{' '}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75"
                                        href="#"
                                    >
                                        {' '}
                                        Task2{' '}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75"
                                        href="#"
                                    >
                                        {' '}
                                        Task3{' '}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75"
                                        href="#"
                                    >
                                        {' '}
                                        Task4{' '}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            <Outlet />
        </div>
    )
}

export { Layout }
