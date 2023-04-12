import { useState } from 'react';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import { sendMessage, isTyping } from 'react-chat-engine';

const MessageForm = (props) => {
  const [value, setValue] = useState('');
  const { chatId, creds, setMessages, handleGPT } = props;

  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (newValue.trim().length > 0) {
      setTypingTimeout(
        setTimeout(() => {
          isTyping(props, chatId);
        }, 1000)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = value.trim();

    if (text.length > 0) {
      sendMessage(creds, chatId, { text }, (message) => {
        
        setMessages((prevMessages) => {
          handleGPT(chatId, message);
          return {
            ...prevMessages,
            [message.id]: message,
          };
        });
        
      });
      
    }

    setValue('');
  };

  const handleUpload = (event) => {
    sendMessage(
      creds,
      chatId,
      { files: event.target.files, text: '' },
      (message) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.id]: message,
        }));
      }
    );
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        className="message-input"
        placeholder="Send a message..."
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <label htmlFor="upload-button">
        <span className="image-button">
          <PictureOutlined className="picture-icon" />
        </span>
      </label>
      <input
        type="file"
        multiple={false}
        id="upload-button"
        style={{ display: 'none' }}
        onChange={handleUpload.bind(this)}
      />
      <button type="submit" className="send-button">
        <SendOutlined className="send-icon" />
      </button>
    </form>
  );
};

export default MessageForm;
