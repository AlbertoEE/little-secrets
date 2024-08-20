"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

export default function Home() {
  const router = useRouter();

  function onLoadGame(where: "join" | "start") {
    router.push("/" + where);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Button fullWidth color="primary" onPress={() => onLoadGame("start")}>
        START GAME
      </Button>

      <Button fullWidth color="primary" onPress={() => onLoadGame("join")}>
        JOIN GAME
      </Button>
    </section>
  );
}
