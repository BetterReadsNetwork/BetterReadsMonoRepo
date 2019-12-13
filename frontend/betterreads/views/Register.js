import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Home extends React.Component {

 
  constructor(props){
    super(props);
    this.state= ({ 
      isLoading: true,
    base:"http://nicereads.herokuapp.com",
      username:'',
      password:'',
      cpassword:''
      })
     
   
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
         onPress={()=>{
           
            fetch(this.state.base+'/createUser', {
      method: 'GET',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: this.state.username,
    password: this.state.password,
  })

    }).then(res=>res.json())
    .then(response =>{
      console.log("user")
      console.error("Sucess");
      this.props.navigation.navigate('Home', {last: "Discussion"})
      
  },
    ).catch((error) =>{
      console.error(error);
  //    this.props.navigation.navigate('Discussion', {id: this.state.dataSource.thread._id})
   //   this.props.navigation.navigate('Discussion', {id:this.state.dataSource.thread._id})
     // this.forceUpdate()
       this.setState({ state: this.state });
    });
        }} />
       
      </View>
    );
  }
}