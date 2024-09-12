import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WordleGame } from '../pages/task1'
import { Layout } from '../layout.tsx'
import { WordleGame2 } from '../pages/task2'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'task1',
                element: <WordleGame />,
            },
            {
                path: 'task2',
                element: <WordleGame2 />,
            },
        ],
    },
])

const Router = () => {
    return <RouterProvider router={router} />
}

export { Router }
