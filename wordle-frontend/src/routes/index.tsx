import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WordleGame } from '../pages/task1'
import { Layout } from '../layout.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'task1',
                element: <WordleGame />,
            },
        ],
    },
])

const Router = () => {
    return <RouterProvider router={router} />
}

export { Router }
