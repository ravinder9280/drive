import { Button } from "@monorepo/ui/components/button";
import Link from "next/link";

export default function Home() {
  return <main>

    <Link href={'/dashboard'}>
      <Button>

        Go To Dashboard
      </Button>
    </Link>

  </main>;
}
