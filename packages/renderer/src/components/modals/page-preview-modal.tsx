import { FC, ReactNode, useEffect, useState } from 'react'
import { GroupsGroupFull, PhotosPhoto, UsersUserFull } from '@vkontakte/api-schema-typescript'
import {
  Icon12Lock,
  Icon20CakeOutline,
  Icon20PlaceOutline,
  Icon20UsersOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import {
  Button,
  calcInitialsAvatarColor,
  Gradient,
  Group,
  Headline,
  Link,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  ModalRootProps,
  PanelSpinner,
  Title,
} from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { AsyncAvatar } from '@/components/async-avatar'
import { ColumnContainer } from '@/components/column-container'
import { useElectron } from '@/hooks/use-electron'
import { useStore } from '@/hooks/use-store'
import { ColumnType } from '@/store/settings-store'
import { getBiggestSize } from '@/utils/get-biggest-size'
import { getInitials } from '@/utils/get-initials'
import { getName } from '@/utils/get-name'
import { numberFormatter } from '@/utils/number-formatter'

import './page-preview-modal.css'

interface PagePreviewModalProps extends ModalRootProps {
  pageId: number
}

type Page = (UsersUserFull | GroupsGroupFull) & {
  wallCount: number | '???'
  mainPhoto?: PhotosPhoto
}

export const PagePreviewModal: FC<PagePreviewModalProps> = ({ pageId, ...restProps }) => {
  const { apiStore } = useStore()
  const { t } = useTranslation()
  const { openViewer } = useElectron()

  const [pageData, setPageData] = useState<Page | null>(null)
  const [activeModal, setActiveModal] = useState('page-preview')
  const [columnHeight, setColumnHeight] = useState(0)

  const modalContentRefCallback = (node: HTMLDivElement | null) => {
    if (node) {
      setColumnHeight(node.closest('.vkuiModalPage')!.clientHeight)
    }
  }

  const fetchData = async () => {
    if (apiStore.getOwner(pageId)) {
      setPageData({ ...apiStore.getOwner(pageId), wallCount: 0 })
    }

    const page = await apiStore.api.call<Page, { id: number }>('execute.getPage', { id: pageId })

    setPageData(page)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getOnlineStatus = (): ReactNode => {
    if (!pageData || !('online_info' in pageData) || !pageData.online_info) return null

    const { sex, online_info: onlineInfo } = pageData
    const { is_online: isOnline, visible, status, last_seen: lastSeen } = onlineInfo

    if (isOnline) {
      return t`pagePreview.online`
    }

    const context = sex === 1 ? 'female' : 'male'

    if (!visible) {
      return t(`pagePreview.online_${status}`, { context })
    }

    if (lastSeen) {
      // TODO: относительное время
      return lastSeen
    }
  }

  const showCover = (pageData as GroupsGroupFull | null)?.cover?.enabled

  return (
    <ModalRoot activeModal={activeModal} {...restProps}>
      <ModalPage dynamicContentHeight id="page-preview">
        {/* TODO: AppearanceProvider вместо игр со стилями */}
        <Gradient
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,
            backgroundImage: showCover
              ? `linear-gradient(to top, var(--transparent-tint), var(--transparent-tint)),url(${
                  getBiggestSize((pageData as GroupsGroupFull | null)!.cover!.images!).url
                })`
              : undefined,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            color: showCover ? 'white' : undefined,
          }}
        >
          {!pageData ? (
            <PanelSpinner />
          ) : (
            <>
              <AsyncAvatar
                gradientColor={calcInitialsAvatarColor(pageData.id)}
                initials={getInitials(pageData)}
                src={pageData.photo_100}
                size={96}
                className={classNames({ clickable: !pageData.is_closed })}
                onClick={() => {
                  if (!pageData.mainPhoto) return
                  const { mainPhoto, photo_100: smallPhoto } = pageData

                  openViewer({
                    photos: [
                      {
                        url: getBiggestSize(mainPhoto.sizes!).url,
                        date: mainPhoto.date,
                        owner: { name: getName(pageData), photo: smallPhoto },
                      },
                    ],
                    index: 0,
                  })
                }}
              />
              <Link
                href={`https://vk.com/${pageData.screen_name}`}
                target="_blank"
                className={classNames('profile-link', {
                  'cover-foreground': !!showCover,
                })}
              >
                <Title style={{ marginBottom: 4, marginTop: 12 }} level="2" weight="1">
                  {getName(pageData)}
                  {!!pageData.is_closed && <Icon12Lock />}
                </Title>
                <Headline style={{ marginBottom: 8 }} weight="regular">
                  @{pageData.screen_name}
                </Headline>
              </Link>
              {'online_info' in pageData && (
                <div className="info-block online-status">{getOnlineStatus()}</div>
              )}
              {'members_count' in pageData && (
                <div className="info-block">
                  <Icon20UsersOutline width={16} height={16} />
                  <span>
                    {t('pagePreview.subscribers', { num: numberFormatter(pageData.members_count) })}
                  </span>
                </div>
              )}
              {pageData.city && (
                <div className="info-block">
                  <Icon20PlaceOutline width={16} height={16} />
                  <span>{pageData.city.title}</span>
                </div>
              )}
              {'bdate' in pageData && (
                <div className="info-block">
                  <Icon20CakeOutline width={16} height={16} />
                  <span>{pageData.bdate}</span>
                </div>
              )}
            </>
          )}
        </Gradient>
        {pageData && (
          <Group>
            wallpost count {pageData.wallCount}
            <Button
              disabled={'can_access_closed' in pageData ? !pageData.can_access_closed : false}
              onClick={() => setActiveModal('wall-preview')}
            >
              dont click me
            </Button>
          </Group>
        )}
      </ModalPage>
      <ModalPage
        dynamicContentHeight
        id="wall-preview"
        header={<ModalPageHeader>oh wow</ModalPageHeader>}
        getModalContentRef={modalContentRefCallback}
      >
        <ColumnContainer
          columnData={{
            id: 'preview',
            type: ColumnType.wall,
            // modal max-height - column header - modal header
            settings: { ownerId: pageId, height: Math.min(columnHeight, 640 - 57 - 48) },
          }}
        />
      </ModalPage>
    </ModalRoot>
  )
}
