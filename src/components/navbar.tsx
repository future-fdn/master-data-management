"use client";

import Account from "./account-dropdown";

export default function NavBar() {
  return (
    <nav className="ml-14 flex h-14 w-full items-center justify-end gap-1 bg-nav pr-10 text-white">
      <Account />
    </nav>
  );
}
