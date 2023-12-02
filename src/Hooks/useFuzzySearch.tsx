import { Mp3Metadata } from '@/Interfaces/electronHandlerInputs'
import React, { useState } from 'react'

const fuzzySearch = (searchQuery: string, item: string) => {
    searchQuery = searchQuery.toLowerCase()
    item = item.toLowerCase()
  
    const matrix = []
    for (let i = 0; i <= item.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= searchQuery.length; j++) {
      matrix[0][j] = j
    }
  
    for (let i = 1; i <= item.length; i++) {
      for (let j = 1; j <= searchQuery.length; j++) {
        const cost = item.charAt(i - 1) === searchQuery.charAt(j - 1) ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        )
      }
    }
  
    return matrix[item.length][searchQuery.length]
  }

const useFuzzySearch = (data: Mp3Metadata[], threshold = 3) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredData: Mp3Metadata[] = data.filter(item =>
    fuzzySearch(searchQuery, item.title) <= threshold
  )

  return {searchQuery, setSearchQuery, filteredData}
}

export default useFuzzySearch