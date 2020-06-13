import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabItem from "./components/TabItem";

const { width } = Dimensions.get("window");

const AnimatedTabBar = ({
  state,
  navigation,
  descriptors,
  activeColor,
  margin = 8,
  moverPadding = 5,
  moverStyle = {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
  },
  contentContainerStyle = {
    backgroundColor: "#181818",
    borderRadius: 14,
    elevation: 3,
  },
  itemLabelStyle,
}) => {
  //number of routes for calculating width
  const numberOrRoutes = state.routes.length;
  const thing = useSharedValue(0);

  //width of bottom tab based on margin
  const bottomTabWidth = width - margin * 2;

  // width of each item = width of mover
  const itemWidth = bottomTabWidth / numberOrRoutes;

  const sz = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(thing.value, {
            stiffness: 80, //default: 100
            damping: 20, //default: 10
            mass: 0.2, //default: 1
          }),
        },
      ],
    };
  });

  const onTabPress = (route, index) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    const isFocused = state.index === index;
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
      thing.value = bottomTabWidth * (index / numberOrRoutes);
    }
  };
  const onTabLongPress = (route) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };
  return (
    <View
      style={[
        { ...contentContainerStyle },
        { margin },
        {
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      ]}
    >
      <Animated.View
        style={[s.mover, { width: itemWidth }, { padding: moverPadding }, sz]}
      >
        <View
          style={[
            moverStyle,
            {
              width: "100%",
              height: "100%",
            },
          ]}
        />
      </Animated.View>
      {state.routes.map((route, index) => {
        return (
          <TabItem
            activeColor={activeColor}
            key={route.key}
            route={route}
            index={index}
            state={state}
            descriptors={descriptors}
            onTabPress={onTabPress}
            onTabLongPress={onTabLongPress}
            itemWidth={itemWidth}
            itemLabelStyle={itemLabelStyle}
          />
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  mover: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedTabBar;
