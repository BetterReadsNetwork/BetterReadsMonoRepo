import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
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
        <h1>BetterReads</h1>
        <Button
          title="Discussions"
          onPress={() => this.props.navigation.navigate('Discussions')}
        />
        <TextInput name="query" onChangeText={(text)=>this.setState({query:text}) }/>
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
      </View>
    );
  }
}