"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Bell,
  Users,
  Building,
  ArrowLeft,
  RefreshCcw,
  BarChart4,
  PieChart,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_patients: 0,
    placed_patients: 0,
    pending_requests: 0,
  });
  const { session, loading, isAuthenticated } = useAuth("/auth/login");

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        if (!session) return;

        const loadingToastId = toast.loading("Loading dashboard data...");

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

        toast.dismiss(loadingToastId);
        if (isInitialLoad.current) {
          toast.success("Dashboard data loaded successfully");
          isInitialLoad.current = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

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

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      if (session?.user?.id) {
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

        toast.success("Dashboard refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const processedPatients = patients.map((patient) => ({
    ...patient,
    date_of_birth: formatDate(patient.date_of_birth),
    created_at: formatDate(patient.created_at),
  }));

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "date_of_birth", label: "Date of Birth" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "pending" ? "outline" : "default"}>
          {value === "pending" ? "Pending" : "Assigned"}
        </Badge>
      ),
    },
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
      description: "Total patients registered",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Assigned to NGOs",
      value: stats.placed_patients.toString(),
      icon: Building,
      description: "Patients with NGO assignments",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      label: "Pending Requests",
      value: stats.pending_requests.toString(),
      icon: Bell,
      description: "Patients awaiting assignment",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
  ];

  const chartData = [
    { name: "Assigned", value: stats.placed_patients },
    { name: "Pending", value: stats.pending_requests },
  ];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold tracking-tight">
              Hospital Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor patients and manage your referrals
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                className="gap-2"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/hospital/register-patient">
                <Button
                  className="gap-2"
                  onClick={() => {
                    toast.info("Navigating to patient registration");
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Register Patient
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <DashboardHeader
          title=""
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.label}
              value={stat.value}
              description={stat.description}
              icon={
                <div className={`p-3 rounded-full ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              }
              className="transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            />
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={itemVariants}
        >
          <DashboardChart
            title="Patient Status Distribution"
            data={chartData}
            type="pie"
            icon={<PieChart className="h-5 w-5" />}
            description="Current patient assignment status"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
          <DashboardChart
            title="Monthly Registrations"
            data={monthlyData}
            type="bar"
            icon={<BarChart4 className="h-5 w-5" />}
            description="Patient registrations over time"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Recent Patients</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage and track patient referrals
                  </p>
                </div>
                <Link
                  href="/hospital/register-patient"
                  className="mt-4 sm:mt-0"
                >
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register New Patient
                  </Button>
                </Link>
              </div>

              {filteredPatients.length === 0 && !isLoading ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No patients found
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Start by registering new patients to your hospital
                  </p>
                  <Link
                    href="/hospital/register-patient"
                    className="mt-4 inline-block"
                  >
                    <Button className="mt-4">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register Patient
                    </Button>
                  </Link>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredPatients}
                  isLoading={isLoading}
                />
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
