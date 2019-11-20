import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator,CheckBox } from 'react-native';
export default class Discussions extends React.Component {
   constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    
    return fetch('https://green-ladybug-78.localtunnel.me/api/discussions')
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
      <Text>Discussions</Text>
       
        {this.state.dataSource.map(item => {
          return (
            <View>
            <Button title={item.title} onPress={() => this.props.navigation.navigate('Discussion', {id: item._id})} />
          
      </View>
           
          )}
        )}
        <TextInput name="title" placeholder="Title" onChangeText={(text)=>this.setState({title: text})}/>
        <TextInput name="book"  placeholder="Book" onChangeText={(text)=>this.setState({book: text})}/>
       <CheckBox
  title='Private' name='Private'
  checked={this.state.checked}
/> 

<Text> Private</Text>
        <Button title="Create Discussion" onPress={()=>{
           
           fetch('https://green-ladybug-78.localtunnel.me/api/createThread', {
      method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: this.state.title,
    book: this.state.book
  })

    }).then(res=>res.json())
    .then(response =>{
      console.error("Sucess");
       this.props.navigation.navigate('Referrer')
       fetch('https://green-ladybug-78.localtunnel.me/discussions')
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
