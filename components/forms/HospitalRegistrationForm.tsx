"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const hospitalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  license_number: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  facilities: z.string().min(2, "Facilities required"),
  operating_hours: z.string().min(2, "Operating hours required"),
});

export function HospitalRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hospitalSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("hospitals").insert([
        {
          ...data,
          facilities: data.facilities
            .split(",")
            .map((facility: string) => facility.trim()),
          operating_hours: JSON.stringify({
            hours: data.operating_hours,
          }),
          verified: false,
        },
      ]);

      if (error) throw error;

      toast.success("Hospital registered successfully");
      router.push("/hospital");
    } catch (error) {
      toast.error("Failed to register hospital");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Hospital Registration</h1>
          <Button variant="outline" onClick={() => router.push("/hospital")}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hospital Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter hospital name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{`${errors.name.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter complete address"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{`${errors.address.message}`}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                {...register("contact_number")}
                placeholder="Enter contact number"
              />
              {errors.contact_number && (
                <p className="text-sm text-red-500">{`${errors.contact_number.message}`}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="license_number">License Number</Label>
            <Input
              id="license_number"
              {...register("license_number")}
              placeholder="Enter license number"
            />
            {errors.license_number && (
              <p className="text-sm text-red-500">{`${errors.license_number.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Input
              id="facilities"
              {...register("facilities")}
              placeholder="Enter facilities (comma-separated)"
            />
            {errors.facilities && (
              <p className="text-sm text-red-500">{`${errors.facilities.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="operating_hours">Operating Hours</Label>
            <Input
              id="operating_hours"
              {...register("operating_hours")}
              placeholder="e.g., Mon-Fri: 9 AM - 5 PM"
            />
            {errors.operating_hours && (
              <p className="text-sm text-red-500">{`${errors.operating_hours.message}`}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Hospital"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
