import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native'
import { Audio } from 'expo-av'
import { usePlayerStore } from '../src/store/playerStore'

export default function HomeScreen() {
  const {
    playSong,
    togglePlayPause,
    playNext,
    setQueue,
    currentSong,
    isPlaying,
  } = usePlayerStore()

  const [songs, setSongs] = useState([])
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setupAudio()
    loadSongs(1)
  }, [])

  useEffect(() => {
    if (songs.length > 0) {
      setQueue(songs)
    }
  }, [songs, setQueue])

  /* AUDIO CONFIG */
  const setupAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    })
  }

  /* LOAD SONGS */
  const loadSongs = async (pageNumber) => {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(
        `https://saavn.sumit.co/api/search/songs?query=arijit&page=${pageNumber}&limit=20`
      )
      const json = await res.json()
      const results = json?.data?.results || []

      setSongs(prev =>
        pageNumber === 1 ? results : [...prev, ...results]
      )
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  /* SEARCH SONGS */
  const searchSongs = async () => {
    if (!searchText) return
    setLoading(true)
    setPage(1)
    setIsSearching(true)

    try {
      const res = await fetch(
        `https://saavn.sumit.co/api/search/songs?query=${searchText}&page=1&limit=20`
      )
      const json = await res.json()
      setSongs(json?.data?.results || [])
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const goBackToMain = () => {
    setSearchText('')
    setIsSearching(false)
    setPage(1)
    loadSongs(1)
  }

  /* RENDER SONG */
  const renderItem = ({ item, index }) => {
    const image = item.image?.[item.image.length - 1]?.url

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => playSong(item, index)}
      >
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <View style={styles.textBox}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.primaryArtists?.length
              ? item.primaryArtists
              : item.artists?.primary?.map(a => a.name).join(', ') ||
                'Unknown Artist'}
          </Text>
        </View>

        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Music Player</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        {searchText.length> 0 && (
          <TouchableOpacity
            onPress={goBackToMain}
            style={styles.backButton}
          >
           <Text style={{ color: '#1DB954', fontSize: 20 }}>⟵</Text>

          </TouchableOpacity>
        )}

        <TextInput
          placeholder="Search songs..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchSongs}
        >
          <Text style={{ color: '#fff' }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* SONG LIST */}
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (!isSearching) {
            const next = page + 1
            setPage(next)
            loadSongs(next)
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {/* PLAYER BAR */}
      <View style={styles.playerBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nowPlaying} numberOfLines={1}>
            {currentSong ? currentSong.name : 'Select a song'}
          </Text>
          {currentSong && (
            <Text style={styles.artistText} numberOfLines={1}>
              {currentSong.primaryArtists}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={togglePlayPause}>
          <Text style={styles.playPause}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <Text style={styles.nextButton}>⏭</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 16, backgroundColor: '#181818' },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },

  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  textBox: { flex: 1, marginLeft: 10 },
  title: { color: '#fff', fontSize: 16 },
  subtitle: { color: '#b3b3b3', fontSize: 13 },
  playIcon: { color: '#1DB954', fontSize: 22 },

  searchContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 8,
  },
  backButton: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  playerBar: {
    height: 65,
    backgroundColor: '#181818',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  nowPlaying: { color: '#fff', fontSize: 14 },
  artistText: { color: '#b3b3b3', fontSize: 12 },
  playPause: { color: '#1DB954', fontSize: 28 },
  nextButton: {
    color: '#1DB954',
    fontSize: 28,
    marginLeft: 20,
  },
})
