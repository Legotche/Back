import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'
import {db} from '../db'
import { goalCompletions, goals } from '../db/schema';
import {lte, eq,count, sql, and, gte} from 'drizzle-orm'




dayjs.extend(weekOfYear)


export async function getWeekPendingGoals(){
    const firstDayOfWeek=dayjs().startOf('week').toDate()
    const lastDayOfWeek=dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek=db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt
        })
        .from(goals)
        .where(lte(goals.createdAt,lastDayOfWeek))
    )

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
                gte(goalCompletions.createdAt,firstDayOfWeek)
            )
        )
        .groupBy(goalCompletions.goalId)
    )

    const pendingGoals= await db
    .with(goalsCreatedUpToWeek,goalCompletionCount)
    .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency:goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount:sql`COALESCE(${goalCompletionCount.completionCount},0)`.mapWith(Number)
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(goalCompletionCount,eq(goalCompletionCount.goalId,goalsCreatedUpToWeek.id))
    

    return {pendingGoals,}
}