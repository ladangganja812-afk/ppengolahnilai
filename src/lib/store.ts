import { ProcessedDocument, Student, Mapel, User } from "./types";

// Database using LocalStorage for MVP

const INITIAL_USERS: User[] = [
  { id: "1", username: "admin", password: "@1", role: "admin", name: "Administrator" },
];

export const getUsers = (): User[] => {
  const data = localStorage.getItem("app_users");
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem("app_users", JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("app_users", JSON.stringify(users));
};

export const getStoredDocuments = (): ProcessedDocument[] => {
  const data = localStorage.getItem("app_documents");
  return data ? JSON.parse(data) : [];
};

export const saveDocument = (doc: ProcessedDocument) => {
  const docs = getStoredDocuments();
  docs.push(doc);
  localStorage.setItem("app_documents", JSON.stringify(docs));
};

export const getStoredStudents = (): Student[] => {
  const data = localStorage.getItem("app_students");
  return data ? JSON.parse(data) : [];
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem("app_students", JSON.stringify(students));
};
