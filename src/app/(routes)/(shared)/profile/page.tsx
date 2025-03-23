import React from 'react'
import ProfileForm from './components/profile-form'
import { auth } from '@/auth'

export default async function Profile() {
  const session = await auth();
  return (
    <div>
      <ProfileForm session={session}/>
    </div>
  )
}
