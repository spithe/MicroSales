
# Troubleshooting Database
If the table 'expenses' is missing, it means the previous push didn't actually execute the changes to the SQLite file.
Running `npx drizzle-kit push` should detect the `expenses` table in `schema.ts` and create it.
