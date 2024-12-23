import express from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";
import { Cart } from "../entities/cart";
import { Product } from "../entities/product";
import {
  handleCreateNewUser,
  handleUserLogin,
  logoutOnGetRequest,
} from "../controllers/user";
import { addItemToCart, deleteItemFromCart, fetchUserCart } from "../controllers/cart";



const router = express.Router();

//crud operations using typeorm
router.route("/").get(async (req, res) => {
  const userRepo = AppDataSource.getRepository(Users);

  //getting one user by his id
  const oneUser = await userRepo.findOne({ where: { id: 1 } });
  console.log(oneUser);

  res.json(oneUser);

  // getting all users
  // const allUsers = await userRepo.find({});
  // res.send(allUsers);
});

//signup request
router.route("/signup").post(handleCreateNewUser);

//login request
router.route("/login").get(logoutOnGetRequest).post(handleUserLogin);

// .post(async (req, res) => { 
//     //this is for, when we'll get the data from frontend
//     // const {firstname, lastname, email} = req.body;

//     const userRepo = AppDataSource.getRepository(Users);

//     //one to one relation with profile
//     const profileRepo = AppDataSource.getRepository(Profile);

//     let profile: Profile = new Profile();
//     profile.gender = "male";
//     profile.photo = "photo URL";

//     const profileInserted = await profileRepo.save(profile);

//     //creating a new user
//     let user: Users = new Users();
//     user.firstname = 'Amit';
//     user.lastname = 'Kumar';
//     user.email = 'amitt@gmail.com';
//     user.profile = profileInserted;

//     //inserting in database
//     const userInserted = await userRepo.save(user);

//     res.json(userInserted);
// }).put(async (req, res) => {

//     // const {id} = req.params;

//     const userRepo = AppDataSource.getRepository(Users);

//     //put id in place of 3
//     const updatedUser = await userRepo.update(3, {firstname: 'Ravi up', lastname:'Raj up', email: "updated@gmail.com"});
//     res.json(updatedUser);
// }).delete(async (req, res) => {

//     // const {id} = req.params;

//     const userRepo = AppDataSource.getRepository(Users);

//     const deletedUser = await userRepo.delete(2);

//     res.json(deletedUser);
// })

//store router
router.route("/store").get(async (req, res) => {
  const productRepo = AppDataSource.getRepository(Product);

  const allProducts = await productRepo.find({});

  res.json(allProducts);
});


//cart router
router.route("/cart").get(fetchUserCart).post(addItemToCart).delete(deleteItemFromCart)

export default router;
