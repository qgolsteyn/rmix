import { mapTailAsObject } from "../utils/mapTailAsObject";

export const def = ([tag, ...map]) => {
  return {
    node: ["_"],
    siblingScope: {
      [tag]: {
        map: (tail, scope) => {
          const tailObj = mapTailAsObject(tail);

          return {
            node: ["_", ...map],
            innerScope: {
              "#": {
                map: (tailMap, innerScope) => {
                  const [arg] = tailMap;
                  if (typeof arg === "number") {
                    if (Array.isArray(tail[arg])) {
                      return { node: ["_", ...tail[arg]] };
                    } else if (tail[arg] !== null && tail[arg] !== undefined) {
                      return { node: ["_", tail[arg]] };
                    } else {
                      throw new Error(
                        `Argument not found. Positional argument ${arg} does not exist in scope.`
                      );
                    }
                  } else if (typeof arg === "string") {
                    if (Array.isArray(tailObj[arg])) {
                      return { node: ["_", ...tailObj[arg]] };
                    } else if (
                      tailObj[arg] !== null &&
                      tailObj[arg] !== undefined
                    ) {
                      return { node: ["_", tailObj[arg]] };
                    } else if ("#" in scope) {
                      return scope["#"].map(tail, innerScope);
                    } else {
                      throw new Error(
                        `Argument not found. Argument ${arg} does not exist in scope.`
                      );
                    }
                  } else {
                    return { node: ["_", ...tail] };
                  }
                },
              },
            },
          };
        },
      },
    },
  };
};
