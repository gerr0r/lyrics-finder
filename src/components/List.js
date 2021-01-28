import ListItem from './ListItem'

const divContainer = {
    "maxHeight": "222px",
    "overflow" : "auto",
    "scrollbarWidth": "none"
}

const List = ({ data, cb }) => {
    // console.log('List');
    return (
        <div style={divContainer}>
            {data.map(item => {
                return (
                    <ListItem key={item.id} dataID={item.id} name={item.name} cb={cb}/>
                )
            })}
        </div>
    )
}

export default List
