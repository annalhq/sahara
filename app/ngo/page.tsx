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

export default function NGODashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading, isAuthenticated } = useAuth("/auth/login");

  // Fetch pending patients
  useEffect(() => {
    if (loading) return; // Don't fetch data while checking authentication
    if (!isAuthenticated) return; // Don't proceed if not authenticated

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
      // Add a more specific check for session.user and session.user.id
      if (!session || !session.user || !session.user.id) {
        toast.error(
          "User session is invalid or incomplete. Please try logging in again."
        );
        console.error(
          "Attempted to accept patient with invalid session:",
          session
        );
        return; // Stop execution if session is invalid
      }

      // Now it's safer to access session.user.id
      const ngoUserId = session.user.id;

      // 1. Create assignment
      const { error: assignmentError } = await supabase
        .from("ngo_assignments")
        .insert({
          patient_id: patientId,
          ngo_id: ngoUserId, // Use the validated user ID
          status: "accepted", // Or 'assigned' depending on your desired flow
        });

      if (assignmentError) {
        console.error("Error creating assignment:", assignmentError);
        throw new Error(
          `Failed to create assignment: ${assignmentError.message}`
        );
      }

      // 2. Update patient status from pending to assigned
      const { data, error: updateError } = await supabase
        .from("patients")
        .update({ status: "assigned" })
        .eq("id", patientId)
        .eq("status", "pending") // Ensure we're only updating patients with pending status
        .select();

      if (updateError) {
        console.error("Error updating patient status:", updateError);
        throw new Error(
          `Failed to update patient status: ${updateError.message}`
        );
      }

      // Verify the status was updated by checking if any rows were affected
      if (!data || data.length === 0) {
        console.error("No patient was updated, may have already been assigned");
        throw new Error(
          "Patient could not be updated. It may have already been assigned."
        );
      }

      toast.success("Patient accepted successfully");

      setPatients((currentPatients: any) =>
        currentPatients.filter((p: any) => p.id !== patientId)
      );
    } catch (error: any) {
      console.error("Error accepting patient:", error);
      toast.error(
        error.message ||
          "An unexpected error occurred while accepting the patient."
      );
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
      render: (row: any) => (
        <Button size="sm" onClick={() => handleAcceptPatient(row.id)}>
          Accept Patient
        </Button>
      ),
    },
  ];

  const filteredPatients = patients.filter((patient: any) =>
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
