import React, { useState } from 'react'

const Loading = () => {

  const [loading, setLoading] = useState(false)

  return [
    loading ? "Loading...." : null,
    () => setLoading(true), //Show loader
    () => setLoading(false) //Hide Loader
]
}

export default Loading