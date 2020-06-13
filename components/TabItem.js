import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const TabItem = ({
  onTabPress,
  route,
  index,
  state,
  activeColor = "white",
  itemLabelStyle,
  itemWidth,
  descriptors,
  onTabLongPress,
}) => {
  const isActive = index === state.index;
  const color = isActive ? activeColor : "gray";
  const textScale = useSharedValue(0);
  const iconScale = useSharedValue(1);
  useEffect(() => {
    if (isActive) {
      textScale.value = 1;
      iconScale.value = 0;
    } else {
      textScale.value = 0;
      iconScale.value = 1;
    }
  }, [isActive]);
  const textZ = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(textScale.value, {
            stiffness: 80, //default: 100
            damping: 20, //default: 10
            mass: 0.2, //default: 1
          }),
        },
      ],
    };
  });
  const iconZ = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(iconScale.value),
        },
      ],
    };
  });
  const { options } = descriptors[route.key];

  const renderIcon = () => {
    if (options.tabBarIcon) {
      return <View>{options.tabBarIcon()}</View>;
    }
    return <Text>NOICON</Text>;
  };

  return (
    <TouchableOpacity
      onPress={() => onTabPress(route, index)}
      onLongPress={() => onTabLongPress(route)}
      style={{ ...s.tabItem, ...{ width: itemWidth } }}
    >
      <Animated.View style={[s.icon, iconZ]}>{renderIcon()}</Animated.View>
      <Animated.Text style={[s.text, { ...itemLabelStyle, color }, textZ]}>
        {route.name}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  tabItem: {
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
  },
  icon: {
    position: "absolute",
  },
});

export default TabItem;
