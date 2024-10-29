"use client";

import React, { useState } from 'react';

const CharacterStory: React.FC = () => {
    const [userMessage, setUserMessage] = useState<string>('');
    const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
        { role: 'system', content: 'You are a highly skilled secret agent, trained to operate covertly, providing information with precision and secrecy.' }
    ]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (userMessage) {
            // Append the new user message to the conversation
            const updatedConversation = [
                ...conversation,
                { role: 'user', content: userMessage }
            ];

            try {
                const res = await fetch('/api/generateStory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: updatedConversation,  // Send entire conversation
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Error from server:', errorData);
                    throw new Error(errorData.error || 'Failed to generate response');
                }

                const data = await res.json();
                const assistantResponse = { role: 'assistant', content: data.story || 'No response generated.' };

                // Update conversation with the assistant's response
                setConversation([...updatedConversation, assistantResponse]);
                setUserMessage('');  // Clear input field after sending message
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage('Error generating response: ' + error.message);
                } else {
                    setErrorMessage('An unknown error occurred.');
                }
            }
        } else {
            setErrorMessage('Please enter a message.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userMessage">Your Message:</label>
                <input
                    type="text"
                    id="userMessage"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Write your message"
                />

                <button type="submit">Send</button>

                {errorMessage && (
                    <div>
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                    </div>
                )}
            </form>

            <div>
                <h3>Conversation</h3>
                {conversation.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default CharacterStory;
