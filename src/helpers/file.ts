import * as FileSystem from "fs"

export const readContents = (url) => {
  const data: any = FileSystem.readFileSync(url)
  return JSON.parse(data)
}
