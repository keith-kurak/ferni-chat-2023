# Coda: Deployment
## Goal
Shipping is, uh, pretty important!
## Useful info
- [How to make an icon/ splash screen](https://www.youtube.com/watch?v=QSNkU7v0MPc)

## How-to (mobile)

### 0, Update splash and icon
Download these from the [Figma template](https://www.figma.com/file/I5YlN0z7nOBOlxx1UDH9m5/Expo-App-Icon-%26-Splash-(Ferni-Chat)?type=design&node-id=0-1&t=VuoDmQB7k1VZB0E2-0) or from the **exercises/support/assets** folder. Put them inside **assets**. Remove the platform-specific `splash` keys, set the universal splash, icon, and Android adaptive icon to your respective files.

You'll setup app.json like:
```json
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/images/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#FFFFFF"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon-foreground.png",
      "backgroundColor": "#FFFFFF"
    },
  }
```

### 1. Setup EAS Build
a. Run `eas init`
b. Run `eas build:configure`

### 2. Setup EAS Update (optional, if you want updates)
a. Run `eas update:configure`
b. Set a `channel` field in the desired build profile in **eas.json**. This will tell the build where to look for updates.

### 3. Build
Run `eas build --profile production --platform <ios|android>` (note: might want to do a preview build if you're not ready to distribute on Testflight/ want an APK instead of AAB file)

## How-to (web)
### 1. Setup Firebase hosting
Create firebase.json with these contents:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate, max-age=0"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, max-age=0"
          }
        ]
      }
    ]
  }
}
```

### 2. Setup deploy commands
Add these scripts to **package.json**
```json
"predeploy": "npx expo export --platform web",
"deploy-hosting": "npm run predeploy && firebase deploy --only hosting"
```

### 3. Deploy
You'll probably have to one-time setup your firebase CLI:
a. Run `firebase login`.
b. Run `firebase projects:list` to find your project ID
c. Run `firebase use --add <project-id>`
Run `npm run deploy-hosting`