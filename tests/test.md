Show a file in the same directory without syntax highlighting.

```include
test_hello.py
```

Show a file in the same directory with syntax highlighting.

```include python
test_hello.py
```

Show a file in the parent directory with syntax highlighting.

```include css
../styles.css
```

Show a file with absolute path with syntax highlighting.

```include python
/hello.py
```

Show an error message due to a missing file.

```include cpp
not_a_file.cpp
```

Show an error message due to being a folder.

```include
/tests
```

Show an error message due to using too many relative parts.

```include
../../hello.py
```

Demonstrate that we can handle complex paths. This should resolve to `test_hello.py` in the `tests` directory.

```include python
missing-child/../../tests/.///test_hello.py
```
