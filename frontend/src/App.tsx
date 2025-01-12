import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

enum MessageType {
  IMAGE = 'image',
  MESSAGE = 'message',
}

interface ChatMessage {
  message: string;
  nick: string;
  myMessage: boolean;
  type: MessageType;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nick, setNick] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    const nick = prompt('Podaj nick!');

    setNick(nick as string);

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('chat-message', ({ message, nick, userId, type }) => {
      setMessages((prevMessages: ChatMessage[]) => [
        ...prevMessages,
        { message, nick, myMessage: socket.id === userId, type },
      ]);
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  const sendMessage = () => {
    if (nick && message && socket) {
      socket.emit('message', { message, nick, type: MessageType.MESSAGE });
      setMessage('');
    }
  };

  const sendImage = () => {
    if (nick && imageBase64 && socket) {
      socket.emit('message', { message: imageBase64, nick, type: MessageType.IMAGE });
      setImageBase64(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (!imageBase64) {
      return;
    }

    sendImage();
  }, [imageBase64]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main>
      <div className="messages" ref={messagesEndRef}>
        {messages.map((message, index) => {
          return message.type === MessageType.MESSAGE ? (
            <div className={`${message.myMessage ? 'message-bubble-you' : ' message-bubble'}`} key={index}>
              <span className="bubble-autor">{message.nick}: </span>
              <span className="bubble-text">{message.message}</span>
            </div>
          ) : (
            <div className={`${message.myMessage ? 'message-bubble-you' : ' message-bubble'}`} key={index}>
              <span className="bubble-autor">{message.nick}: </span>
              <span className="bubble-text">
                <img src={message.message} />
              </span>
            </div>
          );
        })}
      </div>
      <div className="inputs">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
        <button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="image-upload"
            style={{ display: 'none' }}
            ref={imageInputRef}
          />
          <label htmlFor="image-upload" className="image-upload-label">
            <img className="img-attach" src="/attach.png" alt="Upload image" />
          </label>
        </button>

        <button onClick={sendMessage}>
          <img src="/arrow.png" alt="arrow" />
        </button>
      </div>
    </main>
  );
}

export default App;
