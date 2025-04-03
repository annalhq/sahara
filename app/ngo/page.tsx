"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  getNGOs,
  getPendingPatients,
  type NGO,
  type Patient,
} from "@/lib/database";

export default function NGODashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [ngo, setNGO] = useState<NGO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock NGO ID for demo purposes
  const mockNGOId = "n001";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // For demo purposes, we're using the first NGO in our JSON file
      const ngos = getNGOs();
      const currentNGO = ngos.find((n) => n.id === mockNGOId) || ngos[0];

      if (currentNGO) {
        setNGO(currentNGO);
        // Get patients that need NGO placement
        const pendingPatients = getPendingPatients();
        setPatients(pendingPatients);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    alert("Export functionality would be implemented here");
  };

  const handleFilter = () => {
    // Implement filter functionality
    alert("Filter functionality would be implemented here");
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: Patient) => `${row.first_name} ${row.last_name}`,
    },
    {
      key: "date_of_birth",
      label: "Age",
      render: (row: Patient) => {
        const dob = new Date(row.date_of_birth);
        return new Date().getFullYear() - dob.getFullYear();
      },
    },
    { key: "hospital_id", label: "Hospital" },
    { key: "current_diagnosis", label: "Diagnosis" },
    { key: "address", label: "Location" },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Total Patients Housed",
      value: ngo?.total_patients_housed.toString() || "0",
      icon: Users,
    },
    {
      label: "Current Capacity",
      value: ngo ? `${ngo.current_capacity}%` : "0%",
      icon: Building,
    },
    {
      label: "Upcoming Intakes",
      value: ngo?.upcoming_intakes.toString() || "0",
      icon: Calendar,
    },
  ];

  return (
    <div className="container py-8">
      <DashboardHeader
        title="NGO Dashboard"
        onSearch={setSearchQuery}
        onExport={handleExport}
        onFilter={handleFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
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
            <h2 className="text-xl font-semibold">Available Patients</h2>
            <Button
              variant="outline"
              onClick={() => router.push("/ngo/update-capacity")}
            >
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
    </div>
  );
}
