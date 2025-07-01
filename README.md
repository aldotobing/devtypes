# DevTypes - Developer Personality Quiz

Discover your developer personality type through an interactive quiz powered by AI. This application helps you understand your coding style, preferences, and potential career paths in software development.

## 🚀 Features

- Interactive personality quiz with AI-generated questions
- Multiple language support
- Beautiful, responsive UI built with Radix UI and Tailwind CSS
- Shareable results
- Mobile-friendly design
- Support for multiple AI providers (Gemini, DeepSeek)

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS with CSS Modules
- **UI Components**: Radix UI Primitives
- **Form Handling**: React Hook Form
- **State Management**: React Context API
- **AI Integration**: Gemini AI, DeepSeek AI
- **Type Safety**: TypeScript
- **Build Tool**: Vite (via Next.js)
- **Linting**: ESLint
- **Styling**: PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- API keys for AI services (Gemini and/or DeepSeek)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aldotobing/devtypes.git
   cd devtypes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
   NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
   NEXT_PUBLIC_AI_ENDPOINT=https://api.deepseek.com/v1/chat/completions
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```
devtypes/
├── app/                 # Next.js 13+ app directory
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── public/              # Static files
├── styles/              # Global styles and CSS modules
├── .env                # Environment variables
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## 🛠 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini AI](https://ai.google.dev/)
- [DeepSeek AI](https://deepseek.com/)

---

Made with ❤️ by Aldo Tobing
