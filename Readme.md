 Music Player App (React Native + Expo)

Overview
A music player application built using React Native and Expo.
It supports:
- Song listing
- Search functionality
- Play / Pause
- Next song (queue-based playback)

 Tech Stack
- React Native
- Expo
- Zustand (state management)
- Expo AV (audio playback)

Project Structure
screens/ → UI screens (HomeScreen)
src/store/ → Zustand player store
App.js → App entry point

Features
- Search songs using Saavn API
- Play music
- Forward to next song
- Background playback

 Setup Instructions
1. Clone the repository  
   `git clone https://github.com/anitakumari16022/Music-Player.git`

2. Install dependencies  
   `npm install`

3. Start the app  
   `npx expo start`

 Architecture
- Global audio state managed using Zustand
- Audio handled using Expo AV
- FlatList used for efficient song rendering

 Trade-offs
- No offline downloads
- Basic UI to focus on functionality
- Queue stored in memory (not persisted)
