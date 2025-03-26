//NodeModules
import validator from "validator"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"

export interface IUser extends mongoose.Document {
  username: string;
  nickname: string;
  password: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publicJSON: () => UserPublicJSON;
  comparePassword: (password: string) => Promise<boolean>;
  createJWT: () => string;
}

export interface UserPublicJSON {
  username: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    require: true,
    maxlength: [ 16, "Username must be a maximum of 16 characters long" ],
    minlength: [ 5, "Username must be at least 5 characters" ],
  },

  nickname: {
    type: String,
    require: true,
    maxlength: [ 16, "Nickname must be a maximum of 16 characters long" ],
    minlength: [ 5, "Nickname must be at least 5 characters" ]
  },

  password: {
    type: String,
    require: true,
    maxlength: [ 128, "Password must be a maximum of 128 characters long" ],
    minlength: [ 8, "Password must be at least 8 characters" ]
  }, 

  email: {
    type: String,
    require: true,
    maxlength: [ 255, "Email must be a maximum of 255 characters long" ],
    unique: true
  }
}, { timestamps: true })

//Validate
userSchema.path("email").validate(function (email: string) {
  return validator.isEmail(email)
}, JSON.stringify({ message: "Email is invalid email", type:"invalidEmail" }), "errorInJSON")

userSchema.path("password").validate(function (password: string) {
  return validator.isStrongPassword(password, { minUppercase: 1, minLowercase: 1, minSymbols: 1, minNumbers: 1 })
}, JSON.stringify({ message: "Password needs at least one capital letter, one symbol, one number", type:"weakPassword", minUppercase: 1, minLowercase: 1, minSymbols: 1, minNumbers: 1 }))

userSchema.path("username").validate(function (username: string) {
  return validator.isAlphanumeric(username, "en-US", { ignore:"_-" })
}, JSON.stringify({ message: "Username must be alphanumeric", type: "invalidCharacter", alphanumeric: true, ignore:["-", "_"] }))

userSchema.path("nickname").validate(function (nickname: string) {
  return validator.isAlphanumeric(nickname, "en-US", { ignore:"_-" })
}, JSON.stringify({ message: "NickName must be alphanumeric", type: "invalidCharacter", alphanumeric: true, ignore:["-", "_"] }))

//Methods
userSchema.methods.publicJSON = function(this): UserPublicJSON {
  return {
    _id:this._id,
    nickname:this.nickname,
    username:this.username,
    createdAt:this.createdAt,
    updatedAt:this.updatedAt,
  }
}

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.createJWT = function(): string {
  return JWT.sign({ _id:this._id }, process.env.Secret_JWT || "", {
    expiresIn:Number(process.env.ExpiresIn_JWT || "604800000")
  })
}

//Save
userSchema.pre("save", async function(next) {
  if (!this.isModified('password')) { return next() }
  
  const salt = await bcrypt.genSalt(Number(process.env.Salt_Bcrypt || 10))
  const hash = await bcrypt.hash(this.password as string, salt)

  this.password = hash
  next()
})

userSchema.pre("save", async function(next) {
  if (!this.isNew && this.nickname !== undefined) { return next() }
  
  this.nickname = this.username

  next()
})

export const UserModel = mongoose.model<IUser>("Users", userSchema)