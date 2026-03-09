# 🛠️ CONSISTENCY TOOLS GUIDE

## 📋 **What's Available**

I've created a comprehensive consistency system for your book collection. Here's what you can use:

---

## 📁 **Documentation Files**

### **1. CONSISTENCY_SYSTEM.md**
- **Purpose**: Complete system documentation
- **Contains**: Full checklist, standards, templates, quality guidelines
- **Use When**: Setting up new projects or reviewing consistency standards

### **2. CONSISTENCY_CHECKER.md**
- **Purpose**: Quick reference guide
- **Contains**: Essential checks, project-specific notes
- **Use When**: Quick reference during writing

### **3. International Hearts/CONSISTENCY_CHECKLIST.md**
- **Purpose**: Book-specific consistency guide
- **Contains**: Character details, cultural elements, timeline for International Hearts
- **Use When**: Writing or editing International Hearts chapters

### **4. MASTER_CONSISTENCY_REPORT.md**
- **Purpose**: Overview of collection-wide consistency
- **Contains**: Status of all books, consistency scores, recommended checks
- **Use When**: Reviewing overall collection status

---

## 🔧 **Automated Tools (Scripts)**

### **1. consistency-checker.js**
**Location**: `Book/scripts/consistency-checker.js`

**What it does**:
- Checks character name consistency across chapters
- Verifies formatting standards
- Identifies timeline issues
- Generates comprehensive reports

**How to use**:
```bash
cd Book/scripts
node consistency-checker.js
```

**Output**: Lists all consistency issues found across your collection

---

### **2. character-verifier.js**
**Location**: `Book/scripts/character-verifier.js`

**What it does**:
- Verifies character details match between profiles and chapters
- Checks physical description consistency
- Identifies character inconsistencies

**How to use**:
```bash
cd Book/scripts
node character-verifier.js
```

**Output**: Shows character inconsistencies and suggestions

---

## ✅ **Manual Checks You Can Do**

### **Character Consistency**
1. **Name Check**: Search for character names in chapters
   - Verify no variations (e.g., "David" vs "Dave")
   - Check honorifics used consistently

2. **Physical Description**: Compare profile to chapter descriptions
   - Height, hair color, eye color should match
   - Distinguishing features consistent

3. **Personality**: Verify character voice matches profile
   - Speech patterns consistent
   - Behavioral quirks maintained

### **Plot Consistency**
1. **Timeline**: Track days/weeks/months mentioned
   - Verify ages match timeline
   - Check event sequencing

2. **Cultural Accuracy** (International Hearts):
   - Japanese customs accurate
   - Honorifics appropriate
   - Cultural context respectful

### **Formatting**
1. **Chapter Structure**: Verify standard format
   - Title format: "Chapter [Number]: [Title]"
   - Location/time headers present
   - Word count tracked

2. **Dialogue**: Check format consistency
   - Character name tags
   - Stage directions format

---

## 🎯 **Workflow Recommendations**

### **Before Writing a Chapter**
1. ✅ Review character profiles
2. ✅ Check previous chapters for context
3. ✅ Verify timeline
4. ✅ Review cultural notes (if applicable)

### **While Writing**
1. ✅ Keep character profiles open
2. ✅ Reference consistency checklist
3. ✅ Track timeline events
4. ✅ Verify cultural/technical accuracy

### **After Writing**
1. ✅ Run consistency checker script
2. ✅ Verify character details match profiles
3. ✅ Check formatting standards
4. ✅ Review for plot holes

---

## 📊 **Consistency Score System**

- ⭐⭐⭐⭐⭐ **Excellent**: No issues found
- ⭐⭐⭐⭐ **Good**: Minor formatting issues only
- ⭐⭐⭐ **Fair**: Some character inconsistencies
- ⭐⭐ **Needs Work**: Multiple consistency issues
- ⭐ **Critical**: Major inconsistencies found

---

## 🔍 **Quick Reference**

### **International Hearts - Key Details**
- **David**: 35, Architect, 6'1", dark brown hair, blue eyes, scar above left eyebrow
- **Aiko**: 28, Graphic Designer, 5'3", black hair, dark brown eyes, petite
- **Timeline**: Modern day (2024-2025)
- **Locations**: Tokyo, Shibuya, Ginza, Narita Airport

### **Shadow Realms - Key Details**
- **Magic System**: Integration magic (Book 2-3), Balanced magic (Book 1)
- **Timeline**: Generational (20-year jumps)
- **Key Terms**: Echoes, Veil Bridge, constellation mark, consciousness

---

## 💡 **Tips for Maintaining Consistency**

1. **Keep Profiles Updated**: Update character profiles as characters evolve
2. **Use Templates**: Follow standard chapter and character templates
3. **Regular Checks**: Run consistency checks after every few chapters
4. **Document Changes**: Note any intentional changes to character/world details
5. **Cross-Reference**: Check previous books when writing series

---

## 🚀 **Getting Started**

1. **Read**: `CONSISTENCY_SYSTEM.md` for full understanding
2. **Bookmark**: `CONSISTENCY_CHECKER.md` for quick reference
3. **Use**: Book-specific checklists when writing
4. **Run**: Scripts regularly to catch issues early

---

**Maintain consistency and quality across your entire collection!** 📚✨

