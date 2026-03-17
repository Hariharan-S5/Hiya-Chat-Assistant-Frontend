import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import NewChatSvg from "./assets/new-chat.svg";
import SearchSvg from "./assets/search.svg";
import ImageSvg from "./assets/image.svg";
import AppsSvg from "./assets/apps.svg";
import DeepResearchSvg from "./assets/deep-research.svg";
import CodexSvg from "./assets/codex.svg";
import ProjectSvg from "./assets/project.svg";
import HiyaSvg from "./assets/Hiya-logo.svg";



export default function Sidebar({ onNewChat, user, wholeChatHistory, onSidebarChatSelect }) {
  // Remove fallback SVGs when user logs out
  useEffect(() => {
    const icons = document.querySelectorAll('.sidebar-profile-icon');
    icons.forEach(icon => {
      Array.from(icon.querySelectorAll('svg.fallback-avatar')).forEach(svg => icon.removeChild(svg));
    });
  }, [user]);
  const [selectedChatKey, setSelectedChatKey] = useState("Current conversation to HarryConnect");
  // Handler to log and call onNewChat
  const handleNewChatClick = () => {
    onNewChat();
  };

  // Handler for chat selection
  const handleChatSelect = (key, value) => {
    onSidebarChatSelect(key, value);

  };
  return (
    <aside className="chatgpt-sidebar">
      <div className="sidebar-header">
        <img src={HiyaSvg} alt="Hiya" style={{ width: 32, height: 32 }} />
        Hiya
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-btn" onClick={handleNewChatClick}>
          <img src={NewChatSvg} alt="New Chat" style={{ width: 32, height: 32 }} />
          New chat
        </div>
        <div className="sidebar-btn">
          <img src={SearchSvg} alt="Search" style={{ width: 32, height: 32 }} />
          Search chats
        </div>
        <div className="sidebar-btn">
          <img src={ImageSvg} alt="Images" style={{ width: 32, height: 32 }} />
          Images
        </div>
        <div className="sidebar-btn">
          <img src={AppsSvg} alt="Apps" style={{ width: 32, height: 32 }} />
          Apps</div>
        <div className="sidebar-btn">
          <img src={DeepResearchSvg} alt="Deep Research" style={{ width: 32, height: 32 }} />
        Deep Research</div>
        <div className="sidebar-btn">
          <img src={CodexSvg} alt="Codex" style={{ width: 32, height: 32 }} />
        Codex</div>
        <div className="sidebar-btn">
        <img src={ProjectSvg} alt="Projects" style={{ width: 32, height: 32 }} />
        Projects</div>
      </nav>
      <p className="sidebar-your-header">Your chats</p>
      <div className="sidebar-chats">
        {wholeChatHistory && Object.keys(wholeChatHistory).length > 0 ? (
          Object.entries(wholeChatHistory)
            .sort((a, b) => {
              const tA = a[1].timestamp ? new Date(a[1].timestamp).getTime() : 0;
              const tB = b[1].timestamp ? new Date(b[1].timestamp).getTime() : 0;
              return tB - tA;
            })
            .map(([key, value]) => (
              <div
                className={"sidebar-chat" + (selectedChatKey === key ? " sidebar-chat-active" : "")}
                key={key}
                onClick={() => {
                  setSelectedChatKey(key);
                  handleChatSelect(key, value);
                }}
                style={{ cursor: 'pointer' }}
              >
                {key}
              </div>
            ))
        ) : <></>}

      </div>
      <div className="sidebar-footer">
        <div className="sidebar-footer-profile">
          <span className="sidebar-profile-icon">
            {typeof user === 'object' && user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
                onError={e => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  // Remove any existing fallback SVGs
                  const parent = e.target.parentNode;
                  Array.from(parent.querySelectorAll('svg.fallback-avatar')).forEach(svg => parent.removeChild(svg));
                  // Add fallback SVG
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('width', '36');
                  svg.setAttribute('height', '36');
                  svg.setAttribute('viewBox', '0 0 36 36');
                  svg.setAttribute('fill', 'none');
                  svg.classList.add('fallback-avatar');
                  svg.innerHTML = `
                    <circle cx="18" cy="18" r="18" fill="#e6eaf1" />
                    <circle cx="18" cy="14" r="7" fill="#4f8cff" />
                    <rect x="8" y="24" width="20" height="6" rx="3" fill="#4f8cff" />
                  `;
                  parent.appendChild(svg);
                }}
              />
            ) : (
              <svg className="avatar" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#e6eaf1" />
                <circle cx="18" cy="14" r="7" fill="#4f8cff" />
                <rect x="8" y="24" width="20" height="6" rx="3" fill="#4f8cff" />
              </svg>
            )}
          </span>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-mail">{typeof user === 'object' && user && user.displayName ? user.displayName : 'Guest'}</div>
            <div className="sidebar-profile-type">Free</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
