import { useGetCategoriesQuery, useValidateProductQuery } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import useValidation from '@/hooks/use-validation';
import { Product } from '@/models/Products';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

type AddEditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: Product) => void;
  onUpdate: (id: number, formData: Partial<Product>) => void;
  row?: Product | null;
}

// Define the options type
type ValidationOptions = {
  skip?: boolean;
};

// Create a custom hook for category validation
const useProductValidation = () => {
  // Return the hook itself instead of calling it
  return useValidateProductQuery;
};

const AddEditProductModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  row,
}: AddEditProductModalProps) => {
  const { hasPermission } = useAuth();
  const [productName, setProductName] = useState("");
  const debouncedProductName = useDebounce(productName, 100);


  const { data: categories = [], error } = useGetCategoriesQuery();

  useEffect(() => {
    if (error) {
      console.error("Error fetching categories:", error);
    }
  }, [error]);

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be less than 50 characters" }),

    description: z
      .string()
      .max(255, { message: "Description must be less than 255 characters" })
      .optional(),

    category_id: z
      .number({ invalid_type_error: "Category is required" })
      .int()
      .positive({ message: "Category ID must be a positive number" }),

    quantity: z
      .number({ invalid_type_error: "Quantity is required" })
      .int()
      .nonnegative({ message: "Quantity must be 0 or a positive number" }),

    price: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ invalid_type_error: "Price is required" })
        .nonnegative({ message: "Price must be 0 or a positive number" })
    ),

    img: z
      .string()
      .url({ message: "Invalid image URL" })
      .optional(),

    created_at: z
      .union([z.string(), z.date()])
      .transform((val) => new Date(val))
      .optional(),

    updated_at: z
      .union([z.string(), z.date()])
      .transform((val) => new Date(val))
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: undefined,
      quantity: 0,
      price: 0,
      img: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        name: "",
        description: "",
        category_id: undefined,
        quantity: 0,
        price: 0,
        img: "",
      });
    } else if (row) {
      form.reset({
        name: row.name || "",
        description: row.description || "",
        category_id: row.category_id || undefined,
        quantity: row.quantity || 0,
        price: row.price || 0,
        img: row.img || "",
      });
    }
  }, [isOpen, row, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const trimmedProductName = (value.name ?? "").trim(); // ✅ Fix here
      setProductName(trimmedProductName);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const validateQuery = useProductValidation();

  const {
    error: productNameError,
    isChecking: isCheckingProductName,
  } = useValidation<boolean>({
    value: debouncedProductName,
    originalValue: row?.name,
    validateQuery: (name: string, options: ValidationOptions) =>
      validateQuery(name, options),
    entityName: "Product",
    conflictMessage: "Product name already exists."
  });

  const handleSubmitProduct = (values: z.infer<typeof formSchema>) => {
    const submissionData: Product = {
      product_id: row?.product_id || 0,
      name: values.name,
      description: values.description || "",
      category_id: values.category_id || 0,
      quantity: values.quantity || 0,
      price: values.price || 0,
      img: values.img || "",
      created_at: values.created_at ? new Date(values.created_at) : new Date(),
      updated_at: values.updated_at ? new Date(values.updated_at) : new Date(),
    };

    if (row) {
      onUpdate(row.product_id, submissionData);
    } else {
      onCreate(submissionData);
    }

    form.reset();
    onClose();
  }



  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 grid h-screen w-screen place-items-center bg-black bg-opacity-40 z-[10] backdrop-blur-sm transition-opacity duration-300">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{row ? "Update" : "Create"} Product</CardTitle>
          <CardDescription>{row ? "Update" : "Create"} an existing product.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitProduct)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <sup className="text-red-900">*</sup></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apple iPhone" {...field} />
                  </FormControl>
                  <FormDescription>
                    {isCheckingProductName && <span className="text-sm text-blue-500">Checking product name...</span>}
                    {productNameError && <span className="text-sm text-red-500">{productNameError}</span>}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. High-quality smartphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <p className="text-sm text-muted-foreground">Required fields (<span className="text-red-900">*</span>)</p>

              <FormField control={form.control} name="category_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category <sup className="text-red-900">*</sup></FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border p-2 rounded-md w-full"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value || ""}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity <sup className="text-red-900">*</sup></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Convert to number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price <sup className="text-red-900">*</sup></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 999.99"
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />




              <FormField control={form.control} name="img" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="e.g. https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                {hasPermission('create', 'products') && (
                  <Button type="submit" disabled={!!productNameError} className={`hover:bg-primary ${productNameError ? "disabled:opacity-50" : ""}`}>
                    {row ? "Update" : "Create"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddEditProductModal;