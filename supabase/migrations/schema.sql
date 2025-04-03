/*
  # Healthcare Management System Schema

  1. New Tables
    - `hospitals`
      - Basic hospital information and verification status
    - `ngos`
      - NGO details and verification status
    - `patients`
      - Patient information and medical history
    - `capacity_logs`
      - Historical tracking of NGO capacity changes
    - `documents`
      - Medical and verification documents
    - `medical_staff`
      - Hospital staff information
    - `patient_assignments`
      - Tracks patient assignments to NGOs
    - `patient_treatments`
      - Patient treatment history

  2. Security
    - Enable RLS on all tables
    - Policies for hospitals, NGOs, and staff access
    - Document access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL UNIQUE,
  license_number text NOT NULL UNIQUE,
  verified boolean DEFAULT false,
  operating_hours jsonb,
  facilities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NGOs table
CREATE TABLE IF NOT EXISTS ngos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL UNIQUE,
  license_number text NOT NULL UNIQUE,
  verified boolean DEFAULT false,
  total_capacity integer NOT NULL,
  current_capacity integer NOT NULL,
  service_areas text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  contact_number text,
  address text,
  medical_history text,
  current_diagnosis text,
  treatment_plan text,
  emergency_contact_name text,
  emergency_contact_number text,
  consent_given boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical Staff table
CREATE TABLE IF NOT EXISTS medical_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL,
  department text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Capacity Logs table
CREATE TABLE IF NOT EXISTS capacity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id uuid REFERENCES ngos(id),
  previous_capacity integer NOT NULL,
  new_capacity integer NOT NULL,
  change_reason text,
  created_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  hospital_id uuid REFERENCES hospitals(id),
  ngo_id uuid REFERENCES ngos(id),
  document_type text NOT NULL,
  file_path text NOT NULL,
  uploaded_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Patient Assignments table
CREATE TABLE IF NOT EXISTS patient_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  ngo_id uuid REFERENCES ngos(id),
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending',
  notes text
);

-- Patient Treatments table
CREATE TABLE IF NOT EXISTS patient_treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  hospital_id uuid REFERENCES hospitals(id),
  treatment_date date NOT NULL,
  treatment_type text NOT NULL,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_treatments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hospitals can view their own data"
  ON hospitals FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT created_by FROM medical_staff WHERE hospital_id = hospitals.id
  ));

CREATE POLICY "NGOs can view their own data"
  ON ngos FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT created_by FROM medical_staff WHERE ngo_id = ngos.id
  ));

CREATE POLICY "Hospital staff can view assigned patients"
  ON patients FOR SELECT
  TO authenticated
  USING (hospital_id IN (
    SELECT hospital_id FROM medical_staff WHERE created_by = auth.uid()
  ));

CREATE POLICY "NGO staff can view assigned patients"
  ON patients FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT patient_id FROM patient_assignments 
    WHERE ngo_id IN (
      SELECT ngo_id FROM medical_staff WHERE created_by = auth.uid()
    )
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_ngo_id ON patient_assignments(ngo_id);
CREATE INDEX IF NOT EXISTS idx_patient_treatments_patient_id ON patient_treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON documents(patient_id);