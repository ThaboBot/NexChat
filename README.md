# ChronoChat: The Futurist Messaging Super App

ChronoChat is a next-generation messaging application that redefines communication through the power of Artificial Intelligence. Built with a futuristic vision, it combines the best features from leading social and messaging platforms into a single, intelligent "super app."

## ✨ Core Features

ChronoChat is packed with innovative features designed to make your conversations smarter, more efficient, and more expressive.

### AI-Powered Communication Tools
*   **Message Rewriter**: Instantly rewrite your messages in different tones (professional, funny, persuasive) before sending.
*   **Live Fact-Checker**: Verify information directly within the chat. The AI assesses statements and provides explanations with sources, inspired by X's Community Notes.
*   **AI Message Summarization**: Automatically get concise summaries of long messages or entire conversations so you never miss what's important.
*   **Real-time Translation**: Break language barriers with on-the-fly message translation powered by AI.
*   **Emotionally-Aware Suggestions**: The app detects the sentiment of your message as you type, suggesting tone corrections or relevant emojis to help you communicate more effectively.
*   **Smart Scheduling Assistant**: The AI automatically detects plans and commitments made in your chats and suggests adding them to your calendar.

### Dynamic & Personalized Experience
*   **Mood-Aware Themes**: The app analyzes the overall mood of a conversation and can suggest or automatically apply a new UI theme (colors and music) to match the vibe.
*   **Custom AI Avatar Builder**: Design your own AI avatar by providing a text description. The system generates a unique image, bio, and even a voice for your digital persona.
*   **Dynamic Message Animations**: Messages come to life with subtle animations based on their emotional tone (e.g., a "happy" message might bounce).

### Advanced Chat Functionality
*   **Chat Polls with AI Analysis**: Create polls to make decisions and use AI to analyze the results, providing insights into sentiment and winning options.
*   **Self-Destructing Messages**: Send ephemeral messages that automatically delete after a set time for enhanced privacy.
*   **Time Capsule Messages**: Write messages now and schedule them to be delivered at a specific date in the future.
*   **Crypto Transfer**: (Coming Soon) Securely send and receive cryptocurrency tokens directly within a chat.

## 🚀 Tech Stack

ChronoChat is built with a modern, powerful, and scalable tech stack:

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **UI Library**: [React](https://react.dev/)
*   **AI/LLM Integration**: [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Hosting**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🛠️ Getting Started

Follow these instructions to get a local copy of ChronoChat up and running for development and testing purposes.

### Prerequisites

*   Node.js (v20 or later)
*   npm or yarn

### Installation

1.  **Clone the repository** (or use it within Firebase Studio):
    ```sh
    git clone https://your-repo-url/chronochat.git
    cd chronochat
    ```

2.  **Install NPM packages**:
    ```sh
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root of the project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    # .env
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

### Running the App

1.  **Start the development server**:
    This command runs the Next.js app.
    ```sh
    npm run dev
    ```

2.  **Start the Genkit development service** (in a separate terminal):
    This command starts the local Genkit server, which makes the AI flows available to your Next.js app.
    ```sh
    npm run genkit:watch
    ```

3.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

```
/
├── src/
│   ├── app/            # Main application pages and layouts
│   ├── components/     # Reusable React components (UI, chat features)
│   ├── ai/             # All AI-related code
│   │   ├── flows/      # Genkit flows that define AI logic
│   │   └── genkit.ts   # Genkit initialization and configuration
│   ├── lib/            # Utility functions, actions, and type definitions
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── ...                 # Configuration files (tailwind, next, etc.)
```

## Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run genkit:dev`: Starts the Genkit development server once.
-   `npm run genkit:watch`: Starts the Genkit server and watches for file changes.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Lints the project files.

---

This README was generated with the help of AI in Firebase Studio.
