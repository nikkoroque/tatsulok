import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
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
import { Category } from "@/models/Category";
import { useValidateCategoryQuery } from "@/api/api";
import useDebounce from "@/hooks/use-debounce";
import useValidation from "@/hooks/use-validation";


type AddEditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: Category) => void;
  onUpdate: (id: number, formData: Partial<Category>) => void;
  row?: Category | null;
};

// Define the options type
type ValidationOptions = {
  skip?: boolean;
};

// Create a custom hook for category validation
const useCategoryValidation = () => {
  // Return the hook itself instead of calling it
  return useValidateCategoryQuery;
};

const AddEditCategoryModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  row,
}: AddEditCategoryModalProps) => {
    const [categoryName, setCategoryName] = useState<string>("");
    const debouncedCategoryName = useDebounce(categoryName, 100);

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be less than 50 characters" }),
    description: z
      .string()
      .max(255, { message: "Description must be less than 255 characters" })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
        form.reset({
            "name": "",
            "description": "",
        });
    } else if (row) {
        form.reset({
            "name": row.name || "",
            "description": row.description || "",
        });
    }
  }, [isOpen, row, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
        const trimmedCategoryName = (value.name ?? "").trim();
        setCategoryName(trimmedCategoryName);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Get the query hook
  const validateQuery = useCategoryValidation();

  const {
    error: categoryNameError,
    isChecking: isCheckingCategoryName,
  } = useValidation<boolean>({
    value: debouncedCategoryName,
    originalValue: row?.name,
    validateQuery: (name: string, options: ValidationOptions) => validateQuery(name, options),
    entityName: "Category",
    conflictMessage: "Category name already exists.",
  });



  const handleSubmitCategory = (values: z.infer<typeof formSchema>) => {
    const submissionData: Category = {
      category_id: row?.category_id || 0,
      name: values.name,
      description: values.description || "",
    };

    if (row) {
      onUpdate(row.category_id, submissionData);
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
          <CardTitle>{row ? "Update" : "Create"} Category</CardTitle>
          <CardDescription>
            {row ? "Update" : "Create"} an existing category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitCategory)}
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
                      <Input placeholder="e.g. Clothing" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                        {isCheckingCategoryName && (
                            <span className="text-sm text-blue-500">Checking category name...</span>
                        )}
                        {categoryNameError && (
                            <span className="text-sm text-red-500">{categoryNameError}</span>
                        )}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Soft Material" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-sm text-muted-foreground">
                  Required fields (<span className="text-red-900">*</span>)
                </p>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!!categoryNameError}
                    className={`hover:bg-primary ${categoryNameError ? "disabled:opacity-50" : ""}`}
                  >
                    {row ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditCategoryModal;
