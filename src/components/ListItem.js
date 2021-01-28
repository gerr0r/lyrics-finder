const ListItem = ({name, dataID, cb}) => {

    return (
        <h3 onClick={e => cb(name, dataID)}>
            {name}
        </h3>
    )
}

export default ListItem
