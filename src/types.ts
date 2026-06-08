export type UserRole = "admin" | "guru";

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  kelas?: string[];
  mapel?: string[];
}

export interface Student {
  id: string;
  nomorPeserta: string;
  nama: string;
  kelas: string;
}

export interface Mapel {
  id: string;
  kode: string;
  nama: string;
}

export interface ProcessedDocument {
  id: string;
  mapelId: string;
  mapelName: string;
  kelas: string;
  uploadedAt: string;
  processedByAdminId: string;
  totalStudents: number;
  missingScores: number;
  data: ProcessedRecord[];
}

export interface ProcessedRecord {
  nomorPeserta: string;
  nama: string;
  kelas: string;
  nilai: number | string | null;
  status: "Lengkap" | "Tidak Mengikuti Ujian" | "Data Tidak Ditemukan";
}
