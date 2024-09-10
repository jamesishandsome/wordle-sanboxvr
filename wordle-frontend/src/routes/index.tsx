import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WordleGame } from '../pages/home'

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
