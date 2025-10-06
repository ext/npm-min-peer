import commitAnalyzer from "@html-validate/semantic-release-config/lib/commit-analyzer";
import releaseNotesGenerator from "@html-validate/semantic-release-config/lib/release-notes-generator";
import npm from "@html-validate/semantic-release-config/lib/npm";
import changelog from "@html-validate/semantic-release-config/lib/changelog";
import exec from "@html-validate/semantic-release-config/lib/exec";
import git from "@html-validate/semantic-release-config/lib/git";

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
