import React, { Component } from 'react';
import { Form, Container, Row, Col, Alert, Image, Button } from 'react-bootstrap';
import http from 'http';
import querystring from 'querystring';
import dummyImg from './dummyImg.png';
import {Link} from 'react-router-dom';

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
            port: 8081,
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

    // componentDidMount() {
	//   const getData = querystring.stringify({ user: this.state.username });
    //   const options = {
    //     hostname: 'localhost',
    //     port: 3002,
    //     path: '/browseDiscussions',
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'Content-Length': Buffer.byteLength(getData),
    //     },
    //   };
    //
    //   const req = http.request(options, (res) => {
    //     console.log('submit form');
    //
    //
    //     res.setEncoding('utf8');
    //
    //     res.on('data', (chunk) => {
    //       console.log(chunk);
    //     });
    //
    //     res.on('end', () => {
    //       console.log('No more data');
    //     });
    //   });
    //
    //   req.on('error', (error) => {
    //     console.log(error.message);
    //   });
    //
    //   req.write(getData);
    //   req.end();
    //
    //   const getData2 = querystring.stringify({ user: this.state.username });
    //   const options2 = {
    //     hostname: 'localhost',
    //     port: 3002,
    //     path: '/getProfile',
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'Content-Length': Buffer.byteLength(getData2),
    //     },
    //   };
    //
    //   const req2 = http.request(options2, (res) => {
    //
    //
    //     res.setEncoding('utf8');
    //
    //     res.on('data', (chunk) => {
    //       console.log(chunk);
    //     });
    //
    //     res.on('end', () => {
    //       console.log('No more data');
    //     });
    //   });
    //
    //   req2.on('error', (error) => {
    //     console.log(error.message);
    //   });
    //
    //   req2.write(getData);
    //   req2.end();
    // }

    render() {
        if (this.state.edit) {
            return (
            	<div>
                	<h3>Edit Profile</h3>
                	<Form onSubmit = { this.handleSubmitEditProfile } >
                		<Form.Group >
                			<Form.Label > Favorite Book: </Form.Label>
                			<Form.Control type = "text"
                			value = { this.state.favoriteBook }
                			onChange = { this.handleChangeFavoriteBook }
                			/>
                		</Form.Group>
                		<Form.Group >
                			<Form.Label > Favorite Genre: </Form.Label>
                			<Form.Control type = "text"
                			value = { this.state.favoriteGenre }
                			onChange = { this.handleChangeFavoriteGenre }
                			/>
                		</Form.Group>
                		<Form.Group >
                			<Form.Label > Age Range: </Form.Label>
                			<Form.Control as="select"
                			value = { this.state.ageRange }
                			onChange = { this.handleChangeAgeRange }
                			>
                				{['17-', '18-25', '25-40', '40-70', '70+']
                				.map((age) => <option>{age}</option>)}
                			</Form.Control>
                		</Form.Group>
                		<Form.Group >
                			<Form.Label > Country: </Form.Label>
                			<Form.Control type = "text"
                			value = { this.state.country }
                			onChange = { this.handleChangeCountry }
                			/>
                		</Form.Group>
                		<Form.Group >
                			<Form.Label > Langauge: </Form.Label>
                			<Form.Control type = "text"
                			value = { this.state.language }
                			onChange = { this.handleChangeLanguage }
                			/>
                		</Form.Group>
                		<Button type="submit" > Submit Change </Button>
                	</Form>
                </div>
            );
        } else {
            return (

            	<div>
	                <Alert variant={"primary"}>
			    		Welcome!
			    	</Alert>
			    	<Image src={dummyImg} thumbnail/>
	                <h3>Profile</h3>
	                <Button onClick = { this.handleEditOnClick }> Edit </Button>
	                <Container >
		                <Row >
			                <Col >
			                	Username:
			                </Col>
			                <Col >
			                	{ this.state.username }
			                </Col>
		                </Row>
		                <Row>
		                	<Col>
		                		Age Range:
							</Col>
		                	<Col>
		                		{ this.state.ageRange }
							</Col>
		                </Row>
		                <Row>
		                	<Col>
		                		Country:
							</Col>
		                	<Col>
		                		{ this.state.country }
							</Col>
		                </Row>
		                <Row>
		                	<Col>
		                		Language:
		                	</Col>
		                	<Col>
		                		{ this.state.language }
		                	</Col>
		                </Row>
		                <Row >
			                <Col >
			                	Favorite Book:
			                </Col>
			                <Col >
			                	{ this.state.favoriteBook }
			                </Col>
		                </Row>
		                <Row>
		                	<Col>
		                		Favorite Genre:
		                	</Col>
		                	<Col>
		                		{ this.state.favoriteGenre }
							</Col>
						</Row>
		                <Row >
			                <Col >
			                	Gender
			                </Col>
			                <Col >
			                	{ this.state.gender }
			                </Col>
		                </Row>
	                </Container>
	                <h3>Threads</h3>
	               	{this.state.threads.map(thread => <h5>{thread}</h5>)}
                </div>
            );
        }
    }
}

export default Profile;
