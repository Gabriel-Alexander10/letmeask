import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import { AdminRoom } from './pages/AdminRoom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

function App() {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <Route exact path="/" component={Home}/>
          <Route path="/rooms/new" component={NewRoom}/>
          <Route path="/rooms/:id" component={Room}/>
          <Route path="/admin/rooms/:id" component={AdminRoom}/>
        </AuthProvider>
      </Switch>
    </Router>
  );
}

export default App;
