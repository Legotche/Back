import {z} from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import createGoal from '../../function/CreateGoal'


const schemaGoals= {
    body:z.object(
    {
        title:z.string(),
        desiredWeeklyFrequency:z.number().int().min(1).max(7)
    }
)}

export const createGoalRoute:FastifyPluginAsyncZod=async (app)=>{
    
    app.post('/goals',{ schema:schemaGoals },async (request)=>{

    const {title, desiredWeeklyFrequency} = request.body
    
    await createGoal({ title, desiredWeeklyFrequency })
})
}