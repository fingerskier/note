export {}

declare global {
  interface FileSystemDirectoryHandle {
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>
  }

  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>
  }
}
