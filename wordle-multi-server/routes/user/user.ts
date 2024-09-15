import { Router } from 'express'

const userRouter = Router()

userRouter.get('/', async (req, res, next) => {
    try {
        return { message: 'Hello from user route' }
    } catch (error) {
        next(error)
    }
})

export const userRoute: { route: Router; name: string } = {
    route: userRouter,
    name: 'user',
}

export default userRoute
