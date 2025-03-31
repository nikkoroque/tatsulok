import { useValidateUserQuery } from "@/api/api";
import { User } from "@/models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { z } from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import useValidation from "@/hooks/use-validation";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type AddEditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: User) => void;
  onUpdate: (id: number, formData: Partial<User>) => void;
  row?: User | null;
};

// Define the options type
type ValidationOptions = {
  skip?: boolean;
};

// Create a custom hook for user validation
const useUserValidation = () => {
  // Return the hook itself instead of calling it
  return useValidateUserQuery;
};

const AddEditUserModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  row,
}: AddEditUserModalProps) => {
  const [username, setUsername] = useState<string>("");
  const debouncedUsername = useDebounce(username, 100);

  const formSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string()
      .transform(val => val === "" ? undefined : val)
      .superRefine((val, ctx) => {
        // Only require password for new users
        if (!row && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password is required for new users"
          });
        }
      }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "",
    },
    mode: "onChange",
  });

  // Update form when row changes or modal opens
  useEffect(() => {
    if (row && isOpen) {
      console.log("Setting form data for edit:", row);
      form.reset({
        username: row.username,
        password: "", // Empty for editing
        email: row.email,
        role: row.role,
      });
    } else if (!isOpen) {
      form.reset({
        username: "",
        password: "",
        email: "",
        role: "",
      });
    }
  }, [isOpen, row, form]);

  // Watch for username changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const trimmedUsername = (value.username ?? "").trim();
      setUsername(trimmedUsername);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const validateQuery = useUserValidation();

  const { error: usernameError, isChecking: isCheckingUsername } =
    useValidation<boolean>({
      value: debouncedUsername,
      originalValue: row?.username,
      validateQuery: (username: string, options: ValidationOptions) =>
        validateQuery(username, options),
      entityName: "User",
      conflictMessage: "Username already exists",
    });

  const handleSubmitUser = (values: z.infer<typeof formSchema>) => {
    const submissionData: Partial<User> = {
      user_id: row?.user_id || 0,
      username: values.username,
      email: values.email,
      role: values.role,
    };

    // Only include password if it's provided
    if (values.password) {
      submissionData.password = values.password;
    }

    if (row) {
      onUpdate(row.user_id, submissionData);
    } else {
      // For new users, password is required
      onCreate(submissionData as User);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 grid h-screen w-screen place-items-center bg-black bg-opacity-40 z-[10] backdrop-blur-sm transition-opacity duration-300">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{row ? "Update" : "Create"} User</CardTitle>
          <CardDescription>
            {row ? "Update" : "Create"} an existing user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitUser)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username <sup className="text-red-900">*</sup></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {isCheckingUsername && (
                        <span className="text-sm text-blue-500">Checking username...</span>
                      )}
                      {usernameError && (
                        <span className="text-sm text-red-500">{usernameError}</span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password {!row && <sup className="text-red-900">*</sup>}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        placeholder={row ? "Leave blank to keep current password" : "Enter password"}
                      />
                    </FormControl>
                    <FormDescription>
                      {row && "Leave blank to keep the current password"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <sup className="text-red-900">*</sup></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => {
                    console.log("Rendering role field with value:", field.value);
                    return (
                      <FormItem>
                        <FormLabel>Role <sup className="text-red-900">*</sup></FormLabel>
                        <Select
                          defaultValue={row?.role}
                          onValueChange={field.onChange}
                          value={field.value || row?.role}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role">
                              {field.value || row?.role}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                  disabled={!!usernameError}
                  className={`hover:bg-primary ${
                    usernameError ? "disabled:opacity-50" : ""
                  }`}
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

export default AddEditUserModal;
