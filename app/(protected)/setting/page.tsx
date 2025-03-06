"use client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ImageField } from "@/app/dashboard/_component/imageFields";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const SettingPage = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login');
    },
  });

  const form = useForm({
    defaultValues: {
      images: [],
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <ImageField
          control={form.control}
          name="images"
          label="Hotel Images"
          maxFiles={5}
        />
      </form>
    </Form>
  );
};

export default SettingPage;
