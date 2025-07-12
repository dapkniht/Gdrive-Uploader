import Database from "better-sqlite3";
export const db = new Database("upload_logs.db");

export const setupDatabase = () => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS job_progress (
        id TEXT,
        google_id TEXT,
        filename TEXT,
        progress INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
};
