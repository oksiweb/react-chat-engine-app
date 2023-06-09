import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import MessageForm from './MessageForm';
import axios from 'axios';
import { sendMessage } from 'react-chat-engine';

const ChatFeed = (props) => {
  const { chats, activeChat, userName, messages, setMessages, creds } = props;
  const chat = chats && chats[activeChat];

  const handleGPT = (chatId, message) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
    };
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message.text }],
      temperature: 0.7,
    };
    axios
      .post(`${process.env.REACT_APP_OPENAI_URL}`, data, config)
      .then((response) => {
        const generatedText = response.data.choices[0].message.content;
        
        let fixedCreds = { ...creds, userName: `${process.env.REACT_AOO_CHATBOT_USERNAME}`, userSecret: `${process.env.REACT_AOO_CHATBOT_USER_SECRET}` };
        sendMessage(fixedCreds, chatId, { text: generatedText }, (message) => {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [message.id]: message,
          }));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderReadReceipts = (message, isMyMessage) =>
    chat.people.map(
      (person, index) =>
        person.last_read === message.id && (
          <div
            key={`read_${index}`}
            className="read-receipt"
            style={{
              float: isMyMessage ? 'right' : 'left',
              backgroundImage:
                person.person.avatar && `url(${person.person.avatar})`,
            }}
          />
        )
    );

  const renderMessages = () => {
    const keys = Object.keys(messages);

    return keys.map((key, index) => {
      const message = messages[key];
      const lastMessageKey = index === 0 ? null : keys[index - 1];
      const isMyMessage = userName === message.sender.username;

      return (
        <div key={`msg_${index}`} style={{ width: '100%' }}>
          <div className="message-block">
            {isMyMessage ? (
              <MyMessage message={message} />
            ) : (
              <TheirMessage
                message={message}
                lastMessage={messages[lastMessageKey]}
              />
            )}
          </div>
          <div
            className="read-receipts"
            style={{
              marginRight: isMyMessage ? '18px' : '0px',
              marginLeft: isMyMessage ? '0px' : '68px',
            }}
          >
            {renderReadReceipts(message, isMyMessage)}
          </div>
        </div>
      );
    });
  };

  if (!chat) return <div />;

  return (
    <div className="chat-feed">
      <div className="chat-title-container">
        <div className="chat-title">{chat?.title}</div>
        <div className="chat-subtitle">
          {chat.people.map((person) => ` ${person.person.username}`)}
        </div>
      </div>
      {renderMessages()}
      <div style={{ height: '100px' }} />
      <div className="message-form-container">
        <MessageForm
          {...props}
          chatId={activeChat}
          messages={messages}
          setMessages={setMessages}
          handleGPT={handleGPT}
        />
      </div>
    </div>
  );
};

export default ChatFeed;
