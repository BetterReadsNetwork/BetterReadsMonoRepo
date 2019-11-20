import * as React from 'react';
import { Button, View, Text ,Image, TextInput,FlatList,ActivityIndicator } from 'react-native';
export default class Browse extends React.Component {
   constructor(props){
    super(props);
    this.state ={ isLoading: true, query:                 this.props.navigation.query}
  }

  addToLibrary =(book)=>{
    return fetch('https://green-ladybug-78.localtunnel.me/createBook?title='+book, {
      method: 'GET'
     
    }).then(res=>res.json())
    .then(response =>{
      console.error("Sucess");
       
         this.props.navigation.navigate('Library')
    }

    ).catch((error) =>{
      console.error(error);
      this.props.navigation.navigate('Library')
    });
    
  } 
  startDiscussion(book){
   return fetch('https://green-ladybug-78.localtunnel.me/createThread?title='+book, {
      method: 'GET'
     
    }).then(res=>res.json())
    .then(response =>{
      console.error("Sucess");
        this.props.navigation.navigate('Discussions')
    }

    ).catch((error) =>{
      console.error(error);
       this.props.navigation.navigate('Discussions')
    });
   
  }
  componentDidMount(){
   var url = 'https://green-ladybug-78.localtunnel.me/api/browse/'+this.props.navigation.getParam('query','NO-ID')
    return fetch(url, {
      method: 'GET'
      //,body: JSON.stringify({query: 'Potter'}),
      
     /* headers: {
        'Content-Type': 'application/json'
      } */
    }).then(res=>res.json())
    .then(response =>{
      console.error("Sucess");
       this.setState({
          isLoading: false,
          dataSource: response,
          url: url
        }, function(){

        });
    }

    ).catch((error) =>{
      console.error(error);
    });
  }
  render() {
    const {navigate} = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{this.state.url}</Text>
      <Text>{this.props.navigation.getParam('query','NO-ID')}</Text>
        {this.state.dataSource.map((book) =>{
          return ( 
             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            {
              book.results[0]['work'].map(work =>
              <View>
               <Image
          style={{width: 50, height: 50}}
          source={{uri: work.best_book[0].image_url[0]}}
        />
               <Text> { work.best_book[0].title[0]}</Text> 
               <Button title="Add To Library" onPress={()=>this.addToLibrary(work.best_book[0].title[0])}/>
               <Button title="Start Discussion"  onPress={()=>this.startDiscussion(work.best_book[0].title[0])}/>
               
               </View>
               )
            
           
          }
          </View>  
         ) })}
      </View>
    );
  }
}