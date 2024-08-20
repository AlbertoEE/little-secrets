export interface word {
  disciple: string;
  impostor: string;
  periodist: string;
}

export interface playerConfiguration {
  players: string;
  disciples: string;
  impostors: string;
  periodists: string;
}

export const words: word[] = [
  {
    disciple: "PIÑA",
    impostor: "MANGO",
    periodist: "You are the Periodist",
  },
  {
    disciple: "AGUACATE",
    impostor: "GUACAMOLE",
    periodist: "You are the Periodist",
  },
];

export const playerConfigurations: playerConfiguration[] = [
  {
    players: "4",
    disciples: "3",
    impostors: "1",
    periodists: "0",
  },
  {
    players: "5",
    disciples: "3",
    impostors: "1",
    periodists: "1",
  },
  {
    players: "6",
    disciples: "4",
    impostors: "1",
    periodists: "1",
  },
  {
    players: "7",
    disciples: "4",
    impostors: "2",
    periodists: "1",
  },
  {
    players: "8",
    disciples: "5",
    impostors: "2",
    periodists: "1",
  },
];
