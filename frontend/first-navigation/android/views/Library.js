import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';


 export default class Library extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    
    return fetch('http://localhost:4444/api/books')
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
      <h1>Books</h1>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}        {item.created_at}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}