const Pool = require('../config/db')
const findEmail = (email) =>{
    return  new Promise ((resolve,reject)=> 
    Pool.query(`SELECT * FROM users WHERE email='${email}'`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
}
const create = (data)=>{
const {id,email,passwordHash,fullname,role}= data
    return  new Promise ((resolve,reject)=> 
    Pool.query(`INSERT INTO users(id, email,password,fullname,role) VALUES('${id}','${email}','${passwordHash}','${fullname}','${role}')`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
}

const createUsers = (id, email, passwordHash, verify) => {
  return Pool.query(`insert into users ( id , email , password , verify ) values ( '${id}' , '${email}' , '${passwordHash}' ,'${verify}') `);
};

const createUsersVerification = (users_verification_id, users_id, token) => {
  return Pool.query(`insert into users_verification ( id , users_id , token ) values ( '${users_verification_id}' , '${users_id}' , '${token}' )`);
};

const checkUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`select * from users_verification where users_id='${queryUsersId}' and token = '${queryToken}' `);
};

const deleteUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`delete from users_verification  where users_id='${queryUsersId}' and token = '${queryToken}' `);
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(`update users set verify='true' where id='${queryUsersId}' `);
}

const findId = (id) => {
  return Pool.query(`select * from users where id='${id}'`);
};

module.exports = {
    findEmail,
    create,
    createUsers,
    createUsersVerification,
    checkUsersVerification,
    deleteUsersVerification,
    updateAccountVerification,
    findId
}