import Peer, { DataConnection } from "peerjs";

export class P2PClient {
  peer: Peer = new Peer();
  id: string;
  connections: Map<string, DataConnection> = new Map();
  private onOpenFunction: (id: string) => void = (_) => {};
  private onCloseFunction: () => void = () => {};
  private onConnectedFunction: (conn: DataConnection) => void = (_) => {};
  private onNewWordFunction: (seed: string, numberOfPlayers: string) => void = () => {};

  constructor() {
    this.peer.on("connection", (conn) => {
      this.onConnection(conn);
    });
    this.peer.on("open", (id) => {
      console.log("Connected with id ", id);
      this.id = this.peer.id;
      this.onOpenFunction(id);
    });
    this.peer.on('disconnected', () => {
      this.onCloseFunction();
    });
  }

  onOpen(fn: (id) => void) {
    this.onOpenFunction = fn;
  }

  onConnected(fn: (conn: DataConnection) => void) {
    this.onConnectedFunction = fn;
  }

  onClose(fn: () => void) {
    this.onCloseFunction = fn;
  }

  onNewWord(fn: (seed: string, numberOfPlayers: string) => void) {
    this.onNewWordFunction = fn;
  }

  sendNewWord(seed: string, numberOfPlayers: string) {
    this.connections.forEach((conn, peerId) => {
      console.log("Sending new word to", peerId);
      conn.send({
        command: Command.NEW_WORD,
        seed: seed,
        numberOfPlayers: numberOfPlayers,
      } as NewWordCommand);
    });
  }

  connectToHost(hostId: string) {
    let conn = this.peer.connect(hostId);

    console.log(conn);

    this.onConnection(conn);
  }

  close(peerId: string) {
    console.log("Closing connection to", peerId)
    let conn = this.connections.get(peerId);

    if (conn) {
      (conn as DataConnection).close();
    }
  }

  private onConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);
    conn.on("open", () => {
      console.log("Connection open to ", conn.peer);
      this.onConnectedFunction(conn);

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
      this.connections.delete(conn.peer);
      this.onCloseFunction();
    });
  }

  private handleMessage(command: CommandMessage) {
    console.log("Received command message", command);
    if (isNewWordCommand(command)) {
      console.log("Received new word command message", command);
      this.onNewWordFunction(command.seed, command.numberOfPlayers);
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
  numberOfPlayers: string;
}

function isCommandMessage(object: any): object is CommandMessage {
  return "command" in object;
}

function isNewWordCommand(object: any): object is NewWordCommand {
  return "command" in object && object.command == Command.NEW_WORD;
}
