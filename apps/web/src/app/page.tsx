import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";

export default function Home() {
  return <main className="min-h-screen  ">
    <div className=" bg-linear-to-b  from-white via-primary/70 to-white dark:from-black dark:via-primary/70 dark:to-primary/80">

      <Navbar />
      <Hero />
    </div>
    {/* <section className="py-28 bg-primary/60">

    </section>
 */}


  </main>;
}
