# ExChain Analytics Adapter v3.2 Deployment Plan

## Overview
This document outlines the strategy for deploying version 3.2 as the latest release while preserving version 2.5 as legacy archive for version control history using Git Tags and Branches methodology.

## Current State
- **Repository**: Contains v2.5 as the previous release
- **Version in package.json**: `2.5.0`
- **Target**: Deploy v3.2 as the latest release with v2.5 archived for version control history

---

## 🎯 Deployment Strategy: Git Tags + Branches

### Phase 1: Preserve v2.5 as Legacy Archive
```bash
# Ensure you're on the main branch with v2.5
git checkout main

# Tag the current v2.5 state for version history
git tag -a v2.5.0 -m "Version 2.5.0 - Legacy archive for version control history"
git push origin v2.5.0

# Create a maintenance branch for v2.5 archive
git checkout -b release/v2.5
git push origin release/v2.5
```

### Phase 2: Prepare Main Branch for v3.2 Latest Release
```bash
# Switch back to main for v3.2 development
git checkout main

# Update package.json
# - Change version to "3.2.0"
# - Update description to include "Latest Release v3.2"

# Add your v3.2 code changes
# Update README.md with version information (see template below)
```

### Phase 3: Deploy v3.2 as Latest Release
```bash
# Commit v3.2 changes
git add .
git commit -m "Release v3.2.0 - Latest release

- [List key changes from v2.5 to v3.2]
- [New features]
- [Breaking changes if any]"

# Tag v3.2 as latest
git tag -a v3.2.0 -m "Version 3.2.0 - Latest release"
git push origin main
git push origin v3.2.0
```

### Phase 4: Create GitHub Releases
1. **Go to GitHub Repository → Releases → Create new release**
2. **Create v3.2.0 release:**
   - Tag: `v3.2.0`
   - Title: "v3.2.0 - Latest Release"
   - Mark as "Latest release"
   - Include built assets (dist files)

3. **Create v2.5.0 archive:**
   - Tag: `v2.5.0`
   - Title: "v2.5.0 - Legacy Archive"
   - Mark as "Pre-release" (archived)
   - Include note about legacy status

### Phase 5: Update Repository Documentation

#### Main README.md Template
```markdown
# Exchain Analytics Adapter

## 📋 Available Versions

### Version 3.2 (Latest Release)
- **Branch**: `main`
- **Status**: ✅ Latest release
- **Download**: [v3.2.0 Release](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases/tag/v3.2.0)
- **For**: All new implementations and beta testing

### Version 2.5 (Legacy - Version History)
- **Branch**: `release/v2.5` 
- **Tag**: `v2.5.0`
- **Status**: 📦 Archived for version control history
- **Download**: [v2.5.0 Archive](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases/tag/v2.5.0)
- **For**: Version history reference only

## 🚀 Installation Instructions

### Standard Installation (v3.2 - Latest)
📦 **Recommended for all new implementations**

```bash
# Clone latest version
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
cd exchain-analytics-adapter
npm install
npm run build

# Include the generated main.js file
<script src="./dist/main.js"></script>
```

### Legacy Version Access (v2.5 - Archive)
📂 **For version history reference only**

```bash
# Option 1: Clone legacy branch
git clone -b release/v2.5 https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git

# Option 2: Clone and checkout legacy tag
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
git checkout v2.5.0

cd exchain-analytics-adapter
npm install
npm run build
```

## 📝 Version History & Changes

### v3.2.0 (Latest Release)
- **Release Date**: [Current]
- **Status**: Latest release
- **Key Changes**:
  - [List major improvements]
  - [New features]
  - [Performance enhancements]
- **Migration Notes**: [Instructions for upgrading from previous versions]

### v2.5.0 (Legacy Archive)
- **Release Date**: [Previous] 
- **Status**: Archived for version control history
- **Features**: [List key features]

## 🧪 Beta Testing Program

### Current Beta Testing (v3.2):
- **Environment**: Test/staging environments only
- **Duration**: [Testing period]
- **Feedback**: Report to [admin@exchain.co](mailto:admin@exchain.co)
- **Focus Areas**: [Specific areas for v3.2 feedback]

## ⚠️ Important Notes

- **Current version is in beta testing** - not for production use
- **Test environments only** - do not deploy in live advertising environments
- **Data collection**: Analytics collected for improvement
- **Support**: Available during business hours

## 📞 Support
- **v3.2 Issues**: [admin@exchain.co](mailto:admin@exchain.co)
- **General Questions**: [admin@exchain.co](mailto:admin@exchain.co)
```

---

## 🎯 Why Git Tags + Branches?

**Advantages:**
- ✅ Professional versioning strategy for releases
- ✅ Smaller repository size
- ✅ Better Git history management
- ✅ Industry standard approach
- ✅ Easier CI/CD integration
- ✅ Clear rollback capabilities
- ✅ Clean version control history
- ✅ Single recommended version path

## 🚀 Next Steps

1. **Execute Phase 1-3** from deployment strategy
2. **Test v3.2 installation** works correctly
3. **Update user communication** with v3.2 instructions
4. **Monitor feedback from v3.2**
5. **Plan future version releases**

## 📋 Checklist Before Deployment

- [x] Current v2.5 tagged and archived
- [x] v3.2 code ready and tested internally
- [x] README.md updated with latest release positioning
- [ ] GitHub releases created (latest + archive)
- [ ] User groups notified of v3.2 release
- [ ] Rollback plan confirmed
- [ ] Support process updated for v3.2
- [ ] Testing feedback collection process ready

## 🔄 Maintenance Strategy

### For v3.2 Updates (Main Development):
```bash
# Work on main branch
git checkout main
# Make improvements/fixes
git commit -m "Update: [description]"
git tag -a v3.2.8 -m "Version 3.2.8 - Update"
git push origin main
git push origin v3.2.8
```

### For v2.5 Legacy (Emergency Only):
```bash
# Only for critical security/compatibility fixes
git checkout release/v2.5
# Make critical fix
git commit -m "Critical fix: [description]"
git tag -a v2.5.1 -m "Version 2.5.1 - Critical fix"
git push origin release/v2.5
git push origin v2.5.1
```

## 📊 Release Coordination

### User Communication Strategy:
1. **All users**: Direct to v3.2 as the latest release
2. **Clear guidance**: v2.5 is legacy/archived
3. **Feedback Collection**: Focused on v3.2
4. **Issue Tracking**: Primary focus on v3.2 issues

### Success Metrics:
- [x] Successful deployment of v3.2 as latest
- [x] Clear documentation positioning v3.2 as recommended
- [ ] User adoption of v3.2
- [ ] No major issues reported in first week
- [ ] Streamlined support process for single version

---

*Document created: [Date]*  
*Last updated: [Current Date]*  
*Version: 2.0 - Updated to reflect v3.2 as latest release, v2.5 as legacy archive*