import { MarkdownRenderer, Plugin, TFile, TFolder, View } from 'obsidian';


function resolvePath(sourcePath: string, targetPath: string): string {
	// This is an absolute path; return it as is after popping the leading slash.
	if (targetPath.startsWith("/")) {
		return targetPath.substring(1);
	}
	// Resolve the path relative to the source document.
	const parts = sourcePath.split("/");
	// Remove the source filename to get the parent directory.
	parts.pop();
	for (const part of targetPath.split("/")) {
		if (part == "..") {
			if (parts.pop() == undefined) {
				throw Error(`"${targetPath}" could not be resolved.`);
			}
		} else if (part == ".") {
			// Do nothing.
		} else {
			parts.push(part);
		}
	}
	return parts.join("/");
}


export default class IncludeFilePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("include", async (source, el, ctx) => {
			let markdown: string;
			let include_path: string;
			try {
				// Get the section information.
				const sectionInfo = ctx.getSectionInfo(el);
				if (sectionInfo == null) {
					throw Error("Could not retrieve section information.");
				}

				// Resolve the file relative to the current document.
				include_path = resolvePath(ctx.sourcePath, source.trim());

				// Load the content.
				const include_file = this.app.vault.getAbstractFileByPath(include_path);
				if (include_file == null) {
					throw Error(`"${source}" could not be found.`);
				} else if (include_file instanceof TFolder) {
					throw Error(`"${source}" is a folder.`);
				} else if (!(include_file instanceof TFile)) {
					throw Error(`"${source}" is not a file.`);
				}
				const content = await this.app.vault.read(include_file);

				// Determine the language if any.
				const startLine = sectionInfo.text.split(/\n/)[sectionInfo.lineStart];
				const lang = startLine.match(/include(?:[:\s]+(?<lang>\w+))?/)?.groups?.lang;

				// Prepare the markdown content.
				markdown = ["```", lang, "\n", content.trim(), "\n```"].join("");
			} catch (error) {
				// Show an error message.
				let message: string;
				if (error instanceof Error) {
					message = error.message;
				} else {
					message = String(error);
				}
				markdown = `> [!error] ${message}`;
				include_path = "unresolved";
			}

			// Render the content or abort with a simple error message if there is no active view.
			const view = this.app.workspace.getActiveViewOfType(View);
			if (view == null) {
				el.createSpan({text: "There is no active view for rendering markdown."});
			} else {
				await MarkdownRenderer.renderMarkdown(markdown, el, include_path, view);
			}
		});
	}

	onunload() { }
}
