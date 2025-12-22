const express=require('express');const router=express.Router();const auth=require('../middleware/auth');const {Order,User}=require('../models');

const helpTopics={order:{issues:['Where is my order?','Order seems wrong','Payment issue'],solutions:{delayed:'Contact delivery partner (📞 call button on order)',wrong:'We will refund the difference',payment:'Your payment is being processed'}},payment:{issues:['Payment failed','Refund pending','Card not accepted'],solutions:{failed:'Try another card or payment method',refund:'Refund processes within 5-7 business days',card:'Try Debit Card or UPI'}},delivery:{issues:['Delivery charge high','No delivery available','Delivery delayed'],solutions:{charge:'Delivery charges based on distance & time',unavailable:'Try different restaurants in your area',delayed:'Live track your delivery'}},account:{issues:['Can\'t login','Password reset','Account suspended'],solutions:{login:'Check email/password, try reset option',password:'Reset link sent to your email',suspended:'Contact support team'}}};

router.get('/topics',async(req,res)=>{res.json({topics:Object.keys(helpTopics),message:'Select your issue category'});});

router.get('/issues/:category',async(req,res)=>{try{const {category}=req.params;if(!helpTopics[category])return res.status(400).json({error:'Invalid category'});res.json({category,issues:helpTopics[category].issues,message:`Common ${category} issues`});}catch(e){res.status(500).json({error:'Get issues failed'});}});

router.get('/solution/:category/:issue',async(req,res)=>{try{const {category,issue}=req.params;if(!helpTopics[category])return res.status(400).json({error:'Invalid category'});const solution=helpTopics[category].solutions[issue.toLowerCase().replace(/\s+/g,'')];res.json({category,issue,solution:solution||'Contact our support team',escalate:!solution});}catch(e){res.status(500).json({error:'Get solution failed'});}});

router.post('/escalate',auth,async(req,res)=>{try{const {category,issue,description}=req.body;const ticket={id:Math.random().toString(36).substr(2,9),userId:req.user.id,category,issue,description,status:'open',createdAt:new Date(),response:null};res.status(201).json({ticket,message:'Support ticket created. Our team will reach out within 2 hours.'});}catch(e){res.status(500).json({error:'Escalate failed'});}});

module.exports=router;
