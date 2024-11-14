import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { createGoalRoute } from './http/routes/CreateGoalRoute';
import { pendingGoalsRoute } from './http/routes/PendingGoalsRoute';
import { completeGoalRoute } from './http/routes/CompleteGoalRoute';
import { getWeekSummaryRoute } from './http/routes/GetWeekSummaryRoute';

const app=fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(pendingGoalsRoute)
app.register(completeGoalRoute)
app.register(getWeekSummaryRoute)

app.listen({
    port:3000
})
    .then(() => console.log('server running on port 3000'))