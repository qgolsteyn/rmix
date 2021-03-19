import { RmixDefinition } from "../types";

const namespace = (
  name: string,
  definition: Record<string, RmixDefinition>
) => {
  const namespacedDefinition: Record<string, RmixDefinition> = {};

  for (const key in definition) {
    namespacedDefinition[[name, key].join(".")] = definition[key];
  }

  return namespacedDefinition;
};

export default namespace;
