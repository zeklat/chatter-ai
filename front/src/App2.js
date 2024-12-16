import React, { useState } from "react";
import './App2.css';

function App2() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { role: "user", content: input };
  
      // Add user's message to the conversation history
      setMessages((prevMessages) => [...prevMessages, userMessage]);
  
      // Send the message to the backend and get the AI response
      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to get a valid response from the server");
        }
  
        const data = await response.json();
  
        
        if (data.response) {
          const aiMessage = { role: "ai", content: data.response };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } else {
          
          const errorMessage = { role: "ai", content: "No response from Ollama." };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      } catch (error) {
        
        const errorMessage = { role: "ai", content: `Error: ${error.message}` };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
  
      
      setInput("");
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="App">
      <main className="main">
        {/* History Section */}
        <div className="history">
          <div className="hisheader">
            <img src="/z.jpg" className="profilepic" alt="profile" />
            <img src="/settings.png" className="settingsbtn" alt="settings" />
          </div>
        </div>

        {/* Conversation Section */}
        <div className="conversation">
          <div>
              <h1>Chatter AI 1b beta v0.12.16.24</h1>
          </div>
          <div className="conv">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "mytext" : "aitext"}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="input">
            <textarea
              className="text-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App2;
