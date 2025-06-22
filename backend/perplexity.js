import { ConvexHttpClient } from "convex/browser";
import readline from "node:readline";
import { api } from "../convex/_generated/api.js";
import { getTopPriorityContacts } from "./getPriorityContacts.js";

import axios from 'axios';
import fs from 'node:fs';
import path, { dirname } from 'node:path';

import { fileURLToPath } from 'node:url';

const client = new ConvexHttpClient("https://terrific-rhinoceros-310.convex.cloud"); // replace with your URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tokenPath = path.join(__dirname, 'token.txt');
const API_KEY = fs.readFileSync(tokenPath, 'utf-8').trim();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askPerplexity(query) {
    try {
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: "sonar",
          messages: [
            { role: "user", content: query }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const reply = response.data.choices[0].message.content;
      console.log("Response:", reply);
  
    } catch (error) {
      console.error("Error querying Perplexity:", error.response?.data || error.message);
    }
  }

rl.question("Enter the name to search: ", async (inputName) => {
  try {
    const contacts = await client.query(api.contacts.getContacts, {});
    const match = contacts.find(c =>
        c.First_Name && c.First_Name.toLowerCase().includes(inputName.toLowerCase())
    );
      

    if (!match) {
      console.log("No contact found with that name.");
    } else {
      const { Days_since_last_contact, Last_conversation } = match;
      console.log(`Found contact: ${match.First_Name}`);
      console.log(`Days since last contact: ${Days_since_last_contact}`);
      console.log(`Last conversation: ${Last_conversation}`);
      askPerplexity(`I last messaged ${match.First_Name} ${Days_since_last_contact} days ago and we talked about ${Last_conversation}. In a simple 1 sentence prompt, Whats something we could talk about today?`);
    }
  } catch (err) {
    console.error("Error querying contacts:", err);
  } finally {
    rl.close();
  }
});


const topContacts = await getTopPriorityContacts(5);

topContacts.forEach((c, i) => {
  console.log(`${i + 1}. ${c.First_Name} (${c.Frequency}) — Last contacted ${c.Days_since_last_contact} days ago — Score: ${c.priorityScore.toFixed(2)}`);
});



