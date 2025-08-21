
// import  jwt  from "jsonwebtoken";
// import { nanoid } from "nanoid";
// export const generateToken= ({payload,signature,})=>
// {
// return  jwt.sign(payload,signature,{
//   jwtid: nanoid() 
// })
// }
// export const verifyToken= ({token,signature})=>
// {
//      console.log(jwt.decode(token)); 
    
// return  jwt.verify(token,signature)
// }
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";



export const generateToken = ({ payload, signature, expiresIn = "1h" }) => {
  const token = jwt.sign(
    payload,
    signature,
    {
      jwtid: nanoid(),        // ✅ Adds the `jti`
      expiresIn               // ✅ Adds the `exp`
    }
  );

  return token;
};

// export const verifyToken = ({ token, signature }) => {
//   const decoded = jwt.decode(token); // decode without verifying
//   console.log("Decoded token:", decoded);   // full payload
//   console.log("JTI:", decoded?.jti);        // jti field

//   return jwt.verify(token, signature);
// };
export const verifyToken = ({ token, signature }) => {
  try {
    const verified = jwt.verify(token, signature);
    // console.log("Verified token payload:", verified);
    return verified;
  } catch (err) {
    console.error("[verifyToken] JWT verification error:", err.message);
    throw err; // Make sure you re-throw it
  }
};



// const signature = "supersecretkey";
// const token = generateToken({
//   payload: { id: "689acafcac9b4e0fbc3c1345", isLoggedIn: true },
//   signature,
// });

// verifyToken({ token, signature });

