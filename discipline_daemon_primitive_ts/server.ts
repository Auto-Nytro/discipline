import { 
  Procedures,
  ConditionalLocation, Duration, Program, Time, TimeRange, 
  VaultData, VaultName, createBadRequestResponse, 
  createInternalServerErrorResponse, createNotFoundResponse, 
  createOkResponse, parseInteger, createOkHtmlResponse, Program_toHtml
} from "./x.ts";

// export class Reader {
//   private constructor(private readonly parameters: URLSearchParams) {}

//   static create(parameters: URLSearchParams) {
//     return new Reader(parameters);
//   }

//   readAny(name: string) {
//     const value = this.parameters.get(name);
//     if (value !== null) {
//       return value;
//     }

//     return TextualError
//       .create("Reading a url search parameter")
//       .addMessage("Parameter doesn't exist")
//       .addStringAttachment("Parameter name", name);
//   }

//   readInteger(name: string) {
//     const valueAsString = this.parameters.get(name);
//     if (valueAsString === null) {
//       return TextualError
//         .create("Reading a url search parameter of type 'integer'")
//         .addMessage("Parameter doesn't exist")
//         .addStringAttachment("Parameter name", name);
//     }

//     const valueAsNumber = parseInteger(valueAsString);
//     if (valueAsNumber === null) {
//       return TextualError
//         .create("Reading a url search parameter of type 'integer'")
//         .addMessage("Parameter value cannot be parsed as 'integer'")
//         .addStringAttachment("Parameter name", name)
//         .addStringAttachment("Parameter value", valueAsString);
//     }

//     return valueAsNumber;
//   }

//   readString(name: string) {
//     const value = this.parameters.get(name);
//     if (value === null) {
//       return TextualError
//         .create("Reading a url search parameter of type 'string'")
//         .addMessage("Parameter doesn't exist")
//         .addStringAttachment("Parameter name", name);
//     }

//     return value;
//   }

//   readBoolean() {
//     const value = this.parameters.get(name);
//     if (value === null) {
//       return TextualError
//         .create("Reading a url search parameter of type 'boolean'")
//         .addMessage("Parameter doesn't exist")
//         .addStringAttachment("Parameter name", name);
//     }

//     if (value === "true") {
//       return true;
//     }
//     if (value === "false") {
//       return false;
//     }

//     return TextualError
//       .create("Reading a url search parameter of type 'boolean'")
//       .addMessage("Parameter value cannot be parsed as boolean: Expected literals 'true' or 'false', but found something else")
//       .addStringAttachment("Parameter name", name)
//       .addStringAttachment("Parameter value", value);
//   }
// }

// export class Deserialize<Value> {
//   private constructor(
//     readonly read: (reader: Reader) => Value | TextualError
//   ) {}

//   static implement<Value>({
//     read,
//   }: {
//     read: (reader: Reader) => Value | TextualError,
//   }) {
//     return new Deserialize(read);
//   }
// }

// const DurationDeserialize = Deserialize.implement<Duration>({
//   read(reader) {
//     const seconds = reader.readInteger();

//   },
// });

const createTimeRangeConditional = async (
  program: Program,
  url: URL,
) => {
  const locationParameter = url.searchParams.get("location");
  if (locationParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'location' is missing`);
  }
  
  const fromHourParameter = url.searchParams.get("from-hour");
  if (fromHourParameter === null) {
    return createBadRequestResponse(`Failure: Paramater 'from-hour' is missing`);
  }

  const fromMinuteParameter = url.searchParams.get("from-minute");
  if (fromMinuteParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'from-minute' is missing`);
  }

  const tillHourParameter = url.searchParams.get("till-hour");
  if (tillHourParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'till-hour' is missing`);
  }

  const tillMinuteParameter = url.searchParams.get("till-minute");
  if (tillMinuteParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'till-minute' is missing`);
  }

  const lifetimeInMinutesParameter = url.searchParams.get('lifetime');
  if (lifetimeInMinutesParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'lifetime' is missing`);
  }

  const location = ConditionalLocation.fromString(locationParameter);
  if (location instanceof Error) {
    return createBadRequestResponse(`Failure: Paramater 'location' is invalid as ConditionalLocation: ${location}`)
  }

  const fromHour = parseInteger(fromHourParameter);
  if (fromHour === null) {
    return createBadRequestResponse(`Failure: Paramater 'from-hour' is not an integer`);
  }

  const fromMinute = parseInteger(fromMinuteParameter);
  if (fromMinute === null) {
    return createBadRequestResponse(`Failure: Paramater 'from-minute' is not an integer`);
  }

  const fromTime = Time.fromHourAndMinuteOrError(fromHour, fromMinute);
  if (fromTime instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Time from parameters 'from-minute' and 'from-hour': ${fromTime}`);
  }

  const tillHour = parseInteger(tillHourParameter);
  if (tillHour === null) {
    return createBadRequestResponse(`Failure: Paramater 'till-hour' is not an integer`);
  }

  const tillMinute = parseInteger(tillMinuteParameter);
  if (tillMinute === null) {
    return createBadRequestResponse(`Failure: Paramater 'till-minute' is not an integer`);
  }
  
  const tillTime = Time.fromHourAndMinuteOrError(fromHour, fromMinute);
  if (tillTime instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Time from parameters 'till-minute' and 'till-hour': ${tillTime}`);
  }

  const timeRange = TimeRange.fromTimes(fromTime, tillTime);

  const lifetimeInMinutes = parseInteger(lifetimeInMinutesParameter);
  if (lifetimeInMinutes === null) {
    return createBadRequestResponse(`Failure: Parameter 'lifetime' is not an integer`);
  }

  const lifetime = Duration.fromMinutes(lifetimeInMinutes);
  if (lifetime instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Duration from parameter 'lifetime': ${lifetime}`);
  }

  const status = await Procedures.createTimeRangeConditional(
    program,
    timeRange,
    lifetime,
    location,
  );

  switch (status.type) {
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message.print()}`)
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
  }
};

const createCountdownConditional = async (
  program: Program,
  url: URL,
) => {
  const locationParameter = url.searchParams.get("location");
  if (locationParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'location' is missing`);
  }

  const durationInMinutesParameter = url.searchParams.get("duration");
  if (durationInMinutesParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'duration' is missing`);
  }

  const location = ConditionalLocation.fromString(locationParameter);
  if (location instanceof Error) {
    return createBadRequestResponse(`Failure: Paramater 'location' is invalid as ConditionalLocation: ${location}`)
  }

  const durationInMinutes = parseInteger(durationInMinutesParameter);
  if (durationInMinutes === null) {
    return createBadRequestResponse(`Failure: Parameter 'duration' is not an integer`);
  }

  const duration = Duration.fromMinutes(durationInMinutes);
  if (duration instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Duration from parameter 'lifetime': ${duration}`);
  }

  const status = await Procedures.createCountdownConditional(
    program,
    duration,
    location,
  );

  switch (status.type) {
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message.print()}`);
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
  }
};

const createUptimeAllowanceConditional = async (
  program: Program,
  url: URL,
) => {
    const locationParameter = url.searchParams.get("location");
  if (locationParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'location' is missing`);
  }
  
  const allowanceInMinutesParameter = url.searchParams.get('allowance');
  if (allowanceInMinutesParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'allowance' is missing`);
  }

  const lifetimeInMinutesParameter = url.searchParams.get('lifetime');
  if (lifetimeInMinutesParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'lifetime' is missing`);
  }

  const location = ConditionalLocation.fromString(locationParameter);
  if (location instanceof Error) {
    return createBadRequestResponse(`Failure: Paramater 'location' is invalid as ConditionalLocation: ${location}`)
  }

  const allowanceInMinutes = parseInteger(allowanceInMinutesParameter);
  if (allowanceInMinutes === null) {
    return createBadRequestResponse(`Failure: Parameter 'allowance' is not an integer`);
  }

  const allowance = Duration.fromMinutes(allowanceInMinutes);
  if (allowance instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Duration from parameter 'allowance': ${allowance}`);
  }

  const lifetimeInMinutes = parseInteger(lifetimeInMinutesParameter);
  if (lifetimeInMinutes === null) {
    return createBadRequestResponse(`Failure: Parameter 'lifetime' is not an integer`);
  }

  const lifetime = Duration.fromMinutes(lifetimeInMinutes);
  if (lifetime instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Duration from parameter 'lifetime': ${lifetime}`);
  }

  const status = await Procedures.createUptimeAllowanceConditional(
    program,
    allowance,
    lifetime,
    location,
  );

  switch (status.type) {
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message.print()}`);
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
  }
};

const createVault = async (
  program: Program,
  url: URL,
) => {
  const nameParameter = url.searchParams.get("name");
  if (nameParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'name' is missing`);
  }

  const dataParameter = url.searchParams.get("data");
  if (dataParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'data' is missing`);
  }

  const protectionDurationInMinutesParameter = url.searchParams.get('protection-duration');
  if (protectionDurationInMinutesParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'protection-duration' is missing`);
  }

  const name = VaultName.create(nameParameter);
  if (name instanceof Error) {
    return createBadRequestResponse(`Failure: Creating VaultName from 'name': ${name}`);
  }

  const data = VaultData.create(dataParameter);
  if (data instanceof Error) {
    return createBadRequestResponse(`Failure: Creating VaultData from 'data': ${data}`);
  }

  const protectionDurationInMinutes = parseInteger(protectionDurationInMinutesParameter);
  if (protectionDurationInMinutes === null) {
    return createBadRequestResponse(`Failure: Parameter 'protection-duration' is not an integer`);
  }

  const protectionDuration = Duration.fromMinutes(protectionDurationInMinutes);
  if (protectionDuration instanceof Error) {
    return createBadRequestResponse(`Failure: Couldn't create a Duration from parameter 'protection-duration': ${protectionDuration}`);
  }

  const status = await Procedures.createVault(
    program,
    name,
    data,
    protectionDuration,
  );

  switch (status.type) {
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message.print()}`);
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
  }
};

const deleteVault = async (
  program: Program,
  url: URL,
) => {
  const nameParameter = url.searchParams.get("name");
  if (nameParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'name' is missing`);
  }

  const name = VaultName.create(nameParameter);
  if (name instanceof Error) {
    return createBadRequestResponse(`Failure: Creating VaultName from 'name': ${name}`);
  }

  const status = await Procedures.deleteVault(program, name);
  switch (status.type) {
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message.print()}`);
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
  }
};

const prolongVaultProtection = async (
  program: Program,
  url: URL,
) => {
  const nameParameter = url.searchParams.get("name");
  if (nameParameter === null) {
    return createBadRequestResponse(`Failure: Parameter 'name' is missing`);
  }

  const name = VaultName.create(nameParameter);
  if (name instanceof Error) {
    return createBadRequestResponse(`Failure: Creating VaultName from 'name': ${name}`);
  }

  const status = await Procedures.prolongVaultProtection(program, name);
  switch (status.type) {
    case Procedures.StatusType.ExternalError: {
      return createBadRequestResponse(`Failure: ${status.message}`);
    }
    case Procedures.StatusType.InternalError: {
      return createInternalServerErrorResponse(`Failure: An internal error occured`);
    }
    case Procedures.StatusType.Success: {
      return createOkResponse(`Success`);
    }
  }
};

const CREATE_TIME_RANGE_CONDITIONAL = "/create-time-range-conditional";
const CREATE_COUNTDOWN_CONDITIONAL = "/create-countdown-conditional";
const CREATE_UPTIME_ALLOWANCE_CONDITIONAL = "/create-uptime-allowance-conditional";
const CREATE_VAULT = "/create-vault";
const DELETE_VAULT = "/delete-vault";
const PROLONG_VAULT_PROTECTION = "/prolong-vault-protection";

const process = async (
  program: () => Program,
  request: Request,
): Promise<Response> => {
  let url: URL;
  try {
    url = new URL(request.url);
  } catch (error) {
    console.error(error);
    return createBadRequestResponse("Malformed Url");
  }

  const pathname = url.pathname;
  switch (pathname) {
    case "/": {
      return createOkHtmlResponse(Program_toHtml(program()));
    }
    case CREATE_TIME_RANGE_CONDITIONAL: {
      return await createTimeRangeConditional(program(), url);
    }
    case CREATE_COUNTDOWN_CONDITIONAL: {
      return await createCountdownConditional(program(), url);
    }
    case CREATE_UPTIME_ALLOWANCE_CONDITIONAL: {
      return await createUptimeAllowanceConditional(program(), url);
    }
    case CREATE_VAULT: {
      return await createVault(program(), url);
    }
    case DELETE_VAULT: {
      return await deleteVault(program(), url);
    }
    case PROLONG_VAULT_PROTECTION: {
      return await prolongVaultProtection(program(), url);
    }
  }

  return createNotFoundResponse(`No such path: ${pathname}`)
};

export class Server {
  private constructor(private readonly it: Deno.HttpServer) {}

  static start(port: number, hostname: string, program: () => Program) {
    let server;

    try {
      server = Deno.serve(
        { 
          port, 
          hostname,
        }, 
        request => {
          return process(program, request);
        }
      );
    } catch (error) {
      return new Error(`Starting discipline http server on port ${port}. Error: ${error}`);
    }

    return new Server(server);
  }
}