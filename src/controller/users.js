const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { findEmail, create,createUsers,createUsersVerification ,checkUsersVerification,deleteUsersVerification,updateAccountVerification,findId} = require("../models/users");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const sendEmail = require("../middlewares/sendEmail");
const crypto = require("crypto");

const UserController = {
  //  register : async(req,res,next)=>{
  //     try{
  //       const {email,password,fullname} = req.body;
  //       const {rowCount} = await findEmail(email)
  //       const salt = bcrypt.genSaltSync(10);
  //       const passwordHash = bcrypt.hashSync(password);
  //       const id = uuidv4()
  //       if(rowCount){
  //         return next(createError(403,"Email is already used"))
  //       }
  //       const data={
  //         id:uuidv4(),
  //         email,
  //         passwordHash,
  //         fullname,
  //         role :'user'
  //       }
  //       create(data)
  //       .then(
  //         result => commonHelper.response(res, result.rows, 201, "Category created")
  //       )
  //       .catch(err => res.send(err)
  //       )
  //     }catch(error){
  //       console.log(error);
  //     }
  //   },
  registerAccount: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await findEmail(email);

      try {
        if (checkEmail.rowCount == 1) throw "Email already used";
        // delete checkEmail.rows[0].password;
      } catch (error) {
        delete checkEmail.rows[0].password;
        return commonHelper.response(res, null, 403, error);
      }

      // users
      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(password, saltRounds);
      const id = uuidv4().toLocaleLowerCase();

      // verification
      const verify = "false";

      const users_verification_id = uuidv4().toLocaleLowerCase();
      const users_id = id;
      const token = crypto.randomBytes(64).toString("hex");

      // url localhost
      const url = `${process.env.BASE_URL}users/verify?id=${users_id}&token=${token}`;
      

      // url deployment
      // const url = `${process.env.BASE_URL}/verification?type=email&id=${users_id}&token=${token}`;

      //send email
      await sendEmail(email, "Verify Email", url);

      // insert db table users
      await createUsers(id, email, passwordHash, verify);

      // insert db table verification
      await createUsersVerification(
        users_verification_id,
        users_id,
        token
      );


      commonHelper.response(
        res,
        null,
        201,
        "Sign Up Success, Please check your email for verification"
      );
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findId(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkUsersVerification(
          queryUsersId,
          queryToken
        );

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteUsersVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);
      
      // res.send(createError(404));
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await findEmail(email);
      if (!user) {
        return commonHelper.response(res, null, 403, "Email is invalid");
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      console.log(isValidPassword);

      if (!isValidPassword) {
        return commonHelper.response(res, null, 403, "Password is invalid");
      }
      delete user.password;
      const payload = {
        email: user.email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefershToken(payload);

      commonHelper.response(res, user, 201, "login is successful");
    } catch (error) {
      console.log(error);
    }
  },
  sendEmail: async (req, res, next) => {
    const { email } = req.body;
    await sendEmail(email, "Verify Email", url);
  },
  profile: async (req, res, next) => {
    const email = req.payload.email;
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },
  refreshToken: (req, res) => {
    const refershToken = req.body.refershToken;
    const decoded = jwt.verify(refershToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refershToken: authHelper.generateRefershToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = UserController;
