import {
  useState,
} from "react";

import "./Assistant.css";

import {
  sendAssistantMessage,
} from "../../services/assistantService";


const suggestions = [
  "How many tasks are pending?",
  "Show my in-progress tasks",
  "Who has the lowest workload?",
  "Who is best for React?",
  "Show all team members",
  "Give me a project summary",
];


const Assistant = () => {
  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        text:
          "Hello! I am CollabFlow AI Assistant. I can help you with tasks, projects, team members, workload and project progress.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSend =
    async (
      customMessage = null
    ) => {
      const message =
        customMessage ||
        input.trim();

      if (!message) {
        return;
      }

      const userMessage = {
        role: "user",
        text: message,
      };

      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );

      setInput("");
      setError("");
      setLoading(true);

      try {
        const response =
          await sendAssistantMessage(
            message
          );

        const assistantText =
          response.data?.answer ||
          "I could not generate a response.";

        const assistantMessage = {
          role: "assistant",
          text: assistantText,
          data:
            response.data?.data ||
            null,
        };

        setMessages(
          (previous) => [
            ...previous,
            assistantMessage,
          ]
        );

      } catch (err) {
        console.error(
          "ASSISTANT ERROR:",
          err
        );

        const errorMessage =
          err.response?.data
            ?.message ||
          "Unable to contact CollabFlow AI Assistant.";

        setError(
          errorMessage
        );

        setMessages(
          (previous) => [
            ...previous,
            {
              role:
                "assistant",

              text:
                "I encountered an error while processing your request. Please try again.",
            },
          ]
        );

      } finally {
        setLoading(false);
      }
    };


  const handleKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        if (!loading) {
          handleSend();
        }
      }
    };


  const handleClear = () => {
    setMessages([
      {
        role:
          "assistant",

        text:
          "Conversation cleared. What would you like to know about your CollabFlow workspace?",
      },
    ]);

    setError("");
  };


  return (
    <div className="assistant-page">

      <div className="assistant-header">

        <div>
          <span className="assistant-eyebrow">
            COLLABFLOW AI
          </span>

          <h1>
            AI Assistant
          </h1>

          <p>
            Ask questions about tasks,
            projects, team members,
            workload and project
            progress.
          </p>
        </div>


        <button
          className="clear-chat-btn"
          onClick={
            handleClear
          }
        >
          Clear Chat
        </button>

      </div>


      <div className="assistant-layout">

        <div className="assistant-main">

          <div className="chat-container">

            <div className="messages-container">

              {messages.map(
                (
                  message,
                  index
                ) => (
                  <div
                    key={index}
                    className={`message-row ${
                      message.role ===
                      "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                  >

                    {message.role ===
                      "assistant" && (
                      <div className="assistant-avatar">
                        AI
                      </div>
                    )}


                    <div
                      className={`message-bubble ${
                        message.role ===
                        "user"
                          ? "user-message"
                          : "assistant-message"
                      }`}
                    >
                      <p>
                        {message.text}
                      </p>
                    </div>


                    {message.role ===
                      "user" && (
                      <div className="user-avatar">
                        U
                      </div>
                    )}

                  </div>
                )
              )}


              {loading && (
                <div className="message-row assistant-row">

                  <div className="assistant-avatar">
                    AI
                  </div>

                  <div className="message-bubble assistant-message loading-message">

                    <span />
                    <span />
                    <span />

                  </div>

                </div>
              )}

            </div>


            {error && (
              <div className="assistant-error">
                {error}
              </div>
            )}


            <div className="assistant-input-wrapper">

              <textarea
                value={input}
                onChange={(
                  event
                ) =>
                  setInput(
                    event.target
                      .value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Ask CollabFlow AI something..."
                rows="1"
                disabled={
                  loading
                }
              />


              <button
                onClick={() =>
                  handleSend()
                }
                disabled={
                  loading ||
                  !input.trim()
                }
              >
                {loading
                  ? "Thinking..."
                  : "Send"}
              </button>

            </div>

          </div>

        </div>


        <div className="assistant-sidebar">

          <div className="assistant-info-card">

            <span>
              AI WORKSPACE
            </span>

            <h3>
              What can I help with?
            </h3>

            <p>
              Ask questions based on
              your actual CollabFlow
              project data.
            </p>

          </div>


          <div className="suggestions-card">

            <h3>
              Suggested Questions
            </h3>

            <div className="suggestions-list">

              {suggestions.map(
                (
                  suggestion,
                  index
                ) => (
                  <button
                    key={
                      index
                    }
                    onClick={() =>
                      handleSend(
                        suggestion
                      )
                    }
                    disabled={
                      loading
                    }
                  >
                    {suggestion}
                  </button>
                )
              )}

            </div>

          </div>


          <div className="assistant-status-card">

            <div className="status-dot" />

            <div>
              <strong>
                CollabFlow AI
              </strong>

              <span>
                Connected to workspace
                data
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default Assistant;