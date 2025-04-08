"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact_number: string;
  medical_history: string;
  current_diagnosis: string;
  treatment_plan: string;
  status: string;
}

export default function NGODashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading, isAuthenticated } = useAuth("/auth/login");

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select(
            `
            id,
            first_name,
            last_name,
            date_of_birth,
            contact_number,
            medical_history,
            current_diagnosis,
            treatment_plan,
            status
          `
          )
          .eq("status", "pending");

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [loading, isAuthenticated]);

  const handleAcceptPatient = async (patientId: string) => {
    try {
      if (!session?.user?.id) {
        toast.error("Please log in to accept patients");
        return;
      }

      const ngoUserId = session.user.id;

      const { error: assignmentError } = await supabase
        .from("ngo_assignments")
        .insert({
          patient_id: patientId,
          ngo_id: ngoUserId,
          status: "accepted",
        });

      if (assignmentError) throw assignmentError;

      const { data, error: updateError } = await supabase
        .from("patients")
        .update({ status: "assigned" })
        .eq("id", patientId)
        .eq("status", "pending")
        .select();

      if (updateError) throw updateError;

      if (!data?.length) {
        throw new Error("Patient could not be updated");
      }

      toast.success("Patient accepted successfully");
      setPatients((currentPatients) =>
        currentPatients.filter((p) => p.id !== patientId)
      );
    } catch (error: any) {
      console.error("Error accepting patient:", error);
      toast.error(error.message || "Failed to accept patient");
    }
  };

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "contact_number", label: "Contact" },
    { key: "current_diagnosis", label: "Diagnosis" },
    {
      key: "actions",
      label: "Actions",
      render: (patient: Patient) => (
        <Button size="sm" onClick={() => handleAcceptPatient(patient.id)}>
          Accept Patient
        </Button>
      ),
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <DashboardHeader
        title="NGO Dashboard"
        onSearch={setSearchQuery}
        onExport={() => {}}
        onFilter={() => {}}
      />

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Available Patients</h2>
          </div>

          <DataTable
            columns={columns}
            data={filteredPatients}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  );
}
