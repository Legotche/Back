import {db, client} from '.'
import { goalCompletions,goals } from './schema';
import dayjs from "dayjs";

async function seed() {
    const startOfWeek=dayjs().startOf('week')
    await db.delete(goalCompletions)
    await db.delete(goals)

    let createdGoals= await db.insert(goals).values([
        {title:'Acordar cedo',desiredWeeklyFrequency:5},
        {title:'Exercitar',desiredWeeklyFrequency:2},
        {title:'estudar',desiredWeeklyFrequency:6}
    ])

    await db.insert(goalCompletions).values([
        {goalId:createdGoals[0],createdAt: startOfWeek.subtract(2,'day').toDate()},
        {goalId:createdGoals[1],createdAt: startOfWeek.toDate()},
    ])
};

seed().finally(()=>{client.end()});