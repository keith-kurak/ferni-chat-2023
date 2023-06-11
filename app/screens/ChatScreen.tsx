import React, { FC, useEffect, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, SlackMessage } from "app/components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useHeader } from "app/utils/useHeader"
import { GiftedChat } from "react-native-gifted-chat"

export const ChatScreen: FC<AppStackScreenProps<"Chat">> = observer(function ChatScreen() {
  const route = useRoute<AppStackScreenProps<"Chat">["route"]>()
  const navigation = useNavigation()

  useHeader({
    title: route.params.channelName,
    leftIcon: "back",
    onLeftPress: navigation.goBack,
  })
  return (
    <Screen contentContainerStyle={$root} preset="fixed" safeAreaEdges={["bottom"]}>
      <Chat />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

function Chat() {
  const [messages, setMessages] = useState([])

  const renderMessage = useCallback((props) => <SlackMessage {...props} />, [])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderMessage={renderMessage}
      user={{
        _id: 1,
      }}
    />
  )
}
