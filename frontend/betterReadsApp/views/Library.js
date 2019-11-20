import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';


 export default class Library extends React.Component {

  constructor(props){
    super(props);
     this.state ={ isLoading: true,base : "https://curly-bulldog-68.localtunnel.me"}
  }

  componentDidMount(){
    
    return fetch(this.state.base+'/api/books')
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
      <Text>Books</Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}