// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://ignitecookbook.com/docs/recipes/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FlatList, ImageStyle, ViewStyle } from "react-native"
import { EmptyState, Screen, ListItem } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { useHeader } from "app/utils/useHeader"
import { spacing } from "../theme"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AppStackParamList } from 'app/navigators'

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
    const navigation =  useNavigation<NavigationProp<AppStackParamList>>()

    useHeader({
      title: "Channels",
    })

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={[]}
        contentContainerStyle={$screenContentContainer}
      >
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
