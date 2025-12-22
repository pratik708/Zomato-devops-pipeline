const express=require('express');const router=express.Router();const auth=require('../middleware/auth');const {User}=require('../models');

const offers=[{id:1,type:'first-order',code:'FIRST50',discount:50,maxDiscount:200,minOrder:150,desc:'50% off on your first order',valid:true,applicable:user=>!user.orders||user.orders.length===0},{id:2,type:'bank',code:'BANK20',discount:20,maxDiscount:500,minOrder:300,desc:'20% off with HDFC Bank credit cards',valid:true,applicable:()=>true},{id:3,type:'seasonal',code:'SUMMER30',discount:30,maxDiscount:400,minOrder:250,desc:'30% off on summer special orders',valid:true,applicable:()=>true},{id:4,type:'restaurant',code:'PIZZA10',discount:10,maxDiscount:100,minOrder:100,desc:'10% off on Pizza items',valid:true,applicable:()=>true}];

router.get('/',async(req,res)=>{try{const {location,minOrder}=req.query;const userOffers=offers.filter(o=>o.valid&&(!minOrder||parseInt(minOrder)>=100));res.json({offers:userOffers,total:userOffers.length,location:location||'Bangalore',message:'Browse available offers'});}catch(e){res.status(500).json({error:'Offers failed'});}});

router.get('/personalized',auth,async(req,res)=>{try{const user=await User.findByPk(req.user.id,{include:'Orders'});const personalized=offers.filter(o=>o.applicable(user));res.json({personalized,recommended:offers.slice(0,3),saved:user.savedOffers||[],message:`${personalized.length} offers available for you`});}catch(e){res.status(500).json({error:'Personalized offers failed'});}});

router.post('/apply',auth,async(req,res)=>{try{const {code,cartTotal}=req.body;const offer=offers.find(o=>o.code===code&&o.valid);if(!offer)return res.status(400).json({error:'Invalid offer code'});if(cartTotal<offer.minOrder)return res.status(400).json({error:`Minimum order ${offer.minOrder} required`});const discount=Math.min(Math.floor(cartTotal*offer.discount/100),offer.maxDiscount);res.json({success:true,discount,finalTotal:cartTotal-discount,offerDetails:{code,type:offer.type,desc:offer.desc}});}catch(e){res.status(500).json({error:'Apply offer failed'});}});

module.exports=router;
