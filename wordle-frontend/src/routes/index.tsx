import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WordleGame } from '../pages/task1'

const router = createBrowserRouter([
    {
        path: '/',
        element: <WordleGame />,
    },
])

const Router = () => {
    return <RouterProvider router={router} />
}

export { Router }
