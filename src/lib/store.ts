import { ProcessedDocument, Student, Mapel, User } from "./types";
import { supabase } from "./supabase";

const INITIAL_USERS: User[] = [
  { id: "1", username: "admin", password: "@1", role: "admin", name: "Administrator" },
];

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('app_users').select('*');
  if (error) {
    console.error("Error fetching users from Supabase:", error);
    return INITIAL_USERS;
  }
  if (!data || data.length === 0) {
    return INITIAL_USERS;
  }
  return data;
};

export const saveUser = async (user: User) => {
  const { error } = await supabase.from('app_users').insert([user]);
  if (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const getStoredDocuments = async (): Promise<ProcessedDocument[]> => {
  const { data, error } = await supabase.from('app_documents').select('*');
  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
  return data || [];
};

export const saveDocument = async (doc: ProcessedDocument) => {
  const { error } = await supabase.from('app_documents').insert([doc]);
  if (error) {
    console.error("Error saving document:", error);
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
  const { error } = await supabase.from('app_documents').delete().eq('id', id);
  if (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getStoredStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase.from('app_students').select('*');
  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }
  return data || [];
};

export const saveStudents = async (students: Student[]) => {
  const { error } = await supabase.from('app_students').insert(students);
  if (error) {
    console.error("Error saving students:", error);
    throw error;
  }
};
