import seedrandom from "seedrandom";

import { playerConfigurations, Word, words } from "@/data/settings";

export interface SeedAndWord {
  seed: string;
  word: string;
  secretWords: Word;
}

export function generateWords(
  players: string,
  playerNumber: number,
  seed?: string
): SeedAndWord {
  const roles = [];
  const rolesReordenados = [];
  const result = [];

  if (!seed) {
    seed = crypto.randomUUID();
  }

  const rng = seedrandom(seed.toString());

  const configuration = playerConfigurations.find(
    (conf) => conf.players === players
  );

  for (let i = 0; i < parseInt(configuration!.disciples); i++) {
    roles.push("disciple");
  }
  for (let i = 0; i < parseInt(configuration!.impostors); i++) {
    roles.push("impostor");
  }
  for (let i = 0; i < parseInt(configuration!.periodists); i++) {
    roles.push("periodist");
  }

  while (roles.length != 0) {
    rolesReordenados.push(roles.splice(Math.floor(rng() * roles.length), 1)[0]);
  }

  const wordPair = words[Math.floor(rng() * words.length)];

  rolesReordenados.forEach((rol) => result.push(wordPair[rol]));

  return {
    seed: seed.toString(),
    word: result[playerNumber],
    secretWords: wordPair,
  };
}
