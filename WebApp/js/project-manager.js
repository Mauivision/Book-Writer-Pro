// Book Writer Studio - Project Management System

class ProjectManager {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.loadProjects();
    }

    async loadProjects() {
        try {
            // Load from localStorage or server
            const saved = localStorage.getItem('bookProjects');
            this.projects = saved ? JSON.parse(saved) : [];

            // Add our existing projects for demo/continuation
            this.initializeDemoProjects();

            this.updateProjectList();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    initializeDemoProjects() {
        // Initialize with our existing book projects
        const existingProjects = [
            {
                id: 'weightless-love',
                title: 'Weightless Love',
                genre: 'Science Fiction Romance',
                status: 'Complete',
                wordCount: 22147,
                chapters: 12,
                description: 'A sci-fi romance about love in zero gravity between a human scientist and alien warrior.',
                createdDate: '2024-12-01',
                lastModified: '2024-12-15',
                chaptersData: Array.from({length: 12}, (_, i) => ({
                    number: i + 1,
                    title: `Chapter ${i + 1}`,
                    wordCount: Math.floor(1800 + Math.random() * 400),
                    status: 'Complete'
                }))
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
                lastModified: '2024-12-25',
                chaptersData: Array.from({length: 10}, (_, i) => ({
                    number: i + 1,
                    title: `Chapter ${i + 1}`,
                    wordCount: Math.floor(600 + Math.random() * 200),
                    status: i < 5 ? 'Complete' : 'In Progress'
                }))
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
                lastModified: '2024-12-25',
                chaptersData: Array.from({length: 3}, (_, i) => ({
                    number: i + 1,
                    title: `Chapter ${i + 1}`,
                    wordCount: Math.floor(650 + Math.random() * 100),
                    status: 'Complete'
                }))
            }
        ];

        existingProjects.forEach(project => {
            if (!this.projects.find(p => p.id === project.id)) {
                this.projects.push(project);
            }
        });

        this.saveProjects();
    }

    saveProjects() {
        localStorage.setItem('bookProjects', JSON.stringify(this.projects));
    }

    createProject(data) {
        const newProject = {
            id: data.title.toLowerCase().replace(/\s+/g, '-'),
            title: data.title,
            genre: data.genre,
            description: data.description,
            status: 'New',
            wordCount: 0,
            chapters: 0,
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            chaptersData: []
        };

        this.projects.push(newProject);
        this.saveProjects();
        return newProject;
    }

    updateProject(projectId, updates) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, updates);
            project.lastModified = new Date().toISOString().split('T')[0];
            this.saveProjects();
            return project;
        }
        return null;
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.saveProjects();
    }

    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    updateProjectList() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = '';

        this.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
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
                <div class="project-actions">
                    <button class="btn-primary" onclick="projectManager.openProject('${project.id}')">Open</button>
                    <button class="btn-secondary" onclick="projectManager.editProject('${project.id}')">Edit</button>
                    <button class="btn-danger" onclick="projectManager.deleteProject('${project.id}')">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    openProject(projectId) {
        this.currentProject = this.getProject(projectId);
        if (window.app) {
            window.app.currentProject = this.currentProject;
            window.app.showSection('write');
            window.app.loadWritingInterface();
        }
    }

    editProject(projectId) {
        const project = this.getProject(projectId);
        if (!project) return;

        // Simple edit modal (in real app, this would be more sophisticated)
        const newTitle = prompt('Edit project title:', project.title);
        if (newTitle && newTitle !== project.title) {
            this.updateProject(projectId, { title: newTitle });
            this.updateProjectList();
        }
    }

    saveChapter(projectId, chapterNumber, content) {
        const project = this.getProject(projectId);
        if (!project) return false;

        // Update or create chapter data
        let chapterData = project.chaptersData.find(c => c.number === chapterNumber);
        if (!chapterData) {
            chapterData = {
                number: chapterNumber,
                title: `Chapter ${chapterNumber}`,
                wordCount: 0,
                status: 'Draft'
            };
            project.chaptersData.push(chapterData);
        }

        const wordCount = content.trim().split(/\s+/).length;
        chapterData.wordCount = wordCount;
        chapterData.lastModified = new Date().toISOString();

        // Update project totals
        project.wordCount = project.chaptersData.reduce((sum, ch) => sum + ch.wordCount, 0);
        project.chapters = project.chaptersData.length;
        project.lastModified = new Date().toISOString().split('T')[0];

        this.saveProjects();
        return true;
    }

    loadChapter(projectId, chapterNumber) {
        const project = this.getProject(projectId);
        if (!project) return null;

        const chapterData = project.chaptersData.find(c => c.number === chapterNumber);
        return chapterData ? chapterData.content : null;
    }

    getProjectStats() {
        return {
            totalProjects: this.projects.length,
            totalWords: this.projects.reduce((sum, p) => sum + p.wordCount, 0),
            completedProjects: this.projects.filter(p => p.status === 'Complete').length,
            inProgressProjects: this.projects.filter(p => p.status === 'In Progress').length
        };
    }

    exportProject(projectId, format = 'json') {
        const project = this.getProject(projectId);
        if (!project) return null;

        switch (format) {
            case 'json':
                return JSON.stringify(project, null, 2);
            case 'markdown':
                return this.exportProjectAsMarkdown(project);
            case 'txt':
                return this.exportProjectAsText(project);
            default:
                return project;
        }
    }

    exportProjectAsMarkdown(project) {
        let markdown = `# ${project.title}\n\n`;
        markdown += `**Genre**: ${project.genre}\n`;
        markdown += `**Status**: ${project.status}\n`;
        markdown += `**Word Count**: ${project.wordCount}\n`;
        markdown += `**Chapters**: ${project.chapters}\n\n`;
        markdown += `## Description\n${project.description}\n\n`;

        if (project.chaptersData.length > 0) {
            markdown += `## Chapters\n\n`;
            project.chaptersData.forEach(chapter => {
                markdown += `### Chapter ${chapter.number}: ${chapter.title}\n`;
                markdown += `**Word Count**: ${chapter.wordCount}\n`;
                markdown += `**Status**: ${chapter.status}\n\n`;
            });
        }

        return markdown;
    }

    exportProjectAsText(project) {
        let text = `${project.title}\n`;
        text += `Genre: ${project.genre}\n`;
        text += `Status: ${project.status}\n`;
        text += `Word Count: ${project.wordCount}\n`;
        text += `Chapters: ${project.chapters}\n\n`;
        text += `Description: ${project.description}\n\n`;

        if (project.chaptersData.length > 0) {
            text += `Chapters:\n`;
            project.chaptersData.forEach(chapter => {
                text += `Chapter ${chapter.number}: ${chapter.title} (${chapter.wordCount} words, ${chapter.status})\n`;
            });
        }

        return text;
    }

    importProject(projectData) {
        try {
            const project = typeof projectData === 'string' ? JSON.parse(projectData) : projectData;

            // Check if project already exists
            if (this.projects.find(p => p.id === project.id)) {
                if (!confirm('Project already exists. Overwrite?')) {
                    return false;
                }
                this.deleteProject(project.id);
            }

            this.projects.push(project);
            this.saveProjects();
            return true;
        } catch (error) {
            console.error('Error importing project:', error);
            return false;
        }
    }
}

// Initialize project manager
window.projectManager = new ProjectManager();

