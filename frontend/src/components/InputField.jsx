import React from 'react'

const InputField = ({
    label,
    id,
    name,
    onChange,
    type="text",
    value,
}) => {
  return (
    <div>
        <label
            className='block text-sm font-medium text-gray-700'
            htmlFor={id}
        >
            {label}
        </label>

        <input
            className='mt-1 p-2 w-full rounded-md text-black focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colours duration-300'
            id={id}
            value={value}
            onChange={onChange}
            type={type}
            name={name}
        />
    </div>
  )
}

export default InputField