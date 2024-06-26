"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { setUserCookie } from "@/server/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import mdm from "public/mdm.svg";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      setError("Invalid fields!");
    } else {
      const { email, password } = validatedFields.data;
      startTransition(async () => {
        await axios({
          method: "POST",
          url: process.env.NEXT_PUBLIC_API + "/login",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: { username: email, password: password },
        })
          .then(async (response) => {
            setSuccess("Logged in successfully!");
            await setUserCookie(response.data.access_token);
            window.location.href = "/";
          })
          .catch((error) => {
            setError(error?.response?.data?.detail);
          });
      });
    }
  };

  return (
    <CardWrapper
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
    >
      <div className="my-5 flex w-full flex-wrap items-center justify-center">
        <Image
          src={mdm}
          alt="MDM"
          width={50}
          height={50}
          className="my-5 invert"
        />

        <h1 className="w-full text-center text-2xl font-bold">Welcome back!</h1>
        <p className="text-center text-sm text-gray-500">
          Please login to get started.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="••••••••"
                      type="password"
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
