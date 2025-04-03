"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Building, Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NGODashboard() {
  const router = useRouter();
  const [patients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      hospital: "City General Hospital",
      requirements: "Physical therapy, Regular medication",
      location: "Mumbai",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 38,
      hospital: "District Hospital",
      requirements: "Occupational therapy",
      location: "Delhi",
    },
  ]);

  const stats = [
    { label: "Total Patients Housed", value: "89", icon: Users },
    { label: "Current Capacity", value: "75%", icon: Building },
    { label: "Upcoming Intakes", value: "8", icon: Calendar },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push("/ngo/update-capacity")}
        >
          <Building className="h-4 w-4" />
          Update Capacity
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <stat.icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Patient Listings */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Available Patients</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search patients..." className="pl-8" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.hospital}</TableCell>
                  <TableCell>{patient.requirements}</TableCell>
                  <TableCell>{patient.location}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
