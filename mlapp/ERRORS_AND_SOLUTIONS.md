# Errors and Solutions

## Current Error

### Error: Node.js/npm not found
```
npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

**Status:** ❌ Node.js is not installed on your system

**Solution:**
1. Download and install Node.js from https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - During installation, make sure to check "Add to PATH"
2. Restart your PowerShell/terminal after installation
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```
4. Run the setup script:
   ```powershell
   .\setup.ps1
   ```
5. Start the application:
   ```powershell
   npm run dev
   ```

---

## Potential Errors After Node.js Installation

### Error 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
- Kill the process using port 4000:
  ```powershell
  netstat -ano | findstr :4000
  taskkill /PID <PID> /F
  ```
- Or change the port in `server/index.js`:
  ```javascript
  const PORT = 4001; // Change to different port
  ```

### Error 2: Port 3000 Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solution:**
- Kill the process or change React's port:
  ```powershell
  $env:PORT=3001
  npm start
  ```

### Error 3: Module Not Found

**Error:**
```
Cannot find module 'express'
```

**Solution:**
- Install dependencies:
  ```powershell
  npm run install-all
  ```
- Or manually:
  ```powershell
  cd server
  npm install
  cd ../client
  npm install
  ```

### Error 4: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
- Make sure backend is running on port 4000
- Check that `cors` is enabled in `server/index.js` (it is)
- Verify API URL in `client/src/api.js` is `http://localhost:4000/api`

### Error 5: Cannot Connect to Server

**Error in Browser:**
```
Cannot connect to server. Make sure the backend is running on http://localhost:4000
```

**Solution:**
1. Start the backend server:
   ```powershell
   cd server
   npm start
   ```
2. In another terminal, start the frontend:
   ```powershell
   cd client
   npm start
   ```
3. Or use the combined command:
   ```powershell
   npm run dev
   ```

### Error 6: React Scripts Not Found

**Error:**
```
'react-scripts' is not recognized
```

**Solution:**
- Install client dependencies:
  ```powershell
  cd client
  npm install
  ```

### Error 7: JWT Token Errors

**Error:**
```
Invalid token
```

**Solution:**
- Clear browser localStorage and login again
- Or check that JWT_SECRET is set in `server/index.js`

---

## Quick Fix Commands

### Install All Dependencies
```powershell
npm run install-all
```

### Start Both Servers
```powershell
npm run dev
```

### Start Backend Only
```powershell
cd server
npm start
```

### Start Frontend Only
```powershell
cd client
npm start
```

### Check if Ports are Available
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

---

## Verification Checklist

After installing Node.js, verify:

- [ ] `node --version` shows a version number
- [ ] `npm --version` shows a version number
- [ ] `npm run install-all` completes without errors
- [ ] `npm run dev` starts both servers
- [ ] Backend shows: "Server running on http://localhost:4000"
- [ ] Frontend opens at http://localhost:3000
- [ ] No errors in browser console
- [ ] Can register/login successfully

---

## Still Having Issues?

1. **Check Node.js Installation:**
   ```powershell
   where.exe node
   where.exe npm
   ```

2. **Check PATH Environment Variable:**
   ```powershell
   $env:PATH -split ';' | Select-String -Pattern "node"
   ```

3. **Reinstall Dependencies:**
   ```powershell
   Remove-Item -Recurse -Force server/node_modules
   Remove-Item -Recurse -Force client/node_modules
   Remove-Item -Recurse -Force node_modules
   npm run install-all
   ```

4. **Clear npm Cache:**
   ```powershell
   npm cache clean --force
   ```


