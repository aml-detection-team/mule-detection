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
    "Sneha Iyer",
    "Aman Malhotra",
    "Pooja Shah",
    "Karan Joshi",
    "Meera Kapoor",
    "Ravi Desai",
    "Isha Bansal",
    "Nikhil Rao",
    "Simran Kaur",
    "Varun Chawla",
    "Riya Menon",
    "Siddharth Jain",
    "Tanya Sethi",
    "Manish Agarwal",
    "Aditi Mishra",
    "Harsh Vardhan",
    "Nandini Bose",
    "Akash Tiwari",
    "Divya Saxena",
    "Mohit Sinha",
    "Shreya Das",
    "Yash Thakur",
    "Ritika Malhotra",
    "Abhishek Roy",
    "Swati Kulkarni",
    "Deepak Yadav",
    "Maya Iyer",
    "Saurabh Mittal",
    "Komal Arora",
    "Rajeev Khanna",
    "Preeti Rao",
    "Gaurav Kapoor",
    "Nisha Aggarwal",
    "Tarun Bhatia",
    "Anjali Deshmukh",
    "Vivek Pandey",
    "Radhika Sen",
    "Rohit Saxena",
    "Shalini Gupta",
    "Sameer Qureshi",
    "Monika Pillai"
];

const accountTypes = ["savings", "current"];



const accounts = []

for (let i = 1; i <= 100; i++){

  const randomName = Math.floor(Math.random() * names.length)
  const randomAccType = Math.floor(Math.random() * accountTypes.length)
  
  const accountid = "ACC"+i.toString().padStart(3,"0")
  const customerName = names[randomName];
  const accountType =accountTypes[randomAccType]
  const country ="IN"
  const createdAt = new Date().toISOString()
  
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