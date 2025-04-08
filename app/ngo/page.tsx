"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default function NGODashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Hardcoded NGO data
  const ngo = {
    id: "n001",
    name: "Helping Hands Foundation",
    total_patients_housed: 120,
    current_capacity: 75,
    upcoming_intakes: 10,
  };

 const patients = [
   {
     id: "p001",
     name: "Aarav Sharma",
     age: 52,
     hospital_id: "H003",
     current_diagnosis: "Hypertension",
     address: "15 MG Road, Mumbai, MH",
   },
  
 ];

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  const handleFilter = () => {
    alert("Filter functionality would be implemented here");
  };

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "age",
      label: "Age",
    },
    { key: "hospital_id", label: "Hospital" },
    { key: "current_diagnosis", label: "Diagnosis" },
    { key: "address", label: "Location" },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Total Patients Housed",
      value: ngo.total_patients_housed.toString(),
      icon: Users,
    },
    {
      label: "Current Capacity",
      value: `${ngo.current_capacity}%`,
      icon: Building,
    },
    {
      label: "Upcoming Intakes",
      value: ngo.upcoming_intakes.toString(),
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
            isLoading={false} // No async loading needed
          />
        </div>
      </Card>
    </div>
  );
}
