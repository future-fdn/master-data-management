import Image from "next/image";
import Link from "next/link";
import dataquality from "public/data_quality.svg";
import files from "public/file.svg";
import master from "public/master.svg";
import mdm from "public/mdm.svg";
import my_files from "public/my_file.svg";
import tasks from "public/tasks.svg";
import users from "public/users.svg";

export default function Sidebar() {
  return (
    <aside className="bg-nav group fixed z-10 h-screen w-14 items-center overflow-hidden transition-transform duration-500 hover:w-48">
      <Link href="/">
        <Image src={mdm} alt="MDM" className="w-14 px-2.5 py-5" />
      </Link>
      <div className="mx-2.5 mt-28 space-y-2.5 text-center group-hover:mx-5">
        <Link
          href="/"
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
        <Link
          href="/master"
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
        <Link
          href="/tasks"
          className="flex items-center gap-2 rounded bg-primary p-1.5"
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
