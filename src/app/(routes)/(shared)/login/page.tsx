"use client";
import { z } from "zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formLoginSchema } from "@/_zod-schema/zod-schema";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SigninServerAction } from "@/_action/(shared)/login";
export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [state, setState] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await SigninServerAction(values);
      if(response) {
        router.push("/")
      }
    } catch (error) {
      console.error("Something went wrong while logging in to your account", error);
      return { error: "Something went wrong while logging in to your account" };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10 flex items-center justify-center">
      <Card className="border-none shadow-none md:shadow-md w-full sm:max-w-[450px]">
        <CardHeader>
          <h3 className="text-slate-700 text-lg font-semibold">Login</h3>
          <p className="text-slate-500 text-sm">Try to explore more delicious food!</p>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-4 py-4">
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-slate-700">Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <label htmlFor="remember-me" className="text-sm">
                    Remember Me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm hover:text-green-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-green-500 hover:bg-green-600" variant={"default"} type={"submit"} disabled={state.loading}>
                {state.loading ? <ButtonLoading text={"Signing in..."} /> : "Sign in"}
              </Button>
              <p className="text-slate-700 text-sm py-2">
                Don"t have an account?{" "}
                <Link className="text-sm hover:text-green-600 hover:underline" href={"/register"}>
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
