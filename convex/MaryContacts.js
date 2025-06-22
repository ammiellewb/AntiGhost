import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllContacts = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query('MaryContacts').collect();
    return contacts;
  }
});

export const getContactsByFilter = query({
  args: {
    frequency: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('MaryContacts');
    
    if (args.frequency) {
      query = query.filter(q => q.eq(q.field('Frequency'), args.frequency));
    }
    
    if (args.tag) {
      query = query.filter(q => q.eq(q.field('Tag'), args.tag));
    }
    
    const contacts = await query.collect();
    return contacts;
  }
});

export const createContact = mutation({
  args: {
    First_Name: v.string(),
    Last_Name: v.string(),
    Email: v.string(),
    Phone_Number: v.string(),
    Birthday: v.string(),
    Frequency: v.string(),
    Tag: v.string(),
    Last_conversation: v.string(),
    Days_since_last_contact: v.float64(),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert('MaryContacts', args);
    return contactId;
  }
});

export const updateContact = mutation({
  args: {
    id: v.id('MaryContacts'),
    First_Name: v.string(),
    Last_Name: v.string(),
    Email: v.string(),
    Phone_Number: v.string(),
    Birthday: v.string(),
    Frequency: v.string(),
    Tag: v.string(),
    Last_conversation: v.string(),
    Days_since_last_contact: v.float64(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  }
});

export const deleteContact = mutation({
  args: {
    id: v.id('MaryContacts'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  }
});

export const getUniqueFrequencies = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query('MaryContacts').collect();
    const frequencies = [...new Set(contacts.map(contact => contact.Frequency))];
    return frequencies;
  }
});

export const getUniqueTags = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query('MaryContacts').collect();
    const tags = [...new Set(contacts.map(contact => contact.Tag))];
    return tags;
  }
});

export const updateContactTime = mutation({
  args: {
    id: v.id('MaryContacts'),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patchData = {
      Days_since_last_contact: 0,
      Last_conversation: args.note || new Date().toISOString().split('T')[0],
    };
    await ctx.db.patch(args.id, patchData);
    return true;
  }
});

export const updateLastContacted = mutation({
  args: { id: v.id("MaryContacts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { Days_since_last_contact: 0 });
  },
});

export const updateLastConversation = mutation({
  args: { id: v.id("MaryContacts"), note: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      Last_conversation: args.note, 
      Days_since_last_contact: 0 
    });
  },
});

export const getRecentNotes = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("MaryContacts")
      .order("desc", "Last_conversation")
      .take(args.limit || 5);
      
    return contacts.map(c => ({
      id: c._id,
      contact: `${c.First_Name} ${c.Last_Name}`,
      message: c.Last_conversation,
    }));
  },
});