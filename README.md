# CDIC Admin Module

This repository contains the source code for the **CDIC Admin Module**.

This document describes setup, configuration, authentication, and deployment steps.


---

## 📦 Prerequisites

- Node.js v16 or above
- npm (comes with Node.js)
- Backend Server URL
- Access to deployment server

---

## ⚙️ Runtime Configuration

### 📁 File Location
src/config/appConfig.js

### ✏️ Required Configuration

```js
export const appBaseUrl = "https://YOUR_SERVER_URL/";
export const appApiUrl = "https://YOUR_SERVER_URL/service/api/";
export const adminAccountEmail = "YOUR_ADMIN_ACCOUNT_EMAIL";
export const adminAccountPassword = "YOUR_ADMIN_ACCOUNT_PASSWORD";
```

> Use the **Email ID & Password** of the account from which you have created the program from the Smart Setup at the place of **YOUR_ADMIN_ACCOUNT_EMAIL & YOUR_ADMIN_ACCOUNT_PASSWORD** respectively.

---

## 📁 Deployment Folder (basename)

The `basename` defines the deployment folder name.

Deployment URL:
```
https://YOUR_SERVER_URL/cdicv2
```

---

## 🖼 Media Folder Setup

Create a media folder at:
```
https://YOUR_SERVER_URL/media
```

Required files:
- logo.png
- landingpage.png

---

## ▶️ Deployment Steps

1. Generate build
```bash
npm run build
```

2. Create folder `cdicv2` on server

3. Copy build ZIP into folder

4. Extract ZIP inside `cdicv2`

5. Verify URL
```
https://YOUR_SERVER_URL/cdicv2
```

---

## ✅ Final Checklist

- runtime-config.json updated
- placeholder Base64 key replaced during deployment
- basename matches folder
- media folder created
- CSP updated
- build deployed successfully
