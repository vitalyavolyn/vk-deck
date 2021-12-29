import { FC, ReactNode, useEffect, useState } from 'react'
import {
  GroupsGetByIdParams,
  GroupsGroupFull,
  UsersGetParams,
  UsersGetResponse,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import {
  Icon12Lock,
  Icon20CakeOutline,
  Icon20PlaceOutline,
  Icon20UsersOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import {
  Button,
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

export const PagePreviewModal: FC<PagePreviewModalProps> = ({ pageId, ...restProps }) => {
  const { apiStore } = useStore()
  const { t } = useTranslation()

  const [pageData, setPageData] = useState<UsersUserFull | GroupsGroupFull | null>(null)
  const [postsCount, setPostsCount] = useState<number | null>(null)
  const [activeModal, setActiveModal] = useState('page-preview')

  const fetchData = async () => {
    setPageData(apiStore.getOwner(pageId))

    if (pageId > 0) {
      const [user] = await apiStore.api.call<UsersGetResponse, UsersGetParams>('users.get', {
        user_ids: pageId.toString(),
        fields: 'screen_name,photo_100,city,bdate,counters,online_info,sex', // career,education?
      })

      setPageData(user)
      // TODO: приходит только у закрытых профилей, надо делать новую хранимку
      setPostsCount(user.counters?.posts ?? null)
    } else {
      // в новых версиях обновленный незадокументированный формат, типов нет
      const {
        groups: [group],
      } = await apiStore.api.call<{ groups: GroupsGroupFull[] }, GroupsGetByIdParams>(
        'groups.getById',
        {
          group_id: (-pageId).toString(),
          fields: 'screen_name,photo_100,counters,cover,members_count',
        },
      )

      setPageData(group)
    }
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
              {/* TODO: открывать фото в просмотрщике (fields: photo_id) */}
              <AsyncAvatar
                gradientColor={(pageData.id % 6) + 1}
                initials={getInitials(pageData)}
                src={pageData.photo_100}
                size={96}
              />
              <Link
                href={`https://vk.com/${pageData.screen_name}`}
                target="_blank"
                className={classNames('profile-link', {
                  'cover-foreground': !!showCover,
                })}
              >
                <Title style={{ marginBottom: 4, marginTop: 12 }} level="2" weight="bold">
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
            wallpost count {postsCount}
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
      >
        <ColumnContainer
          columnData={{ id: 'a', type: ColumnType.wall, settings: { ownerId: pageId } }}
        />
      </ModalPage>
    </ModalRoot>
  )
}
