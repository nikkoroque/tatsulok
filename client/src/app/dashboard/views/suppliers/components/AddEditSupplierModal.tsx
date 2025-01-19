import { Supplier } from "@/models/Supplier";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AddEditSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: Supplier) => void;
  onUpdate: (id: number, formData: Partial<Supplier>) => void;
  row?: Supplier | null;
};

const AddEditSupplierModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  row,
}: AddEditSupplierModalProps) => {
    
  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be less than 50 characters" }),
    contact_email: z
      .string()
      .email({ message: "Invalid email address" })
      .max(50, { message: "Email must be less than 50 characters" })
      .optional(),
    contact_phone: z
      .string()
      .min(1, { message: "Contact phone is required" })
      .max(15, { message: "Contact phone must be less than 15 characters" })
      .optional(),
    address: z
      .string()
      .min(1, { message: "Address is required" })
      .max(255, { message: "Address must be less than 255 characters" })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      contact_phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (row) {
      form.reset({
        name: row.name || "",
        contact_email: row.contact_email || "",
        contact_phone: row.contact_phone || "",
        address: row.address || "",
      });
    } else {
      form.reset({
        name: "",
        contact_email: "",
        contact_phone: "",
        address: "",
      });
    }
  }, [row, form]);

  const handleSubmitSupplier = (values: z.infer<typeof formSchema>) => {
    const submissionData: Supplier = {
      supplier_id: row?.supplier_id || 0,
      name: values.name,
      contact_email: values.contact_email || "",
      contact_phone: values.contact_phone || "",
      address: values.address || "",
    };

    if (row) {
      onUpdate(row.supplier_id, submissionData);
    } else {
      onCreate(submissionData);
    }

    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 grid h-screen w-screen place-items-center bg-black bg-opacity-40 z-[10] backdrop-blur-sm transition-opacity duration-300">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{row ? "Update" : "Create"} Supplier</CardTitle>
          <CardDescription>
            {row ? "Update" : "Create"} an existing supplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitSupplier)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <sup className="text-red-900">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tatsulok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                        type="email"
                          placeholder="e.g. info@tatsulok.com"
                          {...field} // Binds the value to the form
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 09123456789"
                          {...field} // Binds the value to the form
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 123 Anywhere St."
                          {...field} // Binds the value to the form
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Required fields (<span className="text-red-900">*</span>)
              </p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`hover:bg-primary
                  `}
                >
                  {row ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditSupplierModal;
