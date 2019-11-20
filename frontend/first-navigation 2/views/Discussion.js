import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Discussion extends React.Component {
   constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  
  componentDidMount(){
    
    return fetch('http://10.103.66.97:4444/api/discussions/'+this.props.navigation.getParam('id', 'NO-ID'))
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
      <Text>{this.state.dataSource.thread.title}</Text>
        <FlatList
          data={this.state.dataSource.posts}
          renderItem={({item}) => <Text>{item.content}       {item.created_at}</Text>}
          keyExtractor={({id}, index) => id}
        />
        <TextInput name="content" onChangeText={(text)=>this.setState({content: text})}/>
        <Button title="POST" onPress={()=>{
           
           fetch('https://green-ladybug-78.localtunnel.me/createPost', {
      method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: this.state.content,
    thread_id: this.state.dataSource.thread._id,
  })

    }).then(res=>res.json())
    .then(response =>{
      console.error("Sucess");
       this.props.navigation.navigate('Referrer')
       fetch('https://green-ladybug-78.localtunnel.me/api/discussions/'+this.props.navigation.getParam('id', 'NO-ID'))
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });
        this.props.navigation.navigate('Referrer')
         this.props.navigation.navigate('Referrer', {last: "Discussion",id: this.state.dataSource.thread._id})
      //  this.props.navigation.navigate('Referrer', {last: "Discussion",id: this.state.dataSource.thread._id})
      //  this.forceUpdate()
    //   this.setState({ state: this.state });
      })
      .catch((error) =>{
        console.error(error);
        
      });
  },
   this.props.navigation.navigate('Home', {last: "Discussion",id: this.state.dataSource.thread._id})
 //      this.props.navigation.navigate('Discussion', {id: this.state.dataSource.thread._id})
     //  this.forceUpdate()
       
        // this.props.navigation.navigate('Discussion', {id: this.state.dataSource.thread._id})
    

    ).catch((error) =>{
      console.error(error);
  //    this.props.navigation.navigate('Discussion', {id: this.state.dataSource.thread._id})
   //   this.props.navigation.navigate('Discussion', {id:this.state.dataSource.thread._id})
     // this.forceUpdate()
       this.setState({ state: this.state });
    });
        }}/>
      </View>
    );
  }
}