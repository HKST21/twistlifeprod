import React, { useEffect, useState } from "react";
import { Message, UserProfile } from "../types/interfaces";
import TwistLife from "../class/TwistLifeFeClass";
import "./Inbox.css";

export function Inbox({
    closeInbox,
    currentUser,
    onMessageSent,
    newMessage,
    handleHasMessages
}: {
    closeInbox: () => void,
    currentUser: UserProfile | null,
    onMessageSent: (message: Message) => void,
    newMessage: Message | null,
    handleHasMessages: (hasMessages: number) => void
}) {
    const [conversationPreviews, setConversationPreviews] = useState<Message[] | null>(null);
    const [activeConversation, setActiveConversation] = useState<Message | null>(null);
    const [messagesHistory, setMessagesHistory] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');

    
    useEffect(() => {
        const loadInboxPreview = async () => {
            if (!currentUser?.email) {
                return;
            }

            try {
                const userInbox = await TwistLife.getUserInboxPreview(currentUser.email);
                setConversationPreviews(userInbox ?? []);
                handleHasMessages(userInbox?.length || 0);
            } catch (err) {
                console.error('Failed to load inbox:', err);
                setConversationPreviews([]);
            }
        };

        loadInboxPreview();
    }, [currentUser?.email]);

    
    useEffect(() => {
        if (newMessage && currentUser) {
            
            setConversationPreviews(prev => {
                if (!prev) return [newMessage];

                const otherEmail = newMessage.senderEmail === currentUser.email
                    ? newMessage.receiverEmail
                    : newMessage.senderEmail;

                const existingConversationIndex = prev.findIndex(msg =>
                    msg.senderEmail === otherEmail || msg.receiverEmail === otherEmail
                );

                if (existingConversationIndex === -1) {
                    return [newMessage, ...prev];
                } else {
                    const updatedPreviews = [...prev];
                    updatedPreviews[existingConversationIndex] = newMessage;
                    return updatedPreviews;
                }
            });

            
            if (activeConversation) {
                const isPartOfCurrentConversation =
                    newMessage.senderEmail === activeConversation.senderEmail ||
                    newMessage.senderEmail === activeConversation.receiverEmail ||
                    newMessage.receiverEmail === activeConversation.senderEmail ||
                    newMessage.receiverEmail === activeConversation.receiverEmail;

                if (isPartOfCurrentConversation) {
                    setMessagesHistory(prev => [...prev, newMessage]);
                }
            }
        }
    }, [newMessage, activeConversation, currentUser]);

    // Načtení historie konverzace
    useEffect(() => {
        const loadConversationHistory = async () => {
            if (!activeConversation || !currentUser?.email) return;

            const otherEmail = activeConversation.senderEmail === currentUser.email
                ? activeConversation.receiverEmail
                : activeConversation.senderEmail;

            try {
                const history = await TwistLife.getConversationHistory(currentUser.email, otherEmail);
                setMessagesHistory(history);
            } catch (err) {
                console.error('Failed to load conversation history:', err);
                setMessagesHistory([activeConversation]);
            }
        };

        loadConversationHistory();
    }, [activeConversation, currentUser?.email]);

    const handleSendMessage = async () => {
        if (!currentUser?.email || !activeConversation || !messageText.trim()) {
            return;
        }

        const otherEmail = activeConversation.senderEmail === currentUser.email
            ? activeConversation.receiverEmail
            : activeConversation.senderEmail;

        try {
            const response = await TwistLife.sendMessage({
                id: crypto.randomUUID(),
                senderEmail: currentUser.email,
                senderFirstname: currentUser.firstname,
                senderLastname: currentUser.lastname,
                receiverEmail: otherEmail,
                content: messageText.trim(),
                timestamp: new Date().toISOString(),
            });

            onMessageSent(response);
            setMessagesHistory(prev => [...prev, response]);
            setMessageText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (activeConversation) {
        const otherPersonName = activeConversation.senderEmail === currentUser?.email
            ? activeConversation.receiverEmail
            : `${activeConversation.senderFirstname} ${activeConversation.senderLastname}`;

        return (
            <div>
                <div>
                    <button onClick={() => setActiveConversation(null)}>Back</button>
                    <h4>Chat with {otherPersonName}</h4>
                </div>

                <div className="messages-history">
                    {messagesHistory.map((msg, index) => (
                        <div
                            key={`${msg.id}-${msg.timestamp}-${index}`}
                            className={msg.senderEmail === currentUser?.email ? 'sent' : 'received'}
                        >
                            <div>{msg.content}</div>
                            <small>
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </small>
                        </div>
                    ))}
                </div>

                <div className="message-input">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="inbox-container">
            <div>
                <h3>Messages</h3>
                <button onClick={closeInbox}>Close</button>
            </div>

            <div className="conversations-list">
                {!conversationPreviews?.length ? (
                    <p>No messages yet</p>
                ) : (
                    conversationPreviews.map((preview, index) => (
                        <div
                            className="conversation-preview"
                            key={`${preview.id}-${preview.timestamp}-${index}`}
                            onClick={() => setActiveConversation(preview)}
                        >
                            <div className="preview-header">
                                <span className="preview-sender">
                                    {preview.senderEmail === currentUser?.email
                                        ? preview.receiverEmail
                                        : `${preview.senderFirstname} ${preview.senderLastname}`}
                                </span>
                                <span className="preview-timestamp">
                                    {new Date(preview.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <div className="preview-content">
                                {preview.senderEmail === currentUser?.email && "You: "}
                                {preview.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}