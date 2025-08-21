import React from 'react'
import { Link } from 'react-router-dom'

function Button({Text,bgColor,textColor, Links}) {
  return (
    <div>
        <Link to={Links}>
       <button  className={`px-6 py-3 rounded-full bg-${bgColor} text-${textColor} shadow-[6px_6px_#4D2C5E] transition duration-300`}>
            {Text}
          </button>
          </Link>
    </div>
  )
}

export default Button
