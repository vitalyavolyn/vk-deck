export const isDefaultAvatar = (url: string) =>
  url.startsWith('https://vk.com/images/community_') ||
  url.startsWith('https://vk.com/images/camera_')
