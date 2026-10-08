import React, { useState } from 'react'
import api from '../api/axios'

const SignUp = () => {

  const [form, setform] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = ()=>{

  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
  }
  return (
    <>

    </>
  )
}

export default SignUp