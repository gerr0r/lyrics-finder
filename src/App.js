import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Input from './components/Input'
import List from './components/List'
const url = 'http://localhost:4000'

function App() {

  const [artists, setArtists] = useState([])

  useEffect(()=> {
    const getArtists = async() => {
      const artistList = await fetchArtists()
      setArtists(artistList.map(artist => artist.name))
      console.log(artists);
    }

    getArtists()
  }, [])


  async function fetchArtists() {
    const response = await fetch(`${url}/artists`)
    const data = await response.json()

    console.log(data)
    return data
  }

  return (
    <div className="App">
      <Header name='ARTIST' />
      <Input />
      <List data={artists}/>
      <Header name='ALBUM' />
      <Input />
      <Header name='SONG' />
      <Input />
    </div>
  )
}

export default App
