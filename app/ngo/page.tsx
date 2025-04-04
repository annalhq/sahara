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
   {
     id: "p002",
     name: "Diya Patel",
     age: 28,
     hospital_id: "H001",
     current_diagnosis: "Asthma",
     address: "42 Park Street, Kolkata, WB",
   },
   {
     id: "p003",
     name: "Rohan Singh",
     age: 65,
     hospital_id: "H002",
     current_diagnosis: "Diabetes Type 2",
     address: "110 Sector 17, Chandigarh, CH",
   },
   {
     id: "p004",
     name: "Ananya Gupta",
     age: 34,
     hospital_id: "H005",
     current_diagnosis: "Migraine",
     address: "7 Lajpat Nagar, Delhi, DL",
   },
   {
     id: "p005",
     name: "Vikram Kumar",
     age: 41,
     hospital_id: "H001",
     current_diagnosis: "Gastritis",
     address: "234 Anna Salai, Chennai, TN",
   },
   {
     id: "p006",
     name: "Priya Verma",
     age: 22,
     hospital_id: "H004",
     current_diagnosis: "Common Cold",
     address: "88 Residency Road, Bangalore, KA",
   },
   {
     id: "p007",
     name: "Aditya Reddy",
     age: 58,
     hospital_id: "H003",
     current_diagnosis: "Arthritis",
     address: "5 Jubilee Hills, Hyderabad, TS",
   },
   {
     id: "p008",
     name: "Sneha Joshi",
     age: 39,
     hospital_id: "H002",
     current_diagnosis: "Anemia",
     address: "9 Koregaon Park, Pune, MH",
   },
   {
     id: "p009",
     name: "Arjun Nair",
     age: 70,
     hospital_id: "H001",
     current_diagnosis: "Pneumonia",
     address: "1 Corporate Avenue, Ahmedabad, GJ",
   },
   {
     id: "p010",
     name: "Ishaan Menon",
     age: 31,
     hospital_id: "H005",
     current_diagnosis: "Dengue Fever",
     address: "67 Malviya Nagar, Jaipur, RJ",
   },
   {
     id: "p011",
     name: "Kavya Shah",
     age: 48,
     hospital_id: "H004",
     current_diagnosis: "Hypertension",
     address: "303 Hazratganj, Lucknow, UP",
   },
   {
     id: "p012",
     name: "Mohan Rao",
     age: 61,
     hospital_id: "H002",
     current_diagnosis: "Diabetes Type 2",
     address: "12 Civil Lines, Nagpur, MH",
   },
   {
     id: "p013",
     name: "Meera Iyer",
     age: 25,
     hospital_id: "H003",
     current_diagnosis: "Urinary Tract Infection",
     address: "45 Race Course Road, Indore, MP",
   },
   {
     id: "p014",
     name: "Rajesh Pillai",
     age: 55,
     hospital_id: "H001",
     current_diagnosis: "Gastritis",
     address: "99 Beach Road, Visakhapatnam, AP",
   },
   {
     id: "p015",
     name: "Aisha Khan",
     age: 43,
     hospital_id: "H005",
     current_diagnosis: "Skin Allergy",
     address: "21 Boring Road, Patna, BR",
   },
   {
     id: "p016",
     name: "Siddharth Malhotra",
     age: 36,
     hospital_id: "H002",
     current_diagnosis: "Migraine",
     address: "77 Alkapuri, Vadodara, GJ",
   },
   {
     id: "p017",
     name: "Neha Chopra",
     age: 29,
     hospital_id: "H004",
     current_diagnosis: "Asthma",
     address: "50 Kavi Nagar, Ghaziabad, UP",
   },
   {
     id: "p018",
     name: "Vivaan Aggarwal",
     age: 19,
     hospital_id: "H001",
     current_diagnosis: "Common Cold",
     address: "14 Model Town, Ludhiana, PB",
   },
   {
     id: "p019",
     name: "Riya Mehta",
     age: 68,
     hospital_id: "H003",
     current_diagnosis: "Arthritis",
     address: "2 Link Road, Bhopal, MP",
   },
   {
     id: "p020",
     name: "Kabir Das",
     age: 47,
     hospital_id: "H005",
     current_diagnosis: "Typhoid Fever",
     address: "8 East Coast Road, Chennai, TN",
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
