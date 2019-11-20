import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Referrer extends React.Component {
  
  constructor(props){
    super(props);
    this.state= ({ 
      isLoading: true,
      query:''})
      
      if(this.props.navigation.getParam('last', 'NO-ID') =="Discussion") {
        this.props.navigation.navigate(this.props.navigation.getParam('last', 'NO-ID'),{id: this.props.navigation.getParam('id', 'NO-ID')} )
      }
  }
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() => navigate('Profile', {name: 'Jane'})}
      />
    );
  }
}