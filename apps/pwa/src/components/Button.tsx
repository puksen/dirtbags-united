type ButtonProps = {
  label: string,
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

function Button({ label, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={`text-black py-3 px-5 rounded-full transition ${variant === 'primary' ? 'bg-amber-400 hover:bg-amber-300' : 'bg-gray-300 hover:bg-gray-200'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Button