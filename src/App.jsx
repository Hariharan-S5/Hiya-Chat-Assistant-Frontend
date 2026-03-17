import { auth, provider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import axios from "axios";
import ChatMessageList from "./ChatMessageList";
import ChatInputBox from "./ChatInputBox";
import Sidebar from "./Sidebar";
import "./App.css";

function App() {
  const setDefaultHistory = () => ({
    "Current conversation to HarryConnect": {
      "history": [
        {
          id: 1,
          role: "assistant",
          content: "Hello! Ask me anything"
        }
      ],
      "timestamp": new Date().toISOString()
    }
  });
  const [userId, setUserId] = useState(null);
  const [wholeChatHistory, setWholeChatHistory] = useState(setDefaultHistory());
  const [currentChatSelected, setCurrentChatSelected] = useState("Current conversation to HarryConnect");
    // Handler for sidebar chat selection
    const handleSidebarChatSelect = (key, value) => {
      setCurrentChatSelected(key);  
      console.log('Chat selected app.jsx:', key, value);
      // Example: load selected chat into Current conversation to HarryConnect
      
    };
  
  const handleGoogleLogout = async () => {
    try {
      await saveChatHistory(userId, wholeChatHistory);
      await signOut(auth);
      setUser(null);
      setWholeChatHistory(setDefaultHistory());
    } catch (error) {
      console.error(error);
    }
  };
  const [user, setUser] = useState(null);

  
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      // Call /api/checkuser after sign-in using axios
      if (result.user && result.user.email) {
        const response = await axios.post('http://localhost:5000/api/checkuser', { mailid: result.user.email }, {
          headers: { 'Content-Type': 'application/json' }
        });
        var data = response.data;
        data.chat_history["Current conversation to HarryConnect"]["history"]=data.chat_history["Current conversation to HarryConnect"]["history"].slice(0, -1);
        
        if (data.status === 'success') {
          if (typeof data.user_id === 'number') {
            setUserId(data.user_id);
          }

          if (typeof data.chat_history === 'object' && data.chat_history !== null) {
            data.chat_history["Current conversation to HarryConnect"]["timestamp"] = new Date().toISOString();
            console.log('Chat history loaded from server:', data.chat_history);

            setWholeChatHistory(data.chat_history);
          }

        }
        console.log('Check user response:', data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // State for errorMsg, loading, handleRefresh, lastUserMessage
  const [errorMsg, setErrorMsg] = useState(null);

  // Function to save chat history
  const saveChatHistory = async (userId, histories) => {
    try {
      await axios.post('http://localhost:5000/api/savehistory', { userid: userId, histories }, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };
  const [loading, setLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState(null);

  // API call logic
  const callApi = async (userMsg, history) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMsg.content,
        history
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.status === "error") {
        setErrorMsg("Server error, try again");
        setLastUserMessage(userMsg);
      } else {
        const aiMessage = { role: 'assistant', content: response.data.response };
        setWholeChatHistory(prev => {
          const updated = { ...prev };
          if (!updated[currentChatSelected]) {
            updated[currentChatSelected] = { history: [], timestamp: new Date().toISOString() };
          }
          updated[currentChatSelected] = {
            ...updated[currentChatSelected],
            history: [...(updated[currentChatSelected].history || []), aiMessage],
            timestamp: new Date().toISOString()
          };
          return updated;
        });
        setErrorMsg(null);
        setLastUserMessage(null);
      }
    } catch (error) {
      setErrorMsg("Server error, try again");
      setLastUserMessage(userMsg);
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSend = async (userInput) => {
    if (!userInput.trim()) return;
    const userMessage = { role: 'user', content: userInput };
    // Show user message immediately
    const history =
      wholeChatHistory[currentChatSelected] && wholeChatHistory[currentChatSelected]["history"]
        ? wholeChatHistory[currentChatSelected]["history"].map(({ role, content }) => ({ role, content }))
        : [];
    setWholeChatHistory(prev => {
      const updated = { ...prev };
      if (!updated[currentChatSelected]) {
        updated[currentChatSelected] = { history: [], timestamp: new Date().toISOString() };
      }
      updated[currentChatSelected] = {
        ...updated[currentChatSelected],
        history: [...history, userMessage],
        timestamp: new Date().toISOString()
      };
      return updated;
    });
    await callApi(userMessage, [...history, userMessage]);
  };

  const handleRefresh = async () => {
    if (!lastUserMessage) return;
    // Exclude the last message (user's message) from history
    const history = wholeChatHistory["Current conversation to HarryConnect"]["history"].slice(0, -1).map(({ role, content }) => ({ role, content }));
    await callApi(lastUserMessage, history);
  };

  const handleNewChat = async () => {
    // Store previous history in chat_histories.json with custom key
    if (wholeChatHistory["Current conversation to HarryConnect"]["history"].length > 1) {
      const historyToSave = wholeChatHistory["Current conversation to HarryConnect"]["history"].slice(1); // Exclude initial assistant message
      // Find user message with maximum content length
      const userMsg = historyToSave
        .filter(m => m.role === 'user' && m.content)
        .reduce((maxMsg, msg) =>
          (!maxMsg || msg.content.length > maxMsg.content.length) ? msg : maxMsg
        , null);
      let key = userMsg.content.slice(0, 50);
      //
      // Read existing histories
      wholeChatHistory[key] = { "history": historyToSave };
      wholeChatHistory[key]["timestamp"] = new Date().toISOString();
      wholeChatHistory["Current conversation to HarryConnect"]["history"] = [
        {
          id: 1,
          role: "assistant",
          content: "Hello! Ask me anything"
        }
      ];
      wholeChatHistory["Current conversation to HarryConnect"]["timestamp"] = new Date().toISOString();
      setCurrentChatSelected("Current conversation to HarryConnect");
      // Save updated histories

      setWholeChatHistory({ ...wholeChatHistory });
      // await saveChatHistory(userId, histories);
    }
    setWholeChatHistory(prev => ({
      ...prev,
      "Current conversation to HarryConnect": {
        "history": [
          {
            id: 1,
            role: "assistant",
            content: "Hello! Ask me anything"
          }
        ],
        "timestamp": new Date().toISOString()
      }
    }));
    setErrorMsg(null);
    setLastUserMessage(null);
  };
      
  return (
    <div className="chatgpt-root">
      <Sidebar
        onNewChat={handleNewChat}
        user={user}
        wholeChatHistory={wholeChatHistory}
        onSidebarChatSelect={handleSidebarChatSelect}
      />
      <div className="chatgpt-app">
        <header className="chatgpt-header">
          <div className="chatgpt-header-row">
            <span className="chatgpt-header-title">Ollama-Phi-3</span>
            <span className="chatgpt-signin-link" tabIndex={0} role="button" >
              {user ? (
                <>
                  <span onClick={handleGoogleLogout} >Logout</span>
                </>
              ) : (
                <span onClick={handleGoogleSignIn} >Sign In</span>
              )}
            </span>
          </div>
        </header>
        <div className="chatgpt-divider">
          <main className="chatgpt-main">
            <ChatMessageList
              key={currentChatSelected}
              messages={
                wholeChatHistory &&
                wholeChatHistory[currentChatSelected] &&
                wholeChatHistory[currentChatSelected]["history"]
                  ? wholeChatHistory[currentChatSelected]["history"]
                  : [
                      {
                        id: 1,
                        role: "assistant",
                        content: "Hello! Ask me anything"
                      }
                    ]
              }
              errorMsg={errorMsg}
              loading={loading}
              handleRefresh={handleRefresh}
              lastUserMessage={lastUserMessage}
            />
          </main>
          <footer className="chatgpt-footer">
            <ChatInputBox
              messages={wholeChatHistory[currentChatSelected]["history"]}
              setMessages={setWholeChatHistory}
              handleSend={handleSend}
              loading={loading}
            />
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App
