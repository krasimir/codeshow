export type Item = {
  path: string,
  name: string,
  type: 'folder' | 'file',
  children: Item[]
}
export type Commands = {
  ['openFile']: string;
}
export type Slide = {
  description: string;
  commands: Commands[]
}
export type Script = {
  name: string;
  slides: Slide[];
}