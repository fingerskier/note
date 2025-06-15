import { useState, useEffect } from 'react'
import './App.css'
import {
  pickDirectory,
  listTextFiles,
  readFile,
  writeFile,
  createFile,
  deleteFile,
} from './fileApi'

function App() {
  const [dir, setDir] = useState<FileSystemDirectoryHandle | null>(null)
  const [files, setFiles] = useState<FileSystemFileHandle[]>([])
  const [current, setCurrent] = useState<FileSystemFileHandle | null>(null)
  const [content, setContent] = useState('')
  const [newName, setNewName] = useState('')
  const [newContent, setNewContent] = useState('')

  const refresh = async (handle: FileSystemDirectoryHandle) => {
    setFiles(await listTextFiles(handle))
  }

  const selectDirectory = async () => {
    const handle = await pickDirectory()
    if (handle) {
      setDir(handle)
      await refresh(handle)
    }
  }

  const openFile = async (file: FileSystemFileHandle) => {
    setContent(await readFile(file))
    setCurrent(file)
  }

  const saveFile = async () => {
    if (current) {
      await writeFile(current, content)
      if (dir) await refresh(dir)
    }
  }

  const createNewFile = async () => {
    if (dir && newName) {
      const file = await createFile(dir, newName, newContent)
      setNewName('')
      setNewContent('')
      await refresh(dir)
      await openFile(file)
    }
  }

  const removeFile = async (file: FileSystemFileHandle) => {
    if (dir) {
      await deleteFile(dir, file.name)
      if (current?.name === file.name) {
        setCurrent(null)
        setContent('')
      }
      await refresh(dir)
    }
  }

  useEffect(() => {
    if (dir) refresh(dir)
  }, [dir])

  return (
    <div className="app">
      {!dir && <button onClick={selectDirectory}>Select Directory</button>}
      {dir && (
        <div>
          <h2>Directory: {dir.name}</h2>
          <button onClick={selectDirectory}>Change Directory</button>
          <ul>
            {files.map((f) => (
              <li key={f.name}>
                {f.name}{' '}
                <button onClick={() => openFile(f)}>Open</button>{' '}
                <button onClick={() => removeFile(f)}>Delete</button>
              </li>
            ))}
          </ul>
          <div className="new-file">
            <h3>Create New File</h3>
            <input
              placeholder="name.txt"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button onClick={createNewFile}>Create</button>
          </div>
          {current && (
            <div className="editor">
              <h3>Editing {current.name}</h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button onClick={saveFile}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
