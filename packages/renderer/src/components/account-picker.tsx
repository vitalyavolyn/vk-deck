import { FC, useState } from 'react'
import { Icon20CheckCircleFillGreen, Icon24ChevronUp } from '@vkontakte/icons'
import { Avatar, calcInitialsAvatarColor, classNames, RichCell } from '@vkontakte/vkui'
import { TextTooltip } from '@vkontakte/vkui/dist/unstable'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/hooks/use-store'
import { getInitials } from '@/utils/get-initials'
import { getName } from '@/utils/get-name'
import { AsyncAvatar } from './async-avatar'

import './account-picker.css'

export enum AccountPickerMode {
  grid = 'grid',
  minigrid = 'minigrid',
  list = 'list',
}

interface AccountPickerProps {
  mode: AccountPickerMode
  selectedAccount: number
  onSelect(id: number): void
}

interface AccountProps {
  name: string
  id: number
  screenName: string
  photo?: string
  isSelected: boolean
  mode: AccountPickerMode
  onClick: () => void
}

const Account: FC<AccountProps> = ({ name, id, screenName, photo, isSelected, mode, onClick }) => {
  if (mode !== AccountPickerMode.list) {
    const isLargeGrid = mode === AccountPickerMode.grid
    const imageSize = isLargeGrid ? 48 : 32
    const iconSize = isLargeGrid ? 20 : 16

    return (
      <div className="account">
        <TextTooltip text={name}>
          <div className={classNames('account-avatar', { selected: isSelected })} onClick={onClick}>
            <AsyncAvatar
              gradientColor={calcInitialsAvatarColor(id)}
              initials={getInitials(name)}
              size={imageSize}
              src={photo}
            />
            {isSelected && <Icon20CheckCircleFillGreen width={iconSize} height={iconSize} />}
          </div>
        </TextTooltip>
      </div>
    )
  }

  return (
    <RichCell
      before={
        <div className={classNames('account-avatar', { selected: isSelected })}>
          <AsyncAvatar
            gradientColor={calcInitialsAvatarColor(id)}
            initials={getInitials(name)}
            size={32}
            src={photo}
          />
          {isSelected && <Icon20CheckCircleFillGreen width={16} height={16} />}
        </div>
      }
      caption={'@' + screenName}
      onClick={onClick}
    >
      {name}
    </RichCell>
  )
}

export const AccountPicker: FC<AccountPickerProps> = observer(
  ({ mode, selectedAccount, onSelect }) => {
    const { apiStore } = useStore()
    const { user, managedGroups } = apiStore.initData
    const [isExpanded, setIsExpanded] = useState(false)

    const isList = mode === AccountPickerMode.list

    const groups = isList ? managedGroups : managedGroups.slice(0, 10)

    // TODO: если групп будет ровно 11, то будет некрасиво
    const expandable = !isList && managedGroups.length > 10

    return (
      <div className={classNames('account-picker', mode)}>
        <Account
          name={getName(user)}
          id={user.id}
          screenName={user.screen_name!}
          photo={user.photo_50}
          isSelected={selectedAccount === user.id}
          mode={mode}
          onClick={() => {
            onSelect(user.id)
          }}
        />

        {groups.map((group) => (
          <Account
            key={group.id}
            name={group.name}
            id={group.id}
            screenName={group.screen_name}
            photo={group.photo_50}
            isSelected={selectedAccount === -group.id}
            mode={mode}
            onClick={() => {
              onSelect(-group.id)
            }}
          />
        ))}

        {expandable && (
          <Avatar
            className="expand-button"
            size={mode === AccountPickerMode.grid ? 48 : 32}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Icon24ChevronUp /> : `+${managedGroups.length - 10}`}
          </Avatar>
        )}

        {isExpanded &&
          managedGroups.slice(10).map((group) => (
            <Account
              key={group.id}
              name={group.name}
              id={group.id}
              screenName={group.screen_name}
              photo={group.photo_50}
              isSelected={selectedAccount === -group.id}
              mode={mode}
              onClick={() => {
                onSelect(-group.id)
              }}
            />
          ))}
      </div>
    )
  },
)
