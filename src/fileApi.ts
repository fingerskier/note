export async function pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (window as any).showDirectoryPicker()
  } catch (e) {
    if ((e as DOMException).name === 'AbortError') return null
    throw e
  }
}

export async function listTextFiles(dir: FileSystemDirectoryHandle): Promise<FileSystemFileHandle[]> {
  const files: FileSystemFileHandle[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const [name, handle] of (dir as any).entries()) {
    if (handle.kind === 'file' && (name.endsWith('.txt') || name.endsWith('.md')))
      files.push(handle as FileSystemFileHandle)
  }
  return files
}

export async function readFile(file: FileSystemFileHandle): Promise<string> {
  const f = await file.getFile()
  return f.text()
}

export async function writeFile(file: FileSystemFileHandle, contents: string): Promise<void> {
  const writable = await file.createWritable()
  await writable.write(contents)
  await writable.close()
}

export async function createFile(
  dir: FileSystemDirectoryHandle,
  name: string,
  contents: string,
): Promise<FileSystemFileHandle> {
  const file = await dir.getFileHandle(name, { create: true })
  await writeFile(file, contents)
  return file
}

export async function deleteFile(dir: FileSystemDirectoryHandle, name: string): Promise<void> {
  await dir.removeEntry(name)
}
