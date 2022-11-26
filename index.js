const express=require('express');
const {RtcTokenBuilder,RtcRole}=require('agora-access-token');
const PORT=process.env.PORT || 3000;
const app=express();

const nocache=(req,resp,next)=>{
resp.header('Cache-Control','private, no-cache, no-store, must-revalidate');
resp.header('Expire','-1');
resp.header('Pragma','no-cache');
next();
}

const generateAccessToken=(req,resp)=>{

    let APP_ID=req.query.appId;
    if(!appId || appId==''){
        return resp.status(500).json({'error':'App Id is required!.'});
    }

    let APP_CERTIFICATE=req.query.appCertificate;
    if(!APP_CERTIFICATE || APP_CERTIFICATE==''){
        return resp.status(500).json({'error':'App Certificate is required!.'});
    }





    //set response header
    resp.header('Access-Controll-Allow-Origion','*');
    //get channel name
    const channelName=req.query.channelName;
    if(!channelName){
        return resp.status(500).json({'error':'channel name is required!.'});
    }
    //get uid
    let uid=req.query.uid;
    if(!uid||uid==''){
        uid=0;
    }
    //get role

    var role = RtcRole.SUBSCRIBER;
    if(req.query.role=='publisher'){
        role=RtcRole.PUBLISHER;
    }
    //the expiration time for token
    let expireTime=req.query.expireTime;
    if(!expireTime||expireTime==''){
        expireTime=3600;
    }else{
        expireTime=parseInt(expireTime,10);
    }
    //calculate privilage expire time
    const currentTime=Math.floor(Date.now()/1000);
    const privilageExpireTime=currentTime+expireTime;
    //build the toke
    const token=RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilageExpireTime);
    //return the token
    return resp.json({'token':token});
}

app.get('/access_token',nocache,generateAccessToken);

app.listen(PORT,()=>{
    console.log(`Listing on port: ${PORT}`);
    console.log(RtcRole);
    console.log(RtcTokenBuilder);

})