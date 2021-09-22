import { Avatar, classNames, RichCell } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Icon20CheckCircleFillGreen } from '@vkontakte/icons'
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
  const { api } = useStore()
  const { user, managedGroups } = api.userData

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

      {managedGroups
        .slice(0, 4 * 3 - 1)
        .map(group => (
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
