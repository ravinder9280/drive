"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@monorepo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@monorepo/ui/components/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { useAuth } from "@/hooks/useAuth";

import { ModeToggle } from "../ModeToggle";
import SearchModal from "../SearchModal";

const Navbar = () => {
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b sticky top-0 bg-background z-10 px-6  ">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-2">
          <Image
            alt={"Drive Logo"}
            height={32}
            src={"/drive-logo.png"}
            width={32}
          />
          <h1 className="text-lg font-semibold truncate hidden md:block">
            Divine
          </h1>
        </div>
        <div className=" flex-1 flex items-center justify-center">
          <SearchModal />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="ring-transparent">
              <Avatar className="size-8 ring-transparent">
                <AvatarImage
                  alt={"Shadcn"}
                  height={32}
                  src={"https://github.com/shadcn.png"}
                  width={32}
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
              >
                Log out <LogOutIcon className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
