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
        <Text>Register</Text>
        
        <TextInput name="username" placeholder="username"  onChangeText={(text)=>this.setState({username:text}) }/>
         <TextInput name="password" placeholder="password" onChangeText={(text)=>this.setState({password:text}) }/>
          <TextInput name="cpassword" placeholder="confirm password" onChangeText={(text)=>this.setState({cpassword:text}) }/>
        <Button
          title="Register"
          onPress={() => this.props.navigation.navigate('Register', {query: this.state.query})}
        />
       
      </View>
    );
  }
}