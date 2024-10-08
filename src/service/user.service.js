const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

class UserService {
  secret = process.env.SECRET;

  // User Signup
  signup = async (data) => {
    try {
      const userInDB = await this.findUserinDB(data.email)
      if(!userInDB){
        const hashedPassword = await this.hashingPassword(data.password);
        const result = await User.create({ email: data.email, password: hashedPassword });
        return result;
      }else{
        return userInDB;
      }
    } catch (error) {
      throw error;
    }
  };

  // Creating Hashed Password for storing in DB
  hashingPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  
  // User Login
  login = async (email, password) => {
    try {
      // Finding User in User Database
      const findUser = await this.findUserinDB(email);
      if(findUser){
        // Password verification
        const user = await this.verifyPassword(email, password);
        if (user) {
          // Token generation
          const token = this.generateWebToken(user._id);
          return {
            isLoggedIn: true,
            userid: user._id,
            token: token,
          };
        } else {
          return { isLoggedIn: false };
        }
      }else{
        return { isLoggedIn: false };
      }
    } catch (error) {
      throw error;
    }
  };

  // Finding User in User Database
  findUserinDB = async (email) =>{
    try{
      const user = await User.find({email});
      if(user[0]) return user;
      else return null;
    }catch(error){ throw error}
  }

  // Password verification for Login purpose
  verifyPassword = async (email, password) => {
    try {
      const user = await User.findOne({ email: email});
      if(!user) return null;
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) return user;
      else return null;
    } catch (error) {
      throw error;
    }
  };

  // Token generation for storing in cookie
  generateWebToken = (userId) => {
    try {
      const payoad = { userId };
      const secret = this.secret;
      const options = { expiresIn: "1h" };
      const token = jwt.sign(payoad, secret, options);
      return token;
    } catch (e) {
      throw e;
    }
  };
}

module.exports = UserService;