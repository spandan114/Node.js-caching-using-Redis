const express = require("express");
const axios = require('axios');
const redis = require("redis");
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;
const redis_port = process.env.PORT || 6379;
const client = redis.createClient(redis_port)

//middleware function

const cache = (req,res,next) =>{
    const {username} = req.params;

    client.get(username,(err,data)=>{
        if(err) throw err;
        if(data !== null){
            res.send({
                usernamecashe:data
            });
        }else{
            next()
        }
    })
}

const getRepos = async (req,res) =>{
try {
    const {username} = req.params;
    const response = await axios.get(`https://api.github.com/users/${username}`)

    //redis caching
    //key,expiretime,value
    client.setex(username,3600,response.data.name);
   
    res.send({
        status:200,
        data:response.data.name
    });

} catch (error) {
    res.json({
        status:400,
        message:error
    })
}
} 
  
//routes
app.get("/repos/:username",cache,getRepos);


app.listen(port, () => console.log(`Server running on port port ${port}`));