import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			"--git": Boolean,
			"--yes": Boolean,
			"--install": Boolean,
			"-g": "--git",
			"-y": "--yes",
			"-i": "--install",
		},
		{
			argv: rawArgs.slice(2),
		}
	);
	return {
		skipPrompts: false,
		git: true,
		framework: "",
		language: "",
		targetDirectory: "",
		runInstall: args["--install"] || true,
	};
}

async function promptForMissingOptions(options) {
	const questions = [];

	if (!options.targetDirectory) {
		questions.push({
			type: "input",
			name: "targetDirectory",
			message: "What is the project name?",
			default: "new-WindUp-project",
		});
	}

	if (!options.framework) {
		questions.push({
			type: "list",
			name: "framework",
			message: "Select a framework:",
			choices: ["Vue 3"],
			default: "Vue 3",
		});
	}

	if (!options.language) {
		questions.push({
			type: "list",
			name: "language",
			message: "Select a language:",
			choices: ["TypeScript"],
			default: "TypeScript",
		});
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		targetDirectory: options.targetDirectory || answers.targetDirectory,
		language: options.language || answers.language,
		framework: options.framework || answers.framework,
		git: options.git || answers.git,
	};
}

export async function cli(args) {
	let options = parseArgumentsIntoOptions(args);
	options = await promptForMissingOptions(options);
	await createProject(options);
}
