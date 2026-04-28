import { config } from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { DEFAULT_SIMULATOR_SETTINGS } from "../src/lib/simulator-settings-defaults";
import { SimulatorSettings } from "../src/models/SimulatorSettings";
import { User } from "../src/models/User";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL ?? "admin@ebm-entreprise.tn";
  const password = process.env.ADMIN_PASSWORD;

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }
  if (!password) {
    throw new Error("ADMIN_PASSWORD is required to create the first admin user");
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: "admin" } },
    { upsert: true, returnDocument: "after" },
  );

  await SimulatorSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default", ...DEFAULT_SIMULATOR_SETTINGS } },
    { upsert: true, returnDocument: "after" },
  );

  // eslint-disable-next-line no-console -- CLI script
  console.log(`Seed OK — admin user: ${email}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
