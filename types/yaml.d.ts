// используется только для локалей
declare module '*.yml' {
  const content: { translation: { [key: string]: string } }
  export default content
}
