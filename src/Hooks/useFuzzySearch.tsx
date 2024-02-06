import React, { useState } from 'react'
const { filter } = require('fuzzaldrin')

const useFuzzySearch = <T extends object>(data: T[] | null | undefined, key: string) => {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredData: T[] = data ? filter(data,searchQuery,{key:key}): []
  return {searchQuery, setSearchQuery, filteredData}
}

export default useFuzzySearch