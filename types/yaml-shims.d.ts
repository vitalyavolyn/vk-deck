// используется только для локалей
// TODO: обозначить, что это модуль locales
declare module '*.yml' {
  const content: { translation: { [key: string]: string } }
  export default content
}
