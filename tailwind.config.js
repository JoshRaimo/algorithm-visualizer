/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-slate-100',
    'bg-sky-500',
    'bg-rose-500',
    'bg-emerald-500',
    'text-gray-800',
    'text-gray-700',
    'text-white',
    'text-2xl',
    'text-lg',
    'text-base',
    'font-sans',
    'font-semibold',
    'leading-relaxed',
    'p-5',
    'p-2',
    'py-2.5',
    'px-5',
    'my-2.5',
    'my-1.5',
    'mb-8',
    'mb-4',
    'gap-2',
    'gap-5',
    'gap-0.5',
    'rounded-lg',
    'rounded-md',
    'shadow-md',
    'border',
    'border-gray-300',
    'border-none',
    'transition-colors',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'hover:bg-blue-600',
    'w-full',
    'h-[350px]',
    'min-h-[400px]',
    'max-w-7xl',
    'mx-auto',
    'flex',
    'flex-col',
    'items-end',
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'lg:grid-cols-3',
  ],
} 