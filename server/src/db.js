/**
 * MongoDB-backed store. Keeps the exact same interface the API used with the
 * previous JSON file store (createPlan, getPlan, updatePlan, listPlans, addLead,
 * listLeads) so the rest of the server is unchanged. Records keep their own
 * string `id` field; Mongo's `_id` is never exposed.
 */
import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
if (!MONGO_URL) throw new Error("MONGO_URL is required");
if (!DB_NAME) throw new Error("DB_NAME is required");

const client = new MongoClient(MONGO_URL, { maxPoolSize: 20 });
let plans, leads;

export async function connectDb() {
  if (plans) return;
  await client.connect();
  const database = client.db(DB_NAME);
  plans = database.collection("plans");
  leads = database.collection("leads");
  await plans.createIndex({ id: 1 }, { unique: true });
  await plans.createIndex({ createdAt: -1 });
  await leads.createIndex({ createdAt: -1 });
}

const strip = (doc) => {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
};

export const db = {
  async createPlan(record) {
    await plans.insertOne({ ...record });
    return record;
  },
  async getPlan(id) {
    return strip(await plans.findOne({ id }, { projection: { _id: 0 } }));
  },
  async updatePlan(id, patch) {
    const result = await plans.findOneAndUpdate(
      { id },
      { $set: { ...patch, updatedAt: new Date().toISOString() } },
      { returnDocument: "after", projection: { _id: 0 } }
    );
    return strip(result && (result.value ?? result));
  },
  async listPlans() {
    const docs = await plans.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
    return docs.map(({ id, createdAt, updatedAt, plan, done }) => ({
      id, createdAt, updatedAt,
      company: plan.input.company,
      frameworks: plan.input.frameworks,
      certificationDate: plan.summary.certificationDate,
      done: done.length,
      total: plan.summary.taskCount,
    }));
  },
  async addLead(lead) {
    await leads.insertOne({ ...lead });
    return lead;
  },
  async listLeads() {
    const docs = await leads.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
    return docs;
  },
};
