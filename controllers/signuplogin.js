let bcrypt=require('bcrypt');
let User=require('../models/user');

let jwt=require('jsonwebtoken');
let sajid='7b7525a48092abc17e7e56064c5b227ff141de550fd20028ad9ab61463d451bb4d3c897a19e80817ad1014ad05c1469f164450899557f811bb98ab1bb7f66ca2';



exports.postuserdata=async (req,res)=>{
let {name,email,phonenumber,pwd}=req.body;
let password=await bcrypt.hash(pwd,10);
User.create({
    name,email,phonenumber,password
})
.then(result=>{
res.json({result,suc:true})
})
.catch(err=>{
    res.json(err);
})
};



exports.postlogin = async (req, res) => {
  let { email, pwd } = req.body;

  let user=await User.findAll({where:{email:email}});

  if(user.length>0){
    const dbid=user[0].id;
    const dbemail=user[0].email;
    const dbpassword=user[0].password;
    const dbname=user[0].name;
    const dbphonenumber=user[0].phonenumber;

    const emailpwdmatch=await bcrypt.compare(pwd,dbpassword);


    if (emailpwdmatch) {
      const token = jwt.sign(dbid, 'sajid1234567890');
      res.status(200).json({ msg: "login successful", token: token });
    } else {
      res.status(401).json({ msg: "something went wrong" });
    }
  }
  else{
            res.status(404).json({ msg: "user not found" });

  }

};