import { useState, useEffect } from 'react'
import { searchCustomers } from '../lib/api'

export function useCustomerSearch(query: string) {
  const [results, setResults] = useState<
    { fullName: string; phoneNumber: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCustomers(query)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, loading }
}