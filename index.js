#!/usr/bin/env node

const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs-extra");

const cwd = process.cwd();

const getDefaultMetadataConfig = () => ({
  id: uuidv4(),
  name: "My name",
  description: "",
  schemaVersion: 2,
  baseQuestionType: "OpenForm",
  disableDefaultRendering: true,
  iconUrl: "design/icon.svg",
  designEntryPoint: "design/index.html",
  runtimeEntryPoint: {
    component: "runtime/component.js",
    deps: {
      scripts: [],
      styles: ["runtime/styles.css"],
    },
  },
});

const replaceGuidInFile = async (file, componentId) => {
  const data = await fs.readFile(file, "utf8");
  const result = data.replace(/__MY_COMPONENT_ID__/g, componentId);
  await fs.writeFile(file, result, "utf8");
};

const main = async () => {
  console.log("Welcome");
  const metadata = getDefaultMetadataConfig();
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "displayName",
      message: "What is the display name of your custom question?",
      validate(input) {
        if (!input.length) {
          return "Required.";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "baseQuestionType",
      message: "Confirmit base question type",
      choices: [
        { name: "Open Question", value: "OpenForm" },
        { name: "Info Question", value: "InfoForm" },
        { name: "Single Question", value: "SingleForm" },
        { name: "Multi Question", value: "MultiForm" },
        { name: "Grid Question", value: "GridForm" },
        { name: "3D Grid Question", value: "Grid3DForm" },
      ],
    },
  ]);

  metadata.name = answers.displayName;
  metadata.baseQuestionType = answers.baseQuestionType;

  await fs.writeJson(path.join(cwd, "metadata.json"), metadata, { spaces: 2 });
  await fs.copy(path.join(__dirname, "templates", "static"), cwd);
  await replaceGuidInFile(
    path.join(cwd, "runtime", "component.js"),
    metadata.id
  );

  console.log(
    "Done. You can modify custom question files and upload it as a zip file to Confirmit."
  );
};

main();
