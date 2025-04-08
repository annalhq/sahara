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
  status: string;
  created_at: string;
  ngo_assignments?: Array<{
    id: string;
    status: string;
    ngo_id: string;
  }>;
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

  // Format date function to convert ISO string to YYYY-MM-DD HH:MM:SS
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    // Format as YYYY-MM-DD HH:MM:SS
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (loading) return; // Don't fetch data while checking authentication
    if (!isAuthenticated) return; // Don't proceed if not authenticated

    const fetchData = async () => {
      try {
        if (!session) return; // Safety check

        // Show loading toast
        const loadingToastId = toast.loading("Loading dashboard data...");

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

        // Dismiss loading toast and show success
        toast.dismiss(loadingToastId);
        toast.success("Dashboard data loaded successfully");
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
            filter: `hospital_id=eq.${session.user.id}`,
          },
          () => {
            toast.info("Patient data updated", {
              description:
                "The dashboard has been updated with new information.",
            });
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

  // Process data with formatted dates before passing to DataTable
  const processedPatients = patients.map((patient) => ({
    ...patient,
    date_of_birth: formatDate(patient.date_of_birth),
    created_at: formatDate(patient.created_at),
  }));

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Registration Date" },
  ];

  const filteredPatients = processedPatients.filter((patient: any) =>
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

  // Chart data
  const chartData = [
    { name: "Assigned", value: stats.placed_patients },
    { name: "Pending", value: stats.pending_requests },
  ];

  // Monthly registrations chart data (simulated)
  const currentMonth = new Date().getMonth();
  const monthlyData = [
    {
      name: "Jan",
      value: currentMonth >= 0 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Feb",
      value: currentMonth >= 1 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Mar",
      value: currentMonth >= 2 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Apr",
      value: currentMonth >= 3 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "May",
      value: currentMonth >= 4 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Jun",
      value: currentMonth >= 5 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Jul",
      value: currentMonth >= 6 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Aug",
      value: currentMonth >= 7 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Sep",
      value: currentMonth >= 8 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Oct",
      value: currentMonth >= 9 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Nov",
      value: currentMonth >= 10 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
    {
      name: "Dec",
      value: currentMonth >= 11 ? Math.floor(Math.random() * 10) + 1 : 0,
    },
  ];

  return (
    <div className="container py-8">
      <DashboardHeader
        title="Hospital Dashboard"
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
          title="Patient Status Distribution"
          data={chartData}
          type="pie"
        />
        <DashboardChart
          title="Monthly Registrations"
          data={monthlyData}
          type="bar"
        />
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <Link href="/hospital/register-patient">
              <Button
                className="gap-2"
                onClick={() => {
                  toast.info("Navigating to patient registration");
                }}
              >
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
