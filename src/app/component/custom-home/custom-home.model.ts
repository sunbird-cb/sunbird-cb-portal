export interface IIIIDEMConfig {
  banner: {
    logo: string
    title: string
    description: string
    background: string
    stats: Array<{
      count: string
      label: string
    }>
  }
  features: {
    title: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  learning: {
    title: string
    courses: Array<{
      id: string
      thumbnail: string
      title: string
      description: string
      duration: string
    }>
  }
}