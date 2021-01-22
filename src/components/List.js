import ListItem from './ListItem'

const List = ({ data }) => {
    return (
        <div>
            {data.map(artist => {
                return (
                    <ListItem name={artist}/>
                )
            })}
        </div>
    )
}

export default List
