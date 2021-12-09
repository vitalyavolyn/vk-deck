interface ViewerPhoto {
  // id and stuff for sharing?
  url: string
  date: number
  owner: {
    name: string
    photo?: string
  }
}

// не знаю, что буду делать с видео
interface ViewerData {
  photos: ViewerPhoto[]
  index: number
}
