import React from 'react';
import { ChatEngine } from 'react-chat-engine';

import ChatFeed from './components/ChatFeed';
import LoginForm from './components/LoginForm';
import './App.css';

const projectID = process.env.REACT_APP_PROJECT_ID;

const App = () => {
  if (!localStorage.getItem('username')) return <LoginForm />;
  const handleNewMessage = () => {
    console.log('test');
  };

  return (
    <ChatEngine
      height="100vh"
      projectID={projectID}
      userName={localStorage.getItem('username')}
      userSecret={localStorage.getItem('password')}
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      onNewMessage={handleNewMessage}
    />
  );
};

export default App;
