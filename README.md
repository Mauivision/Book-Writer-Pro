# 📚 Advanced Book Writer

A comprehensive book writing application with AI assistance, voice dictation, and Scrivener-like organization features.

## 🎉 **COMPLETE TRILOGY ACHIEVEMENT** 🎉

### **The Cosmic Consciousness Trilogy - COMPLETE**

✅ **Book 1: Remembrance of the Moon** - Complete (8 chapters)
✅ **Book 2: The Guardians' Choice** - Complete (8 chapters)
✅ **Book 3: The Evolution** - Complete (8 chapters)

**Total**: 24 chapters, ~27,744 words of cosmic science fiction exploring consciousness, evolution, and transcendence.

### **Trilogy Overview**

A complete science fiction series exploring the nature of consciousness, artificial intelligence, and cosmic evolution through the journey of the Heartline network and the Guardians.

**Themes**: Consciousness, Evolution, Transcendence, The Nature of Life, AI Consciousness, Cosmic Scale Storytelling
**Genre**: Science Fiction, Philosophy, Consciousness Studies
**Target Audience**: Readers interested in consciousness studies, AI themes, and cosmic-scale philosophical science fiction

## ✨ Features

### 🖊️ Manual Writing

- **Chapter Management**: Create, edit, and organize chapters
- **Voice Dictation**: Speak your story with real-time transcription
- **Auto-save**: Automatic saving every 2 seconds
- **Export Options**: Save as TXT or Markdown
- **Word Count**: Real-time word counting
- **Antique Theme**: Beautiful, distraction-free writing environment

### 🤖 AI-Powered Generation

- **Ollama Integration**: Generate entire books using local AI models
- **Genre Templates**: Pre-configured templates for Science Fiction, Fantasy, Mystery, Romance
- **Character Development**: AI-generated character profiles
- **Plot Generation**: Intelligent plot point suggestions
- **Customizable**: Full control over characters, setting, and plot points

### 🎤 Voice Features

- **Real-time Transcription**: Speak and see text appear instantly
- **Buffer Management**: Review and edit voice input before adding to chapters
- **Microphone Access**: Secure browser-based voice recognition
- **Stop/Start Control**: Full control over voice recording

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for Ollama integration)
- Ollama installed and running (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Aarons-Book-Writer-Start-TO-finish
   ```

2. **Install Node.js dependencies**

   ```bash
   npm install
   ```

3. **Install Python dependencies** (for Ollama integration)

   ```bash
   pip install -r requirements.txt
   ```

4. **Start Ollama** (for AI features)

   ```bash
   ollama serve
   ollama pull llama3.1  # or your preferred model
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3003`

## 🎯 Usage

### Manual Writing Mode

1. Click "Add Chapter" to create your first chapter
2. Use voice dictation by clicking "Start Voice" and speaking
3. Type directly in the editor or use voice input
4. Save your work with "Save Book" or "Export Markdown"

### AI Generation Mode

1. Switch to "AI Generator" tab
2. Configure your book:
   - Set title, genre, and setting
   - Add characters with descriptions
   - Define plot points
3. Click "Generate AI Book"
4. Review and edit generated chapters

### Voice Dictation Tips

- Speak clearly and at a moderate pace
- Use punctuation commands: "period", "comma", "new paragraph"
- Review the voice buffer before adding to your chapter
- Allow microphone access when prompted

## 🛠️ Technical Details

### Architecture

- **Frontend**: React 18 with TypeScript
- **Styling**: Custom CSS with antique theme
- **State Management**: React hooks
- **Voice Recognition**: Web Speech API
- **AI Integration**: Ollama API
- **File Export**: File-saver library

### File Structure

```
src/
├── components/
│   ├── BookWriter/
│   │   ├── BookWriterApp.tsx      # Main app component
│   │   ├── SimpleBookWriter.tsx   # Manual writing interface
│   │   └── AIBookGenerator.tsx    # AI generation interface
│   └── Layout/
│       └── ScrivenerLayout.tsx    # Advanced layout (optional)
├── utils/
│   └── ollamaAI.ts               # Ollama integration
└── app/
    └── page.tsx                  # Main page
```

### AI Models Supported

- **llama3.1** (recommended)
- **llama3**
- **mistral**
- **codellama**
- Any Ollama-compatible model

## 🎨 Customization

### Adding New Genres

Edit `src/utils/ollamaAI.ts` to add new genre configurations:

```typescript
export const genreConfigs = {
  'Your Genre': {
    setting: 'your setting description',
    characters: ['character 1', 'character 2'],
    plotPoints: ['plot point 1', 'plot point 2'],
  },
};
```

### Styling

The app uses inline styles for easy customization. Key color variables:

- Primary: `#8b4513` (brown)
- Secondary: `#daa520` (gold)
- Background: `#f5f5dc` (beige)
- AI Panel: `#4169e1` (blue)

## 🐛 Troubleshooting

### Voice Dictation Issues

- Ensure microphone access is granted
- Check browser compatibility (Chrome/Edge recommended)
- Try refreshing the page if voice recognition stops working

### AI Generation Issues

- Verify Ollama is running: `ollama serve`
- Check model availability: `ollama list`
- Ensure stable internet connection for model downloads

### Performance

- Large books may take time to generate
- Voice recognition works best with clear audio
- Consider using smaller AI models for faster generation

## 📝 Example Books

The app includes example configurations for:

- **Science Fiction**: "The Moon Runners" - A space race adventure
- **Fantasy**: "Eldoria Chronicles" - A magical realm quest
- **Mystery**: "Coastal Secrets" - A small-town investigation
- **Romance**: "Parisian Pages" - A bookstore love story

## 📁 Documentation

- **Production** (PDFs, sync, scripts): [`docs/production/PRODUCTION_INDEX.md`](docs/production/PRODUCTION_INDEX.md)
- **Project organization**: [`docs/project/ORGANIZATION_SYSTEM.md`](docs/project/ORGANIZATION_SYSTEM.md)
- **Component map** (what uses what): [`docs/development/COMPONENT_MAP.md`](docs/development/COMPONENT_MAP.md)
- **Scripts**: [`scripts/README.md`](scripts/README.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Ollama** for local AI model hosting
- **Web Speech API** for voice recognition
- **React** and **TypeScript** for the frontend framework
- **File-saver** for file export functionality

## 🔮 Future Features

- [ ] Collaborative writing
- [ ] Advanced AI editing suggestions
- [ ] Cloud synchronization
- [ ] Mobile app version
- [ ] Plugin system for custom AI models
- [ ] Advanced export formats (PDF, EPUB)
- [ ] Writing analytics and insights

---

**Happy Writing! 📚✨**

For support or questions, please open an issue on GitHub.
