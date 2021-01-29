import { useState } from 'react'
import { addArtist, addAlbum, addSong } from '../utils/db'
import HelpText from './HelpText'


const NewRecord = ({ input, value, current, updateData  }) => {
    // input - current input
    // value - current input value
    // ids - current selection ids
    // updateData - callback to update data object
    const [data, setData] = useState(value[input])

    async function addData() {
        let newData = []
        switch (input) {
            case 'artist':
                newData = await addArtist(data)
                break;
            case 'album':
                newData = await addAlbum(data, current.artists[0].id)
                break;
            case 'song':
                newData = await addSong(data, current.albums[0].id)
                break;
            default:
                break;
        }
        updateData(newData, input)
    }

    return (
        <div>
            {input === 'album' && <header><h3>{value.artist}</h3></header> }
            {input === 'song' && <header><h3>{value.album}</h3><h5>{value.artist}</h5></header> }
            <textarea cols="40" rows="14" value={data} onChange={e => setData(e.target.value)}></textarea>
            <br />
            <button onClick={addData}>Add {input}(s)</button>
            <HelpText input={input}></HelpText>
        </div>
    )
}

export default NewRecord
