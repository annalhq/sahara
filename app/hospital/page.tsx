"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Bell, Users, Building, ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Patient {
  id: any;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact_number: string;
  status: string;
  created_at: string;
  ngo_assignments: {
    id: any;
    status: any;
    ngo_id: any;
  }[];
}

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total_patients: 0,
    placed_patients: 0,
    pending_requests: 0,
  });
  const { session, loading, isAuthenticated } = useAuth("/auth/login");

  useEffect(() => {
    if (loading) return; // Don't fetch data while checking authentication
    if (!isAuthenticated) return; // Don't proceed if not authenticated

    const fetchData = async () => {
      try {
        if (!session) return; // Safety check

        // Fetch patients
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select(
            `
            id,
            first_name,
            last_name,
            date_of_birth,
            contact_number,
            status,
            created_at,
            ngo_assignments (
              id,
              status,
              ngo_id
            )
          `
          )
          .eq("hospital_id", session.user.id);

        if (patientsError) throw patientsError;
        setPatients(patientsData || []);

        // Calculate stats
        const total = patientsData?.length || 0;
        const placed =
          patientsData?.filter((p: any) => p.status === "assigned").length || 0;
        const pending =
          patientsData?.filter((p: any) => p.status === "pending").length || 0;

        setStats({
          total_patients: total,
          placed_patients: placed,
          pending_requests: pending,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to realtime updates
    let patientsSubscription: any;
    if (session) {
      patientsSubscription = supabase
        .channel("patients_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "patients",
          },
          () => {
            fetchData();
          }
        )
        .subscribe();
    }

    return () => {
      if (patientsSubscription) {
        supabase.removeChannel(patientsSubscription);
      }
    };
  }, [loading, isAuthenticated, session]);

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    {
      key: "date_of_birth",
      label: "Age",
      render: (row: any) => {
        const age =
          new Date().getFullYear() - new Date(row.date_of_birth).getFullYear();
        return `${age} years`;
      },
    },
    { key: "status", label: "Status" },
    {
      key: "created_at",
      label: "Registration Date",
      render: (row: any) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const filteredPatients = patients.filter((patient: any) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const statsData = [
    {
      label: "Total Registrations",
      value: stats.total_patients.toString(),
      icon: Users,
    },
    {
      label: "Assigned to NGOs",
      value: stats.placed_patients.toString(),
      icon: Building,
    },
    {
      label: "Pending Requests",
      value: stats.pending_requests.toString(),
      icon: Bell,
    },
  ];

  return (
    <div className="container py-8">
      <DashboardHeader
        title="Hospital Dashboard"
        onSearch={setSearchQuery}
        onExport={() => {}}
        onFilter={() => {}}
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

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <Link href="/hospital/register-patient">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Register New Patient
              </Button>
            </Link>
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
