import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import List from './components/List'
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
  const [searchMode, setSearchMode] = useState(true)
  const [activeLabel, setActiveLabel] = useState('artist')

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

  async function addArtist() {
    if (!artist) return false
    const array = String(artist).split('\n')
    let newArtists = []
    for (const element of array) {
      let name = titleCase(element)
      if (!name) continue
      const checkArtist = await fetch(`${url}/artists?name_like=^${name}$`)
      const checkArtistData = await checkArtist.json()
      if (checkArtistData.length) continue
      const response = await fetch(`${url}/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      const newData = await response.json()
      newArtists.push(newData)
    }
    setData({
      ...data,
      artists: [
        ...data.artists,
        ...newArtists
      ]
    })
    setArtists([...artists, ...newArtists])
    console.log(newArtists)
  }

  async function addAlbum() {
    if (!album) return false
    const artistID = await findArtist()
    if (!artistID) return false
    const array = String(album).split('\n')
    let newAlbums = []
    for (const element of array) {
      let name = titleCase(element)
      if (!name) continue
      const checkAlbum = await fetch(`${url}/albums?artistID=${artistID}&name_like=^${name}$`)
      const checkAlbumData = await checkAlbum.json()
      if (checkAlbumData.length) continue
      const response = await fetch(`${url}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, artistID })
      })
      const newAlbum = await response.json()
      newAlbums.push(newAlbum)
    }
    setData({
      ...data,
      albums: [
        ...data.albums,
        ...newAlbums
      ]
    })
    setAlbums([...albums, ...newAlbums])
    console.log(newAlbums)
  }

  async function addSong() {
    if (!song) return false
    const albumID = await findAlbum()
    if (!albumID) return false
    const array = String(song).split('\n')
    let newSongs = []
    for (const element of array) {
      let name = titleCase(element)
      if (!name) continue
      const checkSong = await fetch(`${url}/songs?albumID=${albumID}&name_like=^${name}$`)
      const checkSongData = await checkSong.json()
      if (checkSongData.length) continue
      const response = await fetch(`${url}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, albumID, lyrics: '' })
      })
      const newSong = await response.json()
      newSongs.push(newSong)
    }
    setData({
      ...data,
      songs: [
        ...data.songs,
        ...newSongs
      ]
    })
    setSongs([...songs, ...newSongs])
    console.log(newSongs)
  }

  async function findArtist() {
    // console.log(album);
    const response = await fetch(`${url}/artists?id=${artists[0].id}`)
    const data = await response.json()
    if (!data || !data.length) return false
    return data[0].id; // artistID
  }

  async function findAlbum() {
    // console.log(album);
    const response = await fetch(`${url}/albums?id=${albums[0].id}`)
    const data = await response.json()
    if (!data || !data.length) return false
    return data[0].id; // artistID
  }

  function titleCase(input) {
    // split by space and get rid of leading, trailing and middle spaces
    const titleWords = input.split(' ').filter(Boolean)
    if (!titleWords.length) return false
    // capitalize first letters and add single space between words
    return titleWords.reduce((acc, c) => acc + c[0].toUpperCase() + c.slice(1) + ' ', '').trimEnd()
  }


  function filterData(e, by) {
    let currentArtist, currentAlbum, currentSong
    switch (by) {
      case 'artists':
        setActiveLabel('artist')
        setArtist(e)
        currentArtist = e
        currentAlbum = album
        currentSong = song
        break;
      case 'albums':
        setActiveLabel('album')
        setAlbum(e)
        currentArtist = artist
        currentAlbum = e
        currentSong = song
        break;
      case 'songs':
        setActiveLabel('song')
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
    setActiveLabel('album')
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
  }

  function changeAlbum(selectedAlbum, id) {
    setAlbum(selectedAlbum)
    setActiveLabel('song')
    setSong('')
    // filterData(selectedAlbum, 'albums')
    let alb = data.albums.filter(a => a.id === id)
    let art = data.artists.filter(a => a.id === alb[0].artistID)
    let son = data.songs.filter(s => s.albumID === id)

    setArtist(art[0].name)
    setAlbums(alb)
    setArtists(art)
    setSongs(son)
  }
  function changeSong(selectedSong, id) {
    setSong(selectedSong)
    // filterData(selectedSong, 'songs')
    let son = data.songs.filter(s => s.id === id)
    let alb = data.albums.filter(a => a.id === son[0].albumID)
    let art = data.artists.filter(a => a.id === alb[0].artistID)

    setAlbums(alb)
    setArtists(art)
    setSongs(son)
  }

  function toggleSearchMode() {
    setSearchMode(!searchMode)

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
    setActiveLabel('artist')
  }


  return (
    <div className="App">
      {searchMode && <div>
        <Header name='ARTISTS' />
        <input type="text" value={artist} onChange={(e) => filterData(e.target.value, 'artists')} />
        <List data={artists} cb={changeArtist} />
      </div>}

      {!searchMode && (activeLabel === 'artist') && <div>

        <textarea cols="40" rows="14" value={artist} onChange={(e) => setArtist(e.target.value)}
          placeholder={''}>
        </textarea><br />
        <button onClick={addArtist}>Add Artist(s)</button>
        <p>
          Multiple artists can be added.<br />
          Every line represents one artist.<br />
          Press enter to go on new line. <br />
          Existing artists will be ignored.
        </p>
      </div>}

      {searchMode && <div>
        <Header name='ALBUMS' />
        <input type="text" value={album} onChange={(e) => filterData(e.target.value, 'albums')} />
        <List data={albums} cb={changeAlbum} />
      </div>}

      {!searchMode && (activeLabel === 'album') && <div>
        <h3>{artist}</h3>

        <textarea cols="40" rows="14" value={album} onChange={(e) => setAlbum(e.target.value)}></textarea>
        <br />
        <button onClick={addAlbum}>Add Album(s)</button>
        <p>Current artist albums:</p>
        <List data={data.albums.filter(a => a.artistID === artists[0].id)} cb={() => { }} />
        <p>
          Multiple albums can be added.<br />
          Every line represents one album.<br />
          Press enter to go on new line. <br />
          Existing albums for current artist  <br />
          will be ignored.
        </p>
      </div>}

      {searchMode && <div>
        <Header name='SONGS' />
        <input type="text" value={song} onChange={(e) => filterData(e.target.value, 'songs')} />
        <List data={songs} cb={changeSong} />
      </div>}

      {!searchMode && (activeLabel === 'song') && <div>
        <h3>{artist}</h3>
        <h3>{album}</h3>
        <textarea cols="40" rows="14" value={song} onChange={(e) => setSong(e.target.value)}></textarea>
        <br />
        <button onClick={addSong}>Add Song(s)</button>
        <p>Current album songs:</p>
        <List data={data.songs.filter(s => s.albumID === albums[0].id)} cb={() => { }} />
        <p>
          Multiple songs can be added.<br />
          Every line represents one song.<br />
          Press enter to go on new line. <br />
          Existing songs for current album  <br />
          will be ignored.
        </p>
      </div>}

      <button onClick={toggleSearchMode}>{searchMode ? `Add new ${activeLabel}` : '<< Back to search mode'}</button>
      <button hidden={!searchMode} onClick={clearInputs}>Clear</button>
    </div>
  )
}

export default App
