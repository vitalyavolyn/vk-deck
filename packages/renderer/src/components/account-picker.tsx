import { Avatar, classNames, RichCell } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Icon20CheckCircleFillGreen, Icon24ChevronUp } from '@vkontakte/icons'
import { useStore } from '../hooks/use-store'

import './account-picker.css'

export enum AccountPickerMode {
  grid = 'grid',
  minigrid = 'minigrid',
  list = 'list'
}

interface AccountPickerProps {
  mode: AccountPickerMode
  selectedAccount: number
  onSelect(id: number): void
}

interface AccountProps {
  name: string
  screenName: string
  photo?: string
  isSelected: boolean
  mode: AccountPickerMode
  onClick: () => void;
}

const Account: FC<AccountProps> = ({
  name,
  screenName,
  photo,
  isSelected,
  mode,
  onClick,
}) => {
  if (mode !== AccountPickerMode.list) {
    const isLargeGrid = mode === AccountPickerMode.grid
    const imageSize = isLargeGrid ? 48 : 32
    const iconSize = isLargeGrid ? 20 : 16

    return (
      <div className="account">
        <div title={name} className={classNames('account-avatar', { selected: isSelected })} onClick={onClick}>
          <Avatar size={imageSize} src={photo} />
          {isSelected && <Icon20CheckCircleFillGreen width={iconSize} height={iconSize} />}
        </div>
      </div>
    )
  }

  return (
    <RichCell
      before={(
        <div className={classNames('account-avatar', { selected: isSelected })}>
          <Avatar size={32} src={photo} />
          {isSelected && <Icon20CheckCircleFillGreen width={16} height={16} />}
        </div>
      )}
      caption={'@' + screenName}
      onClick={onClick}
    >{name}</RichCell>
  )
}

export const AccountPicker: FC<AccountPickerProps> = observer(({
  mode,
  selectedAccount,
  onSelect,
}) => {
  const { userStore } = useStore()
  const { user, managedGroups } = userStore.data
  const [isExpanded, setIsExpanded] = useState(false)

  const isList = mode === AccountPickerMode.list

  const groups = isList
    ? managedGroups
    : managedGroups.slice(0, 10)

  // TODO: если групп будет ровно 11, то будет некрасиво
  const expandable = !isList && managedGroups.length > 10

  return (
    <div className={classNames('account-picker', mode)}>
      <Account
        name={`${user.first_name} ${user.last_name}`}
        screenName={user.screen_name!}
        photo={user.photo_50}
        isSelected={selectedAccount === user.id}
        mode={mode}
        onClick={() => { onSelect(user.id) }}
      />

      {groups
        .map((group) => (
          <Account
            key={group.id}
            name={group.name}
            screenName={group.screen_name}
            photo={group.photo_50}
            isSelected={selectedAccount === -group.id}
            mode={mode}
            onClick={() => { onSelect(-group.id) }}
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

      {isExpanded && managedGroups.slice(10)
        .map((group) => (
          <Account
            key={group.id}
            name={group.name}
            screenName={group.screen_name}
            photo={group.photo_50}
            isSelected={selectedAccount === -group.id}
            mode={mode}
            onClick={() => { onSelect(-group.id) }}
          />
        ))}
    </div>
  )
})
