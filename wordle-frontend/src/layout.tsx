import { Link, Outlet } from 'react-router-dom'
import {
    Navbar,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'
import { NavbarBrand } from '@nextui-org/react'
const Layout = () => {
    return (
        <div
            className={
                'w-screen min-h-screen h-full flex flex-col bg-gray-100'
            }
        >
            <Navbar
                className={'bg-gray-100 shadow '}
                position="static"
            >
                <NavbarBrand className={'text-black'}>
                    <Link to={'/'}>Wordle</Link>
                </NavbarBrand>
                <NavbarContent
                    className="hidden sm:flex gap-4"
                    justify="center"
                >
                    <NavbarItem>
                        <Link to="/task1">Task 1</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link to="/task2">Task 2</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link to="/task3">Task 3</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link to="/task4">Task 4</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            to="https://wordle-sanboxvr-doc.pages.dev"
                            target="_blank"
                        >
                            Docs
                        </Link>
                    </NavbarItem>
                    {/*github*/}
                    <NavbarItem>
                        <a
                            href="https://github.com/jamesishandsome/wordle-sanboxvr"
                            target="_blank"
                        >
                            Github
                        </a>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className={'h-full'}>
                <Outlet />
            </div>
        </div>
    )
}

export { Layout }
