from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from passlib.hash import bcrypt
import re

app = FastAPI()

# Configure CORS for cross port requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client.iplab_db  #database name
users_collection = db.users  #collection name

class User(BaseModel):
    username: str = Field(..., min_length=6)
    password: str = Field(..., min_length=7)
    confirmPassword: str
    email: EmailStr
    phoneNumber: str

@app.post("/register/")
async def register(user: User):
    user_data = user.dict()
    #Checking
    hashed_password = bcrypt.hash(user_data['password'])
    user_data['password'] = hashed_password
    
    user_data.pop('confirmPassword')
    
    if users_collection.find_one({"username": user_data["username"]}):
        raise HTTPException(status_code=400, detail="Username is already taken")
    if users_collection.find_one({"email": user_data["email"]}):
        raise HTTPException(status_code=400, detail="Email is already in use")
    if users_collection.find_one({"phoneNumber": user_data["phoneNumber"]}):
        raise HTTPException(status_code=400, detail="Phone number is already in use")
    if not re.match(r"\d{11}", user_data["phoneNumber"]):
        raise HTTPException(status_code=400, detail="Phone number must have exactly 11 digits")
    
    # Insert the user into MongoDB
    users_collection.insert_one(user_data)
    return {"message": "User registered successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
