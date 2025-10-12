import { redirect } from 'next/navigation'

// Redirect to the employee dashboard by default
export default function Home() {
  redirect('/dashboard')
}
