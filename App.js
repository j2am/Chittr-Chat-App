import 'react-native-gesture-handler'
import React from 'react'

import { createAppContainer, createSwitchNavigator, StackActions, NavigationActions } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'

import Chits from './Screens/Chits/ChitsTab'
import { Search } from './Screens/Search/SearchTab'
import { Profile } from './Screens/Profile/ProfileTab'

import Login from './Screens/Auth/Login'
import SignUp from './Screens/Auth/SignUp'

import { Landing } from './Screens/Landing'
import { MyAccount } from './Screens/Profile/MyAccount'
import { ViewProfile } from './Screens/Search/ViewProfile'
import { Image } from 'react-native'
import { API_USER_PHOTO, CHITS_ICON, SEARCH_ICON } from './Screens/Constants'
import { Drafts } from './Screens/Chits/Drafts'


/**
 * @author Jamshid
 * @description Navigation structure and application starting point
 */

// Authentication route
// unautherised users can only access these and landing page
const AuthRoute = createStackNavigator({ Login: { screen: Login }, SignUp: { screen: SignUp } }, {
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    // hide default header
    headerShown: false
  }
})

// Stack for App Route 
// profile tab 
const ProfileStack = createStackNavigator(
  {
    ProfileHome: { screen: Profile },
    MyAccount: { screen: MyAccount },
    ViewProfile: { screen: ViewProfile }
  },
  {
    navigationOptions: ({ navigation }) => {
      const store = navigation.dangerouslyGetParent().getParam('store')
      return {
        // set tab icon and tint
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={{ uri: API_USER_PHOTO(store.id) + '?' + Date.now().toString() }} /// trick the cache!
            style={{ borderWidth: 1, borderColor: tintColor, width: 25, height: undefined, borderRadius: 25, aspectRatio: 1, resizeMode: 'cover' }}
            onError={() => console.log('Error ' + API_USER_PHOTO(store.id) + '?' + Date.now())} //
          />
        )
      }
    },
    defaultNavigationOptions: {
      headerShown: false
    },
    resetOnBlur: true,
    initialRouteName: 'ProfileHome'
  })

// Main Tab in tab navigator  shows all chits and compose
const ChitStack = createSwitchNavigator(
  {
    Chits: { screen: Chits },
    Drafts: { screen: Drafts }
  },
  {
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => ( <Image source={CHITS_ICON} style={{ tintColor: tintColor }} />),
      headerMode: 'none'
    },

    initialRouteName: 'Chits'
  })

const SearchStack = createStackNavigator(
  {
    Search: { screen: Search },
    ViewProfile: { screen: ViewProfile }
    // MyPosts:{screen:MyPosts}
  },
  {
    navigationOptions:
        {
          tabBarIcon: ({ tintColor }) => (
            <Image source={SEARCH_ICON} style={{ tintColor: tintColor }} />
          ),
          headerShown: false
        },
    defaultNavigationOptions: {
      headerShown: false
    },
    initialRouteName: 'Search',
    resetOnBlur: true
  })

// Application route for authicated user
const AppRoute = createBottomTabNavigator({
  Profile: { screen: ProfileStack },
  Chits: { screen: ChitStack },
  Search: { screen: SearchStack, navigationOptions: { headerMode: 'none' } }
}, {
  initialRouteName: 'Chits',
  resetOnBlur: true,
  tabBarOnPress: (navigation) => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: navigation.state.routeName })]
  })
})

// Combine routes
export default createAppContainer(createSwitchNavigator({
  Landing: Landing,
  AppRoute: AppRoute,
  AuthRoute: AuthRoute
}, { initialRouteName: 'Landing' }
))
