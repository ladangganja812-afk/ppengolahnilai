-- Run this in your Supabase SQL Editor to create the necessary tables for RekapNilaiPro

-- Users table
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'guru',
  name TEXT NOT NULL,
  kelas TEXT[] DEFAULT '{}',
  mapel TEXT[] DEFAULT '{}'
);

-- insert initial admin
INSERT INTO app_users (id, username, password, role, name) 
VALUES ('1', 'admin', '@1', 'admin', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- Documents table
CREATE TABLE IF NOT EXISTS app_documents (
  id TEXT PRIMARY KEY,
  "mapelId" TEXT NOT NULL,
  "mapelName" TEXT NOT NULL,
  kelas TEXT NOT NULL,
  "uploadedAt" TEXT NOT NULL,
  "processedByAdminId" TEXT NOT NULL,
  "totalStudents" INTEGER NOT NULL,
  "missingScores" INTEGER NOT NULL,
  data JSONB NOT NULL
);

-- Students table
CREATE TABLE IF NOT EXISTS app_students (
  id TEXT PRIMARY KEY,
  "nomorPeserta" TEXT NOT NULL,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL
);
