import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import Lead from './models/Lead.js';
import User from './models/User.js';
import Asset from './models/Asset.js';
import Leave from './models/Leave.js';

dotenv.config();

const EMPLOYEES = [
  { name: "Rahul Kapoor", role: "Chief Executive Officer", department: "Executive", email: "rahul.k@capinoria.in", phone: "+91 98765 00001", location: "Mumbai, MH", avatar: "https://i.pravatar.cc/150?img=11", status: "Active" },
  { name: "Priya Sharma", role: "VP of Human Resources", department: "Human Resources", email: "priya.s@capinoria.in", phone: "+91 98765 12345", location: "Mumbai, MH", avatar: "https://i.pravatar.cc/150?img=5", status: "Active" },
  { name: "Manish Desai", role: "VP of Engineering", department: "Engineering", email: "manish.d@capinoria.in", phone: "+91 98765 20002", location: "Bengaluru, KA", avatar: "https://i.pravatar.cc/150?img=12", status: "Active" },
  { name: "Ananya Singh", role: "Marketing Director", department: "Marketing", email: "ananya.s@capinoria.in", phone: "+91 98765 34567", location: "Delhi, DL", avatar: "https://i.pravatar.cc/150?img=9", status: "Active" },
  { name: "Gaurav Verma", role: "Senior Portfolio Manager", department: "Finance", email: "gaurav.v@capinoria.in", phone: "+91 98765 98765", location: "Bengaluru, KA", avatar: "https://i.pravatar.cc/150?img=60", status: "Active" },
  { name: "Bhavna Patel", role: "Product Manager", department: "Product", email: "bhavna.p@capinoria.in", phone: "+91 98765 45678", location: "Remote", avatar: "https://i.pravatar.cc/150?img=32", status: "Active" },
  { name: "Jayesh Bhatt", role: "Wealth Advisor", department: "Sales", email: "jayesh.b@capinoria.in", phone: "+91 98765 78901", location: "Delhi, DL", avatar: "https://i.pravatar.cc/150?img=68", status: "Active" },
  { name: "Divya Reddy", role: "Financial Analyst", department: "Finance", email: "divya.r@capinoria.in", phone: "+91 98765 23456", location: "Mumbai, MH", avatar: "https://i.pravatar.cc/150?img=40", status: "Active" },
  { name: "Chetan Kumar", role: "Account Executive", department: "Sales", email: "chetan.k@capinoria.in", phone: "+91 98765 54321", location: "Delhi, DL", avatar: "https://i.pravatar.cc/150?img=51", status: "Active" },
  { name: "Rohan Gupta", role: "Risk Assessment Manager", department: "Finance", email: "rohan.g@capinoria.in", phone: "+91 98765 21098", location: "Bengaluru, KA", avatar: "https://i.pravatar.cc/150?img=53", status: "On Leave" }
];

const ASSETS = [
  { name: "Tech Innovators Fund", type: "Mutual Fund", currentValue: 1250000, description: "High yield growth tech fund" },
  { name: "Green Energy Index", type: "Mutual Fund", currentValue: 3400000, description: "Sustainable energy sector portfolio" },
  { name: "SpaceX Equity (Pre-IPO)", type: "Unlisted Share", currentValue: 5500000, description: "Unlisted space exploration giant" },
  { name: "Stripe Series I", type: "Unlisted Share", currentValue: 2100000, description: "Stripe pre-ipo allocations" },
  { name: "Apple Inc.", type: "Listed Share", currentValue: 8000000, description: "Blue chip tech holding" }
];

const USER = {
  firstName: "Priya",
  lastName: "Sharma",
  email: "priya.s@capinoria.in",
  password: "password123", // secure!
  phone: "+91 98765 12345",
  department: "Human Resources",
  roleLevel: "Administrator",
  employeeId: "CAP-2041"
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capinoria-ems');
    console.log('MongoDB connected for seeding.');

    await Employee.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Leave.deleteMany({});

    // 1. Insert Employees
    const createdEmployees = await Employee.insertMany(EMPLOYEES);

    // 2. Insert Assets
    const createdAssets = await Asset.insertMany(ASSETS);

    // 3. Generate Leaves
    const leavesList = [];
    // Just some random mock leaves for employees 1, 2, 8
    leavesList.push({ employee: createdEmployees[1]._id, startDate: new Date('2026-05-01'), endDate: new Date('2026-05-15'), reason: 'Maternity Leave', status: 'Approved' });
    leavesList.push({ employee: createdEmployees[2]._id, startDate: new Date('2026-04-15'), endDate: new Date('2026-04-18'), reason: 'Attending Tech Conference', status: 'Pending' });
    leavesList.push({ employee: createdEmployees[9]._id, startDate: new Date('2026-04-01'), endDate: new Date('2026-06-01'), reason: 'Sabbatical', status: 'Approved' });
    leavesList.push({ employee: createdEmployees[8]._id, startDate: new Date('2026-04-20'), endDate: new Date('2026-04-22'), reason: 'Sick Leave', status: 'Pending' });
    await Leave.insertMany(leavesList);

    // 4. Generate Leads (Sales) dynamically targeting employees and assets
    const clients = ["Wayne Enterprises", "Stark Industries", "Oscorp", "LexCorp", "Umbrella Corp", "Cyberdyne Systems", "Massive Dynamic", "Tyrell Corporation"];
    const statuses = ['Hot Lead', 'Follow Up', 'Cold', 'Closed', 'Closed', 'Closed']; // Bias towards closed for analytics
    
    // Create random leads spread over the last few months
    const salesList = [];
    for (let i = 0; i < 40; i++) {
        const rEmp = createdEmployees[getRandomInt(0, createdEmployees.length - 1)];
        const rAst = createdAssets[getRandomInt(0, createdAssets.length - 1)];
        const rStat = statuses[getRandomInt(0, statuses.length - 1)];
        // amount ranges based on asset roughly 10k to 500k
        const amount = getRandomInt(1, 50) * 10000;
        
        // random date in 2026 or late 2025
        const date = new Date(Date.now() - getRandomInt(1, 180) * 24 * 60 * 60 * 1000); 

        salesList.push({
            employee: rEmp._id,
            asset: rAst._id,
            client: clients[getRandomInt(0, clients.length - 1)],
            contact: "+91 " + getRandomInt(90000, 99999) + " " + getRandomInt(10000, 99999),
            status: rStat,
            date: date,
            amount: amount
        });
    }

    await Lead.insertMany(salesList);

    // 5. Insert Users based on created employees so logins work out-of-the-box
    const usersList = createdEmployees.map(emp => ({
      _id: emp._id, // Match exactly so employee specific endpoints work perfectly
      firstName: emp.name.split(' ')[0],
      lastName: emp.name.split(' ')[1] || '',
      email: emp.email,
      password: "password123",
      phone: emp.phone,
      department: emp.department,
      roleLevel: (emp.department === 'Human Resources' || emp.department === 'Executive') ? 'Manager' : 'Employee',
      avatar: emp.avatar,
      location: emp.location,
      status: emp.status
    }));
    await User.insertMany(usersList);

    console.log('Wealth Management Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
