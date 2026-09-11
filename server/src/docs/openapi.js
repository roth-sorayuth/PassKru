import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the clean openapi.yaml specification
export const openApiSpec = YAML.load(path.join(__dirname, "openapi.yaml"));
