-- Run this in your Supabase SQL Editor to create the necessary tables for RekapNilaiPro

-- 1. Users table
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'guru',
  name TEXT NOT NULL,
  kelas TEXT[] DEFAULT '{}',
  mapel TEXT[] DEFAULT '{}'
);

-- disable RLS for unauthenticated access (since we are doing local auth)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;

-- insert initial admin
INSERT INTO app_users (id, username, password, role, name) 
VALUES ('1', 'admin', '@1', 'admin', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS app_documents (
  id TEXT PRIMARY KEY,
  mapel_id TEXT NOT NULL,
  mapel_name TEXT NOT NULL,
  kelas TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  processed_by_admin_id TEXT NOT NULL,
  total_students INTEGER NOT NULL,
  missing_scores INTEGER NOT NULL,
  data JSONB NOT NULL
);

ALTER TABLE app_documents DISABLE ROW LEVEL SECURITY;


