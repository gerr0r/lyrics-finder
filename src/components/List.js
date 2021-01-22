// import { useState } from 'react';
import ListItem from './ListItem'

const List = ({ data }) => {
    console.log('List');
    return (
        <div>
            {data.map(artist => {
                return (
                    <ListItem key={artist} name={artist}/>
                )
            })}
        </div>
    )
}

export default List
