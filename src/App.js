import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
// import Input from './components/Input'
import List from './components/List'
const url = 'http://localhost:4000'

function App() {
  console.log('App')

  const [data, setData] = useState({})
  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState('')
  const [albums, setAlbums] = useState([])
  const [album, setAlbum] = useState('')
  const [songs, setSongs] = useState([])
  const [song, setSong] = useState('')

  useEffect(() => {
    (async () => { //iife
      const data = await fetchData()
      setData(data)
      setArtists(data.artists)
      setAlbums(data.albums)
      setSongs(data.songs)
    })()
  }, [])

  async function fetchData() {
    const response = await fetch(`${url}/db`)
    const data = await response.json()
    return data
  }

  async function addArtist() {
    const array = String(artist).split(',')
    for (const element of array) {
      let name = titleCase(element)
      if (!name) continue
      const response = await fetch(`${url}/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      const data = await response.json()
      console.log(data)
    }
  }

  function titleCase(input) {
    const titleWords = input.split(' ').filter(Boolean)
    if (!titleWords.length) return false
    return titleWords.reduce((acc, c) => acc + c[0].toUpperCase() + c.slice(1) + ' ','').trimEnd()
  }

  function filterData(e, by) {
    let currentArtist, currentAlbum, currentSong
    switch (by) {
      case 'artists':
        setArtist(e.target.value)
        currentArtist = e.target.value
        currentAlbum = album
        currentSong = song
        break;
      case 'albums':
        setAlbum(e.target.value)
        currentArtist = artist
        currentAlbum = e.target.value
        currentSong = song
        break;
      case 'songs':
        setSong(e.target.value)
        currentArtist = artist
        currentAlbum = album
        currentSong = e.target.value
        break;
      default:
        break;
    }

    let visibleSongs = filterByInput('songs', currentSong)
    let albumIDs = visibleSongs.map(s => s.albumID)

    let visibleAlbums = filterByInput('albums', currentAlbum)
    visibleAlbums = visibleAlbums.filter(a => albumIDs.includes(a.id))
    let artistIDs = visibleAlbums.map(a => a.artistID)
    let visibleArtists = filterByInput('artists', currentArtist)
    visibleArtists = visibleArtists.filter(a => artistIDs.includes(a.id))
    artistIDs = visibleArtists.map(a => a.id)
    visibleAlbums = visibleAlbums.filter(a => artistIDs.includes(a.artistID))
    albumIDs = visibleAlbums.map(a => a.id)
    visibleSongs = visibleSongs.filter(s => albumIDs.includes(s.albumID))

    setArtists(visibleArtists)
    setAlbums(visibleAlbums)
    setSongs(visibleSongs)
  }


  function filterByInput(field, input) {
    return data[field].filter(a => findMatch(a.name, input))
  }

  function findMatch(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase())
  }

  return (
    <div className="App">
      <Header name='ARTIST' />
      <input type="text" onChange={(e) => filterData(e, 'artists')} />
      <button onClick={addArtist}>Add</button>
      <List data={artists} />
      <Header name='ALBUM' />
      <input type="text" onChange={(e) => filterData(e, 'albums')} />
      <List data={albums} />
      <Header name='SONG' />
      <input type="text" onChange={(e) => filterData(e, 'songs')} />
      <List data={songs} />
    </div>
  )
}

export default App
