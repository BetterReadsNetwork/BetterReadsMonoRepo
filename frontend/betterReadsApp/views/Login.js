import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Home extends React.Component {

 
  constructor(props){
    super(props);
    this.state= ({ 
      isLoading: true,
      username:'',password:'',cpassword:''})
     
   
  }
  render() {
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Login</Text>
       
        <TextInput name="username" placeholder="username" onChangeText={(text)=>this.setState({username:text}) }/>
         <TextInput name="password" placeholder="password" onChangeText={(text)=>this.setState({password:text}) }/>
        
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Login', {query: this.state.query})}
        />
       
      </View>
    );
  }
}