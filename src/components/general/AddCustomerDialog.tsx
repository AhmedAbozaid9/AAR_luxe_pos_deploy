import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { createCustomer } from "../../api/createCustomer";
import type { Customer } from "../../api/getCustomers";
import { Plus } from "lucide-react";

interface AddCustomerDialogProps {
  onCustomerAdded: (customer: Customer) => void;
}

export const AddCustomerDialog = ({ onCustomerAdded }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone_country: "EG",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");    try {
      const response = await createCustomer(formData);
      console.log("Create customer response:", response);
        // Handle different response structures
      let customer: Customer | null = null;
      
      if (response.data?.id) {
        customer = response.data;
      } else if (response.id) {
        // API returned customer directly
        customer = {
          id: response.id,
          business_id: response.business_id ?? 0,
          name: response.name ?? formData.name,
          email: response.email ?? "",
          email_verified_at: response.email_verified_at ?? null,
          phone: response.phone ?? formData.phone,
          phone_country: response.phone_country ?? formData.phone_country,
          phone_normalized: response.phone_normalized ?? "",
          phone_national: response.phone_national ?? "",
          phone_e164: response.phone_e164 ?? "",
          phone_verified_at: response.phone_verified_at ?? null,
          language: response.language ?? "en",
          created_at: response.created_at ?? new Date().toISOString(),
          updated_at: response.updated_at ?? new Date().toISOString(),
          city_id: response.city_id ?? null,
          cars: response.cars ?? [],
        };
      }
      
      if (customer?.id) {
        onCustomerAdded(customer);
        setOpen(false);
        setFormData({ name: "", phone: "", phone_country: "EG" });
      } else {
        console.error("Invalid customer data received:", response);
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      console.error("Error creating customer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", phone_country: "EG" });
    setError("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="ml-2 h-10 w-10 border-green-500/40 hover:border-green-500/60"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer account. All fields are required.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">          <div className="space-y-2">
            <label htmlFor="customer-name" className="text-sm font-medium text-green-300">
              Customer Name
            </label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customer-phone" className="text-sm font-medium text-green-300">
              Phone Number
            </label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country-code" className="text-sm font-medium text-green-300">
              Country Code
            </label>
            <Input
              id="country-code"
              type="text"
              value={formData.phone_country}
              onChange={handleInputChange("phone_country")}
              required
              disabled={isLoading}
              readOnly
              className="bg-gray-700/50"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
