/*
  # Simplified Healthcare Management System Schema
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hospitals table (simplified)
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL UNIQUE,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- NGOs table (simplified)
CREATE TABLE IF NOT EXISTS ngos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL UNIQUE,
  total_capacity integer NOT NULL,
  current_capacity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Patients table (simplified)
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  contact_number text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Patient Assignments table (simplified)
CREATE TABLE IF NOT EXISTS patient_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  ngo_id uuid REFERENCES ngos(id),
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Capacity Logs table (simplified)
CREATE TABLE IF NOT EXISTS capacity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id uuid REFERENCES ngos(id),
  previous_capacity integer NOT NULL,
  new_capacity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_logs ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Public read access to hospitals"
  ON hospitals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access to NGOs"
  ON ngos FOR SELECT
  TO authenticated
  USING (true);

-- Create essential indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_ngo_id ON patient_assignments(ngo_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_patient_id ON patient_assignments(patient_id);