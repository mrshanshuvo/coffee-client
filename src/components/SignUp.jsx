import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const SignUp = () => {

  const { createUser } = use(AuthContext)
  // console.log(createUser);

  const handleSignUp = e => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)

    const { email, password, ...restFormData } = Object.fromEntries(formData.entries())


    // console.log(email, password, userProfile);

    // create user in the firebase
    createUser(email, password)
      .then(result => {
        console.log(result.user);

        const userProfile = {
          email,
          ...restFormData,
          creationTime: result.user?.metadata?.creationTime,
          lastSignInTime: result.user?.metadata?.lastSignInTime
        }

        // save profile info in the db
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(userProfile)
        })
          .then(res => res.json())
          .then(data => {
            if (data.insertedId) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your account is created",
                showConfirmButton: false,
                timer: 1500
              });
            }
          })
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  return (
    <div className="card bg-base-100 mx-auto  max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Sign Up now!</h1>
        <form className="fieldset" onSubmit={handleSignUp}>

          <label className="label">Name</label>
          <input type="text" className="input" placeholder="Name" name='name' />

          <label className="label">Address</label>
          <input type="text" className="input" placeholder="Address" name='address' />

          <label className="label">Phone No.</label>
          <input type="text" className="input" placeholder="Phone No." name='phone' />

          <label className="label">PhotoURL</label>
          <input type="text" className="input" placeholder="PhotoURL" name='photo' />

          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" name='email' />

          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" name='password' />

          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;