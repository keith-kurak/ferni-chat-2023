import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useHeader } from 'app/utils/useHeader'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

export const ChatScreen: FC<AppStackScreenProps<"Chat">> = observer(function ChatScreen() {
  const route = useRoute<AppStackScreenProps<"Chat">['route']>();
  const navigation = useNavigation();

  useHeader({
    title: route.params.channelName,
    leftIcon: "back",
    onLeftPress: navigation.goBack,
  })
  return (
    <Screen style={$root} preset="scroll">
      <Text text="chat" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
