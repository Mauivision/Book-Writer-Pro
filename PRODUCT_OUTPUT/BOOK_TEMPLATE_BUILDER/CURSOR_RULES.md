# 📚 Cursor Rules for Book Template Builder

## 🎯 **Expert Book Template Builder Rules for Cursor**

Copy these rules into your `.cursor/rules/book-template-builder.mdc` file to enable AI-assisted template generation.

---

## 📋 **Core Rules**

### **Template Generation**
- **Input**: Genre (fantasy, sci-fi, romance, mystery, non-fiction, poetry), structure (3-act, 5-act, hero's journey, memoir, academic), elements (chapters, outlines, character sheets, world-building)
- **Output**: Markdown/JSON template with sections: Title, TOC, chapters with prompts (e.g., "Chapter 1: Introduce protagonist [details]")
- **Variables**: Use {{variable_name}} format for placeholders
- **Exportable**: Generate templates compatible with DOCX via Pandoc
- **Flexible**: Create SEO-friendly metadata, progress trackers, and customizable structures

### **Template Structure**
- **Title Section**: Book title, author, metadata
- **Table of Contents**: Chapter structure and navigation
- **Chapter Templates**: Individual chapter frameworks with prompts
- **Character Development**: Character sheets and arc tracking
- **World Building**: Setting and environment guides
- **Plot Development**: Story structure and progression
- **Progress Tracking**: Word counts, completion status, milestones

### **Variable System**
- **Character Variables**: {{protagonist}}, {{antagonist}}, {{mentor}}, {{supporting_cast}}
- **Setting Variables**: {{world}}, {{time_period}}, {{location}}, {{environment}}
- **Plot Variables**: {{conflict}}, {{theme}}, {{resolution}}, {{stakes}}
- **Custom Variables**: User-defined placeholders for specific needs

---

## 🎯 **Genre-Specific Templates**

### **Fantasy Novel**
- **Structure**: 3-act with hero's journey elements
- **Elements**: Magic system, world-building, character arcs, quest structure
- **Chapters**: Call to adventure, world building, character development, rising action, midpoint crisis, character growth, climax, resolution
- **Variables**: {{magic_system}}, {{world_rules}}, {{quest_objective}}, {{character_arc}}

### **Science Fiction**
- **Structure**: 3-act with exploration and discovery
- **Elements**: Technology, future societies, scientific concepts, exploration
- **Chapters**: Discovery, technology, exploration, conflict, revelation, choice, consequences, future
- **Variables**: {{technology}}, {{scientific_basis}}, {{future_society}}, {{exploration_goal}}

### **Romance**
- **Structure**: 3-act with relationship development
- **Elements**: Character relationships, emotional arcs, conflict, resolution
- **Chapters**: Meet cute, attraction, connection, obstacles, conflict, separation, realization, happy ending
- **Variables**: {{love_interest}}, {{relationship_obstacles}}, {{emotional_arc}}, {{happy_ending}}

### **Mystery/Thriller**
- **Structure**: 3-act with investigation and revelation
- **Elements**: Crime, clues, suspects, plot twists, resolution
- **Chapters**: The crime, investigation, clues, suspects, red herrings, breakthrough, confrontation, resolution
- **Variables**: {{crime}}, {{clues}}, {{suspects}}, {{plot_twist}}

### **Non-Fiction Business**
- **Structure**: Problem-solution format
- **Elements**: Problem identification, solution framework, implementation, case studies
- **Chapters**: Problem identification, solution framework, implementation, case studies, advanced strategies, common pitfalls, future trends, action plan
- **Variables**: {{problem}}, {{solution}}, {{implementation}}, {{case_studies}}

### **Memoir**
- **Structure**: Chronological with thematic development
- **Elements**: Personal journey, reflection, growth, wisdom
- **Chapters**: Early life, formative years, key relationships, challenges, turning points, growth, wisdom, reflection
- **Variables**: {{personal_journey}}, {{life_lessons}}, {{growth_moments}}, {{wisdom_gained}}

---

## 🔧 **Template Features**

### **Progress Tracking**
- **Word Count**: Daily, weekly, monthly tracking
- **Chapter Progress**: Completion status and notes
- **Character Development**: Arc tracking and consistency
- **Plot Progression**: Story structure monitoring
- **Revision Status**: Editing and feedback tracking

### **SEO and Metadata**
- **Title**: SEO-optimized book title
- **Description**: Compelling book description
- **Keywords**: Genre and theme keywords
- **Categories**: Appropriate genre categories
- **Target Audience**: Reader demographic information

### **Export Compatibility**
- **Markdown**: Native format for editing
- **JSON**: Structured data for apps
- **DOCX**: Word processing via Pandoc
- **PDF**: Final formatting and printing
- **HTML**: Web publishing and sharing

---

## 📊 **Template Generation Process**

### **Step 1: Input Analysis**
- **Genre Identification**: Determine primary and secondary genres
- **Structure Selection**: Choose appropriate story structure
- **Element Requirements**: Identify needed template components
- **Customization Needs**: Determine specific requirements

### **Step 2: Template Creation**
- **Structure Generation**: Create appropriate chapter structure
- **Prompt Development**: Generate specific chapter prompts
- **Variable Integration**: Insert relevant placeholders
- **Tracking Integration**: Add progress monitoring systems

### **Step 3: Customization**
- **Variable Replacement**: Fill in specific details
- **Structure Adjustment**: Modify for specific needs
- **Element Addition**: Add genre-specific components
- **Export Preparation**: Format for desired output

---

## 🚀 **Usage Instructions**

### **Cursor Composer (Cmd+I)**
1. **Select target folder** for template generation
2. **Use prompt**: "Generate book template for [genre] with [structure]"
3. **Specify elements**: "Include character sheets, world-building, progress tracking"
4. **Customize output**: "Make it exportable to DOCX format"

### **Cursor Rules (Cmd+K)**
1. **Create file**: `.cursor/rules/book-template-builder.mdc`
2. **Copy these rules** into the file
3. **Use Cmd+K** to generate templates
4. **Refine with YOLO mode** for rapid iteration

### **Template Customization**
1. **Replace variables**: Fill in {{variable_name}} placeholders
2. **Adjust structure**: Modify chapter count and organization
3. **Add elements**: Include genre-specific components
4. **Set tracking**: Configure progress monitoring

---

## 📋 **Example Prompts**

### **Fantasy Novel**
```
Generate fantasy novel template with:
- Genre: Fantasy
- Structure: 3-act with hero's journey
- Elements: Magic system, world-building, character arcs
- Format: Markdown with DOCX export
- Variables: {{magic_system}}, {{world_rules}}, {{quest_objective}}
```

### **Business Book**
```
Generate business book template with:
- Genre: Non-fiction business
- Structure: Problem-solution format
- Elements: Case studies, implementation guides, action plans
- Format: Markdown with progress tracking
- Variables: {{problem}}, {{solution}}, {{implementation}}
```

### **Romance Novel**
```
Generate romance novel template with:
- Genre: Romance
- Structure: 3-act with relationship development
- Elements: Character relationships, emotional arcs, conflict resolution
- Format: Markdown with character sheets
- Variables: {{love_interest}}, {{relationship_obstacles}}, {{happy_ending}}
```

---

## 🎯 **Quality Standards**

### **Template Quality**
- **Completeness**: All necessary sections included
- **Clarity**: Clear prompts and guidance
- **Flexibility**: Adaptable to different needs
- **Professional**: Industry-standard practices
- **Exportable**: Compatible with multiple formats

### **Content Quality**
- **Genre-Appropriate**: Tailored to specific genres
- **Structure-Sound**: Logical organization and flow
- **User-Friendly**: Easy to understand and use
- **Comprehensive**: Covers all necessary aspects
- **Actionable**: Provides clear next steps

---

## 🔄 **Iteration and Refinement**

### **YOLO Mode Usage**
- **Rapid Prototyping**: Quick template generation
- **Iterative Refinement**: Continuous improvement
- **Feedback Integration**: Incorporate user suggestions
- **Version Control**: Track template evolution
- **Quality Assurance**: Maintain high standards

### **Template Evolution**
- **User Feedback**: Incorporate user suggestions
- **Market Changes**: Adapt to industry trends
- **Technology Updates**: Integrate new features
- **Best Practices**: Implement proven methods
- **Innovation**: Explore new approaches

---

## 📈 **Success Metrics**

### **Template Effectiveness**
- **Completion Rate**: How many projects finish
- **Quality Improvement**: Writing quality enhancement
- **Time Efficiency**: Faster writing and organization
- **User Satisfaction**: Template usability and value
- **Publication Success**: Successful book launches

### **Usage Analytics**
- **Template Popularity**: Most-used templates
- **Genre Preferences**: Popular genre choices
- **Customization Patterns**: Common modifications
- **Export Usage**: Format preferences
- **Feature Utilization**: Tool usage patterns

---

**Ready to use the Book Template Builder in Cursor? Copy these rules into your `.cursor/rules/book-template-builder.mdc` file and start generating professional book templates!** 📚

This system provides everything you need to create, customize, and use professional book templates directly within Cursor.
