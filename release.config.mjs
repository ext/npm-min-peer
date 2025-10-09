import changelog from "@html-validate/semantic-release-config/lib/changelog.js";
import commitAnalyzer from "@html-validate/semantic-release-config/lib/commit-analyzer.js";
import exec from "@html-validate/semantic-release-config/lib/exec.js";
import git from "@html-validate/semantic-release-config/lib/git.js";
import npm from "@html-validate/semantic-release-config/lib/npm.js";
import releaseNotesGenerator from "@html-validate/semantic-release-config/lib/release-notes-generator.js";

export default {
	plugins: [
		["@semantic-release/commit-analyzer", commitAnalyzer],
		["@semantic-release/release-notes-generator", releaseNotesGenerator],
		["@semantic-release/npm", npm],
		["@semantic-release/github", {}],
		["@semantic-release/changelog", changelog],
		["@semantic-release/exec", exec],
		["@semantic-release/git", git],
	],
};
