import {z} from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../function/GetWeekPendingGoals'

export const pendingGoalsRoute:FastifyPluginAsyncZod=async (app)=>{
        
    app.get('/pendingGoals',async()=>{
        const {pendingGoals}=await getWeekPendingGoals()
        return {pendingGoals}
    })

}