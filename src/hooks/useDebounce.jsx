import React, { useEffect, useState } from 'react'

export default function useDebounce(val, delay) {
    const [debounceVal, setDebounceVal] = useState(val)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(val)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [val])
    return debounceVal
}
