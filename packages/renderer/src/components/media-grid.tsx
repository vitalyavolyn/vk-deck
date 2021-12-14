import { FC } from 'react'
import { PhotosPhoto } from '@vkontakte/api-schema-typescript'
import { classNames } from '@vkontakte/vkjs'
import { HasImageGridSettings } from '@/components/columns/common/column-image-grid-settings-form'
import { useColumn } from '@/hooks/use-column'
import { useElectron } from '@/hooks/use-electron'
import { useStore } from '@/hooks/use-store'
import { photoToViewerPhoto } from '@/utils/photo-to-viewer-photo'

import './media-grid.css'

interface MediaGridProps {
  photos: PhotosPhoto[]
}

export const MediaGrid: FC<MediaGridProps> = ({ photos }) => {
  const {
    settings: { imageGridSize },
  } = useColumn<HasImageGridSettings>()
  const { openViewer } = useElectron()
  const { apiStore } = useStore()

  const openPhotosInViewer = (index = 0) => {
    openViewer({
      photos: photos.map((photo) =>
        photoToViewerPhoto(
          photo,
          apiStore.getOwner(photo.user_id === 100 ? photo.owner_id : photo.user_id!),
        ),
      ),
      index,
    })
  }

  return (
    <div
      className={`media-grid media-grid-${Math.min(photos.length, 6)} media-grid-${imageGridSize}`}
    >
      {photos.slice(0, 6).map((photo, i) => {
        if (!photo || !photo.sizes) return null // TODO: проблема тайпинга?

        const sortedSizes = photo.sizes.sort((a, b) => a.height - b.height)

        const minWidth = 240
        const filteredSizes = sortedSizes.filter((e) => e.width > minWidth)
        const { url } = filteredSizes.length
          ? filteredSizes[0]
          : sortedSizes[sortedSizes.length - 1]

        const isOverlayed = photos.length > 6 && i === 5

        return (
          <div
            key={`${photo?.owner_id}_${photo?.id}`}
            onClick={() => !isOverlayed && openPhotosInViewer(i)}
            className={classNames('img', {
              'has-more': isOverlayed,
            })}
            data-text={`+${photos.length - 5}`}
          >
            <img src={url} />
          </div>
        )
      })}
    </div>
  )
}
