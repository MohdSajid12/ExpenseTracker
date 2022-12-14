const express=require('express');
const User=require('../models/user');
const Expense =require('../models/expense');
const Sequelize=require('sequelize');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const aut=require('../authentication');
const router=express.Router();
let bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const Order = require("../models/order");


let c=0;
router.use(bodyParser.json());

router.post('/addexpense',aut.authenticate  ,(req,res)=>{
    const {amount,category,description}=req.body.obj;
    console.log(amount,category,description);

    let userId=req.user.id;

    Expense.create({ amount, category, description,userId }).then(result=>{
        res.json(result);
    })
    .catch(err=>{
        res.json(err)
    })
});

router.get('/getuserdata',aut.authenticate,(req,res)=>{
console.log(c++);
    let userid=req.user.id;

    User.findAll({where:{id:userid}})
    .then(result=>{
        res.json({result,suc:'yes'});
    })
    .catch(err=>{
        res.status(404).json(err);
    })

});
router.get("/getexpenses", aut.authenticate, (req, res) => {
  console.log(c++);
  let userid = req.user.id;

  Expense.findAll({ where: { userId: userid } })
    .then((result) => {
      res.json({ result, suc: "yes" });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});
router.get("/subscription", aut.authenticate, async (req, res) => {
  let userId = req.user.id;
  try {
    var rzp = new Razorpay({
      key_id: 'rzp_test_uT8rTIcrpwJuem',
      key_secret: 'kRlfIeJfV2nwHRLvCrppk9zb',
    });
    const amount = 500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(err);
      }
      Order.create({ orderid: order.id, status: "PENDING", userId: userId })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
});

router.post("/updatetransaction", aut.authenticate, async (req, res) => {
  let userId = req.user.id;
  try {
    const { payment_id, order_id } = req.body;

    Order.findOne({ where: { orderid: order_id } })
      .then((order) => {
        order
          .update({ paymentid: payment_id, status: "SUCCESSFUL" })
          .then(() => {
                req.user.update({ issubcribed: true })
            return res
              .status(202)
              .json({ sucess: true, message: "transaction successful" });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err, message: "something  went wrong" });
  }
});

router.get("/leaderdata", aut.authenticate, async (req, res) => {
  const totalAmount = await Expense.findAll({
    attributes: [
      "userId",
      [Sequelize.fn("sum", Sequelize.col("amount")), "total_amount"],
    ],
    group: ["userId"],
    raw: true,
  });

  totalAmount.sort((a, b) => b.total_amount - a.total_amount);

  for (let i = 0; i < totalAmount.length; i++) {
    let user = await User.findAll({
      attributes: ["name"],
      where: { id: totalAmount[i].userId },
    });

    //console.log(user[0].name)

    totalAmount[i] = { ...totalAmount[i], name: user[0].name };
  }

  //console.log(totalAmount)
  res.json( totalAmount);
});


router.delete('/delete/expense/:id',aut.authenticate,(req,res)=>{
  const id=req.params.id;
  Expense.destroy({where:{id:id}})
  .then(result=>{
res.json(result)  })
  .catch(err=>{
res.json(err)  })
});

module.exports=router;
