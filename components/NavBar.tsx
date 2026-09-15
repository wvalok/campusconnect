import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logout } from "@/app/login/actions";

export function NavBar({
  user,
}: {
  user: { name: string; email: string; avatarColor: string };
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/bennett-mark.png"
            alt="Bennett University"
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain"
            priority
          />
          <span className="hidden font-semibold text-slate-900 dark:text-white sm:inline">
            CampusConnect
          </span>
        </Link>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/me"
            className="flex items-center gap-2 rounded-lg p-0.5 pr-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Your profile"
          >
            <Avatar name={user.name} color={user.avatarColor} size={30} />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 md:inline">
              {user.name.split(" ")[0]}
            </span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
