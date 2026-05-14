"use client";
import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Success! Account created in Firebase.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSignup} style={{ border: '1px solid #333', padding: '40px', borderRadius: '10px', background: '#111' }}>
        <h1 style={{ marginBottom: '20px' }}>Sign Up</h1>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', background: '#222', color: 'white', border: '1px solid #444' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '20px', padding: '10px', borderRadius: '5px', background: '#222', color: 'white', border: '1px solid #444' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
          Create Free Account
        </button>
      </form>
    </div>
  );
}