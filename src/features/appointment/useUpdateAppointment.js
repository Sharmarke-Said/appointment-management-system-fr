import { useState } from 'react'
import axios from 'axios'

const useUpdateAppointment = (fetchAppointments) => {
  const [error, setError] = useState(null)

  const updateAppointment = async (id, updatedAppointment) => {
    try {
      await axios.put(`/api/appointments/${id}`, updatedAppointment)
      fetchAppointments()
    } catch (err) {
      setError(err)
    }
  }

  return { updateAppointment, error }
}

export default useUpdateAppointment
