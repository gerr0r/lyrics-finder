const url = 'http://localhost:4000'

export async function addArtist(artist) {
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
    return newArtists
  }

  export async function addAlbum(album, artistID) {
    if (!album) return false
    const checkArtist = await fetch(`${url}/artists?id=${artistID}`)
    const checkArtistData = await checkArtist.json()
    if (!checkArtistData || !checkArtistData.length) return false
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
    return newAlbums
  }

  export async function addSong(song, albumID) {
    if (!song) return false
    const checkAlbum = await fetch(`${url}/albums?id=${albumID}`)
    const checkAlbumData = await checkAlbum.json()
    if (!checkAlbumData || !checkAlbumData.length) return false
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
    return newSongs
  }

  function titleCase(input) {
    // split by space and get rid of leading, trailing and middle spaces
    const titleWords = input.split(' ').filter(Boolean)
    if (!titleWords.length) return false
    // capitalize first letters and add single space between words
    return titleWords.reduce((acc, c) => acc + c[0].toUpperCase() + c.slice(1) + ' ', '').trimEnd()
  }