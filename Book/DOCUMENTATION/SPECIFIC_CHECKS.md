# 🔍 SPECIFIC CONSISTENCY CHECKS

## 🎯 **Custom Checks for Particular Concerns**

---

## 1. **CHARACTER NAME VARIATIONS**

### **Check For**:
- Name abbreviations (David vs Dave)
- Missing honorifics (Aiko vs Aiko-san)
- Inconsistent surname usage
- Character name typos

### **How to Check**:
```bash
# Search for variations
grep -i "dave\|david t\|thompson" Book/International\ Hearts/CHAPTERS/*.md
grep -i "aiko\|sato" Book/International\ Hearts/CHAPTERS/*.md
```

### **International Hearts Specific**:
- ✅ Always use "David Thompson" or "David-san"
- ✅ Always use "Aiko Sato" or "Aiko-san"
- ⚠️ Check for "David T." or "Dave" - should be corrected

---

## 2. **PHYSICAL DESCRIPTION CONSISTENCY**

### **Check For**:
- Height changes
- Hair color variations
- Eye color inconsistencies
- Build/physique changes

### **How to Check**:
- Compare character profile to chapter descriptions
- Verify physical details match profile exactly
- Check for conflicting descriptions

### **International Hearts**:
- **David**: 6'1", dark brown hair, blue eyes, scar above left eyebrow
- **Aiko**: 5'3", black hair, dark brown eyes, petite
- ⚠️ If height/hair/eyes mentioned differently, flag for review

---

## 3. **AGE/TIMELINE ACCURACY**

### **Check For**:
- Age progression errors
- Timeline jumps that don't make sense
- Inconsistent time references
- Pregnancy timeline accuracy

### **How to Check**:
- Track days/weeks/months mentioned
- Verify ages match timeline
- Check event sequencing

### **International Hearts Specific**:
- **David**: 35 at start
- **Aiko**: 28 at start
- **Timeline**: Modern day (2024-2025)
- **Pregnancy**: 6 weeks confirmed in Chapter 5
- ⚠️ Verify ages remain consistent as story progresses

---

## 4. **OCCUPATION/CAREER CONSISTENCY**

### **Check For**:
- Job title variations
- Career description changes
- Professional terminology accuracy

### **How to Check**:
- Verify occupation matches profile
- Check professional terms used correctly
- Ensure career details consistent

### **International Hearts Specific**:
- **David**: Architect, Competition Judge
- **Aiko**: Graphic Designer (NOT architect - entering architecture competition)
- ⚠️ Don't confuse Aiko's profession - she's a designer, not an architect

---

## 5. **CULTURAL ACCURACY** (International Hearts)

### **Check For**:
- Japanese honorific usage
- Cultural custom accuracy
- Language translation correctness
- Respectful cultural portrayal

### **How to Check**:
- Verify honorifics used appropriately
- Check cultural references accurate
- Ensure no stereotypes
- Verify Japanese customs correctly portrayed

### **Specific Checks**:
- ✅ "-san" for general respect
- ✅ Bowing customs accurate
- ✅ Shoe removal indoors
- ✅ Family structure accurate
- ✅ "Christmas cake" stigma referenced correctly

---

## 6. **MAGIC SYSTEM CONSISTENCY** (Shadow Realms)

### **Check For**:
- Magic rules violations
- Power level inconsistencies
- Terminology variations
- System evolution logical

### **How to Check**:
- Verify magic rules match DOCS/Magic-and-World.md
- Check power limitations maintained
- Ensure terminology consistent

### **Specific Checks**:
- ✅ Integration magic vs balanced magic distinction
- ✅ Constellation mark consistency
- ✅ Echoes definition maintained
- ✅ Consciousness integration rules

---

## 7. **RELATIONSHIP CONSISTENCY**

### **Check For**:
- Relationship timeline errors
- Character connection inconsistencies
- Family relationship accuracy

### **How to Check**:
- Track relationship progression
- Verify family connections
- Check relationship timeline logical

### **International Hearts Specific**:
- ✅ David widower (Sarah died 3 years ago)
- ✅ Aiko's parents: Mr. and Mrs. Sato
- ✅ Relationship progression: Professional → Personal → Romantic
- ⚠️ Verify pregnancy timeline matches relationship timeline

---

## 8. **PLOT HOLE DETECTION**

### **Check For**:
- Unresolved plot threads
- Contradictory events
- Character knowledge inconsistencies
- Logical gaps

### **How to Check**:
- Track plot threads across chapters
- Verify character knowledge accurate
- Check event consequences maintained

---

## 9. **FORMATTING STANDARDS**

### **Check For**:
- Chapter title format variations
- Dialogue format inconsistencies
- Word count tracking gaps
- Status marker variations

### **How to Check**:
- Verify all chapters follow standard format
- Check dialogue format consistent
- Ensure word counts tracked

---

## 10. **CROSS-BOOK CONFLICTS**

### **Check For**:
- Character name conflicts
- Similar concept conflicts
- World-building element conflicts

### **How to Check**:
- Compare character names across books
- Check for similar magic systems
- Verify world-building doesn't conflict

---

## 🛠️ **QUICK CHECK COMMANDS**

### **Character Name Check**:
```bash
# International Hearts
grep -i "david\|aiko" Book/International\ Hearts/CHAPTERS/*.md | grep -v "DAVID\|AIKO"

# Shadow Realms
grep -i "elara\|thorne\|kaelen\|mira" Book/Shadow\ Realms\ Reborn/CHAPTERS/*.md
```

### **Timeline Check**:
```bash
# Find time references
grep -i "day\|week\|month\|year\|ago" Book/International\ Hearts/CHAPTERS/*.md
```

### **Formatting Check**:
```bash
# Check chapter titles
grep "^# Chapter" Book/International\ Hearts/CHAPTERS/*.md

# Check word counts
grep "Word Count" Book/International\ Hearts/CHAPTERS/*.md
```

---

## ✅ **PRIORITY CHECKS**

### **Before Publishing**:
1. ✅ Character name consistency
2. ✅ Physical description accuracy
3. ✅ Timeline verification
4. ✅ Cultural accuracy (if applicable)
5. ✅ Magic system rules (if applicable)
6. ✅ Formatting standardization

---

**Use these specific checks to catch issues early!** ✅🔍

