import React from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './Inbox.module.css';

const Inbox = () => {
  const {
    activeTab,
    activeConversation,
    messageInput,
    messages,
    switchTab,
    selectConversation,
    setMessageInput,
    sendMessage
  } = useChat();
  
  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Inbox</h1>
      
      <div className={styles.inboxContainer}>
        <div className={styles.inboxSidebar}>
          <div className={styles.inboxTabs}>
            <button 
              className={`${styles.inboxTab} ${activeTab === 'exchange' ? styles.active : ''}`}
              onClick={() => switchTab('exchange')}
            >
              Exchange Chat
            </button>
            <button 
              className={`${styles.inboxTab} ${activeTab === 'admin' ? styles.active : ''}`}
              onClick={() => switchTab('admin')}
            >
              Admin Queries
            </button>
          </div>
          
          <div className={styles.inboxSearch}>
            <input type="text" placeholder="Search messages..." />
            <button><i className="fas fa-search"></i></button>
          </div>
          
          <div className={styles.conversationList}>
            <div 
              className={`${styles.conversation} ${activeConversation === 'tech-society' ? styles.active : ''}`}
              onClick={() => setActiveConversation('tech-society')}
            >
              <div className={styles.conversationAvatar}>
                <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationName}>Tech Society</div>
                <div className={styles.conversationPreview}>Sure, we can discuss the exchange...</div>
              </div>
              <div className={styles.conversationMeta}>
                <div className={styles.conversationTime}>10:30 AM</div>
                <div className={styles.conversationBadge}>2</div>
              </div>
            </div>
            
            <div 
              className={`${styles.conversation} ${activeConversation === 'student-council' ? styles.active : ''}`}
              onClick={() => setActiveConversation('student-council')}
            >
              <div className={styles.conversationAvatar}>
                <img src="/assets/avatars/student-council.jpg" alt="Student Council" />
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationName}>Student Council</div>
                <div className={styles.conversationPreview}>We need the auditorium for...</div>
              </div>
              <div className={styles.conversationMeta}>
                <div className={styles.conversationTime}>Yesterday</div>
              </div>
            </div>
            
            <div 
              className={`${styles.conversation} ${activeConversation === 'admin-support' ? styles.active : ''}`}
              onClick={() => setActiveConversation('admin-support')}
            >
              <div className={`${styles.conversationAvatar} ${styles.admin}`}>
                <i className="fas fa-headset"></i>
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationName}>Admin Support</div>
                <div className={styles.conversationPreview}>Your booking request has been...</div>
              </div>
              <div className={styles.conversationMeta}>
                <div className={styles.conversationTime}>Apr 20</div>
              </div>
            </div>
            
            <div 
              className={`${styles.conversation} ${activeConversation === 'venue-manager' ? styles.active : ''}`}
              onClick={() => setActiveConversation('venue-manager')}
            >
              <div className={`${styles.conversationAvatar} ${styles.admin}`}>
                <i className="fas fa-user-tie"></i>
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationName}>Venue Manager</div>
                <div className={styles.conversationPreview}>Regarding your setup requirements...</div>
              </div>
              <div className={styles.conversationMeta}>
                <div className={styles.conversationTime}>Apr 19</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.chatContact}>
              <div className={styles.contactAvatar}>
                <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactName}>Tech Society</div>
                <div className={styles.contactStatus}>Online</div>
              </div>
            </div>
            <div className={styles.chatActions}>
              <button className={styles.actionBtn}><i className="fas fa-phone"></i></button>
              <button className={styles.actionBtn}><i className="fas fa-video"></i></button>
              <button className={styles.actionBtn}><i className="fas fa-info-circle"></i></button>
            </div>
          </div>
          
          <div className={styles.chatMessages}>
            <div className={styles.messageDate}>Today, April 23, 2025</div>
            
            <div className={`${styles.message} ${styles.received}`}>
              <div className={styles.messageAvatar}>
                <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <p>Hi there! I noticed you've booked Computer Lab B204 for April 25th morning. We were planning to use it for our coding workshop.</p>
                </div>
                <div className={styles.messageTime}>10:15 AM</div>
              </div>
            </div>
            
            <div className={`${styles.message} ${styles.sent}`}>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <p>Hello! Yes, I've booked it for a programming workshop for freshmen. What did you have in mind?</p>
                </div>
                <div className={styles.messageTime}>10:20 AM</div>
              </div>
            </div>
            
            <div className={`${styles.message} ${styles.received}`}>
              <div className={styles.messageAvatar}>
                <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <p>I was wondering if you'd be open to exchanging for Seminar Hall 1 at the same time? It has a projector and we can bring laptops.</p>
                </div>
                <div className={styles.messageTime}>10:25 AM</div>
              </div>
            </div>
            
            <div className={`${styles.message} ${styles.sent}`}>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <p>That's an interesting offer. Would the Seminar Hall have enough power outlets for all participants?</p>
                </div>
                <div className={styles.messageTime}>10:28 AM</div>
              </div>
            </div>
            
            <div className={`${styles.message} ${styles.received}`}>
              <div className={styles.messageAvatar}>
                <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <p>Yes, it does! There are power strips along the walls and we can arrange for additional ones if needed. How many participants are you expecting?</p>
                </div>
                <div className={styles.messageTime}>10:30 AM</div>
              </div>
            </div>

            {messages.map(message => (
              <div 
                key={message.id} 
                className={`${styles.message} ${styles[message.type]}`}
              >
                {message.type === 'received' && (
                  <div className={styles.messageAvatar}>
                    <img src="/assets/avatars/tech-society.jpg" alt="Tech Society" />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p>{message.content}</p>
                  </div>
                  <div className={styles.messageTime}>{message.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.chatInput}>
            <button className={styles.attachmentBtn}>
              <i className="fas fa-paperclip"></i>
            </button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button 
              className={styles.sendBtn} 
              onClick={sendMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Inbox;
