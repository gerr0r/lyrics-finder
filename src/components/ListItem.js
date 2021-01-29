import { useState } from 'react'

const ListItem = ({name, dataID, cb}) => {
    const [selected, setSelected] = useState(false)

    function selectItem(e) {
        setSelected(true)
        cb(name, dataID)
    }

    return (
        <h3 onClick={e => selectItem(e)}>
            {name}
        </h3>
    )
}

export default ListItem
