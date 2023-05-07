import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../firebase.config";

import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //Create a new User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //get the new User
      const user = userCredential.user;

      //pdate a user's profile
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      //create a copy of the formData, so we don't mutate it
      const formDataCopy = { ...formData };
      //remove password
      delete formDataCopy.password;
      // add a timestamp to the object
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Sign Up</p>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={handleInput}
            />
            <input
              type="email"
              name="email"
              className="emailInput"
              placeholder="E-mail"
              id="email"
              value={email}
              onChange={handleInput}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                name="password"
                value={password}
                className="passwordInput"
                onChange={handleInput}
              />
              <img
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="white" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignUp;
