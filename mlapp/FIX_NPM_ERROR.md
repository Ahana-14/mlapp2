# Fix: npm is not recognized

## 🔴 Your Exact Error

```
npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.
At line:1 char:1
+ npm run dev
+ ~~~
    + CategoryInfo          : ObjectNotFound: (npm:String) [], CommandNotFoundException
```

## ✅ Solution: Install Node.js

### Step 1: Download Node.js

1. **Open your browser** and go to:
   ```
   https://nodejs.org/
   ```

2. **Click the green "LTS" button** (recommended for most users)
   - This downloads the Windows Installer (.msi file)
   - LTS = Long Term Support (most stable version)

### Step 2: Install Node.js

1. **Run the downloaded installer** (e.g., `node-v20.x.x-x64.msi`)

2. **Follow the installation wizard:**
   - Click "Next" on welcome screen
   - Accept the license agreement
   - **IMPORTANT:** Keep default installation path: `C:\Program Files\nodejs\`
   - **CRITICAL:** Make sure "Automatically install the necessary tools" is checked
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Restart PowerShell:**
   - Close your current PowerShell window completely
   - Open a new PowerShell window
   - This is required for PATH changes to take effect

### Step 3: Verify Installation

In your **NEW** PowerShell window, run:

```powershell
node --version
npm --version
```

**Expected Output:**
```
v20.11.0
10.2.4
```

If you see version numbers, Node.js is installed correctly! ✅

### Step 4: Navigate to Your Project

```powershell
cd D:\mlapp
```

### Step 5: Install Dependencies

```powershell
npm run install-all
```

**Expected Output:**
```
added 50 packages in 5s
added 20 packages in 3s  
added 500+ packages in 30s
```

### Step 6: Run the Project

```powershell
npm run dev
```

**Expected Output:**
```
[0] Server running on http://localhost:4000
[1] Compiled successfully!
[1] You can now view coding-hours-forecaster-client in the browser.
[1]   Local:            http://localhost:3000
```

### Step 7: Open in Browser

- Open: **http://localhost:3000**
- You should see the login page!

---

## 🎯 Quick Reference

```powershell
# After installing Node.js and restarting PowerShell:

cd D:\mlapp
npm run install-all
npm run dev
```

Then open: http://localhost:3000

---

## ❓ Troubleshooting

### If `node --version` still doesn't work:

1. **Check if Node.js is installed:**
   ```powershell
   Test-Path "C:\Program Files\nodejs\node.exe"
   ```
   If this returns `True`, Node.js is installed but not in PATH.

2. **Add to PATH manually:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs`
   - Click OK on all dialogs
   - **Restart PowerShell**

3. **Or reinstall Node.js** and make sure "Add to PATH" is checked during installation

### If installation fails:

- Make sure you have administrator rights
- Try running the installer as Administrator
- Check Windows Defender isn't blocking the installation

---

## ✅ Success Indicators

After installing Node.js, you should be able to:

- ✅ `node --version` shows a version
- ✅ `npm --version` shows a version  
- ✅ `npm run install-all` completes successfully
- ✅ `npm run dev` starts both servers
- ✅ Browser opens to http://localhost:3000
- ✅ Login page displays correctly

---

## 📝 Summary

**The error occurs because Node.js (which includes npm) is not installed.**

**Fix:** Install Node.js from https://nodejs.org/ → Restart PowerShell → Run `npm run install-all` → Run `npm run dev`

**Your code is ready - it just needs Node.js to run!**

