import { Link, Outlet } from 'react-router-dom'
import {
    Navbar,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'
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
                </NavbarContent>
            </Navbar>
            <div className={'py-12'}>
                <Outlet />
            </div>
        </div>
    )
}

export { Layout }
