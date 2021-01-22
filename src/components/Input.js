import { useState } from 'react'


const Input = () => {
    const [name, setName] = useState()

    function change(e) {
        console.log(e.target.value)
        setName(e.target.value)
    }
    
    return (
        <input type="text" onChange={(e) => change(e)}/>
    )
}

export default Input
