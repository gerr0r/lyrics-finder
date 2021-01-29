import List from './List'

const CurrentRecords = ({ input, current, data }) => {

    let activeData = []
    switch (input) {
        case 'album':
            activeData = data.albums.filter(a => a.artistID === current.artists[0].id)
            break;
        case 'song':
            activeData = data.songs.filter(s => s.albumID === current.albums[0].id)
            break;
        default:
            break;
    }

    return (
        <details>
            <summary>Current {input}s:</summary>
            <List data={activeData} cb={() => {}}/>
        </details>
    )
}

export default CurrentRecords