# FerniChat 2023
For "Freaky Fast Full Stack with the FERNI Stack" workshop for KCDC 2023!

[Presentation- FERNI STACK](https://docs.google.com/presentation/d/1QyH5ZRbEAvudZdTVxhXUb7aqpMKrWCxsOHfAUhalwZ8/edit?usp=sharing)
(not much here, mostly an outline for the workshop- if you want to check out 98% of what we did, just follow the instructions right below!)

[Presentation and Example Repo- Choose Your Own React Native Adventure](https://github.com/keith-kurak/simple-expo-router-demo-kcdc)
(companion talk on Thursday, includes an Expo Router demo and presentation slides)

## How to use this repo
1. Do the prerequisite setup steps below.
2. Fork the repo
3. Open up the **exercises** folder. Start at exercise "01"
4. Switch to the branch listed at the top of the exercise (e.g., "exercise-01-start").
5. Do the exercises.
6. Repeat!

You can see (and run) the solution by going to the "end" branch (e.g., "exercise-01-end"). You don't even have to do the exercises; you can just run each branch to see the progress.

NOTE: for branches 03, 04, 05, you'll need to have a Firebase Firestore database setup, so follow the steps at the beginning of Exercise 3. For branches 04, 05, you'll need to have Firebase email/ password auth setup, so follow the steps at the beginning of Exercise 4.

## Prerequisites (do before workshop)

## Installation/ setup steps
(adapted from https://docs.expo.dev/get-started/installation/)
Bring your laptop! You will write code with it. If you regularly do JavaScript development, you likely have many of these installed on your machine already.

### Install Expo prerequisites
1. [Node.js LTS release](https://nodejs.org/en/) (version 16 or higher)
2. [Git](https://git-scm.com/). The [Github Desktop app](https://desktop.github.com/) installs this for you- that's what I use.
3. Highly recommended: [Visual Studio Code](https://code.visualstudio.com/download). Any text editor will do, but my examples will be in VS Code.
### Install CLI Tools
4. Install the Expo EAS CLI (`npm install -g eas-cli`)
5. Install Firebase CLI (`npm install -g firebase-tools`)
### Create Accounts
6. [Create an Expo Account](https://expo.dev/). Follow the link and click "Sign Up".
7. Download the "Expo Go" app on your phone from the App Store or Play Store. Sign into the app using the Expo account you just created.
8. Go to the [Firebase Console](https://console.firebase.google.com/), click "Create a Project" or "Add Project", give it a name like "[myname]-ferni-chat-2023" and accept all the default options. A Google account is required for this step.
### Fork/ Clone the demo project and restore dependencies (recommended!)
*It's a good idea to restore dependencies in case the network goes wonky during the session! Fork AND clone the repo if you'd like to push anything you do to Github. Just cloning it is fine, too, if you just want to keep everything local. Each exercise will start from a specific branch on this repo.*

9. Click "Fork" at the top of this page to fork the repo.
10. Clone your fork (easy way: click the green "Code" button, then "Open in Github Desktop").
11. `cd` to the folder and run `npm install`.
12. Run `npx expo login` and login with your Expo account.

### Optional/ Recommended
- The repo has a Prettier config. You can easily right-click and auto-format your code if you install the "Prettier" VS Code plugin

## Considerations for specific setups
- Beyond installing tools like Node and Git, you should not need admin access on your machine.
- There's nothing particular that should be incompatible with your VPN/ Firewall setup, but you will be connecting to Firebase and Expo services.
- However, if you run into network, installation, or phone issues, most of this workshop can be done without the EAS and Firebase CLI's, and without a phone or simulator. You can run the app in your web browser instead of a phone. Running on just a web browser also does not require logging into the Expo servers on the CLI.

## Platform-specific tips
#### Tips for Windows
- I tested this setup in Powershell and it was fine. I did have to change the execution policy first, using these instructions: https://tecadmin.net/powershell-running-scripts-is-disabled-system (old Windows 10 advice, haven't experienced this in Windows 11)
- I've also worked with Expo in WSL. I followed these instructions previously to get it working with the terminal inside Visual Studio code: https://code.visualstudio.com/docs/remote/wsl (I will not specifically test against WSL before the workshop, but Expo etc is broadly compatible with this)
- You _may_ have to modify the Windows firewall to get the app running on your phone in the Expo Go app. If you keep getting connection timed out errors, you can try running `WF.msc` and then adding an inbound rule for port 19000. (this was old instructions from Windows 10, I have not experienced this issue with Windows 11/ PowerShell).

## Verifying that everything is working
We will walk through this during the workshop, but you can also try it ahead of time to be sure that everything is installed correctly.
(adapted from https://docs.expo.dev/get-started/create-a-new-app/ - see for troubleshooting tips)
1. In the demo project folder, run `npm install`.
2. Run `npx expo start`.
3. Scan the QR code in the terminal. On iOS, scan the code with the Camera app. On Android, scan the code with the Expo Go app.
4. It should run on your phone in Expo Go (you will need to be logged in on iOS in order for this to work).
5. Alternatively (or in addition to), you can press 'w' to run the app in your browser.
