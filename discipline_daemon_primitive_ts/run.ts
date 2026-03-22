import { Duration, Program, TextualError } from "./x.ts"

const main = async () => {


  const program = await Program.launch({
    dataDirectoryPath: "/home/lunynytro/Documents/discipline/discipline_daemon_primitive/data",
    clockSynchronizationInterval: Duration.fromMillisecondsOrThrow(1000 * 30),
    maximumConditionalNumber: 30,
    maximumVaultNumber: 10,
    serverHostname: "0.0.0.0",
    // serverHostname: "127.0.0.1",
    serverPort: 9090,
  });

  if (TextualError.is(program)) {
    console.error(program.print({ color: true }));
    return;
  } else {
    console.log("Program launched successfully");
  }
};

main()