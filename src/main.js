/* ----- IMPORT:PACKAGES ------------------------- */
import chalk from "chalk";
import Listr from "listr";

/* ----- REQUIRE:PACKAGES ------------------------- */
const shell = require("shelljs");

/* ----- INSTALLATION:SHELL:CLONE REPO ------------------------- */
const coneGitRepo = async (options) => {
	let frameworkLower = options.framework.toLowerCase();
	let frameworkNoSpace = frameworkLower.replace(" ", "-");
	let framework = frameworkNoSpace;

	let languageLower = options.language.toLowerCase();
	let languageNoSpace = languageLower.replace(" ", "-");
	let language = languageNoSpace;

	let path = process.cwd();
	let gitPath = `https://github.com/WindUp-CLI/${framework}-${language}`;

	shell.cd(path);
	shell.exec(`git clone ${gitPath}`);
	shell.cd(`${framework}-${language}`);
};

/* ----- INSTALLATION:SHELL:REMOVE GIT REPO ------------------------- */
const removeGitRepo = async () => {
	shell.exec(`rm -rf .git`);
};

/* ----- INSTALLATION:SHELL:INITIALISING GIT ------------------------- */
const initialiseGitRepo = async () => {
	shell.exec(`git init`);
	shell.exec(`git checkout -b 'production'`);
};

/* ----- INSTALLATION:SHELL:INSTALL DEPENDENCIES ------------------------- */
const installDependencies = async () => {
	shell.exec(`rm -rf node_modules`);
	shell.exec(`rm -rf package-lock.json`);
	shell.exec(`npm i`);
};

/* ----- EXPORT:CREATE PROJECT ------------------------- */
export async function createProject(options) {
	options = {
		...options,
		targetDirectory: options.targetDirectory || "new-WindUp-project",
		email: "info@cws.ltd",
		name: "Clockwork Studios",
	};

	const tasks = new Listr(
		[
			{
				title: "Downloading Project Files",
				task: () => coneGitRepo(options),
			},
			{
				title: "Removing The Old Git Repo",
				task: () => removeGitRepo(),
			},
			{
				title: "Initialising Git",
				task: () => initialiseGitRepo(),
			},
			{
				title: "Install dependencies",
				task: () => installDependencies(),
			},
		],
		{
			exitOnError: false,
		}
	);

	await tasks.run();
	console.log("%s Project ready", chalk.green.bold("DONE"));
	return true;
}
