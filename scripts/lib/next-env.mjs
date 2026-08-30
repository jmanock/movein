import nextEnvironment from "@next/env";

const { loadEnvConfig } = nextEnvironment;

export function loadNextEnvironment(projectDirectory) {
  const development = process.env.NODE_ENV === "development";
  return loadEnvConfig(projectDirectory, development);
}
