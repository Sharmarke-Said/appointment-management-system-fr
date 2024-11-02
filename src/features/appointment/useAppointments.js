// useAppointments.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const useAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments')
      setAppointments(response.data.data || []) // Adjust to the correct structure
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  return { appointments, loading, error, fetchAppointments }
}

export default useAppointments
