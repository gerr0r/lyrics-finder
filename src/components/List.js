// import { useState } from 'react';
import ListItem from './ListItem'

const List = ({ data }) => {
    console.log('List');
    return (
        <div>
            {data.map(item => {
                return (
                    <ListItem key={item.id} name={item.name}/>
                )
            })}
        </div>
    )
}

export default List
