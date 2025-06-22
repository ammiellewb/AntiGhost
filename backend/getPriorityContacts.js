import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexHttpClient("https://terrific-rhinoceros-310.convex.cloud");

const FREQUENCY_MAP = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  annually: 365
};

export async function getTopPriorityContacts(limit = 4) {
  const contacts = await client.query(api.contacts.getContacts, {});
  
  const scoredContacts = contacts
    .filter(c => c.Frequency && c.Days_since_last_contact != null)
    .map(contact => {
      const freq = contact.Frequency.toLowerCase();
      const idealGap = FREQUENCY_MAP[freq];
      const daysSince = contact.Days_since_last_contact;
      
      if (!idealGap || isNaN(daysSince)) return null;

      const score = daysSince / idealGap;

      return {
        ...contact,
        priorityScore: score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.priorityScore - a.priorityScore) // descending
    .slice(0, limit);

  return scoredContacts;
}
