"use client";
import { z } from "zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formForgotPasswordSchema } from "@/_zod-schema/zod-schema";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { useRouter } from "next/navigation";
import { ForgotPasswordServerAction } from "@/_action/(shared)/login";
import { toast } from "@/hooks/use-toast";
import {  CheckCircle2, UserX } from "lucide-react";
export default function ForgotPassword() {
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  const form = useForm<z.infer<typeof formForgotPasswordSchema>>({
    resolver: zodResolver(formForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formForgotPasswordSchema>) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await ForgotPasswordServerAction({user_email: values.email});
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
          <h3 className="text-slate-700 text-lg font-semibold">Forgot Your Password?</h3>
          <p className="text-slate-500 text-sm">Enter your email to receive password reset instructions.</p>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" id="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-green-500 hover:bg-green-600" variant={"default"} type={"submit"} disabled={state.loading}>
                {state.loading ? <ButtonLoading text={"Sending email..."} /> : "Send to email"}
              </Button>
              <p className="text-slate-700 text-sm py-2">
                Remember your account?{" "}
                <Link className="text-sm hover:text-green-600 hover:underline" href={"/login"}>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
