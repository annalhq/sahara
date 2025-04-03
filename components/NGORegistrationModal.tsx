import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ngoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  license_number: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  total_capacity: z.number().min(1, "Capacity must be at least 1"),
  service_areas: z.string().min(2, "Service areas required"),
});

interface NGORegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NGORegistrationModal({
  open,
  onOpenChange,
  onSuccess,
}: NGORegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ngoSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("ngos").insert([
        {
          ...data,
          service_areas: data.service_areas
            .split(",")
            .map((area: string) => area.trim()),
          current_capacity: data.total_capacity,
          verified: false,
        },
      ]);

      if (error) throw error;

      toast.success("NGO registered successfully");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to register NGO");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register NGO</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter organization name"
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
            <Label htmlFor="total_capacity">Total Capacity</Label>
            <Input
              id="total_capacity"
              type="number"
              {...register("total_capacity", { valueAsNumber: true })}
              placeholder="Enter total capacity"
            />
            {errors.total_capacity && (
              <p className="text-sm text-red-500">{`${errors.total_capacity.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_areas">Service Areas</Label>
            <Input
              id="service_areas"
              {...register("service_areas")}
              placeholder="Enter service areas (comma-separated)"
            />
            {errors.service_areas && (
              <p className="text-sm text-red-500">{`${errors.service_areas.message}`}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register NGO"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
