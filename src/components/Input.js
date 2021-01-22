import { useState } from 'react'


const Input = ({ data }) => {
    const [name, setName] = useState()

    return (
        <input type="text" onChange={(e) => setName(e.target.value)}/>
    )
}

export default Input
