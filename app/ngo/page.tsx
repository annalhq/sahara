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
      if (!session) throw new Error("No session found");

      // Create assignment
      const { error: assignmentError } = await supabase
        .from("ngo_assignments")
        .insert({
          patient_id: patientId,
          ngo_id: session.user.id,
          status: "accepted",
        });

      if (assignmentError) throw assignmentError;

      // Update patient status
      const { error: updateError } = await supabase
        .from("patients")
        .update({ status: "assigned" })
        .eq("id", patientId);

      if (updateError) throw updateError;

      toast.success("Patient accepted successfully");

      // Remove patient from list
      setPatients(patients.filter((p: any) => p.id !== patientId));
    } catch (error) {
      console.error("Error accepting patient:", error);
      toast.error("Failed to accept patient");
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
