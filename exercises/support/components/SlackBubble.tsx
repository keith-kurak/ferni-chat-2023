/* eslint-disable no-underscore-dangle, no-use-before-define */

import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'

import {
  MessageText,
  MessageImage,
  Time,
  utils,
} from 'react-native-gifted-chat'

const { isSameUser, isSameDay } = utils

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = () => {};

export function Bubble(props: any) {
  function renderMessageText() {
    if (props.currentMessage.text) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = props
      if (props.renderMessageText) {
        return props.renderMessageText(messageTextProps)
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [
              styles.standardFont,
              styles.slackMessageText,
              messageTextProps.textStyle,
              messageTextStyle,
            ],
          }}
        />
      )
    }
    return null
  }

  function renderMessageImage() {
    if (props.currentMessage.image) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { containerStyle, wrapperStyle, ...messageImageProps } = props
      if (props.renderMessageImage) {
        return props.renderMessageImage(messageImageProps)
      }
      return (
        <MessageImage
          {...messageImageProps}
          imageStyle={[styles.slackImage, messageImageProps.imageStyle]}
        />
      )
    }
    return null
  }

  function renderTicks() {
    const { currentMessage } = props
    if (props.renderTicks) {
      return props.renderTicks(currentMessage)
    }
    if (currentMessage.user._id !== props.user._id) {
      return null
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles.standardFont, styles.tick, props.tickStyle]}
            >
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles.standardFont, styles.tick, props.tickStyle]}
            >
              ✓
            </Text>
          )}
        </View>
      )
    }
    return null
  }

  function renderUsername() {
    const username = props.currentMessage.user.name
    if (username) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { containerStyle, wrapperStyle, ...usernameProps } = props
      if (props.renderUsername) {
        return props.renderUsername(usernameProps)
      }
      return (
        <Text
          style={[
            styles.standardFont,
            styles.headerItem,
            styles.username,
            props.usernameStyle,
          ]}
        >
          {username}
        </Text>
      )
    }
    return null
  }

  function renderTime() {
    if (props.currentMessage.createdAt) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { containerStyle, wrapperStyle, ...timeProps } = props
      if (props.renderTime) {
        return props.renderTime(timeProps)
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{
            left: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              timeProps.textStyle,
            ],
          }}
        />
      )
    }
    return null
  }

    const isSameThread =
      isSameUser(props.currentMessage, props.previousMessage) &&
      isSameDay(props.currentMessage, props.previousMessage)

    const messageHeader = isSameThread ? null : (
      <View style={styles.headerView}>
        {renderUsername()}
        {renderTime()}
        {renderTicks()}
      </View>
    )

    return (
      <View style={[styles.container, props.containerStyle]}>
        <TouchableOpacity
          onLongPress={emptyFn}
          accessibilityTraits='text'
          {...props.touchableProps}
        >
          <View style={[styles.wrapper, props.wrapperStyle]}>
            <View>
              {messageHeader}
              {renderMessageImage()}
              {renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flex: 1,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    alignItems: 'baseline',
    flexDirection: 'row',
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
  },
  standardFont: {
    fontSize: 15,
  },
  // eslint-disable-next-line react-native/no-color-literals
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  time: {
    fontSize: 12,
    textAlign: 'left',
  },
  timeContainer: {
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  username: {
    fontWeight: 'bold',
  },
  wrapper: {
    justifyContent: 'flex-end',
    marginRight: 60,
    minHeight: 20,
  },
})
