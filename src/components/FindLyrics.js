const FindLyrics = ({lyrics}) => {

    function getLyrics(e) {
    }

    return (
        <details onToggle={e => getLyrics(e)}>
            <summary>Lyrics</summary>
            <p style={{whiteSpace: "pre-wrap"}}>{lyrics}</p>
        </details>
    )
}

export default FindLyrics
