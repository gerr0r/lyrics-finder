import { useState } from 'react'
import { addArtist, addAlbum, addSong } from '../utils/db'
import CurrentRecords from './CurrentRecords'
import HelpText from './HelpText'


const NewRecord = ({ input, value, current, data, updateData  }) => {
    // input - current input
    // value - current input value
    // ids - current selection ids
    // updateData - callback to update data object
    const [rawData, setRawData] = useState(value[input])

    async function addData() {
        if (!rawData) return
        let newData = []
        switch (input) {
            case 'artist':
                newData = await addArtist(rawData)
                break;
            case 'album':
                newData = await addAlbum(rawData, current.artists[0].id)
                break;
            case 'song':
                newData = await addSong(rawData, current.albums[0].id)
                break;
            default:
                break;
        }
        // if (!newData) return
        updateData(newData, input)
    }

    return (
        <div>
            {input === 'artist' && <header><h3>New artists</h3></header> }
            {input === 'album' && <header><h3>{value.artist}</h3></header> }
            {input === 'song' && <header><h3>{value.album}</h3><h5>{value.artist}</h5></header> }
            <textarea 
            cols="40" 
            rows="14" 
            value={rawData} 
            onChange={e => setRawData(e.target.value)}
            placeholder={rawData ? undefined :`Add new ${input}`} ></textarea>
            <br />
            <button onClick={addData} disabled={!Boolean(rawData)}>Add {input}(s)</button>
            {input !== 'artist' && <CurrentRecords input={input} current={current} data={data}/>}
            <HelpText input={input} />
        </div>
    )
}

export default NewRecord
