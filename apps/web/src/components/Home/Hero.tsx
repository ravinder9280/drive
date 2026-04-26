import { Button } from '@monorepo/ui/components/button'
import React from 'react'
import HoverButton from './HoverButton'
import { Badge } from '@monorepo/ui/components/badge'

const Hero = () => {
    return (
        <section className="max-w-5xl h-[calc(100vh-4rem)] flex items-center  mx-auto py-20 md:py-28 px-2   ">
            <div className='realative h-screen 
'>
                <div className="absolute left-0 top-0 
    md:w-[454px] md:h-[454px] w-[200px] h-[200px] 
  bg-red-400 
    dark:opacity-40 opacity-60
    blur-2xl
    [clip-path:polygon(100%_0,_0_0,_0_100%)]
    pointer-events-none"
                />
                <div
                    className="absolute bottom-0 right-0 
  md:w-[454px] md:h-[454px] w-[200px] h-[200px] 
bg-red-400
  dark:opacity-40 opacity-60
  blur-2xl
  scale-y-[-1]
    scale-x-[-1]

  [clip-path:polygon(100%_0,_0_0,_0_100%)]
  pointer-events-none"/>
            </div>

            <div className='flex items-center flex-col '>
                <Badge className='mb-8 bg-primary/10 text-primary  text-base rounded-full'>
                File Management Made Simple
                </Badge>

                <div className='text-center '>

                    <h1 className=' text-5xl md:text-7xl font-bold mb-6 leading-tight'>
                        Store, manage, and share your files effortlessly.

                    </h1>
                    <p className='text-lg md:text-xl text-zinc-800 dark:text-zinc-300 font-medium'>
                    Upload your files, organize them into folders, and access everything whenever you need it, all within a clean and easy-to-use interface designed for simplicity.

                    </p>
                </div >
                <div className='flex justify-center mt-8'>
                    <HoverButton />

                </div>

            </div>
        </section>
    )
}

export default Hero