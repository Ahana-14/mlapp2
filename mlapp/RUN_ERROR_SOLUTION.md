# Run Error and Solution

## 🔴 Current Error When Running

### Exact Error Output:
```
=== Coding Hours Forecaster Setup ===

Checking Node.js installation...
✗ Node.js is NOT installed!
```

**OR when trying to run directly:**
```
npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the 
spelling of the name, or if a path was included, verify that the path is correct and try again.
At C:\Users\kolay\AppData\Local\Temp\ps-script-8436d7ad-35b2-4f78-b216-1e43bc2655d4.ps1:83 char:1
+ npm install
+ ~~~
    + CategoryInfo          : ObjectNotFound: (npm:String) [], CommandNotFoundException
    + FullyQualifiedId: CommandNotFoundException
```

---

## ✅ Solution

### Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version
   - This includes both Node.js and npm

2. **Install Node.js:**
   - Run the installer
   - **IMPORTANT:** Check the box "Add to PATH" during installation
   - Follow the installation wizard
   - Restart your PowerShell/terminal after installation

3. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```
   
   **Expected Output:**
   ```
   v20.x.x
   10.x.x
   ```

### Step 2: Run Setup Script

After Node.js is installed, run:

```powershell
.\setup.ps1
```

**Expected Output:**
```
=== Coding Hours Forecaster Setup ===

Checking Node.js installation...
✓ Node.js found: v20.x.x
Checking npm installation...
✓ npm found: 10.x.x

Installing root dependencies...
added 50 packages in 5s

Installing server dependencies...
added 20 packages in 3s

Installing client dependencies...
added 500+ packages in 30s

=== Setup Complete! ===

To start the application, run:
  npm run dev
```

### Step 3: Start the Application

```powershell
npm run dev
```

**Expected Output:**
```
[0] Server running on http://localhost:4000
[1] 
[1] Compiled successfully!
[1] 
[1] You can now view coding-hours-forecaster-client in the browser.
[1] 
[1]   Local:            http://localhost:3000
[1]   On Your Network:  http://192.168.x.x:3000
```

---

## 🎯 Quick Start (After Node.js Installation)

### Option 1: Use Setup Script
```powershell
.\setup.ps1
npm run dev
```

### Option 2: Manual Setup
```powershell
# Install all dependencies
npm run install-all

# Start both servers
npm run dev
```

### Option 3: Use Start Script
```powershell
.\start.ps1
```

---

## 📋 Verification Checklist

After installing Node.js, verify everything works:

- [ ] `node --version` shows version (e.g., v20.x.x)
- [ ] `npm --version` shows version (e.g., 10.x.x)
- [ ] `.\setup.ps1` completes successfully
- [ ] `npm run dev` starts both servers
- [ ] Backend shows: "Server running on http://localhost:4000"
- [ ] Frontend opens at http://localhost:3000
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can add logs
- [ ] Can view forecast

---

## 🔧 Alternative: Manual Installation

If the scripts don't work, install manually:

```powershell
# Root dependencies
npm install

# Server dependencies
cd server
npm install
cd ..

# Client dependencies
cd client
npm install
cd ..

# Start both
npm run dev
```

---

## 📝 Summary

**Problem:** Node.js is not installed on your system.

**Solution:** 
1. Install Node.js from https://nodejs.org/
2. Restart terminal
3. Run `.\setup.ps1`
4. Run `npm run dev`

**Status:** ✅ Code is ready, just needs Node.js installation


