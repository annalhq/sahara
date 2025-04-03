"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Building, Bell } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  getHospitals,
  getPatients,
  getPatientsByHospitalId,
  type Patient,
  type Hospital,
} from "@/lib/database";

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock hospital ID for demo purposes
  const mockHospitalId = "h001";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // For demo purposes, we're using the first hospital in our JSON file
      const hospitals = getHospitals();
      const currentHospital =
        hospitals.find((h) => h.id === mockHospitalId) || hospitals[0];

      if (currentHospital) {
        setHospital(currentHospital);
        const hospitalPatients = getPatientsByHospitalId(currentHospital.id);
        setPatients(hospitalPatients);
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
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    {
      key: "date_of_birth",
      label: "Age",
      render: (row: Patient) => {
        const dob = new Date(row.date_of_birth);
        return new Date().getFullYear() - dob.getFullYear();
      },
    },
    { key: "status", label: "Status" },
    {
      key: "created_at",
      label: "Registration Date",
      render: (row: Patient) => {
        return new Date(row.created_at).toLocaleDateString();
      },
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Total Registrations",
      value: hospital?.total_patients.toString() || "0",
      icon: Users,
    },
    {
      label: "Successful Placements",
      value: hospital?.placed_patients.toString() || "0",
      icon: Building,
    },
    {
      label: "Pending Requests",
      value: hospital?.pending_requests.toString() || "0",
      icon: Bell,
    },
  ];

  return (
    <div className="container py-8">
      <DashboardHeader
        title="Hospital Dashboard"
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
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <Link href="./hospital/register-patient">
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
