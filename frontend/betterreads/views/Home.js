import * as React from 'react';
import { Button, View, Text ,Image, Linking, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Home extends React.Component {

 
  constructor(props){
    super(props);
    this.state= ({ 
      isLoading: true,
      query:''})
     
   
  }
  render() {
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>BetterReads</Text>
        <Button
          title="Discussions"
          onPress={() => this.props.navigation.navigate('Discussions')}
        />
        <TextInput name="query" placeholder="query" onChangeText={(text)=>this.setState({query:text}) }/>
        <Button
          title="Browse"
          onPress={() => this.props.navigation.navigate('Browse', {query: this.state.query})}
        />
        <Button
          title="Browse Discussions"
          onPress={() => this.props.navigation.navigate('Browse', {query: this.state.query})}
        />
<Button
          title="Library"
          onPress={() => this.props.navigation.navigate('Library')}
        />
        <Button
          title="Profile"
          onPress={() => this.props.navigation.navigate('Profile')}
        />
        <Button title="Chat" onPress={ ()=>{ Linking.openURL('messenger://app')}} />
        
        <Button
          title="Register"
          onPress={() => this.props.navigation.navigate('Register')}
        />
         <Button
          title="Log In"
          onPress={() => this.props.navigation.navigate('Login')}
        />
         <Button
          title="User list for tests"
          onPress={() => this.props.navigation.navigate('Users')}
        />
      </View>
    );
  }
}