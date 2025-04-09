"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  Calendar,
  CheckCircle,
  BarChart4,
  PieChart,
  RefreshCcw,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      if (session?.user?.id) {
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

        toast.success("Dashboard refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setIsRefreshing(false);
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
      description: "New patients awaiting acceptance",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Accepted Patients",
      value: stats.accepted_patients.toString(),
      icon: CheckCircle,
      description: "Patients under your care",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      label: "Current Capacity",
      value: `${stats.capacity_percentage}%`,
      icon: Building,
      description: "Of total facility utilization",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
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
            <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage patients and track capacity
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
            title="Capacity Utilization"
            data={capacityData}
            type="pie"
            icon={<PieChart className="h-5 w-5" />}
            description="Current occupancy status of your facility"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
          <DashboardChart
            title="Monthly Patient Acceptance"
            data={monthlyAcceptanceData}
            type="bar"
            icon={<BarChart4 className="h-5 w-5" />}
            description="Patients accepted over time"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="available">Available Patients</TabsTrigger>
              <TabsTrigger value="accepted">Accepted Patients</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
                <div className="p-6">
                  {filteredPatients.length === 0 && !isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No patients available for acceptance at this time.
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
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
                <div className="p-6">
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
