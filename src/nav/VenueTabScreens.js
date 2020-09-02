import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import VenuePromotersScreen from "../screens/VenuePromotersScreen";
import VenueEventsScreen from "../screens/VenueEventsScreen";
import TempScreen from '../screens/TempScreen';

const VenueTabNav = createBottomTabNavigator();

const VenueTabScreens = ({ route }) => {
  return (
    <VenueTabNav.Navigator tabBarOptions={{
    activeTintColor: '#313131',
    inactiveTintColor: 'gray',
    style: {
      height: 80
    }}}>
      <VenueTabNav.Screen name="VenuePromoters"
        options={{
          tabBarIcon: ({ focused }) => (
              <Ionicons name="ios-contact" size={32} color={focused ? "#562093" : 'gray'} style={{"marginTop": 6}}/>
          ),
          headerShown: false,
          title: "Promoters"
        }}
        component={VenuePromotersScreen}
        initialParams={{formData: route.params.form}} />

      <VenueTabNav.Screen name="VenueEvents"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="ios-calendar" size={32} color={focused ? "#562093" : 'gray'} style={{"marginTop": 6}}/>
          ),
          headerShown: false,
          title: "Events"
        }}
        component={VenueEventsScreen}
        initialParams={{formData: route.params.form}} />

      <VenueTabNav.Screen name="VenueMessages"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="ios-chatboxes" size={32} color={focused ? "#562093" : 'gray'} style={{"marginTop": 6}}/>
          ),
          headerShown: false,
          title: "Inbox"
        }}
        component={TempScreen} />

      <VenueTabNav.Screen name="VenueLedger"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="ios-pricetags" size={32} color={focused ? "#562093" : 'gray'} style={{"marginTop": 6}}/>
          ),
          headerShown: false,
          title: "Ledger"
        }}
        component={TempScreen} />

      <VenueTabNav.Screen
        name="VenueSettings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="md-settings" size={32} color={focused ? "#562093" : 'gray'} style={{"marginTop": 6}}/>
          ),
          headerShown: false,
          title: "Settings"
        }}
        component={TempScreen} />
    </VenueTabNav.Navigator>
  )
}

export default VenueTabScreens;