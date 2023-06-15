# Hello, MobX and a list of stuff from MobX!
## Goal
Initialize your MobX state tree model with a canned list of channels and display it on the channels tab. Watch the list update as you add channels.
## Tasks
1. Create Channel and ChannelStore MST models
2. Customize stores to include channel properties
3. Wire up Add Channel functionality to MST stores
## Useful info
- [MobX State Tree concepts](https://mobx-state-tree.js.org/concepts/trees)

## Since you've been gone
We've cleaned up some filenames, deleted the screens that we don't need anymore, and added a button and dialog for adding a channel to the list, but it doesn't do anything yet.
Let's make it add data locally by wiring reading and writing of data to an MST store.
## How to do it
### 1. Add a ChannelStore with a channel model
We're going to create a model for individual channels and a model for storing a list of channels and interacting with it:
- [ ] Run `npx ignite-cli generate model Channel`
- [ ] Run `npx ignite-cli generate model ChannelStore`

Add a props block to `Channel`:
```diff
  .model("Channel")
--  .props({})
++  .props({
++    id: types.identifier,
++    name: types.string,
++  })
.actions(withSetPropAction)
```
(I'm just showing these diffs once to demonstrate in context how to add these blocks to MST models. You just chain them, the order doesn't really matter. You can create a new block or add to the existing `props` block, it doesn't really matter)

- [ ] Then add channels to the `ChannelStore`
```ts
.props({
  channels: types.array(ChannelModel),
})
```

- [ ] Be sure to import `ChannelModel` into **ChannelStore.ts**, e.g.:
```ts
import { ChannelModel } from 'app/models/Channel'
```
⚠️ Usually VS Code's "fix it" recommendations work for me, but I had issues when I did that here and tried importing from `apps/models`. Not sure why, but heads up for now!

- [ ] Add an `addChannel` function to `ChannelStore`:
```ts
.actions((self) => ({
  addChannel(name: string) {
    self.channels.push({ name, id: self.channels.length.toString() /*bad way to set an id, ok for now */ })
  }
}))
```
### 2. Wire the list to MST
- [ ] Use the stores in `ChannelListScreen`:
```ts
const { channelStore } = useStores()
```
(update imports, blah blah- VS Code fix it actually work fine here)
- [ ] Update the data in the FlatList to use the store:
```ts
data={channelStore.channels}
```
🏃**Try it!** The list is empty now

(you can also update that `Flatlist` type, e.g., `FlatList<Channel>` using the types from **app/models**, I won't tell anyone if you don't, though)
- [ ] Add a function to add a channel to the store and close the modal
```ts
 const addChannel = () => {
   if (!newChannelName) return
   channelStore.addChannel(newChannelName)
   toggleAddChannelModal()
}
```
- [ ] Update the modal to call that function when add is pressed
```ts
<Button text="Add Channel" onPress={addChannel} />
```

### Bonus: start scaffolding chat screen
Let's wire up `react-native-gifted-chat` in demo mode, with Slack-style customizations applied.

First, copy the following files to **app/components** from the **support/components** folder in the **exercises** folder:
- **SlackMessage.tsx**
- **SlackBubble.tsx**
(update exports accordingly)

These are from the examples in the (react-native-gifted-chat)[https://github.com/FaridSafi/react-native-gifted-chat]. They were modified from the original "Slack" reskin example to use functional components and be slightly more TS-friendly.

Add the `Chat` component at the bottom of **ChatScreen.tsx**:

```ts
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
```

Use this component in `ChatScreen`, also fix the screen scroll behavior:

```ts
<Screen contentContainerStyle={$root} preset="fixed" safeAreaEdges={["bottom"]}>
  <Chat />
</Screen>
```

Now chat should let you "send" messages in demo mode!
