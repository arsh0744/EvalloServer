const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const { connectToMongoDB, closeMongoDBConnection } = require('./mongoConnection');
const Content = require('./mongooseSchema/ContentMongooseSchema');
const User = require('./mongooseSchema/UserMongooseSchema');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

let records = [];

const PORT = process.env.PORT || 3000;



async function checkUserLogin(requestBody) {
  return await new Promise(
    async (resolve,reject) =>
    {
      try {
        await connectToMongoDB().then(
          async () =>
          {
            resolve(await findUserByUsernameOrEmail(requestBody))
          }
        )
       
       
      }
      catch(e)
      {
        console.error("connection error ",e);
        reject({Error:true,Message:"User Not Found"});
      } 
      finally {
        await closeMongoDBConnection();
      }
    }
  )

}

async function findUserByUsernameOrEmail(requestBody)
{

  return await new Promise(
    async (resolve,reject) =>
    {
     await User.findOne({
        $or: [
          { username: requestBody.identifier },
          { userEmail: requestBody.identifier },
        ],
        userPassword: requestBody.password,
      })      
      .then((user) => {
        if(user!=null)
        {
          resolve({Error:false,Message:user});
        }
        else
        {
          reject({Error:true,Message:"User Not Found"});
        }
      })
      .catch((error) => {
        console.error('Internal Error:', error);
        reject({Error:true,Message:"User Not Found"});
      });
    }
  )



  
  
}

async function saveNewContentCreatorUser(requestBody) {
  return await new Promise(
    async (resolve,reject) =>
    {
      try {
        await connectToMongoDB().then(
          async () =>
          {
            resolve(await saveContentCreatorUser(requestBody))
          }
        )
       
       
      }
      catch(e)
      {
        console.error("connection error ",e);
        reject({Error:true,Message:e.Message})
      } 
      finally {
        await closeMongoDBConnection();
      }
    }
  )

}

async function createUserContent(requestBody) {
  return await new Promise(
    async (resolve,reject) =>
    {
      try {
        await connectToMongoDB().then(
          async () =>
          {
            resolve(await saveContentByUserId(requestBody))
          }
        )
       
       
      }
      catch(e)
      {
        console.error("connection error ",e);
        reject({Error:true,Message:e.Message})
      } 
      finally {
        await closeMongoDBConnection();
      }
    }
  )

}

async function getUserContentByUserIdFunc(requestBody) {
  return await new Promise(
    async (resolve,reject) =>
    {
      try {
        await connectToMongoDB().then(
          async () =>
          {
            resolve(await getContentByUserId(requestBody))
          }
        )
       
       
      }
      catch(e)
      {
        console.error("connection error ",e);
        reject({Error:true,Message:e.Message})
      } 
      finally {
        await closeMongoDBConnection();
      }
    }
  )

}

async function saveContentCreatorUser(requestBody)
{
   const newUser = new User({
    Name: requestBody.Name,
    username : requestBody.username,
    userEmail: requestBody.userEmail,
    userPassword: requestBody.userPassword,
  });
  return await new Promise(
    async (resolve,reject) =>
    {
      await newUser.save()
      .then((savedUser) => {
        resolve({Error:false,Message:savedUser._id});
      })
      .catch((error) => {
        console.error('Error saving user:', error);
        reject({Error:true,Message:error});
      });
    }
  )



  
  
}

async function saveContentByUserId(requestBody)
{
   const content = new Content({
    UserId : requestBody.UserId,
    Title: requestBody.Title,
    Description : requestBody.Description,
    Link: requestBody.Link,
    Info: requestBody.Info,

  });
  return await new Promise(
    async (resolve,reject) =>
    {
      await content.save()
      .then((savedContent) => {
        resolve({Error:false,Message:"Content Added"});
      })
      .catch((error) => {
        console.error('Error Adding :', error);
        reject({Error:true,Message:error});
      });
    }
  )



  
  
}


async function getContentByUserId(requestBody)
{

  return await new Promise(
    async (resolve,reject) =>
    {
     await Content.find({
      UserId: requestBody.UserId,
      })      
      .then((contentList) => {
        if(contentList!=null)
        {
          resolve({Error:false,Message:contentList});
        }
        else
        {
          reject({Error:true,Message:"No Content Found"});
        }
      })
      .catch((error) => {
        console.error('Internal Error:', error);
        reject({Error:true,Message:"No Content Found"});
      });
    }
  )



  
  
}






router.get('/', (req, res) => {
  res.send('App is running..');
});


router.get('/test', (req, res) => {
  res.send('App is running on Test..');
});


router.post('/checkLogin', async (req, res) => {


  try {
    
    await checkUserLogin(req.body)
                 .then(
                  (e) =>
                  {
                    if(e.Error)
                    {
                      res.status(500).json({ message: e.Message });
                    }
                    else
                    {
                      res.status(200).json({ message: e.Message  });
                    }
                    
                  },
                  (err) =>
                  {
                    console.error("err",err) ;
                    res.status(500).json({ message: 'Internal server error' });
                  }
                 )

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 

router.post('/addNewCC', async (req, res) => {


  try {
    
    await saveNewContentCreatorUser(req.body)
                 .then(
                  (e) =>
                  {
                    if(e.Error)
                    {
                      res.status(500).json({ message: e.Message });
                    }
                    else
                    {
                      res.status(201).json({ message: e.Message });
                    }
                    
                  },
                  (err) =>
                  {
                    console.error("err",err) ;
                    res.status(500).json({ message: 'Internal server error' });
                  }
                 )

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 


router.post('/addUserContent', async (req, res) => {


  try {
    
    await createUserContent(req.body)
                 .then(
                  (e) =>
                  {
                    if(e.Error)
                    {
                      res.status(500).json({ message: e.Message });
                    }
                    else
                    {
                      res.status(200).json({ message: e.Message  });
                    }
                    
                  },
                  (err) =>
                  {
                    console.error("err",err) ;
                    res.status(500).json({ message: 'Internal server error' });
                  }
                 )

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 


router.post('/getUserContent', async (req, res) => {
  try {
    
    await getUserContentByUserIdFunc(req.body)
                 .then(
                  (e) =>
                  {
                    if(e.Error)
                    {
                      res.status(500).json({ message: e.Message });
                    }
                    else
                    {
                      res.status(200).json({ message: e.Message  });
                    }
                    
                  },
                  (err) =>
                  {
                    console.error("err",err) ;
                    res.status(500).json({ message: 'Internal server error' });
                  }
                 )

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 




app.listen(PORT,()=>{console.log(`Listening on Port:${PORT}`)})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
