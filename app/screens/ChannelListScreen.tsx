// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://ignitecookbook.com/docs/recipes/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { FlatList, ImageStyle, ViewStyle, View } from "react-native"
import Modal from "react-native-modal"
import { EmptyState, Screen, ListItem, TextField, Button } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/MainTabNavigator"
import { useHeader } from "app/utils/useHeader"
import { colors, spacing } from "../theme"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AppStackParamList } from "app/navigators"

const channels = [
  {
    id: "1",
    name: "llamas-who-code",
  },
  {
    id: "2",
    name: "pizza-toppings",
  },
  {
    id: "3",
    name: "taylor-swifts-favorite-cars",
  },
]

export const ChannelListScreen: FC<DemoTabScreenProps<"ChannelList">> = observer(
  function DemoPodcastListScreen(_props) {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>()

    const [isModalVisible, setModalVisible] = useState(false)

    const [newChannelName, setNewChannelName] = useState("")

    const toggleAddChannelModal = () => {
      setNewChannelName("")
      setModalVisible(!isModalVisible)
    }

    const addChannel = () => {
      if (!newChannelName) return
      setNewChannelName("")
      toggleAddChannelModal()
    }

    useHeader({
      title: 'Channels',
      rightText: "Add",
      onRightPress: toggleAddChannelModal,
    })

    return (
      <Screen preset="fixed" safeAreaEdges={[]} contentContainerStyle={$screenContentContainer}>
        <FlatList<any>
          data={channels}
          contentContainerStyle={$flatListContentContainer}
          ListEmptyComponent={
            <EmptyState
              preset="generic"
              button={null}
              style={$emptyState}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          }
          renderItem={({ item }) => (
            <ChannelItem
              key={item.id}
              channel={item}
              onPress={() => navigation.navigate("Chat", { channelName: item.name })}
            />
          )}
        />
        <Modal isVisible={isModalVisible} onBackdropPress={toggleAddChannelModal}>
        <View style={{ backgroundColor: colors.background }}>
          <TextField
            autoFocus
            value={newChannelName}
            containerStyle={{ margin: spacing.sm }}
            placeholder="Channel Name"
            onChangeText={(text) => setNewChannelName(text)}
          />
          <Button text="Add Channel" onPress={addChannel} />
        </View>
      </Modal>
      </Screen>
    )
  },
)

const ChannelItem = observer(function ChannelItem({
  channel,
  onPress,
}: {
  channel: any
  onPress: () => void
}) {
  return <ListItem bottomSeparator onPress={onPress} text={`#${channel.name}`} />
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  // paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion

// @demo remove-file
