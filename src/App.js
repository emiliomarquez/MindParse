//import './App.css';
import  {MemoryRouter as Router, Route} from 'react-router-dom';
import React from "react";
import 'semantic-ui-css/semantic.min.css'

import Dashboard from './routes/Dashboard'
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Forgot from './routes/Forgot';
import Statistics from "./routes/Statistics";
import User from "./routes/User";
import PrivateRoute from './auth/PrivateRoute';
import {AuthProvider} from './auth/Auth';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path='/' component={Dashboard}/>
          <PrivateRoute exact path='/statistics' component={Statistics}/>
          <PrivateRoute exact path='/User' component={User} />
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={SignUp}/>
          <Route exact path='/forgot' component={Forgot}/>

        </div>
      </Router>
    </AuthProvider>

  );
}

export default App;