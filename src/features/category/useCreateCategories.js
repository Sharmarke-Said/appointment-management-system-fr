import { useState } from 'react'
import axios from 'axios'

const useCreateCategories = (fetchCategories) => {
    const [error, setError] = useState(null)

    const CreateCategories = async (newAppointment) => {
        try {
            await axios.post('/api/categories', newAppointment)
            fetchCategories()
        } catch (err) {
            setError(err)
        }
    }

    return { CreateCategories, error }
}

export default useCreateCategories
