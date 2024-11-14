import {z} from 'zod'
import {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { createGoalCompletionRequest } from '../../function/CreateGoalCompletionRequest'
    
const schemaCompletion={
    body:z.object({
        goalId:z.string()
    })
}

export const completeGoalRoute:FastifyPluginAsyncZod=async (app)=>{

    app.post('/completion',{schema:schemaCompletion},async(request)=>{
        const {goalId}=request.body

        await createGoalCompletionRequest({goalId})
    })

}