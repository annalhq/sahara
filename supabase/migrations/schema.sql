/*
  # Healthcare Patient Management System Schema

  This schema defines the structure for managing patients and NGO assignments.

  1. New Tables
    - patients
      - Basic patient information
      - Medical history
      - Assignment status
    - ngo_assignments
      - Tracks NGO assignments for patients
    
  2. Security
    - RLS enabled on all tables
    - Policies for proper access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  contact_number text,
  medical_history text,
  current_diagnosis text,
  treatment_plan text,
  status text DEFAULT 'pending',
  hospital_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ngo_assignments table
CREATE TABLE IF NOT EXISTS ngo_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  ngo_id uuid NOT NULL,
  status text DEFAULT 'pending',
  assigned_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for patients table
CREATE POLICY "Hospitals can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Hospitals can view their own patients"
  ON patients FOR SELECT
  TO authenticated
  USING (hospital_id = auth.uid());

CREATE POLICY "NGOs can view all pending patients"
  ON patients FOR SELECT
  TO authenticated
  USING (status = 'pending');

-- Policies for ngo_assignments table
CREATE POLICY "NGOs can create assignments"
  ON ngo_assignments FOR INSERT
  TO authenticated
  WITH CHECK (ngo_id = auth.uid());

CREATE POLICY "Users can view relevant assignments"
  ON ngo_assignments FOR SELECT
  TO authenticated
  USING (
    ngo_id = auth.uid() OR 
    patient_id IN (
      SELECT id FROM patients 
      WHERE hospital_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_ngo_assignments_patient_id ON ngo_assignments(patient_id);
CREATE INDEX idx_ngo_assignments_ngo_id ON ngo_assignments(ngo_id);