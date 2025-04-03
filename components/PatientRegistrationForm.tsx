"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PatientRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    medicalHistory: "",
    currentCondition: "",
    transferNeeded: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to dashboard after successful registration
      router.push("/hospital");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Register New Patient</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push("/hospital")}
          >
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Patient's full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                placeholder="Patient's age"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Input
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Any relevant medical history"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCondition">Current Condition</Label>
            <Input
              id="currentCondition"
              name="currentCondition"
              value={formData.currentCondition}
              onChange={handleChange}
              required
              placeholder="Patient's current medical condition"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              id="transferNeeded"
              name="transferNeeded"
              type="checkbox"
              checked={formData.transferNeeded}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="transferNeeded">Requires NGO transfer</Label>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Registering Patient..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}