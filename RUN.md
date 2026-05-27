# Run the website (one step)

## Easiest — double-click

1. Open Finder → go to `conference-registration`
2. **Double-click** `Start Website.command`
3. If macOS asks, click **Open**
4. Your browser opens **http://localhost:3000**

## Or — one line in Terminal

```bash
cd /Users/shu/conference-registration && chmod +x start.sh && ./start.sh
```

First run downloads Node.js and installs packages automatically (may take 2–5 minutes). Later runs start in seconds.

### Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@conference.local | admin12345 |
| User | participant@conference.local | user12345 |

Stop the server: press **Ctrl+C** in the Terminal window.
