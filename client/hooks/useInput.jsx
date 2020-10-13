import React, { useState } from 'react'

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue)
  return [
    {
      value,
      onChange: (event) =>
        setValue(event.target.value),
    },
    () => setValue(initialValue),
  ]
}

export default useInput
