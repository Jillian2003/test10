import { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:2490";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          recipientId: selectedConversation.participants.find(p => p._id !== "currentUserId")._id, // This needs to be fixed
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        loadMessages(selectedConversation._id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <h1 className="mb-4">Messages</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Conversations</h5>
            </div>
            <div className="card-body p-0">
              {conversations.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No conversations yet
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {conversations.map(conversation => (
                    <button
                      key={conversation._id}
                      type="button"
                      className={`list-group-item list-group-item-action ${
                        selectedConversation?._id === conversation._id ? "active" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="fw-bold">
                            {conversation.participants
                              .filter(p => p._id !== "currentUserId") // This needs to be fixed
                              .map(p => `${p.first_name} ${p.last_name}`)
                              .join(", ")}
                          </div>
                          <small className="text-muted">
                            {conversation.lastMessage?.content?.substring(0, 50)}
                            {conversation.lastMessage?.content?.length > 50 ? "..." : ""}
                          </small>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="badge bg-primary rounded-pill ms-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedConversation ? (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  Conversation with{" "}
                  {selectedConversation.participants
                    .filter(p => p._id !== "currentUserId") // This needs to be fixed
                    .map(p => `${p.first_name} ${p.last_name}`)
                    .join(", ")}
                </h5>
              </div>
              <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
                {messages.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message._id}
                      className={`d-flex mb-3 ${
                        message.sender._id === "currentUserId" ? "justify-content-end" : "justify-content-start" // This needs to be fixed
                      }`}
                    >
                      <div
                        className={`p-3 rounded ${
                          message.sender._id === "currentUserId"
                            ? "bg-primary text-white"
                            : "bg-light"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <div className="small mb-1">
                          {message.sender._id === "currentUserId" ? "You" : message.sender.first_name}
                        </div>
                        <div>{message.content}</div>
                        <div className="small opacity-75 mt-1">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={sending}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <h5 className="text-muted">Select a conversation to start messaging</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;