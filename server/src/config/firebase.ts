import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');
  let credential: admin.ServiceAccount;

  if (fs.existsSync(serviceAccountPath)) {
    // Use serviceAccount.json if it exists
    const serviceAccount = require('./serviceAccount.json');
    credential = serviceAccount as admin.ServiceAccount;
  } else {
    // Fall back to environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase credentials. Provide either serviceAccount.json or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.');
    }

    credential = {
      projectId,
      clientEmail,
      privateKey,
    } as admin.ServiceAccount;
  }

  admin.initializeApp({
    credential: admin.credential.cert(credential),
  });
}

export const db = admin.firestore();
export default admin;
