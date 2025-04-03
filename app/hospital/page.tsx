"use client";

import { useState, useEffect } from "react";
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
import { UserPlus, Users, Building, Bell, PieChart } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stats = [
    { label: "Total Registrations", value: "156", icon: Users },
    { label: "Successful Placements", value: "89", icon: Building },
    { label: "Pending Requests", value: "12", icon: Bell },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const hospitalId = session?.user?.id;

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("hospital_id", hospitalId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
        <Link
          href="./hospital/register-patient"
          className="inline-flex items-center"
        >
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register New Patient
          </Button>
        </Link>
      </div>

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

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <PieChart className="h-4 w-4" />
              View Reports
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>NGO Assigned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>
                      {new Date().getFullYear() -
                        new Date(patient.date_of_birth).getFullYear()}
                    </TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell>Pending</TableCell>
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
    </div>
  );
}
