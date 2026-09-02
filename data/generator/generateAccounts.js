const fs=require("fs")

const names = [
    "Arjun Sharma",
    "Priya Patel",
    "Rahul Kumar",
    "Ananya Singh",
    "Vikram Mehta",
    "Neha Verma",
    "Rohan Gupta",
    "Kavya Reddy",
    "Aditya Nair",
    "Sneha Iyer"
];

const accountTypes = ["savings", "current"];



const accounts = []

for (let i = 1; i <= 10; i++){

  const randomName = Math.floor(Math.random() * names.length)
  const randomAccType = Math.floor(Math.random() * accountTypes.length)
  
  let accountid = "ACC"+i.toString().padStart(3,"0")
  let customerName = names[randomName];
  let accountType =accountTypes[randomAccType]
  let country ="IN"
  let createdAt = new Date().toISOString()
  
  const account = {
    "accountId": accountid,
    "customerName": customerName,
    "accountType": accountType,
    "country": country,
    "createdAt": createdAt
  }
  accounts.push(account)
}
fs.writeFileSync(
    "data/output/accounts.json",
    JSON.stringify(accounts, null, 2)
);
//console.log(accounts)