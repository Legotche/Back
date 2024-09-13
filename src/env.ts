import z from 'zod';

const schema=z.object({
    URL_DB: z.string().url(),
})

export const env = schema.parse(process.env)