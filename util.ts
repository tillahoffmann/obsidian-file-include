export function resolvePath(targetPath: string, sourcePath?: string): string {
	// Use forward slash for paths on all platforms.
	targetPath = targetPath.replace("\\", "/");
    // This is an absolute path in the file system. Complain about it.
    if (targetPath.startsWith("/")) {
        throw Error(`"${targetPath}" should not start with "/". Use "@/" to reference a file relative to the vault root.`);
    }
	// This is an absolute path; return it as is after popping the leading characters.
	if (targetPath.startsWith("@/")) {
		return targetPath.substring(2);
	}
	// Resolve the path relative to the source document after checking we have one.
    if (!sourcePath) {
        throw Error(`Cannot resolve relative path "${targetPath}" because the source path is missing.`);
    }
	const parts = sourcePath.split("/");
	// Remove the source filename to get the parent directory.
	parts.pop();
	for (const part of targetPath.split("/")) {
		if (part == "..") {
			if (parts.pop() == undefined) {
				throw Error(`"${targetPath}" could not be resolved. Did you use too many ".."?`);
			}
		} else if (part == "." || !part) {
			// Do nothing.
		} else {
			parts.push(part);
		}
	}
	return parts.join("/");
}
