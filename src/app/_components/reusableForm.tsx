"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "react-hook-form";
import {
  Form,
  useFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
//types of data configured.
const formSchema = z.object({
  firstName: z.string().min(2, "length must be more than 2 character").max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email("Invalid email address"),
  username: z.string().min(5).max(10),
  DoB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  image: z.string(),
  password: z.string().min(8).max(20),
});
const section = () => {};
//image input -> need to be researched

function FillboxReusable({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function FormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate as user types
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      DoB: "",
      password: "",
      image: "",
    },
  });

  // Define what fields show in each step
  const stepFields = {
    1: [
      { name: "firstName", label: "First Name", placeholder: "John" },
      { name: "lastName", label: "Last Name", placeholder: "Doe" },
      { name: "username", label: "Username", placeholder: "johndoe123" },
    ],
    2: [
      {
        name: "email",
        label: "Email",
        placeholder: "john@example.com",
        type: "email",
      },
      {
        name: "DoB",
        label: "Date of Birth",
        placeholder: "1990-01-15",
        type: "date",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "••••••••",
        type: "password",
      },
    ],
  };

  async function handleNext() {
    // Validate only current step fields
    const fieldsToValidate = stepFields[step as keyof typeof stepFields].map(
      (f) => f.name
    );
    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    setStep(step - 1);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    // Handle submission (API call, redirect, etc.)
  }

  const currentFields = stepFields[step as keyof typeof stepFields];
  const totalSteps = Object.keys(stepFields).length;

  return (
    <div className="w-full h-screen flex flex-row justify-center items-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="text-center">
            <img src="/misc/Main 1.svg" alt="Logo" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Join Us!</h1>
            <p className="text-sm text-gray-600 mt-2">
              Please provide current information accurately
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-16 rounded-full ${
                  idx + 1 <= step ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-center text-sm font-medium">
            Step {step} of {totalSteps}
          </p>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Render current step fields */}
              {currentFields.map((field) => (
                <FillboxReusable
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.placeholder}
                />
              ))}

              {/* Navigation buttons */}
              <div className="flex gap-2 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}

                {step < totalSteps ? (
                  <Button type="button" onClick={handleNext} className="flex-1">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1">
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
