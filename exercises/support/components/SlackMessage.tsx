import React from "react"
import { View, StyleSheet } from "react-native"

import { Day, utils } from "react-native-gifted-chat"
import { Bubble } from "./SlackBubble"

const { isSameUser, isSameDay } = utils

export function SlackMessage(props: any) {
  function getInnerComponentProps() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, ...rest } = props
    return {
      ...rest,
      position: "left",
      isSameUser,
      isSameDay,
    }
  }

  function renderDay() {
    if (props.currentMessage.createdAt) {
      const dayProps = getInnerComponentProps()
      if (props.renderDay) {
        return props.renderDay(dayProps)
      }
      return <Day {...dayProps} />
    }
    return null
  }

  function renderBubble() {
    const bubbleProps = getInnerComponentProps()
    if (props.renderBubble) {
      return props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} />
  }

  const marginBottom = isSameUser(props.currentMessage, props.nextMessage) ? 2 : 10

  return (
    <View>
      {renderDay()}
      <View style={[styles.container, { marginBottom }, props.containerStyle]}>
        {renderBubble()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 8,
    marginRight: 0,
  },
})
