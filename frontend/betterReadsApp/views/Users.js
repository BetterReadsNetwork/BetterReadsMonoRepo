import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';


 export default class Library extends React.Component {

  constructor(props){
    super(props);
     this.state ={ isLoading: true,base : "https://slippery-fly-59.localtunnel.me"}
  }

  componentDidMount(){
    
    return fetch(this.state.base+'/api/users')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
  const { error, isLoaded, items } = this.state
    return(
      <View style={{flex: 1, paddingTop:20}}>
      <Text >Users</Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.name}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}