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
import { useRouter } from "next/navigation";
import { SigninServerAction } from "@/_action/(shared)/login";
import { toast } from "@/hooks/use-toast";
import cookie from "js-cookie";


export default function Login() {
  const router = useRouter();
  const email = cookie.get("email");
  const remember_me = cookie.get("remember-me");
  const [rememberMe, setRememberMe] = useState<boolean>(false || Boolean(remember_me?.toLowerCase()));
  const [state, setState] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  console.log(email)

  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await SigninServerAction(values, rememberMe);
      if(response?.error) {
        toast({
          variant: "destructive",
          description: response.error
        });
        return;
      }
      router.push("/");
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
                      <FormLabel htmlFor="email" className="font-medium text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input type="email" id="email" placeholder="Enter your email" {...field} autoComplete="true" />
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
                      <FormLabel  htmlFor="password" className="font-medium text-slate-700">Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="password" placeholder="Enter your password" {...field} autoComplete="true"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" name="remember-me" onClick={() => setRememberMe(!rememberMe)} checked={rememberMe}/>
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
