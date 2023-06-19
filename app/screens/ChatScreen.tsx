import React, { FC, useEffect, useCallback, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AppStackScreenProps } from "app/navigators"
import { Screen, SlackMessage } from "app/components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useHeader } from "app/utils/useHeader"
import { GiftedChat } from "react-native-gifted-chat"
import { useStores } from "app/models"

export const ChatScreen: FC<AppStackScreenProps<"Chat">> = observer(function ChatScreen() {
  const route = useRoute<AppStackScreenProps<"Chat">["route"]>()
  const navigation = useNavigation()

  const { channelStore, authenticationStore } = useStores()

  useEffect(() => {
    channelStore.startStreamingMessagesForChannel(route.params.channelId)
    return () => {
      channelStore.stopStreamingCurrentChannelMessages()
    }
  }, [])

  useHeader({
    title: channelStore.channelForId(route.params.channelId)?.name,
    leftIcon: "back",
    onLeftPress: navigation.goBack,
  })

  const { top } = useSafeAreaInsets()

  return (
    <Screen
      contentContainerStyle={$root}
      preset="fixed"
      KeyboardAvoidingViewProps={{ behavior: "padding", keyboardVerticalOffset: top + 56 }}
      safeAreaEdges={["bottom"]}
    >
      <Chat
        user={authenticationStore.user}
        onSendMessage={channelStore.sendMessage}
        channelId={route.params.channelId}
        messages={channelStore.currentChannelMessagesForList}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

function Chat({ onSendMessage, user, channelId, messages }) {
  const renderMessage = useCallback((props) => <SlackMessage {...props} />, [])

  const { bottom } = useSafeAreaInsets()

  const onSend = useCallback((messages = []) => {
    onSendMessage({ user, text: messages[0].text, channelId })
  }, [])

  const myMessages = useMemo(() => {
    return messages.reverse().map((message) => ({
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.time),
      user: {
        _id: message.uid,
        name: message.username,
      },
    }))
  }, [messages])

  return (
    <GiftedChat
      messages={myMessages}
      onSend={onSend}
      bottomOffset={bottom}
      isKeyboardInternallyHandled={false}
      renderMessage={renderMessage}
      user={{
        _id: 1,
      }}
    />
  )
}
