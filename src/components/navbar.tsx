"use client";

import Account from "@/components/account-dropdown";

export default function NavBar() {
  return (
    <nav className="fixed ml-14 flex h-14 w-full items-center justify-end gap-1 bg-nav pr-20 text-white">
      <Account />
    </nav>
  );
}
