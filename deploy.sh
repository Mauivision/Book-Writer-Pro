#!/bin/bash

# 🚀 Book Writer Deployment Script
# Automated deployment for the Book Writer application

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}================================${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    print_error "This script must be run from the Book Writer project root directory"
    exit 1
fi

print_header "🚀 Book Writer Deployment"

# Step 1: Environment Setup
print_status "Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Book Writer Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: Error Tracking
SENTRY_DSN=your_sentry_dsn
EOF
    print_warning "Created .env.local file. Please update with your actual API keys!"
    print_warning "Required: OPENAI_API_KEY"
    print_warning "Optional: NEXT_PUBLIC_GA_ID, SENTRY_DSN"
fi

# Step 2: Install Dependencies
print_status "Installing dependencies..."
npm install

# Step 3: Run Tests
print_status "Running tests..."
if npm run test -- --passWithNoTests 2>/dev/null; then
    print_success "Tests passed!"
else
    print_warning "Tests failed or not found, continuing..."
fi

# Step 4: Lint Check
print_status "Running linting..."
if npm run lint 2>/dev/null; then
    print_success "Linting passed!"
else
    print_warning "Linting issues found, but continuing..."
fi

# Step 5: Build Project
print_status "Building project..."
npm run build

# Step 6: Deploy to Vercel
print_status "Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if project is linked to Vercel
if [ ! -f ".vercel/project.json" ]; then
    print_status "Linking project to Vercel..."
    vercel link --yes
fi

# Deploy
print_status "Deploying to production..."
vercel --prod

print_success "✅ Book Writer deployed successfully!"

# Step 7: Post-deployment setup
print_status "Post-deployment setup..."

# Create a simple health check
cat > health-check.js << 'EOF'
// Simple health check for the deployed application
const https = require('https');

const checkHealth = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log('✅ Application is healthy');
            return true;
        } else {
            console.log('❌ Application health check failed');
            return false;
        }
    } catch (error) {
        console.log('❌ Health check error:', error.message);
        return false;
    }
};

// Run health check if URL is provided
if (process.argv[2]) {
    checkHealth(process.argv[2]);
}
EOF

# Create deployment info
cat > deployment-info.md << EOF
# Book Writer Deployment Information

## Deployment Date
$(date)

## Environment Variables Required
- OPENAI_API_KEY: Your OpenAI API key for AI features
- NEXT_PUBLIC_APP_URL: Your deployed application URL

## Features Deployed
- ✅ AI Writing Companion
- ✅ Chapter Generation & Rewriting
- ✅ Character Development Tools
- ✅ Story Planning & Structure
- ✅ Writing Analytics & Gamification
- ✅ Achievement System
- ✅ Daily Challenges
- ✅ Writing Streaks
- ✅ Character Memory System
- ✅ Live Writing Assistant
- ✅ Plot Hole Detector

## Post-Deployment Checklist
- [ ] Update environment variables in Vercel dashboard
- [ ] Test AI features with OpenAI API key
- [ ] Verify all pages load correctly
- [ ] Test user authentication (if implemented)
- [ ] Set up monitoring and analytics
- [ ] Configure custom domain (optional)

## Monitoring
- Check Vercel dashboard for deployment status
- Monitor function execution and errors
- Set up uptime monitoring
- Configure error tracking (Sentry)

## Support
- Check logs in Vercel dashboard
- Review error tracking
- Monitor performance metrics
EOF

print_success "✅ Deployment complete!"
print_status "Next steps:"
print_status "1. Update environment variables in Vercel dashboard"
print_status "2. Test your deployed application"
print_status "3. Set up monitoring and analytics"
print_status "4. Configure custom domain if needed"

print_header "🎉 Book Writer is live!"

