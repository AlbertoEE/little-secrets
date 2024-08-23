import Peer, { DataConnection } from "peerjs";

export class P2PClient {
  peer: Peer = new Peer();
  id: string;
  connections: Map<string, DataConnection> = new Map();
  private onOpenFunction: (id: string) => void = (_) => {};
  private onNewWordFunction: (seed: string) => void = (_) => {};

  constructor() {
    this.peer.on("connection", (conn) => {
      this.onConnection(conn);
    });
    this.peer.on("open", (id) => {
      console.log("Connected with id ", id);
      this.id = this.peer.id;
      this.onOpenFunction(id);
    });
  }

  onOpen(fn: (id) => void) {
    this.onOpenFunction = fn;
  }

  onNewWord(fn: (seed: string) => void) {
    this.onNewWordFunction = fn;
  }

  sendSeed(seed: string) {
    this.connections.forEach((conn, peerId) => {
      console.log("Sending seed to", peerId);
      conn.send({
        command: Command.NEW_WORD,
        data: {
          seed: seed,
        },
      } as CommandMessage);
    });
  }

  connectToHost(hostId: string) {
    let conn = this.peer.connect(hostId);

    console.log(conn);

    this.onConnection(conn);
  }

  private onConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);
    conn.on("open", () => {
      console.log("Connection open to ", conn.peer);

      conn.on("data", (data) => {
        if (isCommandMessage(data)) {
          this.handleMessage(data);
        } else {
          console.error("Invalid payload. Expected a command.", data);
          // TODO properly handle errors
        }
      });
    });

    conn.on("close", () => {
      console.log("Connection closed ", conn);
      delete this.connections[conn.peer];
    });
  }

  private handleMessage(command: CommandMessage) {
    console.log("Received command message", command);
    if (isNewWordCommand(command)) {
      this.onNewWordFunction(command.seed);
    } else {
      console.error("Invalid command message", command);
      // TODO properly handle errors
    }
  }
}

export enum Command {
  NEW_WORD,
}

export interface CommandMessage {
  command: Command;
}

export interface NewWordCommand extends CommandMessage {
  command: Command.NEW_WORD;
  seed: string;
}

function isCommandMessage(object: any): object is CommandMessage {
  return "command" in object;
}

function isNewWordCommand(object: any): object is NewWordCommand {
  return "command" in object && object.command == Command.NEW_WORD;
}
