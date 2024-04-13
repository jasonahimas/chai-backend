import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend

  // validation-not empty

  // check if user already exists : username & email
  // check for images,check for avatar
  //upload them to cloudinary,avatar
  //create user object-create entry in db
  //remove password and refreshtoken from response 
  // check for user creation
  //return response
  const{username,fullname,email,password}=req.body;
  if(
  [username,fullname,email,password].some((field)=>
      field?.trim()==="")
  ){
    throw new ApiError(400,"All field are required");
  }

  let existedUser= await User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"Username or email already exists")
  }

  const avatarLocalPath=req.files?.avatat[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError("Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError("Avatar file is required")
  }
  
  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    username:toLowerCase(),
    email,
    password
  })

  const createdUser = awaitUser.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }
  
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )

    
});

export { registerUser };
