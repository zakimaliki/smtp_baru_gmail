const Pool = require('../config/db')
const selectAll = ({limit,offset,sort,sortby}) => {
  return Pool.query(`SELECT * FROM product ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const select = (id) => {
  return Pool.query(`SELECT * FROM product WHERE id=${id}`)
}
const insert = (data) => {
  const { id,name,stock,price,photo,description } = data
  return Pool.query(`INSERT INTO product(id,name,stock,price,photo,description) VALUES(${id},'${name}',${stock},${price},'${photo}','${description}')`)
}
const update = (data) => {
  const { id,name,stock,price,photo,description } = data
  return Pool.query(`UPDATE product SET name='${name}', stock=${stock}, price=${price} ,photo='${photo}' ,description='${description}' WHERE id='${id}'`)
}
const deleteData = (id) => {
  return Pool.query(`DELETE FROM product WHERE id=${id}`)
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM product')
}

const findId =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM product WHERE id=${id}`,(error,result)=>{
    if(!error){
      resolve(result)
    }else{
      reject(error)
    }
  })
  )
}

module.exports = {
  selectAll,
  select,
  insert,
  update,
  deleteData,
  countData,
  findId
}
