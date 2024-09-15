import { Router, type Application } from 'express'
import userRoute from './user/user' // 假设 userRoute 是一个模块

// 定义路由接口
interface Route {
    name: string
    route: Router
}

// 所有路由
const allRoutes: Route[] = [userRoute]

// 初始化路由的函数
const initializeRoutes = (
    app: Application
): Application => {
    allRoutes.forEach((router) => {
        app.use(`/api/v1/${router.name}`, router.route)
    })
    return app
}

export { initializeRoutes }
