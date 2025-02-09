import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "../../lib/connectDB";
import UserModel from "../../lib/models/userModel";

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_CLIENT_SECRET!

export const authOptions : NextAuthOptions = {
    session:{
        strategy:"jwt"
    },
    providers:[
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,        
        })
    ],
    callbacks:{
        async signIn({profile}){

            if (!profile?.email) {
                throw new Error('No profile')
            }

            try {
                connectDB()
                await UserModel.updateOne(
                  { email: profile.email },
                  { $set: { email: profile.email, name: profile.name, avatar: profile.image } },
                  { upsert: true }
                );
                console.log('Document updated successfully!');
              } catch (error) {
                console.error('Error updating document:', error);
              }
              
            return true
        },async jwt({token}){
            if(!token.email){
                return{
                    message:"Invalid credentials"
                }
            }
            connectDB()
            const fetchedUser = await UserModel.findOne({ email: token.email });
            return{
                ...token,
                id:fetchedUser?._id,
                name:fetchedUser?.name,
                email:fetchedUser?.email,
            }
        },session({token,session}){
            return {
                    ...session,
                    user: {
                      ...session.user,
                      id: token.id,
                    }, 
                }
            }
    }
} 