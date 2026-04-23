"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@monorepo/ui/components/dropdown-menu";
import Image from 'next/image';
import { LogOutIcon, Search } from 'lucide-react';
import { Input } from '@monorepo/ui/components/input';
import { ModeToggle } from '../ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import SearchModal from '../SearchModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter()

  return (
    <header className="border-b sticky top-0 bg-background z-10 px-6  ">
      <div className="flex h-16 items-center justify-between gap-4">

        <div className="min-w-0 flex items-center gap-2">
          <Image src={'/drive-logo.png'} alt={'Drive Logo'} width={32} height={32} />
          <h1 className="text-lg font-semibold truncate hidden md:block">Divine</h1>
        </div>
        <div className=" flex-1 flex items-center justify-center">
          <SearchModal />

        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="ring-transparent">
              <Avatar className="size-8 ring-transparent">
                <AvatarImage src={'https://github.com/shadcn.png'} height={32} width={32} alt={'Shadcn'} />
                <AvatarFallback>
                  SC
                </AvatarFallback>
              </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-500" onClick={() => {
                logout();
                router.replace("/login");
              }}>
                Log out <LogOutIcon className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar