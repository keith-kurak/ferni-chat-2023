# Wire up the chat screen
## Goal
We now have some Firebase code to read/ write chat messages for a channel, let's add a screen with Gifted Chat and wire it up.
## Tasks
1. Fix some ID stuff WRT ChatScreen
2. Wire up sending a message from ChannelsStore -> ChatScreen
3. Add support for streaming messages into ChannelsStore
4. Read messages onto ChatScreen
## Useful info
- [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)

## Since you've been gone
- Not a whole lot... we added a loading overlay for use while logging in.

## How to do it
### 1. Use ID's when navigating from Channel -> Chat
#### a. Fix those types!
Remember where we set the parameters to use `channelName`? Now it should be `channelId`, so we can read info about the channel from the store while on the chat screen.

- [ ] Fix `AppStackParamList` in **AppNavigator.tsx**:
```diff
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  Demo: NavigatorScreenParams<MainTabParamList> // @demo remove-current-line
  // 🔥 Your screens go here
--  Chat: { channelName: string },
++  Chat: { channelId: string },
	// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}
```

- [ ] Update onPress in `ChannelListScreen` to pass channel ID:
```ts
<ChannelItem
  key={item.id}
  channel={item}
  onPress={() => {
    navigation.navigate("Chat", { channelId: item.id })
  }}
/>
```

`ChatScreen` is still referencing `channelName`, though...

#### b. A helper for the chat screen.
- [ ] Add a new view function to `ChannelStore`:
```ts
channelForId(id) {
  return self.channels.find(c => c.id === id);
},
```
This is just for convenience. These parameterized views don't cache, BTW.

- [ ] In `ChatScreen`, use the ID to get the title:
```ts
const channelId = route.params.channelId;

useHeader({
  title: channelStore.channelForId(channelId)?.name,
  leftIcon: "back",
  onLeftPress: navigation.goBack,
})
```

🏃**Try it!** Everything should work the same (should still see channel in the title of the screen)

### 2. Send messages without looking!
So we can see some progress before coding everything, we'll implement "send" first, the opposite we did with channels.

#### a. Update ChannelStore
In a bigger app, I'd probably put messages in their own stores and page them out of a list by channel ID, but we're keeping things simple and putting everything in the `ChannelStore`.

- [ ] Add `sendMessage` to the actions in `ChannelStore`:
```ts
const sendMessage = flow(function* sendMessage({ user, text, channelId }) {
  const db = getFirestore();
  const channelsCollection = collection(db, "channels");
  const channelDoc = doc(channelsCollection, channelId);
  const messagesCollection = collection(channelDoc, "messages");
  // add new document with auto-id
  yield addDoc(
    messagesCollection,
    {
      text,
      time: serverTimestamp(),
      username: user.email,
      uid: user.uid,
    }
  );
});
```

- [ ] There's new imports, too:
```ts
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
```

#### b. Update ChatScreen
- [ ] Add `useStores` to `ChatScreen`, pass the relevant stuff to `Chat`:
```ts
const { channelStore, authenticationStore } = useStores()

// ...

<Chat
  user={authenticationStore.user}
  onSendMessage={channelStore.sendMessage}
  channelId={route.params.channelId}
/>
```

- [ ] Update parameters in `Chat` component inside of **ChatScreen.ts**:
```ts
function Chat({ onSendMessage, user, channelId }) {
```

- [ ] Inside the `Chat` component still, wrap the sending stuff into a callback and pass that into `GiftedChat`:
```ts
const onSend = useCallback((messages = []) => {
  onSendMessage({user, text: messages[0].text, channelId })
}, [])

// ...

<GiftedChat
  messages={messages}
  onSend={onSend}
  renderMessage={renderMessage}
  user={{
    _id: 1,
  }}
/>
```

🏃**Try it!** You should be able to send a message, not see anything in the UI, but it does show up in Firebase when you look at a channel in the console.

### 3. Stream messages and view them
Finally, we'll stream messages from a chat much like we did with channels.
#### a. Wire up a message model
- [ ] Run `npx ignite-cli generate model Message` to create the `MessageModel`.

- [ ] Setup the props as such in `MessageModel`:
```ts
  .props({
    id: types.identifier,
    uid: types.string,
    username: types.string,
    time: types.number,
    text: types.string,
  })
```

#### b. Stream the current channel's messages in ChannelStore

- [ ] In `ChannelStore` add a prop for the messages:
```ts
  currentChannelMessages: types.array(MessageModel),
```

- [ ] Add a view for the messages:
```ts
get currentChannelMessagesForList() {
  return sortBy(self.currentChannelMessages.slice(), m => m.time);
}
```

- [ ] Add an action in the first action block for updating them:
```ts
updateCurrentChannelMessages(querySnapshot) {
  self.currentChannelMessages.clear();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    self.currentChannelMessages.push({
      id: doc.id,
      uid: data.uid,
      username: data.username,
      // when message is added locally before upload, time is null because it will
      // later be set by the server
      time: data.time ? data.time.seconds * 1000 : new Date().getTime(),
      text: data.text,
    });
  });
}
```

- [ ] Add actions for starting and stopping streaming. These will be used when entering the chat screen for a particular channel:
```ts
let unsubscribeFromChannelMessagesFeed; // we could later use this to tear down on logout... or something
const startStreamingMessagesForChannel = (channelId) => {
  const db = getFirestore();
  const channelsCollection = collection(db, "channels");
  const channelDoc = doc(channelsCollection, channelId);
  const messagesCollection = collection(channelDoc, "messages");
  const q = query(messagesCollection);
  unsubscribeFromChannelMessagesFeed = onSnapshot(q, (querySnapshot) => {
    self.updateCurrentChannelMessages(querySnapshot);
  });
};

const stopStreamingCurrentChannelMessages = () => {
  self.currentChannelMessages.clear();
  unsubscribeFromChannelMessagesFeed();
};
```

Be sure to return them with the other actions at the end of the actions block.

#### c. Wire the streamed messages to ChatScreen
- [ ] Setup an effect to start and stop streaming at the top of `ChatScreen`:
```ts
useEffect(() => {
  channelStore.startStreamingMessagesForChannel(route.params.channelId);
  return () => {
    channelStore.stopStreamingCurrentChannelMessages();
  }
}, [])
```
This means that, when you tap a channel, the messages for that channel start steaming, and when you back out of the screen, they stop streaming.

- [ ] Pass the messages from `ChatScreen` to `Chat`, adding a messages prop:
```diff
<Chat
  user={authenticationStore.user}
  onSendMessage={channelStore.sendMessage}
++  messages={channelStore.currentChannelMessagesForList}
  channelId={channelId}
/>
```

- [ ] Of course, add `messages` to the `Chat` props list, too- then you'll need to delete the state variable from `Chat` of the same name.

- [ ] Munge the messages in `Chat` into the Gifted Chat format:
```ts
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
```

- [ ] Update the props going into GiftedChat:
```diff
<GiftedChat
--messages={messages}
++messages={myMessages}
  onSend={onSend}
  renderMessage={renderMessage}
  user={{
    _id: user ? user.uid : null,
  }}
/>
```

- [ ] Delete the `useEffect` that set the default message, as well.

🏃**Try it!**: You should be able to send and see messages!

### TIP
If you get angry error messages about auth initialization, update App.js as such, adding the try/ catch:
```ts
try  {
  initializeAuth(app,
    {
      persistence: reactNativeLocalPersistence
    }
  )
} catch (e) {}
```

OR

Disable the logbox warnings. Put this in **App.js**
```ts
import { LogBox } from "react-native"

// ...
LogBox.ignoreLogs(['Firebase: Error (auth/already-initialized).'])
```
