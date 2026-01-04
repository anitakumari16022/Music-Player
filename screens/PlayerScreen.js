import { View, Text, Image, TouchableOpacity } from 'react-native'
import { usePlayerStore } from '../src/store/playerStore'

export default function PlayerScreen() {
  const { currentSong, isPlaying, togglePlayPause } = usePlayerStore()

  if (!currentSong) {
    return <Text>No song playing</Text>
  }

  const image =
    currentSong.image?.[currentSong.image.length - 1]?.url

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', alignItems: 'center' }}>
      <Image
        source={{ uri: image }}
        style={{ width: 250, height: 250, marginTop: 40 }}
      />

      <Text style={{ color: '#fff', fontSize: 22, marginTop: 20 }}>
        {currentSong.name}
      </Text>

      <Text style={{ color: '#b3b3b3' }}>
        {currentSong.primaryArtists}
      </Text>

      <TouchableOpacity onPress={togglePlayPause}>
        <Text style={{ fontSize: 40, color: '#1DB954', marginTop: 30 }}>
          {isPlaying ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
