"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { SharedSelection } from "@nextui-org/system";
import { Key } from "@react-types/shared";

import { generateWords } from "@/shared/algorithms";
import { playerConfigurations, Word } from "@/data/settings";

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
  const [secretWords, setSecretWords] = useState<Word>();
  const [isSecretWordShown, setIsSecretWordShown] = useState(false);

  function onLoadGame(players: string, playerNumber: number) {
    if (seed === "") return;

    const { word, secretWords } = generateWords(players, playerNumber, seed);

    setWord(word);
    setSecretWords(secretWords);
    setIsSecretWordShown(false);
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
        // @ts-ignore
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
          // @ts-ignore: Unreachable code error
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
        <Divider />
        <CardFooter className="flex justify-center">
          {!isSecretWordShown && (
            <Button
              fullWidth
              color="primary"
              onPress={() => {
                onLoadGame(numberOfPlayers.currentKey, 0);
              }}
            >
              Show secret words
            </Button>
          )}
          {isSecretWordShown && (
            <div>
              <div className="text-2xl font-extrabold py-5 italic text-green-600">
                Disciple: {secretWords.disciple}
              </div>
              <div className="text-2xl font-extrabold py-5 italic text-red-600">
                Impostor: {secretWords.impostor}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
