import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Input from './components/Input'
import List from './components/List'
const url = 'http://localhost:4000'

function App() {
  console.log('App')

  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState('')

  useEffect(() => {
    (async () => { //iife
      const artists = await fetchArtists()
      setArtists(artists.map(artist => artist.name))
    })()
  }, [])

  async function fetchArtists() {
    const response = await fetch(`${url}/artists`)
    const data = await response.json()
    return data
  }

  return (
    <div className="App">
      <Header name='ARTIST' />
      {/* <Input /> */}
      <input type="text" onChange={(e) => setArtist(e.target.value)}/>
      <List data={artists.filter(n => n.toLowerCase().includes(artist.toLowerCase()))}/>
      <Header name='ALBUM' />
      <Input />
      <Header name='SONG' />
      <Input />
    </div>
  )
}

export default App
