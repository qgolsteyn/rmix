import { RmixDefinition } from "../types";

const rmxConsole: Record<string, RmixDefinition> = {
  ".console": {
    post: ([level, ...args]) => {
      switch (level) {
        case "log":
          console.log(args);
          break;
        case "info":
          console.info(args);
          break;
        case "warn":
          console.warn(args);
          break;
        case "error":
          console.error(args);
          break;
      }
      return { node: ["_"] };
    },
  },
};

export default rmxConsole;
