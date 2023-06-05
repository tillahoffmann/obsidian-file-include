import { resolvePath } from '../util';


describe('test resolving path', () => {
  test('path starting with @ should be absolute', () => {
    expect(resolvePath('@/path/from/root', 'absolutely/anything')).toBe('path/from/root');
  });
  test('absolute path should throw error', () => {
    expect(() => resolvePath('/path/from/root', 'absolutely/anything')).toThrow();
  });
  test('relative path should throw if no source path is given', () => {
    expect(() => resolvePath("relative")).toThrow();
  });
  test('relative path should throw if there are too many ..', () => {
    expect(resolvePath("../../file", "dir/of/source")).toBe("file");
    expect(() => resolvePath("../../../file", "dir/of/source")).toThrow();
  });
  test('should resolve paths relative to source', () => {
    expect(resolvePath("path/to/file", "dir/of/source")).toBe("dir/of/path/to/file");
    expect(resolvePath("./path/to/file", "dir/of/source")).toBe("dir/of/path/to/file");
    expect(resolvePath("../path/to/file", "dir/of/source")).toBe("dir/path/to/file");
    expect(resolvePath("path/../to/file", "dir/of/source")).toBe("dir/of/to/file");
    expect(resolvePath("path///to/file", "dir/of/source")).toBe("dir/of/path/to/file");
    expect(resolvePath("path/./to/file", "dir/of/source")).toBe("dir/of/path/to/file");
  });
});
