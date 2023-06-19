# Using Webpack Instead of Metro

## Basic config:
1. In **app.json**, change `web.bundler` to `webpack`.
2. In **app.tsx**, comment out `initialState={initialNavigationState}` (seems to have issues with this)

## After adding Firebase:
You'll need to setup your Firebase auth persistence as described here: https://github.com/expo/fyi/blob/main/firebase-js-auth-setup.md#web-compatiblity.

## Other

### Node 18.x compatibility issue
If you get a weird SSL error when starting, do this:

macOS/ Linux:
`export NODE_OPTIONS=--openssl-legacy-provider`
Windows (Powershell):
`$env:NODE_OPTIONS="--openssl-legacy-provider"`