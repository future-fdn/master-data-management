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
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import user from "public/user.svg";
import { useEffect, useState } from "react";

export default function Account() {
  const router = useRouter();

  const [username, setUsername] = useState(false);

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
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            {"Make changes to your password here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm_password"
              placeholder="Confirm Password"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
