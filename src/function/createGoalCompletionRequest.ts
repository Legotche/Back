import {db} from '../db'
import { goalCompletions, goals } from '../db/schema'
import {count, lte, and, gte, eq, sql} from 'drizzle-orm'
import dayjs from 'dayjs'

interface ICreateGoalCompletionRequest{
    goalId: string
}

export async function createGoalCompletionRequest({goalId}:ICreateGoalCompletionRequest) {
    
    const firstDayOfWeek=dayjs().startOf('week').toDate()
    const lastDayOfWeek=dayjs().endOf('week').toDate()

    const goalCompletionCount=db.$with('goal_completion_count')
    .as(
        db.select({
            goalId:goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        })
        .from(goalCompletions)
        .where(
            and(
                lte(goalCompletions.createdAt,lastDayOfWeek),
                gte(goalCompletions.createdAt,firstDayOfWeek),
                eq(goalCompletions.goalId,goalId)
            )
        )
        .groupBy(goalCompletions.goalId)
    )


    const res=await db.with(goalCompletionCount).select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount:sql`COALESCE(${goalCompletionCount.completionCount},0)`.mapWith(Number)
    })
    .from(goals)
    .leftJoin(goalCompletionCount,eq(goalCompletionCount.goalId,goals.id))
    .where(eq(goals.id,goalId))
    .limit(1)

    const {completionCount,desiredWeeklyFrequency}=res[0]

    if(completionCount>=desiredWeeklyFrequency){
        throw new Error('Goal already completed this week!')
    }

    const insertResult=await db.insert(goalCompletions)
    .values({goalId})
    .returning()

    const goalCompletion=insertResult[0]

    return {goalCompletion,}
}