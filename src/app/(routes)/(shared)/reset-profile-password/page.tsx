"use client";
import { ResetProfilePasswordServerAction } from "@/_action/(shared)/login";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { formResetProfilePasswordSchema } from "@/_zod-schema/zod-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ResetProfilePassword() {
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });
  const form = useForm<z.infer<typeof formResetProfilePasswordSchema>>({
    resolver: zodResolver(formResetProfilePasswordSchema),
    defaultValues: {
      user_password: "",
      new_password: "",
      confirm_password: "",
    },
  });


  async function onSubmit(values: z.infer<typeof formResetProfilePasswordSchema>) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await ResetProfilePasswordServerAction({new_password: values.new_password, confirm_password: values.confirm_password, user_password: values.user_password});
      if (response.error) {
        toast({
          description: (<div className="flex items-center gap-2"><UserX className="text-red-500"/>{response.error}</div>)
        });
        return;
      }
      toast({
        variant:"default",
        description: (<div className="flex items-center gap-2"><CheckCircle2 className="text-green-500"/>{response.success}</div>)
      });
      router.push("/");
    } catch (error) {
      console.error("Something went wrong while processing your forgot password", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10 flex items-center justify-center">
      <Card className="border-none shadow-none md:shadow-md w-full sm:max-w-[450px]">
        <CardHeader>
          <h3 className="text-slate-700 text-lg font-semibold">Reset your password</h3>
          <p className="text-slate-500 text-sm">Change your password.</p>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="user_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Password</FormLabel>
                    <FormControl>
                      <Input type="password" id="password" placeholder="Enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" id="password" placeholder="Enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" id="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-green-500 hover:bg-green-600" variant={"default"} type={"submit"} disabled={state.loading}>
                {state.loading ? <ButtonLoading text={"Processing..."} /> : "Change Password"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
