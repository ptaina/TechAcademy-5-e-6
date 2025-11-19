export type Page =
  | "login"
  | "register"
  | "home"
  | "patients"
  | "doctors"
  | "appointments"
  | "edit-user";

export interface User {
  id: number;
  name?: string;
  email: string;
  cpf?: string;
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  crm: string;
}

export interface Appointment {
  id: number;
  date: string;
  status: "scheduled" | "completed" | "canceled";
  patientId: number;
  doctorId: number;
  patient?: Patient;
  doctor?: Doctor;
}
