import path from "path";
import { fileURLToPath } from "url";

import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));
const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), {
  recursive: true,
});

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
