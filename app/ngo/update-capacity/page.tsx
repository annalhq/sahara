/* eslint-disable */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Building } from "lucide-react";

export default function UpdateCapacity() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentCapacity: 75,
    totalBeds: 120,
    availableBeds: 31,
    expectedNewBeds: 0,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "notes" ? value : parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would submit this data to your API
    console.log("Submitting capacity update:", formData);

    // Show success message and redirect back
    alert("Capacity updated successfully!");
    router.push("/ngo");
  };

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push("/ngo")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <Building className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Update Housing Capacity</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="currentCapacity">Current Capacity (%)</Label>
              <Input
                id="currentCapacity"
                name="currentCapacity"
                type="number"
                value={formData.currentCapacity}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBeds">Total Beds/Spaces</Label>
              <Input
                id="totalBeds"
                name="totalBeds"
                type="number"
                value={formData.totalBeds}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableBeds">Available Beds/Spaces</Label>
              <Input
                id="availableBeds"
                name="availableBeds"
                type="number"
                value={formData.availableBeds}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedNewBeds">Expected New Beds/Spaces</Label>
              <Input
                id="expectedNewBeds"
                name="expectedNewBeds"
                type="number"
                value={formData.expectedNewBeds}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional information about capacity changes..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Update Capacity
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
