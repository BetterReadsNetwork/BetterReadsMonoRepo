import React, { Component } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'SteffenCornwell',
            favoriteBook: 'Bible',
            gender: 'Male',
            edit: false,
        };
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
    }

    handleSubmitEditProfile(event) {
        event.preventDefault();
        this.setState({ edit: false });
    }

    handleEditOnClick(event) {
        this.setState({ edit: true });
    }

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    render() {
        if (this.state.edit) {
            return ( <
                div >
                <
                Form onSubmit = { this.handleSubmitEditProfile } >
                <
                Form.Group >
                <
                Form.Label > Username: < /Form.Label> <
                Form.Control type = "text"
                value = { this.state.username }
                onChange = { this.handleChangeUsername }
                /> <
                /Form.Group> <
                Button type = "submit" > Submit Change < /Button> <
                /Form> <
                /div>
            );
        } else {
            return ( <
                div >
                <
                Button onClick = { this.handleEditOnClick }
                /> <
                Container >
                <
                Row >
                <
                Col >
                Username:
                <
                /Col> <
                Col > { this.state.username } <
                /Col> <
                /Row> <
                Row >
                <
                Col >
                Favorite Book:
                <
                /Col> <
                Col > { this.state.favoriteBook } <
                /Col> <
                /Row> <
                Row >
                <
                Col >
                Gender <
                /Col> <
                Col > { this.state.gender } <
                /Col> <
                /Row> <
                /Container> <
                /div>
            );
        }
    }
}

export default Profile;