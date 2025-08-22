import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    avatar:{
        type: String,     // cloudinary url
        required: true,
    },
    coverImage:{
        type: String,     // cloudinary url
    },
    watchHistory:{
        type: Schema.Types.ObjectId,     
        ref: "Video"
    },
    password:{
        type: String,     
        required: [true, 'password is required']
    },
    refreshToken:{
        type: String
    }

}, {timestamps: true} )

// pre --> ye jab bhi save hone jaye to ye function chala dena aur uske baad next call kar dena
 
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    // in case if don;t run means password is modified then
    this.password = bcrypt.hash(this.password, 10);
    next();
})

// methods creating for checking password

userSchema.methodsisPassworCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// genreate aceess token and refresh token

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET
        }
    )
}



export const User = mongoose.model("User", userSchema)