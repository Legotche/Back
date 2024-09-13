import fastify from 'fastify';
import createGoals from './function/createGoals';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod'
import { getWeekPendingGoals } from './function/getWeekPendingGoals';
import { request } from 'http';
import { createGoalCompletionRequest } from './function/createGoalCompletionRequest';


const app=fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

const schemaGoals= {
    body:z.object(
    {
        title:z.string(),
        desiredWeeklyFrequency:z.number().int().min(1).max(7)
    }
)}

const schemaCompletion={
    body:z.object({
        goalId:z.string()
    })
}

app.post('/goals',{ schema:schemaGoals },async (request)=>{

    const {title, desiredWeeklyFrequency} = request.body
    
    await createGoals({ title, desiredWeeklyFrequency })
})

app.get('/pendingGoals',async()=>{
    const {pendingGoals}=await getWeekPendingGoals()
    return {pendingGoals}
})

app.post('/completion',{schema:schemaCompletion},async(request)=>{
    const {goalId}=request.body

    await createGoalCompletionRequest({goalId})
})

app.listen({
    port:3000
})
    .then(() => console.log('server running on port 3000'))