// Book Writer Studio - Template System

class TemplateManager {
    constructor() {
        this.templates = {};
        this.loadTemplates();
    }

    async loadTemplates() {
        // Load all our book writing templates
        this.templates = {
            chapter: `# Chapter [Number]: [Chapter Title]

*[Location] - [Time/Setting]*

---

[Opening hook - compelling first paragraph that draws readers in]

[Body content - develop scene, advance plot, reveal character]

[Key scene - introduce conflict or major plot advancement]

[Character development - show growth, relationships, internal conflict]

[Transition - smoothly move to next scene]

[Ending hook - leave reader wanting more]

---

*End of Chapter [Number]*

**Word Count**: [Insert word count]
**Status**: [Draft/First Draft/Complete]
**Next**: Chapter [Next Number] - "[Next Chapter Title]"

---

**Chapter Notes**:
- [Key plot points covered]
- [Character development moments]
- [World building elements introduced]
- [Foreshadowing for future chapters]
- [Themes explored]
- [Romantic elements (if applicable)]

**Ready for your creative development!** 💫`,

            character: `# CHARACTER PROFILE: [Character Name]

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
- **Resolution**: [Where they end up]`,

            world: `# WORLD BUILDING: [World Name]

## 🌍 **COMPLETE WORLD DEVELOPMENT**

**World Type**: [Fantasy/Sci-Fi/Contemporary]
**Key Conflict**: [Central world problem]

## 🗺️ **PHYSICAL GEOGRAPHY**

### **🌍 World Structure**
- **Size**: [Compared to Earth]
- **Continents**: [Major land masses]
- **Climate**: [Weather patterns, seasons]

### **🏞️ Key Locations**
- **Primary Setting**: [Main location description]
- **Secondary Locations**: [Other important places]
- **Hidden Places**: [Secret locations]

## 👥 **SOCIETY & CULTURE**

### **🏛️ Government**
- **System**: [Monarchy, democracy, etc.]
- **Leadership**: [How leaders chosen]
- **Laws**: [Important rules]

### **👨‍👩‍👧‍👦 Social Structure**
- **Classes**: [Social hierarchy]
- **Family**: [Marriage, children]
- **Education**: [Knowledge transmission]

## ⚔️ **MAGIC/TECHNOLOGY SYSTEM**

### **⚡ Core Rules**
- **Source**: [Where power comes from]
- **Acquisition**: [How people gain access]
- **Limitations**: [What cannot be done]

## 🕐 **HISTORY & TIMELINE**

### **📜 Ancient History**
- **Creation**: [How world began]
- **Early Civilizations**: [First societies]
- **Catastrophes**: [Major disasters]

## 📝 **WORLD BUILDING CHECKLIST**

### **✅ Essential Elements**
- [ ] **Geography**: Complete physical setting
- [ ] **Society**: Government and culture
- [ ] **Magic/Tech**: Clear rules and limitations
- [ ] **History**: Past events informing present`,

            plot: `# PLOT OUTLINE: [Book Title]

## 📚 **THREE-ACT STRUCTURE**

### **📖 ACT 1: SETUP**
- **Chapter 1**: [Hook and protagonist introduction]
- **Chapter 2**: [Inciting incident]
- **Chapter 3**: [Rising tension]
- **Chapter 4**: [Point of no return]

### **💥 ACT 2: CONFRONTATION**
- **Chapter 5**: [Enter new world]
- **Chapter 6**: [Gather allies]
- **Chapter 7**: [Midpoint crisis]
- **Chapter 8**: [Deepening conflict]

### **🏆 ACT 3: RESOLUTION**
- **Chapter 9**: [Final preparation]
- **Chapter 10**: [Climactic confrontation]
- **Chapter 11**: [Darkest moment]
- **Chapter 12**: [Resolution and new normal]`
        };
    }

    getTemplate(templateType) {
        return this.templates[templateType] || '';
    }

    insertTemplate(editor, templateType, replacements = {}) {
        let template = this.getTemplate(templateType);

        // Replace placeholders with provided values
        Object.keys(replacements).forEach(key => {
            template = template.replace(new RegExp(`\\[${key}\\]`, 'g'), replacements[key]);
        });

        // Insert at cursor position
        const cursorPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, cursorPos);
        const textAfter = editor.value.substring(cursorPos);

        editor.value = textBefore + template + textAfter;
        editor.focus();

        // Update word count
        if (window.app) {
            window.app.updateWordCount(editor.value);
        }

        return template.length;
    }

    loadProjectTemplates(projectType) {
        // Load project-specific templates based on genre
        switch (projectType) {
            case 'fantasy':
                return {
                    chapter: this.getTemplate('chapter'),
                    character: this.getTemplate('character'),
                    world: this.getTemplate('world'),
                    plot: this.getTemplate('plot')
                };
            case 'romance':
                return {
                    chapter: this.getTemplate('chapter'),
                    character: this.getTemplate('character'),
                    romance: `# ROMANCE SUBPLOT: [Book Title]

## ❤️ **ROMANTIC DEVELOPMENT**

### **💕 Meeting**
- **First Encounter**: [How protagonists meet]
- **Initial Attraction**: [What draws them together]

### **💋 Building Connection**
- **Shared Experiences**: [Events that bond them]
- **Emotional Moments**: [Vulnerable conversations]

### **😘 Deepening Relationship**
- **Trust Building**: [Moments of confidence]
- **Intimate Moments**: [Emotional and physical closeness]

### **💔 Crisis**
- **Major Conflict**: [Event testing relationship]
- **Separation**: [Time apart or emotional distance]

### **💑 Resolution**
- **Reunion**: [How they come back together]
- **Future Together**: [Their life after the story]`
                };
            case 'scifi':
                return {
                    chapter: this.getTemplate('chapter'),
                    character: this.getTemplate('character'),
                    world: this.getTemplate('world') + `

## 🚀 **SCIENCE & TECHNOLOGY**

### **🔬 Scientific Principles**
- **Core Science**: [Physics, biology, etc. of your world]
- **Technology Level**: [Advanced, primitive, mixed]
- **Scientific Method**: [How science works in your world]

### **🛸 Advanced Technology**
- **Transportation**: [Space travel, vehicles]
- **Communication**: [How characters stay connected]
- **Medical**: [Healing and life extension]
- **Weapons**: [Defensive and offensive technology]`,
                    plot: this.getTemplate('plot')
                };
            default:
                return this.templates;
        }
    }

    createCustomTemplate(name, content) {
        this.templates[name] = content;
        this.saveTemplates();
    }

    saveTemplates() {
        localStorage.setItem('customTemplates', JSON.stringify(this.templates));
    }

    loadCustomTemplates() {
        const saved = localStorage.getItem('customTemplates');
        if (saved) {
            this.templates = { ...this.templates, ...JSON.parse(saved) };
        }
    }

    getTemplateCategories() {
        return {
            'Writing': ['chapter', 'dialogue', 'description', 'scene-transition'],
            'Characters': ['character', 'character-arc', 'relationship'],
            'World': ['world', 'location', 'magic-system', 'technology'],
            'Plot': ['plot', 'outline', 'conflict', 'resolution'],
            'Custom': Object.keys(this.templates).filter(key => !['chapter', 'character', 'world', 'plot'].includes(key))
        };
    }
}

// Initialize template manager
window.templateManager = new TemplateManager();

