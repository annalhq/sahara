import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Hospital = {
     id: string;
     name: string;
     address: string;
     contact_number: string;
     email: string;
     license_number: string;
     verified: boolean;
     operating_hours: any;
     facilities: string[];
     created_at: string;
     updated_at: string;
};

export type NGO = {
     id: string;
     name: string;
     address: string;
     contact_number: string;
     email: string;
     license_number: string;
     verified: boolean;
     total_capacity: number;
     current_capacity: number;
     service_areas: string[];
     created_at: string;
     updated_at: string;
};

export type Patient = {
     id: string;
     hospital_id: string;
     first_name: string;
     last_name: string;
     date_of_birth: string;
     gender: string;
     contact_number: string;
     address: string;
     medical_history: string;
     current_diagnosis: string;
     treatment_plan: string;
     emergency_contact_name: string;
     emergency_contact_number: string;
     consent_given: boolean;
     status: string;
     created_at: string;
     updated_at: string;
};

export type MedicalStaff = {
     id: string;
     hospital_id: string;
     first_name: string;
     last_name: string;
     role: string;
     department: string;
     contact_number: string;
     email: string;
     created_at: string;
};

export type Document = {
     id: string;
     patient_id: string;
     hospital_id: string;
     ngo_id: string;
     document_type: string;
     file_path: string;
     uploaded_by: string;
     created_at: string;
};

export type PatientAssignment = {
     id: string;
     patient_id: string;
     ngo_id: string;
     assigned_at: string;
     status: string;
     notes: string;
};

export type PatientTreatment = {
     id: string;
     patient_id: string;
     hospital_id: string;
     treatment_date: string;
     treatment_type: string;
     notes: string;
     created_by: string;
     created_at: string;
};

export type CapacityLog = {
     id: string;
     ngo_id: string;
     previous_capacity: number;
     new_capacity: number;
     change_reason: string;
     created_at: string;
};