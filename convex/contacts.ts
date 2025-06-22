// convex/functions.ts
import { query } from "./_generated/server";

export const getContacts = query(async ({ db }) => {
  return await db.query("MaryContacts").collect(); // use your table name
});
