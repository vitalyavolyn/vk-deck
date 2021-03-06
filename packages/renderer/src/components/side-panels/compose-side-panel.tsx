import { FC, useState } from 'react'
import { WallPostParams, WallPostResponse } from '@vkontakte/api-schema-typescript'
import { Icon20ArticleOutline, Icon20CheckBoxOff, Icon20Square4Outline } from '@vkontakte/icons'
import { Button, classNames, FormStatus, Textarea } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { AccountPicker, AccountPickerMode } from '@/components/account-picker'
import { SidePanelProps } from '@/components/side-panel-container'
import { useStore } from '@/hooks/use-store'
import { SidePanelHeader } from './side-panel-header'

import './compose-side-panel.css'

export const ComposeSidePanel: FC<SidePanelProps> = ({ closeSidePanel }) => {
  const { apiStore } = useStore()
  const { id } = apiStore.initData.user

  const { t } = useTranslation()

  const [pickerMode, setPickerMode] = useState<AccountPickerMode>(AccountPickerMode.minigrid)
  const [selectedAccount, setSelectedAccount] = useState(id)
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [isDone, setIsDone] = useState(false)

  const publish = async () => {
    if (isLoading || isDone) return

    setErrorText('')
    setIsLoading(true)
    try {
      await apiStore.api.call<WallPostResponse, WallPostParams>('wall.post', {
        owner_id: selectedAccount,
        message: text,
      })
    } catch (error) {
      // @ts-ignore: TODO: свой класс для ошибок
      setErrorText(error.error_msg)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setIsDone(true)
    closeSidePanel()
  }

  return (
    <div className="side-panel compose-side-panel">
      <SidePanelHeader>{t`composer.title`}</SidePanelHeader>
      <div className="mode-selector">
        <span>{t`composer.from`}</span>
        <div className="picker">
          <Icon20CheckBoxOff
            className={classNames({
              active: pickerMode === AccountPickerMode.grid,
            })}
            onClick={() => setPickerMode(AccountPickerMode.grid)}
          />
          <Icon20Square4Outline
            className={classNames({
              active: pickerMode === AccountPickerMode.minigrid,
            })}
            onClick={() => setPickerMode(AccountPickerMode.minigrid)}
          />
          <Icon20ArticleOutline
            className={classNames({
              active: pickerMode === AccountPickerMode.list,
            })}
            onClick={() => setPickerMode(AccountPickerMode.list)}
          />
        </div>
      </div>
      <AccountPicker
        mode={pickerMode}
        onSelect={setSelectedAccount}
        selectedAccount={selectedAccount}
      />
      {errorText && (
        <FormStatus header={t`composer.error`} mode="error">
          {errorText}
        </FormStatus>
      )}
      <Textarea
        placeholder={t`composer.placeholder`}
        onChange={(event) => setText(event.currentTarget.value)}
      />
      {/* TODO: Ctrl+Enter */}
      <Button
        className="post"
        disabled={!text || isLoading}
        loading={isLoading}
        onClick={publish}
        style={{ width: '50%' }}
      >
        {isDone ? t`composer.done` : t`composer.publish`}
      </Button>
    </div>
  )
}
