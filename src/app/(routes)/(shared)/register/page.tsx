// DONE CODE CLEANING //
"use client"
import { z } from "zod"
import Link from "next/link"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { formRegisterSchema } from "@/_zod-schema/zod-schema"
import { Button } from "@/components/ui/button"
import ButtonLoading from "@/_components/shared/button-loading/button-loading"
import { SignupServerAction } from "@/_action/(shared)/login"

export default function Register() {
    const [loading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formRegisterSchema>>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            user_name: "",
            user_email: "",
            user_password: "",
            confirm_password: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formRegisterSchema>) {
        try {
            setIsLoading(true)
            const response = await SignupServerAction(values);

            if(response.error) {
                toast({
                    variant: "destructive",
                    description: response.error
                });
                return;
            }

            toast({
                title: "Successfully Registered",
                description: response.success
            });
            form.reset();
        } catch (error) {
            console.error("Something went wrong while registering an account");
            toast({
                variant: "destructive",
                description: "Something went wrong while processing your registration"
            });
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-11/12 xl:w-9/12  min-h-screen h-auto m-auto py-10 flex items-center justify-center">
            <Card className="border-none shadow-none md:shadow-md w-full sm:max-w-[450px]">
                <CardHeader>
                    <h3 className="text-slate-700 text-lg font-semibold">Register</h3>
                    <p className="text-slate-500 text-sm">Let's connect to your favorite food!</p>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="user_name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="font-medium text-slate-700">Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" id="user_name" placeholder="Enter your name"  {...field} />
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
                                            <Input type="email" id="user_email" placeholder="Enter your email"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />

                            <FormField
                                control={form.control}
                                name="user_password"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="font-medium text-slate-700">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" id="user_password" placeholder="Enter your password"  {...field} />
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
                                        <FormLabel className="font-medium text-slate-700">Confirm password</FormLabel>
                                        <FormControl>
                                            <Input type="password" id="confirm_password" placeholder="Confirm your password"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-green-500 hover:bg-green-600" variant={"default"} type={"submit"} disabled={loading}>{loading ? <ButtonLoading text={"Signing up..."}/> : "Register"}</Button>
                            <p className="text-slate-500 text-sm">Already have an account? <Link className="text-sm hover:text-green-600 hover:underline" href={"/login"}>Sign in</Link></p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
