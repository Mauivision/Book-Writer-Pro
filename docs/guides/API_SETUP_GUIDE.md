# OpenAI API Setup Guide for NovelCraft AI

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Get Your API Key**
1. **Visit**: [OpenAI Platform](https://platform.openai.com/)
2. **Sign Up**: Create free account (no credit card required initially)
3. **Go to**: [API Keys](https://platform.openai.com/api-keys)
4. **Create Key**: Click "Create new secret key"
5. **Name it**: "NovelCraft AI"
6. **Copy Key**: It starts with `sk-` (keep it secret!)

### **Step 2: Add to Your App**
1. **Create file**: `.env.local` in your project root
2. **Add this content**:
```env
OPENAI_API_KEY=sk-your_actual_key_here
OPENAI_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_API_URL=http://localhost:3006
```
3. **Replace** `sk-your_actual_key_here` with your API key from Step 1

### **Step 3: Restart Server**
```bash
# Stop current server (Ctrl+C)
# Then restart:
npx next dev -p 3012
```

### **Step 4: Test AI Features**
1. Go to http://localhost:3012
2. Try chatting with the AI companion
3. Use AI book generation features

---

## 💰 **Cost Information**

### **Free Tier (First 3 Months)**
- ✅ **$0 Cost**: Free credits included
- ✅ **Limited Usage**: Enough for testing and small projects
- ✅ **No Credit Card**: Required after 3 months

### **Paid Usage (After Free Tier)**
- **GPT-3.5-turbo**: ~$0.002 per 1,000 words
- **GPT-4-turbo**: ~$0.03 per 1,000 words
- **Typical Book**: $2-10 total
- **Monthly Usage**: $5-20 for regular writing

### **Cost Examples**
- **Short Story** (5,000 words): $0.01-0.15
- **Novel Chapter** (3,000 words): $0.006-0.09
- **Complete Book** (80,000 words): $0.16-2.40
- **Monthly Writing**: $5-20

---

## 🔧 **Configuration Options**

### **Model Selection**
```env
# Budget Option (Recommended for most users)
OPENAI_MODEL=gpt-3.5-turbo

# Premium Option (Better quality, higher cost)
OPENAI_MODEL=gpt-4-turbo-preview

# Fast Option (Quick responses)
OPENAI_MODEL=gpt-3.5-turbo-16k
```

### **Usage Limits**
1. **Set Budget**: Go to [Usage Limits](https://platform.openai.com/usage)
2. **Monthly Limit**: Set to $10-20 for safety
3. **Alerts**: Get notified when approaching limit

---

## 🛡️ **Security Best Practices**

### **Keep Your Key Safe**
- ✅ **Never share** your API key publicly
- ✅ **Don't commit** `.env.local` to git (already in .gitignore)
- ✅ **Use environment variables** (as shown above)
- ✅ **Rotate keys** if compromised

### **Monitor Usage**
- **Check Usage**: [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- **Set Alerts**: Get notified of high usage
- **Review Logs**: Monitor API calls

---

## 🎯 **What You Get With AI**

### **AI Writing Companion**
- ✅ **Conversational AI**: Chat about your writing
- ✅ **Writing Tips**: Get personalized advice
- ✅ **Story Ideas**: Generate creative concepts
- ✅ **Character Development**: AI-assisted character creation

### **AI Book Generation**
- ✅ **Complete Books**: Generate full manuscripts
- ✅ **Chapter Suggestions**: AI-guided chapter planning
- ✅ **Plot Development**: Intelligent story structure
- ✅ **Genre Writing**: Any genre or style

### **Advanced AI Tools**
- ✅ **Scene Building**: Create detailed scenes
- ✅ **Perspective Shifting**: Change narrative viewpoint
- ✅ **Metaphor Generation**: Creative language assistance
- ✅ **Character Dialogue**: Natural conversation writing

---

## 🆘 **Troubleshooting**

### **"API Key Invalid"**
- Check the key starts with `sk-`
- Verify no extra spaces or characters
- Ensure key is copied completely

### **"Rate Limit Exceeded"**
- Wait a few minutes and try again
- Check your usage dashboard
- Consider upgrading your plan

### **"Model Not Available"**
- Try `gpt-3.5-turbo` instead of `gpt-4`
- Check OpenAI status page
- Verify your account has access

### **"Cost Concerns"**
- Start with GPT-3.5-turbo (cheaper)
- Set usage limits in your account
- Monitor usage regularly

---

## 🎉 **Ready to Start?**

1. **Get your API key** from OpenAI
2. **Add it to `.env.local`**
3. **Restart your server**
4. **Start writing with AI!**

**Your NovelCraft AI will then have full AI capabilities!** 🤖✨

---

## 📞 **Need Help?**

- **OpenAI Support**: [help.openai.com](https://help.openai.com/)
- **Account Issues**: Check your OpenAI dashboard
- **Technical Issues**: Check the troubleshooting guide
- **Cost Questions**: Review the usage dashboard

**Happy Writing!** 📚✨ 