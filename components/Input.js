
import { useEffect, useState } from 'react'
export default function Input ({ handleSubmit, buttonText }) {

    
    const [value, setValue] = useState  ("")

    let submitForm = e => {
        e.preventDefault()
        handleSubmit(value)
        setValue("")
    }
    return (
        <form onSubmit = {submitForm}>
            <input type = "text"  placeholder = "Enter message" value = {value} className = "border-2 border-blue-400 rounded px-3 py-2 input_size" onChange = {(e) => { setValue(e.target.value)}}>

            </input>
            <button type = "submit" className = "bg-green-500 rounded px-12 py-2">{buttonText}</button>
        </form>
    )
}