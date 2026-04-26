"use client"
import { Button } from '@monorepo/ui/components/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'

const NavbarItems = [
    {
        label: "Home",
        link: "/",

    },
    {
        label: "About",
        link: "/",

    },
    {
        label: "Contact",
        link: "/",

    },
    {
        label: "News",
        link: "/",

    },
]
const Navbar = () => {
    const { isAuthed } = useAuth()
    return (
        <header className='h-16 border-b flex items sticky top-0 z-20-center backdrop-blur-md '>
            <div className=' mx-auto container flex items-center justify-between px-4 gap-4'>
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
                <nav className=' hidden md:flex items-center justify-between gap-8'>
                    {
                        NavbarItems.map((item, i) => (
                            <Link className='font-bold text-lg hover:text-primary' href={item.link}>
                                {item.label}
                            </Link>
                        ))
                    }


                </nav>
                {isAuthed ? <Button size={"lg"} variant={"outline"} asChild>
                    <Link href={"/dashboard"}>
                        Dashboard
                    </Link>
                </Button> :

                    <div className='flex items-center gap-4'>
                        <Button size={"lg"} className='font-bold  ' variant={"outline"} asChild >
                            <Link href={'/login'}>
                                Login
                            </Link>
                        </Button>
                        <Button size={"lg"} className='font-bold ' asChild >
                            <Link href={'/signup'}>
                                Sign Up
                            </Link>
                        </Button>
                    </div>
                }


            </div>

        </header>
    )
}

export default Navbar