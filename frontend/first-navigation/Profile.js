import React, { Component } from 'react';
import { Image, Text, TextInput, View, Button, Form, Container, Row, Col } from 'react-native';
import http from 'http';
import querystring from 'querystring';
import dummyImg from './dummyImg.png';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'SteffenCornwell',
            favoriteBook: 'Bible',
            ageRange: '18-25',
            favoriteGenre: 'Christian',
            threads: ['Apologetics', 'Philadelphia Seventh Day Baptist Church', 'Social Entrepreneurship'],
            country: 'United States',
            language: 'English',
            gender: 'Male',
            edit: false,
        };
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeFavoriteBook = this.handleChangeFavoriteBook.bind(this);
        this.handleChangeFavoriteGenre = this.handleChangeFavoriteGenre.bind(this);
        this.handleChangeAgeRange = this.handleChangeAgeRange.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
		this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
		this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleEditOnClick = this.handleEditOnClick.bind(this);
        this.handleSubmitEditProfile = this.handleSubmitEditProfile.bind(this);
    }

    handleSubmitEditProfile(event) {
        event.preventDefault();
        this.setState({ edit: false });
        const postData = querystring.stringify({
            username: this.state.username,
            favoriteBook: this.state.favoriteBook,
            ageRange: this.state.ageRange,
            favoriteGenre: this.state.favoriteGenre,
            country: this.state.country,
            language: this.state.language,
            gender: this.state.gender
        });
          const options = {
            hostname: 'localhost',
            port: 4444,
            path: '/setProfile',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData),
            },
          };

          const req = http.request(options, (res) => {
            console.log('submit form');


            res.setEncoding('utf8');

            res.on('data', (chunk) => {
              console.log(chunk);
            });

            res.on('end', () => {
              console.log('No more data');
            });
          });

          req.on('error', (error) => {
            console.log(error.message);
          });

          req.write(postData);
          req.end();
    }

    handleEditOnClick(event) {
        this.setState({ edit: true });
    }

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangeFavoriteBook(event) {
    	this.setState({ favoriteBook: event.target.value});
    }

    handleChangeFavoriteGenre(event) {
    	this.setState({ favoriteGenre: event.target.value});
    }

    handleChangeAgeRange(event) {
    	this.setState({ ageRange: event.target.value});
    }

    handleChangeGender(event) {
    	this.setState({ gender: event.target.value });
    }

    handleChangeLanguage(event) {
    	this.setState({ language: event.target.value });
    }

    handleChangeCountry(event) {
    	this.setState({ country: event.target.value });
    }

    componentDidMount() {
  	  const getData = querystring.stringify({ user: this.state.username });
      const options = {
        hostname: 'localhost',
        port: 4444,
        path: '/browseDiscussions',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(getData),
        },
      };

      const req = http.request(options, (res) => {
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          console.log(chunk);
        });

        res.on('end', () => {
          console.log('No more data');
        });
      });

      req.on('error', (error) => {
        console.log(error.message);
      });

      req.write(getData);
      req.end();

      const getData2 = querystring.stringify({ user: this.state.username });
      const options2 = {
        hostname: 'localhost',
        port: 4444,
        path: '/getProfile',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(getData2),
        },
      };

      const req2 = http.request(options2, (res) => {


        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          console.log(chunk);
        });

        res.on('end', () => {
          console.log('No more data');
        });
      });

      req2.on('error', (error) => {
        console.log(error.message);
      });

      req2.write(getData);
      req2.end();
    }

    render() {
        if (this.state.edit) {
            return ( 
            	<View style={{alignItems: 'center', flex: 1, flexDirection: 'column'}} >
                	<Text>Edit Profile</Text>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Age Range: </Text>
                    <TextInput onChange={event => this.handleChangeAgeRange(event)} value={this.state.ageRange} />
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Country: </Text>
                    <TextInput onChange={event => this.handleChangeCountry(event)} value={this.state.country} />
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Language: </Text>
                    <TextInput onChange={event => this.handleChangeLanguage(event)} value={this.state.language} />
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Favorite Book: </Text>
                    <TextInput onChange={event => this.handleChangeFavoriteBook(event)} value={this.state.favoriteBook} />
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Favorite Genre: </Text>
                    <TextInput onChange={event => this.handleChangeFavoriteGenre(event)} value={this.state.favoriteGenre} />
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Gender: </Text>
                    <TextInput onChange={event => this.hanldeChangeGender(event)} value={this.state.gender} />
                  </View>
                  <Button title='Submit' onPress={this.handleSubmitEditProfile} /> 
              </View>
            );
        } else {
            return ( 
              <View style={{alignItems: 'center', flex: 1, flexDirection: 'column'}}>
			    	  <Image style={{height: 50, width: 50}} source={require('./dummyImg.png')} />
	                <Text>Profile</Text>
	                <Button title="Edit" onPress = { this.handleEditOnClick } />
                  <View style={{flex: 1, flexDirection: 'row'}}>
  	                <Text>Username: </Text>
  			            <Text>{ this.state.username }</Text>
			            </View>
		              <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Age Range: </Text>
                    <Text>{ this.state.ageRange }</Text>
                  </View>
		              <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Country: </Text>
                    <Text>{ this.state.country }</Text>
                  </View>
		              <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Language: </Text>
                    <Text>{ this.state.language }</Text>
                  </View>
		              <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Favorite Book: </Text>
                  </View>
		              <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Favorite Genre: </Text>
                    <Text>{ this.state.favoriteGenre }</Text>
                  </View>
						      <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>Gender: </Text>
                    <Text>{ this.state.gender }</Text>
                  </View>
	                <Text>Threads</Text>
	               	{this.state.threads.map(thread => <Text>{thread}</Text>)}
	            </View>
            );
        }
    }
}

export default Profile;