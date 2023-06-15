# Hello, Ignite! Goodbye, Ignite!
## Goal
Try out the ignite template and make some modifications to pare things down a bit.
## Tasks
1. Clone the project with the default ignite template
2. Delete some files we don't need because we're using Expo prebuild and some other default configs
3. Delete the screens we don't need
4. Rename our tabs that we'll use for the rest of the time
5. Make sure it all still works
## Useful info
- [Ignite CLI commands](https://github.com/infinitered/ignite)
### Node 18.x compatibility issue
If you get a weird SSL error when starting, do this:

macOS/ Linux:
`export NODE_OPTIONS=--openssl-legacy-provider`
Windows (Powershell):
`$env:NODE_OPTIONS="--openssl-legacy-provider"`
###

## Starting Point
This was largely created with `npx ignite-cli@latest new MyApp`. Defaults were accepted, and it applied the demo files.

It was modified in some ways to match what you get with `npx create-expo-app`. I was going to have you do these things, but me doing them ahead of time gave you less to download/ eliminated some error states when you're just making sure the prereqs are setup.

Changes:
- Deleted ios/ android folders, as those will be generated just-in-time for build based on app.json.
- Removed the `postInstall` script from package.json, as it ran Cocoapods (not needed without an ios folder)
- Added extra packages we'll need: `expo-updates`, `firebase`, `lodash`, `react-native-modal`. `react-native-gifted-chat`
- Removed **webpack.config.js** and changed **app.json** to use Metro Bundler for web
- Removed **metro.config.js** to use the default, which works great with the rest of the setup.
- Removed React Native Bootsplash, sticking with `expo-splashscreen` (this doesn't work in Expo Go)

So, you can think of this as the Expo blank project + Ignite's components, stores, and demo screens.

## How to do it
### 1. Run it as-is
Run `npx expo start` and pick a device/ emulator to run the app in Expo Go. Or press `w` to run the web version.

### 2. Setup your tabs
We could rename everything, but don't worry too much about that.
What we're going to focus on is mangling this template to the point where it basically flows how our app is gonna flow. We'll fix all the names later. Now, if you want to fix the names, have at it!
#### a. Pruning and visual tweaks
The four tabs you see after "logging in" are set by DemoNavigator. We're going to keep the `PodcastList` and `Debug` tabs, and use them for "Channels" and "Settings".

- [ ] In **app/navigators/DemoNavigator.tsx**, delete the "DemoShowroom" and "DemoCommunity" tabs by deleting the entire `<Tab.Screen>` components with those names.

- [ ] Then, fix the icons and names for the remaining tabs. Rename them "Channels" and "Settings", and set the icons to "community" and "settings", e.g.,
```diff
<Tab.Screen
  name="DemoPodcastList"
  component={DemoPodcastListScreen}
  options={{
    tabBarAccessibilityLabel: translate("demoNavigator.podcastListTab"),
--    tabBarLabel: translate("demoNavigator.podcastListTab"),
++    tabBarLabel: "Channels",
    tabBarIcon: ({ focused }) => (
--      <Icon icon="podcast" color={focused && colors.tint} size={30} />
++      <Icon icon="community" color={focused && colors.tint} size={30} />
    ),
  }}
/>
```

🏃**Try it!** You should have only two tabs, and they should be Channels and Settings tabs. Of course, the Channels tab will actually have podcast episodes on it ;-)

#### b. Fix just enough names to not drive us nuts
We're going to just fix the names of the files we'll be working on the most, so we don't have to think about podcasts when we really want to think about channels.

- [ ] In **DemoNavigator.tsx**, set `DemoTabParamList` to:
```ts
export type DemoTabParamList = {
  ChannelList: undefined
  Settings: undefined
}
```
- [ ] Rename `DemoPodcastListScreen` to `ChannelListScreen` (rename file and the component name)
After this, the declaration should look like:
```ts
export const ChannelListScreen: FC<DemoTabScreenProps<"ChannelList">> = observer(
```
"ChannelList" corresponds to the `DemoTabParamList` type.
- [ ] Rename `DemoDebugScreen` to `SettingsScreen` (rename file and the component name)
- [ ] Update the imports/ exports accordingly in **screens/index.ts**
- [ ] Update the imports in **DemoNavigator.tsx** to reference `ChannelListScreen` and `SettingsScreen`
- [ ] Update their references in `DemoNavigator`, e.g.,
```diff
 <Tab.Screen
--  name="DemoPodcastList"
--  component={DemoPodcastListScreen}
++  name="ChannelList"
++  component={ChannelListScreen}
```

🏃**Try it!** No visual changes, but the two tabs should still work.

### 2. Stub out the ChannelListScreen
We want a traditional, fixed navigation header with a list of "channels". We'll stub this all out with mock data in the `ChannelListScreen`.

- [ ] In **ChannelListScreen.tsx**, delete the `EpisodeCard` component (below `ChannelListScreen`) with a simple thing that displays the name of a channel:
```ts
const ChannelItem = observer(function ChannelItem({
  channel,
  onPress,
}: {
  channel: any
  onPress: () => void
}) {
  return <ListItem bottomSeparator onPress={onPress} text={`#${channel.name}`} />
})
```
- [ ] Update your imports to include `ListItem`, another component from the Ignite component library:
```ts
import { /** ... **/ ListItem } from "../components"
```

- [ ] Delete the entire contents of `ChannelListScreen`, replace them with this:
```ts
  // ignite syntactic sugar for React Nav's screen prop access
  useHeader({
    title: 'Channels'
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
            onPress={() => {} /* we'll fill this in later */}
          />
        )}
      />
    </Screen>
  )
```

- [ ] You'll need a new import, too:
```ts
import { useHeader } from 'app/utils/useHeader'
```

- [ ] Finally, make a canned list of channels at the top of the file, like:
```ts
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
}
]
```

🏃**Try it!** Now you should have some simple channel titles, but tapping on them doesn't do anything.

There's going to be a ton of red squiggles in this file now. You can delete them if you'd like.

**What's going on with the header?**
We did a few mysterious things to change from a big inline header, to a fixed header at the top of the screen:
a. We added `useHeader()` to give us access to the screen's title. This is a helper for modifying some react navigation params
b. We set `safeAreaEdges` on Screen to an empty array, because `useHeader()` turns on React Navigation's header, which does its own safe area accounting.
c. There's still some extra space coming from `$flatListContentContainer` style. Try tweaking it to see what happens.

### 3. Add the stub for the chats screen
Even though we don't have chats, or real channels, we an still put a placeholder screen for the chat to show up when we tap on the channel.

- [ ] Generate a new screen stub in your terminal `npx ignite-cli generate screen ChatScreen` (you should be in the root of the project folder).

- [ ] Then add a new screen with parameter types in `AppNavigator`:
```ts
export type AppStackParamList = {
  Chat: { channelName: string },
  //...
}
```
#### a. Access the route parameter in the ChatScreen
`ChatScreen` will just be a stub for now with no content, but we will at least read in a parameter when we push the screen on the stack for the channel. 

- [ ] Set up `ChatScreen` like this:
```ts
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
```

- [ ] You'll need to add some imports, too:
```ts
import { useNavigation, useRoute } from "@react-navigation/native"
import { useHeader } from 'app/utils/useHeader'
```
The default type will be all red-squiggled, fine to delete that

#### b. Use the route parameter when tapping a channel in ChannelListScreen
- [ ] Add the following at the very top of the `ChannelListScreen` component:
```ts
const navigation =  useNavigation<NavigationProp<AppStackParamList>>()
```
- [ ] Update your imports accordingly:
```ts
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AppStackParamList } from 'app/navigators'
```

- [ ] Update the `ChannelItem` `onPress` to navigate to the Chat screen:
```diff
<ChannelItem
  key={item.id}
  channel={item}
-- onPress={() => {}}
++ onPress={() => navigation.navigate("Chat", { channelName: item.name })}
```
🏃**Try it!** Now you should be able to navigate between the channel list and the channel

### 4. A little cleanup
- [ ] In `AppNavigator`, change the logged in `initialRouteName` to `Demo` (instead of `Welcome`). 

Now, our navigation is basically 100% of what our final app will have. Login, logout, go to channels, it's all there.

- [ ] Also, those tab bars are ugly on web, fix in `DemoNavigator` by adding this to the `screenOptions`:
```ts
tabBarLabelPosition: "below-icon",
```

## Bonus
If you have time, you can do the stuff for the template between steps 1 and 2.
### Boring part: renaming, cleaning up stuff.
Fix the names that don't really match what we're doing. If you want to sync with later lessons, these are the names we'll use:
  - `ChannelListScreen`
  - `ChatScreen`
  - `LoginScreen`
  - `SettingsScreen`
  - `DemoNavigator` -> `MainTabNavigator`
  - Delete `DemoShowroomScreen`, `WelcomeScreen`, `DemoCommunityScreen`
  - **models**
    - delete `Episode`, `EpisodeStore`, delete the `episodeStore` in the `RootStore` model.
### Fun part
Add the `addChannel` button to `ChatListScreen`:

In `ChannelListScreen`, add the following hooks at the top of the component and modify `useHeader` as such:

```ts
const [isModalVisible, setModalVisible] = useState(false)

const [newChannelName, setNewChannelName] = useState("")

const toggleAddChannelModal = () => {
  setNewChannelName("")
  setModalVisible(!isModalVisible)
}

useHeader({
  title: 'Channels',
  rightText: "Add",
  onRightPress: toggleAddChannelModal,
})
```

Update imports:
```ts
import /* ... */  {  /* ... */ useState } from 'react'
import { /* ... */ View } from 'react-native;
import Modal from "react-native-modal"
import { /* ... */ TextField, Button } from "../components"
import { /* .. */ colors } from '../theme'
```

Add the modal underneath the `FlatList`, but inside the `Screen`:
```ts
<Modal isVisible={isModalVisible} onBackdropPress={toggleAddChannelModal}>
  <View style={{ backgroundColor: colors.background }}>
    <TextField
      autoFocus
      value={newChannelName}
      containerStyle={{ margin: spacing.sm }}
      placeholder="Channel Name"
      onChangeText={(text) => setNewChannelName(text)}
    />
    <Button text="Add Channel" onPress={()=>{}} />
  </View>
</Modal>
```
This will force it to appear on top of the list.

🏃**Try it!** You should be able to tap "Add", type into the text input, but the list will not yet update.
