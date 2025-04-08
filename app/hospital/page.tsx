"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Building, Bell } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  status: "Admitted" | "Discharged" | "Pending" | "Transferred";
  created_at: string;
  hospital_id: string;
}

export interface Hospital {
  id: string;
  name: string;
  total_patients: number;
  placed_patients: number;
  pending_requests: number;
}

const sampleHospital: Hospital = {
  id: "h001",
  name: "City General Hospital",
  total_patients: 258,
  placed_patients: 210,
  pending_requests: 15,
};

const samplePatients: Patient[] = [
  {
    id: "p001",
    first_name: "Aarav",
    last_name: "Sharma",
    date_of_birth: "1995-08-21",
    status: "Admitted",
    created_at: "2024-07-12T11:30:00Z",
    hospital_id: "h001",
  }
];

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [hospital, setHospital] = useState<Hospital | null>(sampleHospital);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    console.log("Exporting data:", filteredPatients);
    alert("Export functionality would be implemented here (check console)");
  };

  const handleFilter = () => {
    alert("Filter functionality would be implemented here");
  };

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    {
      key: "date_of_birth",
      label: "Age",
      render: (row: Patient) => {
        return "24";
      },
    },
    { key: "status", label: "Status" },
    {
      key: "created_at",
      label: "Registration Date",
      render: (row: Patient) => {
        return "01-02-2025";
      },
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const stats = hospital
    ? [
        {
          label: "Total Registrations",
          value: hospital.total_patients.toString(),
          icon: Users,
        },
        {
          label: "Successful Placements",
          value: hospital.placed_patients.toString(),
          icon: Building,
        },
        {
          label: "Pending Requests",
          value: hospital.pending_requests.toString(),
          icon: Bell,
        },
      ]
    : [];

  return (
    <div className="container py-8">
      <DashboardHeader
        title={hospital ? `${hospital.name} Dashboard` : "Hospital Dashboard"}
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
