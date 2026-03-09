// Book Writer Studio - Main Application JavaScript

class BookWriterApp {
    constructor() {
        this.currentProject = null;
        this.currentChapter = null;
        this.projects = [];
        this.templates = {};
        this.dailyGoal = 1000;
        this.weeklyWords = 0;
        this.totalWords = 0;

        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.updateDashboard();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Project creation
        document.getElementById('create-project-btn')?.addEventListener('click', () => {
            this.createNewProject();
        });

        // Writing interface
        document.getElementById('chapter-editor')?.addEventListener('input', (e) => {
            this.updateWordCount(e.target.value);
        });

        // Save functionality
        document.getElementById('save-chapter')?.addEventListener('click', () => {
            this.saveChapter();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section-specific data
        if (sectionName === 'projects') {
            this.loadProjectsView();
        } else if (sectionName === 'write') {
            this.loadWritingInterface();
        }
    }

    async loadProjects() {
        try {
            // In a real app, this would load from a server
            // For now, we'll simulate with localStorage
            const savedProjects = localStorage.getItem('bookProjects');
            this.projects = savedProjects ? JSON.parse(savedProjects) : [];

            // Add our existing projects for demo
            this.addDemoProjects();

            this.updateProjectStats();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    addDemoProjects() {
        // Add our existing book projects as demo data
        const demoProjects = [
            {
                id: 'weightless-love',
                title: 'Weightless Love',
                genre: 'Science Fiction Romance',
                status: 'Complete',
                wordCount: 22147,
                chapters: 12,
                description: 'A sci-fi romance about love in zero gravity between a human scientist and alien warrior.',
                createdDate: '2024-12-01',
                lastModified: '2024-12-15'
            },
            {
                id: 'shadow-realms',
                title: 'Shadow Realms',
                genre: 'Epic Fantasy',
                status: 'In Progress',
                wordCount: 6247,
                chapters: 10,
                description: 'Epic fantasy adventure featuring shadow magic and day/night cycle mechanics.',
                createdDate: '2024-12-01',
                lastModified: '2024-12-20'
            },
            {
                id: 'international-hearts',
                title: 'International Hearts',
                genre: 'Contemporary Romance',
                status: 'In Development',
                wordCount: 2052,
                chapters: 3,
                description: 'Cross-cultural romance exploring Japanese-American relationships.',
                createdDate: '2024-12-20',
                lastModified: '2024-12-25'
            }
        ];

        demoProjects.forEach(project => {
            if (!this.projects.find(p => p.id === project.id)) {
                this.projects.push(project);
            }
        });

        this.saveProjects();
    }

    saveProjects() {
        localStorage.setItem('bookProjects', JSON.stringify(this.projects));
    }

    updateProjectStats() {
        document.getElementById('project-count').textContent = this.projects.length;
        this.totalWords = this.projects.reduce((sum, project) => sum + project.wordCount, 0);
        document.getElementById('total-words').textContent = this.totalWords.toLocaleString();
    }

    createNewProject() {
        const projectName = prompt('Enter project name:');
        if (!projectName) return;

        const newProject = {
            id: projectName.toLowerCase().replace(/\s+/g, '-'),
            title: projectName,
            genre: 'New Project',
            status: 'New',
            wordCount: 0,
            chapters: 0,
            description: 'New book project',
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };

        this.projects.push(newProject);
        this.saveProjects();
        this.updateProjectStats();
        this.showSection('projects');
    }

    loadProjectsView() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        this.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span>Genre: ${project.genre}</span>
                    <span>Status: ${project.status}</span>
                </div>
                <div class="project-meta">
                    <span>${project.wordCount.toLocaleString()} words</span>
                    <span>${project.chapters} chapters</span>
                </div>
                <button class="btn-primary" onclick="app.openProject('${project.id}')">Open Project</button>
            `;
            container.appendChild(projectCard);
        });
    }

    openProject(projectId) {
        this.currentProject = this.projects.find(p => p.id === projectId);
        this.showSection('write');
        this.loadWritingInterface();
    }

    loadWritingInterface() {
        if (!this.currentProject) return;

        // Update project selector
        const selector = document.getElementById('current-project');
        selector.innerHTML = `<option value="${this.currentProject.id}" selected>${this.currentProject.title}</option>`;

        // Load chapters (simulated for demo)
        this.loadChapters();
    }

    loadChapters() {
        const chapterList = document.getElementById('chapter-list');
        chapterList.innerHTML = '';

        // Simulate loading chapters
        for (let i = 1; i <= (this.currentProject.chapters || 12); i++) {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.textContent = `Chapter ${i}`;
            chapterItem.onclick = () => this.loadChapter(i);
            chapterList.appendChild(chapterItem);
        }
    }

    loadChapter(chapterNumber) {
        // Simulate loading chapter content
        const editor = document.getElementById('chapter-editor');
        editor.value = `# Chapter ${chapterNumber}: [Chapter Title]

[Location] - [Time/Setting]

---

[Opening hook - compelling first paragraph that draws readers in]

[Body content - develop scene, advance plot, reveal character]

[Key scene - introduce conflict or major plot advancement]

[Character development - show growth, relationships, internal conflict]

[Transition - smoothly move to next scene]

[Ending hook - leave reader wanting more]

---

*End of Chapter ${chapterNumber}*

**Word Count**: [Insert word count]
**Status**: [Draft/First Draft/Complete]
**Next**: Chapter ${chapterNumber + 1} - "[Next Chapter Title]"`;

        this.updateWordCount(editor.value);
    }

    updateWordCount(text) {
        const words = text.trim().split(/\s+/).length;
        document.getElementById('current-words').textContent = words;

        // Update project word count if this is the current project
        if (this.currentProject) {
            this.currentProject.wordCount = words;
            this.currentProject.lastModified = new Date().toISOString().split('T')[0];
            this.saveProjects();
            this.updateProjectStats();
        }
    }

    saveChapter() {
        const content = document.getElementById('chapter-editor').value;
        if (!content.trim()) {
            alert('Nothing to save!');
            return;
        }

        // In a real app, this would save to server
        // For demo, we'll just show success message
        alert('Chapter saved successfully!');

        this.updateWordCount(content);
    }

    exportChapter() {
        const content = document.getElementById('chapter-editor').value;
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

    insertTemplate(templateType) {
        const editor = document.getElementById('chapter-editor');
        const templates = {
            'chapter-header': `# Chapter [Number]: [Chapter Title]

*[Location] - [Time/Setting]*

---

`,
            'dialogue': `**CHARACTER:** "Dialogue here."

**OTHER CHARACTER:** "Response here."

`,
            'description': `[Sensory description - sights, sounds, smells, textures, emotions]

`
        };

        const cursorPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, cursorPos);
        const textAfter = editor.value.substring(cursorPos);
        editor.value = textBefore + templates[templateType] + textAfter;
        editor.focus();
        editor.setSelectionRange(cursorPos + templates[templateType].length, cursorPos + templates[templateType].length);
    }

    formatText(format) {
        const editor = document.getElementById('chapter-editor');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);

        if (!selectedText) {
            alert('Please select text to format');
            return;
        }

        const formats = {
            'bold': `**${selectedText}**`,
            'italic': `*${selectedText}*`
        };

        const formattedText = formats[format];
        editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
        editor.focus();
        editor.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }

    updateDashboard() {
        // Update project count and total words
        this.updateProjectStats();

        // Load recent projects in dashboard
        const recentProjectsContainer = document.getElementById('recent-projects');
        recentProjectsContainer.innerHTML = '';

        this.projects.slice(0, 3).forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <strong>${project.title}</strong><br>
                <small>${project.wordCount.toLocaleString()} words • ${project.status}</small>
            `;
            projectItem.onclick = () => this.openProject(project.id);
            recentProjectsContainer.appendChild(projectItem);
        });
    }

    loadTemplate(templateType) {
        const templates = {
            'chapter': `# Chapter [Number]: [Chapter Title]

*[Location] - [Time/Setting]*

---

[Opening hook - compelling first paragraph]

[Body content with scene development]

[Character development and conflict]

[Transition to next scene]

[Ending hook for reader engagement]

---

*End of Chapter [Number]*

**Word Count**: [Insert word count]
**Status**: [Draft/First Draft/Complete]
**Next**: Chapter [Next Number] - "[Next Chapter Title]"`,

            'character': `# CHARACTER PROFILE: [Character Name]

## 📊 **BASIC INFORMATION**

- **Full Name**: [Character's complete name]
- **Age**: [Age at story start]
- **Occupation**: [Job, role, or social position]
- **Birthplace**: [Where they were born]

## 🔍 **PHYSICAL APPEARANCE**

### **📏 Body Description**
- **Height**: [Height in feet/inches]
- **Build**: [Physical build and fitness level]
- **Hair**: [Color, style, distinctive features]
- **Eyes**: [Color, shape, distinctive features]
- **Skin**: [Tone, texture, markings]
- **Distinguishing Features**: [Scars, tattoos, accessories]

## 🧠 **PERSONALITY & PSYCHOLOGY**

### **😊 Core Traits**
- **Strengths**: [3-5 positive qualities]
- **Weaknesses**: [3-5 flaws or challenges]
- **Quirks**: [Unique habits or mannerisms]
- **Humor**: [Sense of humor style]

## 📚 **BACKGROUND & HISTORY**

### **👶 Early Life**
- **Family**: [Parents, siblings, family dynamics]
- **Childhood**: [Key events, influences]
- **Education**: [Formal schooling, mentors]
- **Formative Experiences**: [Life-changing events]

## 🎯 **GOALS & MOTIVATIONS**

### **💪 External Goals**
- **Primary Objective**: [Main goal they want to achieve]
- **Secondary Goals**: [Supporting objectives]

### **❤️ Internal Motivations**
- **Core Desire**: [What they truly want emotionally]
- **Hidden Need**: [Unconscious desires]
- **Fear**: [Deepest fears]
- **Values**: [Core beliefs]

## 👥 **RELATIONSHIPS**

### **💕 Romantic Interests**
- **Current Partner**: [If applicable]
- **Past Relationships**: [Significant exes]

### **👫 Allies & Friends**
- **Best Friend**: [Closest relationship]
- **Other Friends**: [Social circle]

## 🌟 **CHARACTER ARC**

### **📈 Development Journey**
- **Starting Point**: [Where they begin]
- **Growth Moments**: [Key development scenes]
- **Climax**: [Moment of transformation]
- **Resolution**: [Where they end up]`
        };

        this.showSection('write');
        const editor = document.getElementById('chapter-editor');
        editor.value = templates[templateType];
        this.updateWordCount(editor.value);
    }

    openTool(toolName) {
        // Placeholder for tool modals
        this.showModal('Tool Coming Soon', `${toolName} tool is under development.`);
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = `<p>${content}</p>`;
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookWriterApp();
});

