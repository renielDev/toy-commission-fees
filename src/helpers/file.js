import * as FileSystem from "fs"

export const readContents = (url) => {
  const data = FileSystem.readFileSync(url)
  console.log("receive", JSON.parse(data))
  return JSON.parse(data)
}
