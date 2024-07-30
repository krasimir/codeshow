export type Item = {
  path: string,
  name: string,
  type: 'folder' | 'file',
  children: Item[]
}
export type Command = {
  name: string;
  args: string;
}
export type Script = {
  slides: Command[];
}