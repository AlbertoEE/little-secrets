"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Snippet } from "@nextui-org/snippet";
import { SharedSelection } from "@nextui-org/system";
import { Key } from "@react-types/shared";
import { Divider } from "@nextui-org/divider";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

import { playerConfigurations } from "@/data/settings";
import { generateWords } from "@/shared/algorithms";

export default function Home() {
  const [numberOfPlayers, setNumberOfPlayers] = useState(() => {
    const initialSelection = new Set<Key>(["4"]) as SharedSelection;

    initialSelection.anchorKey = "4";
    initialSelection.currentKey = "4";

    return initialSelection;
  });
  const [word, setWord] = useState("");
  const [seed, setSeed] = useState("");

  function onLoadGame(players: string, playerNumber: number) {
    const { seed, word } = generateWords(players, playerNumber);

    setSeed(seed);
    setWord(word);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
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
        isDisabled
        className="max-w"
        disabledKeys={["1"]}
        label="Select your player number"
        selectedKeys={"1"}
        selectionMode="single"
      >
        <SelectItem key="1">{"1"}</SelectItem>
      </Select>
      <Snippet className="w-full text-right">{seed}</Snippet>
      <Button
        fullWidth
        color="primary"
        onPress={() => {
          onLoadGame(numberOfPlayers.currentKey, 0);
        }}
      >
        Generate
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
