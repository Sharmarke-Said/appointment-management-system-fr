import { useState } from 'react'
import axios from 'axios'

const useCreateAppointment = (fetchAppointments) => {
  const [error, setError] = useState(null)

  const createAppointment = async (newAppointment) => {
    try {
      await axios.post('/api/appointments', newAppointment)
      fetchAppointments()
    } catch (err) {
      setError(err)
    }
  }

  return { createAppointment, error }
}

export default useCreateAppointment
