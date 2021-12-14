import { FC, MouseEventHandler, useState } from 'react'
import { PhotosPhoto, PhotosPhotoSizes } from '@vkontakte/api-schema-typescript'
import { classNames } from '@vkontakte/vkjs'
import { Spinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { HasImageGridSettings } from '@/components/columns/common/column-image-grid-settings-form'
import { useColumn } from '@/hooks/use-column'
import { useElectron } from '@/hooks/use-electron'
import { useStore } from '@/hooks/use-store'
import { photoToViewerPhoto } from '@/utils/photo-to-viewer-photo'

import './media-grid.css'

interface MediaGridProps {
  photos: PhotosPhoto[]
}

interface Point {
  x: number
  y: number
}

export const MediaGrid: FC<MediaGridProps> = observer(({ photos }) => {
  const {
    settings: { imageGridSize },
  } = useColumn<HasImageGridSettings>()
  const { openViewer } = useElectron()
  const { apiStore, settingsStore } = useStore()

  const [popupPhoto, setPopupPhoto] = useState<PhotosPhotoSizes | null>(null)
  const [popupCoordinates, setPopupCoordinates] = useState<Point | null>(null)

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

  const mouseLeave = () => {
    setPopupCoordinates(null)
  }

  const mouseEnter = (photo: PhotosPhotoSizes) => {
    setPopupPhoto(photo)
  }

  const mouseMove: MouseEventHandler = (e) => {
    if (!popupPhoto) return

    const { clientX: x, clientY: y } = e
    const { innerWidth, innerHeight } = window

    let photoHeight, photoWidth

    if (popupPhoto.width / popupPhoto.height < 350 / 500) {
      const ratio = popupPhoto.width / popupPhoto.height

      photoHeight = Math.min(500, popupPhoto.height)
      photoWidth = Math.min(350, photoHeight * ratio)
    } else {
      const ratio = popupPhoto.height / popupPhoto.width

      photoWidth = Math.min(350, popupPhoto.width)
      photoHeight = Math.min(500, photoWidth * ratio)
    }

    setPopupCoordinates({
      x: innerWidth - photoWidth - x < 0 ? innerWidth - photoWidth : x,
      y: innerHeight - photoHeight - y < 0 ? innerHeight - photoHeight : y,
    })
  }

  return (
    <>
      {popupCoordinates && popupPhoto && settingsStore.mediaQuickPreview && (
        <div className="photo-popup" style={{ top: popupCoordinates.y, left: popupCoordinates.x }}>
          <div className="spinner-wrap">
            {/* TODO: первые полсекунды находится у курсора */}
            <Spinner size="medium" />
          </div>
          <div className="image-wrap">
            <img src={popupPhoto.url} />
          </div>
        </div>
      )}
      <div
        className={`media-grid media-grid-${Math.min(
          photos.length,
          6,
        )} media-grid-${imageGridSize}`}
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
              // TODO: выбирать не самый большой размер лол
              onMouseEnter={() => mouseEnter(sortedSizes[sortedSizes.length - 1])}
              onMouseLeave={mouseLeave}
              onMouseMove={mouseMove}
            >
              <img src={url} />
            </div>
          )
        })}
      </div>
    </>
  )
})
