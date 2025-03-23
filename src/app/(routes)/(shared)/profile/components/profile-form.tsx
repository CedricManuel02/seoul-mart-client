"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formProfileSchema } from "@/_zod-schema/zod-schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Trash, Upload } from "lucide-react";

export default function ProfileForm({session} : {session: any}) {
  const [image, setImage] = useState<string>("");

  const form = useForm<z.infer<typeof formProfileSchema>>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      user_name: session?.user.name,
      user_email: session?.user.email,
      user_phone: session?.user.phone,
      user_profile: undefined,
    },
  });

  const handleChangeProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };

      fileReader.onerror = (error) => {
        console.error("Something went wrong while processing file upload:", error);
      };
      fileReader.readAsDataURL(file);
      form.setValue("user_profile", file);
    }
  };

  const handleDeleteImage = () => {
    setImage(""); 
    form.setValue("user_profile", null);
  };

  async function onSubmit(values: z.infer<typeof formProfileSchema>) {
    try {
      const updatedData = {
        name: values.user_name,
        email: values.user_email,
        phone: values.user_phone,
        profile: values.user_profile,
      };

      console.log(updatedData)
      // await fetch('/api/update-profile', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedData),
      // });

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Something went wrong processing updating profile:", error);
    }
  }

  return (
    <div className="w-full h-screen">
      <div className="w-11/12 md:w-6/12 lg:w-4/12 py-10 m-auto h-full">
        <header className="text-sm w-full py-4 flex flex-col justify-center">
          <h2 className="font-medium">Profile</h2>
          <p className="text-slate-500">Managed your profile information</p>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap flex-col items-center justify-center h-auto py-4 gap-4">
              <Avatar className="w-20 h-20 cursor-pointer hover:opacity-90 shadow-md">
                <AvatarImage src={image ? image : session?.user.profile || `https://api.dicebear.com/9.x/initials/svg?seed=${session?.user.name}`} />
              </Avatar>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button type="button" variant={"outline"}>
                  <Upload />
                  <Label htmlFor="file">Upload Image</Label>
                  <Input type="file" name="file" id="file" onChange={handleChangeProfile} className="hidden" />
                </Button>
                <Button type="button" variant={"destructive"} onClick={handleDeleteImage}>
                  <Trash />
                  Delete Image
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-700">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" id="user_name"  placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-700">Phone</FormLabel>
                  <FormControl>
                    <Input type="text" id="user_phone"  placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-700">Email</FormLabel>
                  <FormControl>
                    <Input type="text" id="user_email"  placeholder="Enter your email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end py-4">
              <Button type="submit" className="bg-green-500 hover:bg-green-700">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
