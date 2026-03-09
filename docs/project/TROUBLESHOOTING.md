# NovelCraft AI - Troubleshooting Guide

## 🚨 **Quick Fixes for Common Issues**

### **Issue 1: Import Errors**
**Error**: `Module not found: Can't resolve '@/lib/aiBrain'`

**Solution**:
1. The import should be `@/utils/aiBrain` (not `@/lib/aiBrain`)
2. This has been fixed in the code
3. Restart the development server if you still see this error

### **Issue 2: Syntax Errors**
**Error**: `Expression expected` in import statements

**Solution**:
1. Make sure all imports are properly formatted
2. Check for missing commas or brackets
3. Restart the development server to clear cache

### **Issue 3: Server Won't Start**
**Error**: `Invalid project directory provided`

**Solution**:
1. Make sure you're in the correct directory
2. Run: `npx next dev -p 3012` (not `npm run dev -- --port 3012`)

### **Issue 4: AI Features Not Working**
**Error**: Generic responses or API errors

**Solution**:
1. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
2. Restart the development server
3. Get an API key from [OpenAI Platform](https://platform.openai.com/)

## 🔧 **Step-by-Step Fix Process**

### **Step 1: Verify Your Environment**
```bash
# Check Node.js version (should be 18+)
node --version

# Check if you're in the right directory
pwd
# Should show: C:\Users\Aaron\All-Cursor-projects\Aarons-Book-Writer-Start-TO-finish

# Install dependencies
npm install
```

### **Step 2: Clear Cache and Restart**
```bash
# Stop any running servers
taskkill /F /IM node.exe

# Clear Next.js cache
rm -rf .next

# Restart the server
npx next dev -p 3012
```

### **Step 3: Test the Application**
1. Open http://localhost:3012 in your browser
2. Go to **Planning** → **Overview**
3. Scroll down to the **System Test** component
4. Click **Run System Tests** to verify everything works

## 🎯 **What Should Work Right Now**

### **✅ Working Features (No API Key Required)**
- Professional UI/UX design
- Navigation between views (AI Studio, Workspace, Planning)
- Chapter and character management
- Rich text editor
- Progress tracking
- Theme switching
- Toast notifications
- System test component

### **🤖 AI Features (Requires API Key)**
- AI Writing Companion conversations
- AI Book Generator
- AI chapter suggestions
- AI character development
- AI plot planning

## 🆘 **If You're Still Having Issues**

### **1. Check the Console**
- Open browser developer tools (F12)
- Look for any red error messages
- Share the specific error text

### **2. Verify File Structure**
Make sure these files exist:
```
src/
├── utils/aiBrain.ts ✅
├── components/AI/WritingCompanion.tsx ✅
├── app/page.tsx ✅
└── app/layout.tsx ✅
```

### **3. Test Individual Components**
- Try accessing different views (AI Studio, Workspace, Planning)
- Check if the System Test component works
- Verify toast notifications appear

### **4. Common Solutions**

#### **Port Already in Use**
```bash
# Find what's using port 3012
netstat -ano | findstr :3012

# Kill the process
taskkill /PID <process_id> /F
```

#### **Module Resolution Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **TypeScript Errors**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix any type issues
```

## 📞 **Getting Help**

### **What to Share When Asking for Help**
1. **Specific Error Message**: Copy the exact error text
2. **Steps to Reproduce**: What were you doing when it broke?
3. **Browser Console**: Any errors in developer tools
4. **Environment**: Windows 10, Node.js version, etc.

### **Quick Status Check**
```bash
# Check if server is running
Invoke-WebRequest -Uri http://localhost:3012 -UseBasicParsing | Select-Object StatusCode
# Should return: 200
```

## 🎉 **Success Indicators**

Your NovelCraft AI is working correctly when:
- ✅ Server starts without errors
- ✅ http://localhost:3012 loads successfully
- ✅ You can navigate between AI Studio, Workspace, and Planning
- ✅ System Test component shows all green checkmarks
- ✅ Toast notifications appear when triggered
- ✅ Professional UI loads with proper styling

---

**Need more help?** Check the console for specific error messages and share them for targeted assistance! 🚀 