"use client";

import { isAdmin } from "@/actions/cookies";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dataquality from "public/data_quality.svg";
import files from "public/file.svg";
import master from "public/master.svg";
import mdm from "public/mdm.svg";
import my_files from "public/my_file.svg";
import tasks from "public/tasks.svg";
import users from "public/users.svg";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    async function getAdmin() {
      const response = await isAdmin();
      setAdmin(response);
    }

    getAdmin();
  }, []);

  return (
    <aside className="group fixed z-10 h-screen w-14 items-center overflow-hidden bg-nav transition-all duration-500 hover:w-48">
      <Link href="/">
        <Image src={mdm} alt="MDM" className="w-14 px-2.5 py-5" />
      </Link>
      <div className="mx-2.5 mt-28 space-y-2.5 text-center group-hover:mx-5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
            pathname == "/" ? "bg-primary" : "",
          )}
        >
          <Image
            src={dataquality}
            alt="Data Quality"
            width={56}
            height={56}
            className="group-hover:w-6"
          />
          <p className="hidden font-medium text-white group-hover:block">
            Data Quality
          </p>
        </Link>
        <Link
          href="/files"
          className={cn(
            "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
            pathname == "/files" ? "bg-primary" : "",
          )}
        >
          <Image
            src={my_files}
            alt="My Files"
            width={56}
            height={56}
            className="group-hover:w-6"
          />
          <p className="hidden font-medium text-white group-hover:block">
            My Files
          </p>
        </Link>
        {admin && (
          <>
            <Link
              href="/master"
              className={cn(
                "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
                pathname == "/master" ? "bg-primary" : "",
              )}
            >
              <Image
                src={master}
                alt="Master Data"
                width={56}
                height={56}
                className="group-hover:w-6"
              />
              <p className="hidden font-medium text-white group-hover:block">
                Master Data
              </p>
            </Link>
            <Link
              href="/manage_files"
              className={cn(
                "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
                pathname == "/manage_files" ? "bg-primary" : "",
              )}
            >
              <Image
                src={files}
                alt="Manage Files"
                width={56}
                height={56}
                className="group-hover:w-6"
              />
              <p className="hidden font-medium text-white group-hover:block">
                Manage Files
              </p>
            </Link>
            <Link
              href="/users"
              className={cn(
                "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
                pathname == "/users" ? "bg-primary" : "",
              )}
            >
              <Image
                src={users}
                alt="Users"
                width={56}
                height={56}
                className="group-hover:w-6"
              />
              <p className="hidden font-medium text-white group-hover:block">
                Users
              </p>
            </Link>
          </>
        )}
        <Link
          href="/tasks"
          className={cn(
            "flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-primary",
            pathname == "/tasks" ? "bg-primary" : "",
          )}
        >
          <Image
            src={tasks}
            alt="Tasks"
            width={56}
            height={56}
            className="group-hover:w-6"
          />
          <p className="hidden font-medium text-white group-hover:block">
            Tasks
          </p>
        </Link>
      </div>
    </aside>
  );
}
