import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Question from './Question/Question';
import Questions from './Questions/Questions';
import Callback from './Callback';
import NewQuestion from './NewQuestion/NewQuestion';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import Profile from './Profile/Profile';


class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        // {Profile}
        <Route exact path='/' component={Profile}/>
        // <Route exact path='/question/:questionId' component={Question}/>
        //
        // <Route exact path='/callback' component={Callback}/>
        // <Route exact path='/profile' component={Profile}/>
        // <SecuredRoute path='/profile' component={Profile} />
      </div>
    );
  }
}

export default App;
