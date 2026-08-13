const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "src", "scenePlan.json");
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function main() {
  const scriptArg = process.argv[2];
  if (!scriptArg) throw new Error("Usage: node scripts/plan.js <script.txt>");

  const scriptPath = path.resolve(process.cwd(), scriptArg);
  let script;
  try {
    script = await fs.readFile(scriptPath, "utf8");
  } catch {
    throw new Error(`Could not read script file: ${scriptPath}`);
  }

  // if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

  const [manifestText, promptTemplate] = await Promise.all([
    fs.readFile(path.join(ROOT, "manifest.json"), "utf8"),
    fs.readFile(path.join(ROOT, "system-prompt.txt"), "utf8"),
  ]);

  const manifest = JSON.parse(manifestText);
  const prompt = promptTemplate.replace("{{MANIFEST_JSON}}", manifestText);

  // Build the tool schema from the manifest so it stays the single source of truth.
  const components = manifest.components || [];
  const componentEnum = components.map((c) => c.name);
  const variantEnum = [...new Set(components.flatMap((c) => c.variants || []))];

  const tools = [
    {
      type: "function",
      function: {
        name: "submit_scene_plan",
        description: "Submit the complete ordered scene plan for the animation.",
        parameters: {
          type: "object",
          properties: {
            scenes: {
              type: "array",
              description: "Ordered list of scenes from first to last.",
              items: {
                type: "object",
                properties: {
                  beat: { type: "string", description: "Short label for this narrative beat." },
                  sourceText: { type: "string", description: "Exact source text taken from the script." },
                  component: { type: "string", enum: componentEnum },
                  variant: { type: "string", enum: variantEnum },
                  startFrame: { type: "integer", minimum: 0 },
                  duration: { type: "integer", minimum: 150 },
                },
                required: ["beat", "sourceText", "component", "variant", "startFrame", "duration"],
                additionalProperties: false,
              },
            },
          },
          required: ["scenes"],
          additionalProperties: false,
        },
      },
    },
  ];

  const request = {
    model: MODEL,
    temperature: 0.2,
    tools,
    tool_choice: { type: "function", function: { name: "submit_scene_plan" } },
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: script },
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || `OpenAI request failed (${response.status})`);
  }

  const message = payload.choices?.[0]?.message;
  const raw = message?.tool_calls?.[0]?.function?.arguments || message?.content;
  if (!raw) throw new Error("OpenAI returned no plan");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI returned invalid JSON that could not be parsed");
  }

  const scenes = Array.isArray(parsed) ? parsed : parsed.scenes || parsed.beats || parsed.plan;
  if (!Array.isArray(scenes)) {
    throw new Error("Plan response is not a scene array");
  }

  await fs.writeFile(OUTPUT, `${JSON.stringify(scenes, null, 2)}\n`);
  console.log(`Generated ${scenes.length} scenes using ${MODEL}.`);
}

main().catch((error) => {
  console.error(`Planning failed: ${error.message}`);
  process.exitCode = 1;
});
