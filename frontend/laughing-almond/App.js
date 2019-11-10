import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    
    return fetch('http://localhost:4444/api/discussions/5dc783f98cf49971178b3711')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.posts,
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

    return(
      <View style={{flex: 1, paddingTop:20}}>
      <h1>Posts</h1>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.content}        {item.created_at}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}
