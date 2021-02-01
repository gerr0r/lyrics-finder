import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import List from './components/List'
import NewRecord from './components/NewRecord'
import FindLyrics from './components/FindLyrics'
const url = 'http://localhost:4000'

function App() {
  // console.log('App')

  const mountRef = useRef(false)
  const [data, setData] = useState({})
  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState('')
  const [albums, setAlbums] = useState([])
  const [album, setAlbum] = useState('')
  const [songs, setSongs] = useState([])
  const [song, setSong] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [searchMode, setSearchMode] = useState(true)
  const [activeInput, setActiveInput] = useState('artist')

  useEffect(() => {
    (async () => { //iife
      const data = await fetchData()
      setData(data)
      setArtists(data.artists.sort((a, b) => a.name.localeCompare(b.name)))
      setAlbums(data.albums.sort((a, b) => a.name.localeCompare(b.name)))
      setSongs(data.songs.sort((a, b) => a.name.localeCompare(b.name)))
    })()
  }, [])

  async function fetchData() {
    const response = await fetch(`${url}/db`)
    const data = await response.json()
    return data
  }

  function filterData(e, by) {
    let currentArtist, currentAlbum, currentSong
    switch (by) {
      case 'artists':
        setActiveInput('artist')
        setArtist(e)
        currentArtist = e
        currentAlbum = album
        currentSong = song
        break;
      case 'albums':
        if (activeInput === "song") setActiveInput('album')
        setAlbum(e)
        currentArtist = artist
        currentAlbum = e
        currentSong = song
        break;
      case 'songs':
        setSong(e)
        currentArtist = artist
        currentAlbum = album
        currentSong = e
        break;
      default:
        currentArtist = artist
        currentAlbum = album
        currentSong = song
        break;
    }

    // get songs that match current input
    let visibleSongs = filterByInput('songs', currentSong)
    // get album IDs associated with these songs
    let albumIDs = visibleSongs.map(s => s.albumID)
    // add album IDs that are not associated with any song
    if (!currentSong) albumIDs = albumIDs.concat(freeAlbumIDs())
    // get albums that match current input
    let visibleAlbums = filterByInput('albums', currentAlbum)
    // remove those not associated with songs
    visibleAlbums = visibleAlbums.filter(a => albumIDs.includes(a.id))
    // get artist IDs associated with albums
    let artistIDs = visibleAlbums.map(a => a.artistID)
    // add artist IDs that are not associated with any album
    if (!currentAlbum && !currentSong) artistIDs = artistIDs.concat(freeArtistIDs())
    // get artists that match current input
    let visibleArtists = filterByInput('artists', currentArtist)
    // remove those not associated with albums
    visibleArtists = visibleArtists.filter(a => artistIDs.includes(a.id))
    // update artist IDs
    artistIDs = visibleArtists.map(a => a.id)
    // update albums
    visibleAlbums = visibleAlbums.filter(a => artistIDs.includes(a.artistID))
    // update album IDs
    albumIDs = visibleAlbums.map(a => a.id)
    // update songs
    visibleSongs = visibleSongs.filter(s => albumIDs.includes(s.albumID))

    setArtists(visibleArtists)
    setAlbums(visibleAlbums)
    setSongs(visibleSongs)
  }

  function freeAlbumIDs() {
    let albumIDs = data.albums.map(a => a.id)
    let albumIDsFromSongs = data.songs.map(s => s.albumID)
    return albumIDs.filter(id => !albumIDsFromSongs.includes(id))
  }

  function freeArtistIDs() {
    let artistIDs = data.artists.map(a => a.id)
    let artistIDsFromAlbums = data.albums.map(a => a.artistID)
    return artistIDs.filter(id => !artistIDsFromAlbums.includes(id))
  }

  function filterByInput(field, input) {
    return data[field].filter(a => findMatch(a.name, input))
  }

  function findMatch(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase())
  }

  function changeArtist(selectedArtist, id) {
    setArtist(selectedArtist)
    setActiveInput('album')
    setAlbum('')
    setSong('')
    // filterData(selectedArtist, 'artists')
    let art = data.artists.filter(a => a.id === id)
    let albs = data.albums.filter(a => a.artistID === id)
    let albumIDs = albs.map(a => a.id)
    let son = data.songs.filter(s => albumIDs.includes(s.albumID))

    setAlbums(albs)
    setArtists(art)
    setSongs(son)
    setLyrics('')
  }

  function changeAlbum(selectedAlbum, id) {
    setAlbum(selectedAlbum)
    setActiveInput('song')
    setSong('')
    // filterData(selectedAlbum, 'albums')
    let alb = data.albums.filter(a => a.id === id)
    let art = data.artists.filter(a => a.id === alb[0].artistID)
    let son = data.songs.filter(s => s.albumID === id)

    setArtist(art[0].name)
    setAlbums(alb)
    setArtists(art)
    setSongs(son)
    setLyrics('')
  }
  function changeSong(selectedSong, id) {
    setSong(selectedSong)
    setActiveInput('song')
    // filterData(selectedSong, 'songs')
    let son = data.songs.filter(s => s.id === id)
    let alb = data.albums.filter(a => a.id === son[0].albumID)
    let art = data.artists.filter(a => a.id === alb[0].artistID)

    setAlbums(alb)
    setAlbum(alb[0].name)
    setArtists(art)
    setArtist(art[0].name)
    setSongs(son)
    setLyrics(son[0].lyrics)
  }

  function toggleSearchMode() {
    setSearchMode(!searchMode)
    setLyrics('')

  }

  useEffect(() => {
    if (mountRef.current && searchMode) filterData()
    else mountRef.current = true
  }, [searchMode])


  function clearInputs() {
    setArtist('')
    setAlbum('')
    setSong('')
    setArtists(data.artists.sort((a, b) => a.name.localeCompare(b.name)))
    setAlbums(data.albums.sort((a, b) => a.name.localeCompare(b.name)))
    setSongs(data.songs.sort((a, b) => a.name.localeCompare(b.name)))
    setActiveInput('artist')
    setLyrics('')
  }


  function updateData(newData, input) {
    const key = input + 's'
    setData({
      ...data,
      [key]: [
        ...data[key],
        ...newData
      ]
    })

    switch (input) {
      case 'artist':
        setArtists([...artists, ...newData])
        break;
      case 'album':
        setAlbums([...albums, ...newData])
        break;
      case 'song':
        setSongs([...songs, ...newData])
        break;
      default:
        break;
    }
    console.log(newData)
  }


  return (
    <div className="App">
      {searchMode &&
        <div>
          <Header name='ARTIST' />
          <input type="text" value={artist} onChange={(e) => filterData(e.target.value, 'artists')} />
          <List data={artists} cb={changeArtist} />

          <Header name='ALBUM' />
          <input type="text" value={album} onChange={(e) => filterData(e.target.value, 'albums')} />
          <List data={albums} cb={changeAlbum} />

          <Header name='SONG' />
          <input type="text" value={song} onChange={(e) => filterData(e.target.value, 'songs')} />
          <List data={songs} cb={changeSong} />
        </div>
      }

      {!searchMode &&
        <NewRecord
          input={activeInput}
          value={{ artist, album, song }}
          current={{ artists, albums, songs }}
          data={data}
          updateData={updateData}
        />}

      <button onClick={toggleSearchMode}>{searchMode ? `Add new ${activeInput}` : '<< Back to search mode'}</button>
      <button hidden={!searchMode} onClick={clearInputs}>Clear</button>
      {lyrics && <FindLyrics lyrics={lyrics}/>}
    </div>
  )
}

export default App
