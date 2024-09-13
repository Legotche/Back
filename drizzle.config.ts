import {env} from './src/env'
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  out: './.migrations',
  dbCredentials: {
      url: env.URL_DB
  }
})
