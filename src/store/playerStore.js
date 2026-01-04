import { create } from 'zustand'
import { Audio } from 'expo-av'

let sound = null

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  
    setQueue: (songs) => {
    set({ queue: songs })
  },

  /* PLAY SONG */
  playSong: async (song, index = null) => {
    try {
      if (sound) {
        await sound.unloadAsync()
        sound = null
      }

      const url =
        song.downloadUrl?.[song.downloadUrl.length - 1]?.url

      if (!url) return

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      )

      sound = newSound

      set({
        currentSong: song,
        isPlaying: true,
        ...(index !== null && { currentIndex: index }),
      })
    } catch (e) {
      console.log('Play error:', e)
    }
  },

  /* ADD TO QUEUE & PLAY */
  playFromList: async (song) => {
    const { queue } = get()
    const index = queue.length

    set({
      queue: [...queue, song],
    })

    get().playSong(song, index)
  },

  /* PLAY / PAUSE */
  togglePlayPause: async () => {
    if (!sound) return

    const { isPlaying } = get()

    isPlaying ? await sound.pauseAsync() : await sound.playAsync()
    set({ isPlaying: !isPlaying })
  },

  /* NEXT SONG */
  playNext: () => {
    const { queue, currentIndex } = get()
    const nextIndex = currentIndex + 1

    if (nextIndex >= queue.length) return

    const nextSong = queue[nextIndex]
    get().playSong(nextSong, nextIndex)
  },
}))
