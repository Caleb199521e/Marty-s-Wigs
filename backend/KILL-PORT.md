# How to Kill Process Using Port

## Windows

### Method 1: Using Command Prompt

1. **Find the process ID (PID) using the port:**
   ```cmd
   netstat -ano | findstr :5000
   ```
   
2. **Kill the process:**
   ```cmd
   taskkill /PID <PID_NUMBER> /F
   ```
   
   Example:
   ```cmd
   netstat -ano | findstr :5000
   # Output: TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
   
   taskkill /PID 12345 /F
   ```

### Method 2: Using PowerShell

```powershell
# Find and kill in one command
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Method 3: Using Task Manager

1. Open Task Manager (Ctrl + Shift + Esc)
2. Go to "Details" tab
3. Find the process using port (you need to find PID first using netstat)
4. Right-click and select "End Task"

## macOS / Linux

### Find the process:
```bash
lsof -i :5000
```

### Kill the process:
```bash
kill -9 <PID>
```

Or in one command:
```bash
lsof -ti :5000 | xargs kill -9
```

## Alternative: Change Port

Instead of killing the process, you can change the port in `.env`:

```env
PORT=5001
```

Then update frontend API URL to `http://localhost:5001/api`
