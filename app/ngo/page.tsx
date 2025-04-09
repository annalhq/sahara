"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Calendar, CheckCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
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
  const [acceptedPatients, setAcceptedPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading, isAuthenticated } = useAuth("/auth/login");
  const [stats, setStats] = useState({
    available_patients: 0,
    accepted_patients: 0,
    capacity_percentage: 75,
  });

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const fetchPatients = async () => {
      try {
        const loadingToastId = toast.loading("Loading dashboard data...");

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

        if (session?.user?.id) {
          const { data: acceptedData, error: acceptedError } = await supabase
            .from("ngo_assignments")
            .select(
              `
              patient_id,
              status,
              patients (
                id,
                first_name,
                last_name,
                date_of_birth,
                contact_number,
                medical_history,
                current_diagnosis,
                treatment_plan,
                status
              )
            `
            )
            .eq("ngo_id", session.user.id)
            .eq("status", "accepted");

          if (acceptedError) throw acceptedError;

          const formattedAccepted =
            acceptedData?.map((item) => item.patients).flat() || [];
          setAcceptedPatients(formattedAccepted);

          setStats({
            available_patients: data?.length || 0,
            accepted_patients: formattedAccepted.length,
            capacity_percentage: 75,
          });
        }

        toast.dismiss(loadingToastId);
        if (isInitialLoad.current) {
          toast.success("Dashboard data loaded successfully");
          isInitialLoad.current = false;
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [loading, isAuthenticated, session?.user?.id]);

  const handleAcceptPatient = async (patientId: string) => {
    try {
      if (!session?.user?.id) {
        toast.error("Please log in to accept patients");
        return;
      }

      const loadingToastId = toast.loading("Processing patient acceptance...");

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

      setPatients((currentPatients) =>
        currentPatients.filter((p) => p.id !== patientId)
      );

      const acceptedPatient = patients.find((p) => p.id === patientId);
      if (acceptedPatient) {
        setAcceptedPatients((prev) => [
          ...prev,
          { ...acceptedPatient, status: "assigned" },
        ]);
      }

      setStats((prev) => ({
        ...prev,
        available_patients: prev.available_patients - 1,
        accepted_patients: prev.accepted_patients + 1,
      }));

      toast.dismiss(loadingToastId);
      toast.success("Patient accepted successfully", {
        description: "The patient has been assigned to your organization.",
      });
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
        <Button
          size="sm"
          className="gap-1"
          onClick={() => handleAcceptPatient(patient.id)}
        >
          <CheckCircle className="h-4 w-4" />
          Accept Patient
        </Button>
      ),
    },
  ];

  const acceptedColumns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "contact_number", label: "Contact" },
    { key: "current_diagnosis", label: "Diagnosis" },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredAcceptedPatients = acceptedPatients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const statsData = [
    {
      label: "Available Patients",
      value: stats.available_patients.toString(),
      icon: Users,
    },
    {
      label: "Accepted Patients",
      value: stats.accepted_patients.toString(),
      icon: CheckCircle,
    },
    {
      label: "Current Capacity",
      value: `${stats.capacity_percentage}%`,
      icon: Building,
    },
  ];

  const capacityData = [
    { name: "Used", value: stats.capacity_percentage },
    { name: "Available", value: 100 - stats.capacity_percentage },
  ];

  const currentMonth = new Date().getMonth();
  const monthlyAcceptanceData = [
    {
      name: "Jan",
      value: currentMonth >= 0 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Feb",
      value: currentMonth >= 1 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Mar",
      value: currentMonth >= 2 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Apr",
      value: currentMonth >= 3 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "May",
      value: currentMonth >= 4 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Jun",
      value: currentMonth >= 5 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Jul",
      value: currentMonth >= 6 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Aug",
      value: currentMonth >= 7 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Sep",
      value: currentMonth >= 8 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Oct",
      value: currentMonth >= 9 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Nov",
      value: currentMonth >= 10 ? Math.floor(Math.random() * 5) : 0,
    },
    {
      name: "Dec",
      value: currentMonth >= 11 ? Math.floor(Math.random() * 5) : 0,
    },
  ];

  return (
    <div className="container py-8">
      <DashboardHeader
        title="NGO Dashboard"
        onSearch={setSearchQuery}
        onExport={() => {
          toast.success("Export started", {
            description: "Your data is being exported to CSV",
          });
        }}
        onFilter={() => {
          toast.info("Filters applied");
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={<stat.icon className="h-6 w-6 text-primary" />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart
          title="Capacity Utilization"
          data={capacityData}
          type="pie"
        />
        <DashboardChart
          title="Monthly Patient Acceptance"
          data={monthlyAcceptanceData}
          type="bar"
        />
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Available Patients</h2>
            <Button
              className="gap-2"
              onClick={() => {
                toast.info("Opening capacity update form");
                router.push("/ngo/update-capacity");
              }}
            >
              <Building className="h-4 w-4" />
              Update Capacity
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={filteredPatients}
            isLoading={isLoading}
          />
        </div>
      </Card>

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Accepted Patients</h2>
          </div>

          {filteredAcceptedPatients.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              No patients have been accepted yet.
            </div>
          ) : (
            <DataTable
              columns={acceptedColumns}
              data={filteredAcceptedPatients}
              isLoading={isLoading}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
