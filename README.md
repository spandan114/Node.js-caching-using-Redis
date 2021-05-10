# Node.js-caching-using-Redis

## installation guid
 * Step 1 : Download Redis https://github.com/microsoftarchive/redis/releases
 * Step 2 : Extract the ZIP File in C:\Program Files\Redis
 * Step 3 : Setup environmental variable 
 * Step 4 : open cmd in C:\Program Files\Redis & 
 run command
 `redis-server`
 `redis-cli ping`
 
 ## Redis with node.js & Express.js
 install dependencies 
 `npm install express axios redis`
 
 create server
 ```
 const express = require("express");
 const axios = require('axios');
const redis = require("redis");
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port port ${port}`));
```

Define route & create Middleware 

```
const getRepos = async (req,res) =>{
try {
    const {username} = req.params;
    const response = await axios.get(`https://api.github.com/users/${username}`)
   
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
app.get("/repos/:username",getRepos);
```

Define redis port & createClient
```
const redis_port = process.env.PORT || 6379;
const client = redis.createClient(redis_port)
```

Apply cashing in getrepos

```
    //redis caching
    //key,expiretime,value
    client.setex(username,3600,response.data.name);
```
 create Middleware for use cashing
 ```
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
```
use cashe middleware
```
app.get("/repos/:username",cache,getRepos);
```
 
