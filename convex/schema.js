import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    Users:defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        // password: v.string(),
        picture: v.optional(v.string()),
        subscriptionId: v.optional(v.string()),
        credits: v.float64(),
    }),
    MaryContacts: defineTable({
        Birthday: v.string(),
        Days_since_last_contact: v.float64(),
        Email: v.string(),
        First_Name: v.string(),
        Frequency: v.string(),
        Last_Name: v.string(),
        Last_conversation: v.string(),
        Phone_Number: v.string(),
        Tag: v.string(),
      }),
});
