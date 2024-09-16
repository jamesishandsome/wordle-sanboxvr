import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import { WordleGame } from '../pages/task1'
import { Layout } from '../layout.tsx'
import { WordleGame2 } from '../pages/task2'
import { WordleGame3 } from '../pages/task3'
import { WordleGameTask4 } from '../pages/task4'
import { Home } from '../pages/home/home.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'task1',
                element: <WordleGame />,
            },
            {
                path: 'task2',
                element: <WordleGame2 />,
            },
            {
                path: 'task3',
                element: <WordleGame3 />,
            },
            {
                path: 'task4',
                element: <WordleGameTask4 />,
            },
        ],
    },
])

const Router = () => {
    return <RouterProvider router={router} />
}

export { Router }
