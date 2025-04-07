"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formProfileSchema } from "@/_zod-schema/zod-schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Check, Trash, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/_constant/constant";
import { deleteProfieImageServerAction, updateProfileServerAction } from "@/_action/(shared)/login";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { useRouter } from "next/navigation";

export default function ProfileForm({ session }: { session: any }) {
  const {update} = useSession();
  const router = useRouter();
  const [image, setImage] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formProfileSchema>>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      user_name: session?.user.name,
      user_email: session?.user.email,
      user_phone: session?.user.phone || "",
      user_profile: session?.user.image || undefined,
    },
  });

  const observer = !form.watch().user_name || !form.watch().user_email;

  // Handle file upload
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
        console.error("Error uploading image:", error);
      };
      if (file.size > MAX_FILE_SIZE) {
        form.setError("user_profile", { message: "Maximum file size exceeded, file must be 5MB below" });
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setImage("");
        form.setValue("user_profile", undefined);
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("user_profile", { message: "File type is invalid please try again" });
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setImage("");
        form.setValue("user_profile", undefined);
        return;
      }
      form.clearErrors("user_profile");
      fileReader.readAsDataURL(file);
      form.setValue("user_profile", file);
    }
  };

  // Handle image deletion
  async function handleDeleteImage (){
    try {
      const response = await deleteProfieImageServerAction();

      if(response.error) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
          description: response.error
        });

        return;
      }
      await update({
        ...session,
        user: {
          ...session?.user,
          image: null,
        }
       });

       toast({
        variant: "default",
        description: (<div className="flex items-center gap-2"><Check className="text-green-500"/>{response.success}</div>)
      });

      router.refresh();
    } catch(error) {
      console.error("Something went wrong while deleting your image:", error);
    }
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formProfileSchema>) {
    try {
      setLoading(true);
      const response = await updateProfileServerAction(values);

      if(response.error) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
          description: response.error
        });

        return;
      }
       await update({
        ...session,
        user: {
          ...session?.user,
          name: response.data.user_name,
          phone: response.data.user_phone,
          image: response.data.user_profile,
        }
       }
       )
      
      toast({
        variant: "default",
        description: (<div className="flex items-center gap-2"><Check className="text-green-500"/>{response.success}</div>)
      });

      router.refresh();
      
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Avatar image upload section */}
              <FormField
                control={form.control}
                name="user_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap flex-col items-center justify-center h-auto py-4 gap-4">
                        <Avatar className="w-20 h-20 cursor-pointer hover:opacity-90 shadow-md">
                          <AvatarImage
                            src={image || session?.user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${session?.user.name}`}
                            alt="Profile Image"
                            className="object-cover"
                          />
                        </Avatar>
                        <FormMessage />
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {/* Upload Button */}
                          <Button type="button" variant={"outline"}>
                            <Upload />
                            <Label htmlFor="file">Upload Image</Label>
                          </Button>
                          <Input ref={fileRef} type="file" id="file" className="hidden" onChange={handleChangeProfile} />
                          {/* Delete Button */}
                          {session.user.image &&   <Button
                            type="button"
                            variant={"destructive"}
                            onClick={handleDeleteImage}
                            disabled={form.getValues("user_profile") === undefined} 
                          >
                            <Trash />
                            Delete Image
                          </Button>}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Name field */}
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" id="user_name" placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email field (disabled) */}
              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input type="text" id="user_email" placeholder="Enter your email" {...field} disabled/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone field */}
              <FormField
                control={form.control}
                name="user_phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Phone</FormLabel>
                    <FormControl>
                      <Input type="text" id="user_phone" placeholder="Enter your phone number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <div className="flex items-center justify-end py-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-700" disabled={observer || loading}>
                  {loading ? <ButtonLoading text="Updating..."/> : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
