"use client";
import { getToken } from "@/actions/cookies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { deleteUserCookie } from "@/server/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import user from "public/user.svg";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password have to be at least 8 characters",
  }),
});

export default function Account() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [username, setUsername] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = await getToken();
    const result = await axios
      .post(
        env.NEXT_PUBLIC_API + "/change_password",
        {
          password: values.password,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((response) => toast(response.data?.detail))
      .catch((error) => toast(error));
  }

  useEffect(() => {
    async function getUsername() {
      const token = await getToken();
      const data = await axios.get(env.NEXT_PUBLIC_API + "/users/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUsername(data.data.name);
    }

    getUsername();
  }, []);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={null}>
            <Image src={user} alt="User" width={24} height={24} />
            <p className="pl-1 font-normal">{username}</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-sm font-normal">
              Change password
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await deleteUserCookie();
              window.location.href = "/auth/login";
            }}
            className="text-sm font-normal"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>
                {
                  "Make changes to your password here. Click save when you're done."
                }
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
