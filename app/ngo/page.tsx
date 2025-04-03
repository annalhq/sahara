"use client";

import { useState, useEffect } from "react";
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
import { Users, Building, Calendar, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NGORegistrationModal } from "@/components/NGORegistrationModal";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";

export default function NGODashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNGOModal, setShowNGOModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Patients Housed", value: "89", icon: Users },
    { label: "Current Capacity", value: "75%", icon: Building },
    { label: "Upcoming Intakes", value: "8", icon: Calendar },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/ngo/update-capacity")}
          >
            <Building className="h-4 w-4" />
            Update Capacity
          </Button>
          <Button className="gap-2" onClick={() => setShowNGOModal(true)}>
            <Plus className="h-4 w-4" />
            Register NGO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <stat.icon className="h-8 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Available Patients</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>
                      {new Date().getFullYear() -
                        new Date(patient.date_of_birth).getFullYear()}
                    </TableCell>
                    <TableCell>{patient.hospital_id}</TableCell>
                    <TableCell>{patient.current_diagnosis}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <NGORegistrationModal
        open={showNGOModal}
        onOpenChange={setShowNGOModal}
        onSuccess={fetchPatients}
      />
    </div>
  );
}
