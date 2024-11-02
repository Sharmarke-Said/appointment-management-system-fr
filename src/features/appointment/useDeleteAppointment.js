import { useState } from 'react'
import axios from 'axios'

const useDeleteAppointment = (fetchAppointments) => {
  const [error, setError] = useState(null)

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`)
      fetchAppointments()
    } catch (err) {
      setError(err)
    }
  }

  return { deleteAppointment, error }
}

export default useDeleteAppointment
