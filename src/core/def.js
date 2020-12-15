import { mapTailAsObject } from "../utils/mapTailAsObject";

export const def = {
  pre: ([tag, ...map]) => {
    return {
      node: ["_"],
      siblingScope: {
        [tag]: {
          post: (tail, scope) => {
            const tailObj = mapTailAsObject(tail);

            return {
              node: ["_", ...map],
              innerScope: {
                "#": {
                  post: (tailMap, innerScope) => {
                    const [arg] = tailMap;
                    if (typeof arg === "number") {
                      if (Array.isArray(tail[arg])) {
                        return { node: ["'", ...tail[arg]] };
                      } else if (
                        tail[arg] !== null &&
                        tail[arg] !== undefined
                      ) {
                        return { node: ["'", tail[arg]] };
                      } else {
                        throw new Error(
                          `Argument not found. Positional argument ${arg} does not exist in scope.`
                        );
                      }
                    } else if (typeof arg === "string") {
                      if (Array.isArray(tailObj[arg])) {
                        return { node: ["'", ...tailObj[arg]] };
                      } else if (
                        tailObj[arg] !== null &&
                        tailObj[arg] !== undefined
                      ) {
                        return { node: ["'", tailObj[arg]] };
                      } else if ("#" in scope) {
                        return scope["#"].post(tailMap, innerScope);
                      } else {
                        throw new Error(
                          `Argument not found. Argument ${arg} does not exist in scope.`
                        );
                      }
                    } else {
                      return { node: ["'", ...tail] };
                    }
                  },
                },
              },
            };
          },
        },
      },
    };
  },
};
