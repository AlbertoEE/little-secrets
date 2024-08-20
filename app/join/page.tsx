"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { SharedSelection } from "@nextui-org/system";
import { Key } from "@react-types/shared";

import { generateWords } from "@/shared/algorithms";
import { playerConfigurations } from "@/data/settings";

export default function Home() {
  const [numberOfPlayers, setNumberOfPlayers] = useState(() => {
    const initialSelection = new Set<Key>(["4"]) as SharedSelection;

    initialSelection.anchorKey = "4";
    initialSelection.currentKey = "4";

    return initialSelection;
  });
  const [playerNumber, setPlayerNumber] = useState(new Set([]));
  const [seed, setSeed] = useState("");
  const [word, setWord] = useState("...");

  function onLoadGame(players: string, playerNumber: number) {
    if (seed === "") return;

    const { word } = generateWords(players, playerNumber, seed);

    setWord(word);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Input
        label="Enter Seed"
        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        value={seed}
        onValueChange={setSeed}
      />
      <Select
        className="max-w"
        label="Select number of players"
        selectedKeys={numberOfPlayers}
        selectionMode="single"
        onSelectionChange={setNumberOfPlayers}
      >
        {playerConfigurations.map((configuration) => (
          <SelectItem key={configuration.players}>
            {configuration.players}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="max-w"
        disabledKeys={["1"]}
        label="Select your player number"
        selectedKeys={playerNumber}
        selectionMode="single"
        onSelectionChange={setPlayerNumber}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8"].map((number) => (
          <SelectItem key={number}>{number}</SelectItem>
        ))}
      </Select>
      <Button
        fullWidth
        color="primary"
        onPress={() =>
          onLoadGame(numberOfPlayers.currentKey, playerNumber.currentKey - 1)
        }
      >
        Join
      </Button>
      <Divider />
      <Card fullWidth>
        <CardHeader className="flex justify-center">
          <div className="text-4xl">Your word is...</div>
        </CardHeader>
        <Divider />
        <CardBody className="text-center">
          <div className="text-4xl font-extrabold py-10 italic">{word}</div>
        </CardBody>
      </Card>
    </section>
  );
}