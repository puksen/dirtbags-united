type ButtonProps = {
  label: string,
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ label, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={`text-black py-3 px-5 rounded-full transition ${variant === 'primary' ? 'bg-orange-300 hover:bg-orange-300/70 inset-ring inset-ring-orange-300/20' : 'bg-gray-300 hover:bg-gray-300/70 inset-ring inset-ring-gray-300/20'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}