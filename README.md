# Obsidian File Include Plugin

Include files in Obsidian using fenced code blocks. For example, the markdown below will render the content of `path/to/file` in a code block.

    ```include
    path/to/file
    ```

The include plugin also supports language specifiers separated by a colon. For example using `include:python` will render the file content with Python syntax highlighting.

By default, the plugin resolves paths relative to the markdown file you are editing. If you want to use an absolute path, prefix the path with `/`.
