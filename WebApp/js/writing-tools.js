// Book Writer Studio - Writing Tools System

class WritingTools {
    constructor() {
        this.currentEditor = null;
        this.templates = {};
        this.loadWritingTools();
    }

    loadWritingTools() {
        // Initialize writing tools and shortcuts
        this.setupKeyboardShortcuts();
        this.loadCustomTemplates();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentChapter();
            }

            // Ctrl/Cmd + B for bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.formatText('bold');
            }

            // Ctrl/Cmd + I for italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.formatText('italic');
            }
        });
    }

    setEditor(editorElement) {
        this.currentEditor = editorElement;
    }

    insertText(text, cursorOffset = 0) {
        if (!this.currentEditor) return;

        const start = this.currentEditor.selectionStart;
        const end = this.currentEditor.selectionEnd;
        const selectedText = this.currentEditor.value.substring(start, end);

        const newText = text.replace('[SELECTED]', selectedText);
        const textBefore = this.currentEditor.value.substring(0, start);
        const textAfter = this.currentEditor.value.substring(end);

        this.currentEditor.value = textBefore + newText + textAfter;
        this.currentEditor.focus();

        // Set cursor position
        const newCursorPos = start + newText.length + cursorOffset;
        this.currentEditor.setSelectionRange(newCursorPos, newCursorPos);

        // Update word count
        this.updateWordCount();
    }

    formatText(formatType) {
        if (!this.currentEditor) return;

        const start = this.currentEditor.selectionStart;
        const end = this.currentEditor.selectionEnd;

        if (start === end) {
            alert('Please select text to format');
            return;
        }

        const selectedText = this.currentEditor.value.substring(start, end);
        let formattedText = '';

        switch (formatType) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'heading':
                formattedText = `## ${selectedText}`;
                break;
            case 'dialogue':
                formattedText = `**CHARACTER:** "${selectedText}"`;
                break;
        }

        const textBefore = this.currentEditor.value.substring(0, start);
        const textAfter = this.currentEditor.value.substring(end);

        this.currentEditor.value = textBefore + formattedText + textAfter;
        this.currentEditor.focus();
        this.currentEditor.setSelectionRange(start + formattedText.length, start + formattedText.length);

        this.updateWordCount();
    }

    insertTemplate(templateName) {
        const templates = {
            'chapter-header': `# Chapter [NUMBER]: [TITLE]

*[LOCATION] - [TIME/SETTING]*

---

`,
            'dialogue': `**CHARACTER:** "Dialogue here."

**OTHER:** "Response here."

`,
            'description': `[Vivid description - sights, sounds, smells, textures, emotions that immerse the reader in the scene]

`,
            'scene-break': `---

*[Scene transition or time skip]*

`,
            'character-intro': `**[CHARACTER NAME]** emerged from the [LOCATION], [PHYSICAL DESCRIPTION]. [PERSONALITY TRAIT] and [DISTINCTIVE FEATURE] made them [UNIQUE IDENTIFIER].

`,
            'conflict-setup': `The tension had been building [TIME PERIOD]. [PROTAGONIST] knew that [CONFLICT] would [IMPACT], but [REASON FOR DELAY]. Now, [TRIGGERING EVENT] forced the confrontation.

`,
            'emotional-beat': `[CHARACTER] felt [EMOTION] as [SITUATION]. [INTERNAL MONOLOGUE]. [PHYSICAL SENSATION]. [DECISION OR ACTION].

`,
            'world-detail': `[WORLD ELEMENT] [DESCRIPTION]. This [CULTURAL/TECHNOLOGICAL/MAGICAL DETAIL] [IMPACT ON STORY/CHARACTER].

`
        };

        this.insertText(templates[templateName] || '');
    }

    saveCurrentChapter() {
        if (!this.currentEditor || !window.app?.currentProject) return;

        const content = this.currentEditor.value;
        const wordCount = content.trim().split(/\s+/).length;

        // Update project data
        if (window.projectManager) {
            window.projectManager.saveChapter(window.app.currentProject.id, 1, content); // Assuming chapter 1 for now
        }

        // Show save confirmation
        this.showSaveNotification('Chapter saved successfully!');
    }

    exportCurrentChapter() {
        if (!this.currentEditor) return;

        const content = this.currentEditor.value;
        if (!content.trim()) {
            alert('Nothing to export!');
            return;
        }

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chapter-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    updateWordCount() {
        if (!this.currentEditor) return;

        const text = this.currentEditor.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

        const wordCountElement = document.getElementById('current-words');
        if (wordCountElement) {
            wordCountElement.textContent = words;
        }

        // Update project word count if available
        if (window.app?.currentProject) {
            window.app.currentProject.wordCount = words;
            window.app.saveProjects();
        }
    }

    showSaveNotification(message) {
        // Create and show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    loadCustomTemplates() {
        // Load any custom templates from localStorage
        const customTemplates = localStorage.getItem('customTemplates');
        if (customTemplates) {
            this.templates = { ...this.templates, ...JSON.parse(customTemplates) };
        }
    }

    createCustomTemplate(name, content) {
        this.templates[name] = content;
        localStorage.setItem('customTemplates', JSON.stringify(this.templates));
    }

    getWritingStats() {
        if (!window.projectManager) return null;

        const stats = window.projectManager.getProjectStats();
        const currentProject = window.app?.currentProject;

        return {
            ...stats,
            currentProject: currentProject ? {
                title: currentProject.title,
                wordCount: currentProject.wordCount,
                chapters: currentProject.chapters
            } : null
        };
    }

    validateChapter() {
        if (!this.currentEditor) return { valid: false, issues: ['No content'] };

        const content = this.currentEditor.value;
        const issues = [];

        // Check for basic structure
        if (!content.includes('# Chapter')) {
            issues.push('Missing chapter header');
        }

        if (content.split('**').length < 4) {
            issues.push('Consider adding more dialogue or emphasis');
        }

        if (content.length < 500) {
            issues.push('Chapter seems short (under 500 words)');
        }

        return {
            valid: issues.length === 0,
            issues: issues,
            wordCount: content.trim().split(/\s+/).length,
            suggestions: this.getWritingSuggestions(content)
        };
    }

    getWritingSuggestions(content) {
        const suggestions = [];

        // Check for common writing issues
        if (!content.includes('*Location*')) {
            suggestions.push('Consider adding location and time setting');
        }

        if (content.split('\n\n').length < 3) {
            suggestions.push('Break into more paragraphs for better pacing');
        }

        const dialogueCount = (content.match(/"/g) || []).length;
        if (dialogueCount < 6) {
            suggestions.push('Consider adding more dialogue for character voice');
        }

        return suggestions;
    }

    autoSave() {
        if (!this.currentEditor || !window.app?.currentProject) return;

        const content = this.currentEditor.value;
        if (content.length > 100) { // Only autosave if substantial content
            localStorage.setItem(`autosave-${window.app.currentProject.id}`, content);
        }
    }

    loadAutoSave(projectId) {
        const saved = localStorage.getItem(`autosave-${projectId}`);
        if (saved && confirm('Found autosaved content. Load it?')) {
            return saved;
        }
        return null;
    }
}

// Initialize writing tools
window.writingTools = new WritingTools();

// Auto-save every 30 seconds
setInterval(() => {
    window.writingTools?.autoSave();
}, 30000);

