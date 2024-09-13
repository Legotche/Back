import {db} from '../db'
import { goals } from "../db/schema";

interface CreateGoalRequest {
    title:string
    desiredWeeklyFrequency: number
}

export default async function createGoals({title,desiredWeeklyFrequency} : CreateGoalRequest){
    const res=await db.insert(goals).values({ title, desiredWeeklyFrequency}).returning()

    const goal=res[0]

    return {goal,}
}