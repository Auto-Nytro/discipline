import { TaskId } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

export const TaskIdAdapter = ScalarAdapter.implement<TaskId>({
  name: "TaskId",

  write(value, destination, destinationImpl) {
    destinationImpl.writeInteger(destination, TaskId.getValue(value));
  },

  readOrThrow(source, sourceImpl) {
    return TaskId.wrap(sourceImpl.readIntegerOrThrow(source));
  },
});