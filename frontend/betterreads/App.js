import * as React from 'react';
import Library from "./views/Library";
import Browse from "./views/Browse";
import Home from "./views/Home";
import Discussions from "./views/Discussions";
import Discussion from "./views/Discussion";
import Referrer from "./views/Referrer";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Register from "./views/Register";
import Users from "./views/Users";
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const RootStack = createStackNavigator(
  {
    Home: Home,
    Browse: Browse,
    Discussions: Discussions,
    Discussion: Discussion,
    Library: Library,
    Referrer: Referrer,
    Profile: Profile,
    Register: Register,
    Login: Login,
    Users: Users
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}