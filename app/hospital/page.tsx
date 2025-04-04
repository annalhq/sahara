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
  },
  {
    id: "p002",
    first_name: "Diya",
    last_name: "Patel",
    date_of_birth: "1988-12-05",
    status: "Discharged",
    created_at: "2024-07-08T14:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p003",
    first_name: "Rohan",
    last_name: "Singh",
    date_of_birth: "2002-04-18",
    status: "Pending",
    created_at: "2024-07-19T08:45:00Z",
    hospital_id: "h001",
  },
  {
    id: "p004",
    first_name: "Ananya",
    last_name: "Gupta",
    date_of_birth: "1975-02-10",
    status: "Transferred",
    created_at: "2024-06-25T16:20:00Z",
    hospital_id: "h001",
  },
  {
    id: "p005",
    first_name: "Vikram",
    last_name: "Kumar",
    date_of_birth: "1999-11-30",
    status: "Admitted",
    created_at: "2024-07-20T07:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p006",
    first_name: "Priya",
    last_name: "Verma",
    date_of_birth: "1991-07-14",
    status: "Admitted",
    created_at: "2024-07-15T10:15:00Z",
    hospital_id: "h001",
  },
  {
    id: "p007",
    first_name: "Aditya",
    last_name: "Reddy",
    date_of_birth: "1983-09-03",
    status: "Discharged",
    created_at: "2024-07-01T17:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p008",
    first_name: "Sneha",
    last_name: "Joshi",
    date_of_birth: "2005-01-25",
    status: "Pending",
    created_at: "2024-07-18T13:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p009",
    first_name: "Arjun",
    last_name: "Nair",
    date_of_birth: "1979-06-08",
    status: "Admitted",
    created_at: "2024-07-19T11:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p010",
    first_name: "Ishaan",
    last_name: "Menon",
    date_of_birth: "1998-03-12",
    status: "Transferred",
    created_at: "2024-07-10T09:30:00Z",
    hospital_id: "h001",
  },
  {
    id: "p011",
    first_name: "Kavya",
    last_name: "Shah",
    date_of_birth: "1985-10-29",
    status: "Admitted",
    created_at: "2024-07-17T14:45:00Z",
    hospital_id: "h001",
  },
  {
    id: "p012",
    first_name: "Mohan",
    last_name: "Rao",
    date_of_birth: "1972-05-19",
    status: "Discharged",
    created_at: "2024-06-30T12:10:00Z",
    hospital_id: "h001",
  },
  {
    id: "p013",
    first_name: "Meera",
    last_name: "Iyer",
    date_of_birth: "2000-08-07",
    status: "Pending",
    created_at: "2024-07-20T10:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p014",
    first_name: "Rajesh",
    last_name: "Pillai",
    date_of_birth: "1993-01-01",
    status: "Admitted",
    created_at: "2024-07-16T08:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p015",
    first_name: "Aisha",
    last_name: "Khan",
    date_of_birth: "1980-11-11",
    status: "Transferred",
    created_at: "2024-07-05T15:55:00Z",
    hospital_id: "h001",
  },
  {
    id: "p016",
    first_name: "Siddharth",
    last_name: "Malhotra",
    date_of_birth: "1996-07-23",
    status: "Admitted",
    created_at: "2024-07-18T09:20:00Z",
    hospital_id: "h001",
  },
  {
    id: "p017",
    first_name: "Neha",
    last_name: "Chopra",
    date_of_birth: "1989-04-09",
    status: "Discharged",
    created_at: "2024-07-14T11:05:00Z",
    hospital_id: "h001",
  },
  {
    id: "p018",
    first_name: "Vivaan",
    last_name: "Aggarwal",
    date_of_birth: "2008-02-28",
    status: "Pending",
    created_at: "2024-07-19T15:30:00Z",
    hospital_id: "h001",
  },
  {
    id: "p019",
    first_name: "Riya",
    last_name: "Mehta",
    date_of_birth: "1977-10-15",
    status: "Admitted",
    created_at: "2024-07-11T18:00:00Z",
    hospital_id: "h001",
  },
  {
    id: "p020",
    first_name: "Kabir",
    last_name: "Das",
    date_of_birth: "1994-09-01",
    status: "Discharged",
    created_at: "2024-07-17T09:00:00Z",
    hospital_id: "h001",
  },
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
