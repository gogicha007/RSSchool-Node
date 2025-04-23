Install Install dependecies: npm i

Modes

- Development mode : npm run start:dev
- Production mode (Build + start): npm run start:prod
- multi server mode: npm run start:multi



## API

Required fields


name — user's name [type: string]

age — user's age [type:number]

hobbies — user's hobbies [type: array of strings]


`GET api/users` - to get all users

`GET api/users/userId` - to get user by id (uuid)

`POST api/users` - to create record about new user and store it in database

    example of body:
    {
      "username": "Elon",
      "age": 54,
      "hobbies": ["star gazing", "rockets"]
    }

`PUT api/users/userId` - to update existing user (all fields required)

    example of body:
      {
        "username": "Elon", and/or "age": 54, and/or "hobbies": ["star gazing", "rockets"]
      }

`DELETE api/users/userId` - to delete existing user from database
