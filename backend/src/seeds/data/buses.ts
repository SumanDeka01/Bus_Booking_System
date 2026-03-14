export const buses = [

//assam
{
name: "ASTC Volvo AC Sleeper",
departureCity: "Guwahati",
arrivalCity: "Dibrugarh",
date: "2026-03-25",
departureTime: "20:30",
arrivalTime: "06:30",
price: 1350,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Nagaon", arrivalTime: "23:00" },
{ stopName: "Golaghat", arrivalTime: "02:30" },
{ stopName: "Dibrugarh", arrivalTime: "06:30" }
]
},

{
name: "Brahmaputra Non AC Seater",
departureCity: "Guwahati",
arrivalCity: "Silchar",
date: "2026-03-25",
departureTime: "07:00",
arrivalTime: "16:00",
price: 850,
totalSeats: 40,
availableSeats: 40,
seatTypes: ["seater"],
isAC: false,
stops: [
{ stopName: "Nagaon", arrivalTime: "09:00" },
{ stopName: "Hojai", arrivalTime: "10:30" },
{ stopName: "Badarpur", arrivalTime: "14:30" }
]
},

{
name: "Jonaki Sleeper Deluxe",
departureCity: "Guwahati",
arrivalCity: "Jorhat",
date: "2026-03-26",
departureTime: "21:00",
arrivalTime: "05:00",
price: 1100,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Tezpur", arrivalTime: "23:30" },
{ stopName: "Dergaon", arrivalTime: "03:30" }
]
},

{
name: "Northeast Express",
departureCity: "Guwahati",
arrivalCity: "Tezpur",
date: "2026-03-27",
departureTime: "09:30",
arrivalTime: "14:00",
price: 450,
totalSeats: 40,
availableSeats: 40,
seatTypes: ["seater"],
isAC: false,
stops: [
{ stopName: "Mangaldoi", arrivalTime: "11:30" }
]
},

//karnataka
{
name: "VRL Travels AC Sleeper",
departureCity: "Bangalore",
arrivalCity: "Chennai",
date: "2026-03-25",
departureTime: "22:45",
arrivalTime: "05:30",
price: 980,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Hosur", arrivalTime: "23:45" },
{ stopName: "Vellore", arrivalTime: "02:30" }
]
},

{
name: "SRS Travels Seater",
departureCity: "Bangalore",
arrivalCity: "Chennai",
date: "2026-03-26",
departureTime: "08:00",
arrivalTime: "14:00",
price: 650,
totalSeats: 40,
availableSeats: 40,
seatTypes: ["seater"],
isAC: true,
stops: [
{ stopName: "Krishnagiri", arrivalTime: "10:30" }
]
},

{
name: "Orange Travels Sleeper",
departureCity: "Bangalore",
arrivalCity: "Hyderabad",
date: "2026-03-25",
departureTime: "21:30",
arrivalTime: "07:00",
price: 1250,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Anantapur", arrivalTime: "02:30" }
]
},


//south

{
name: "Kerala Lines AC Sleeper",
departureCity: "Bangalore",
arrivalCity: "Kochi",
date: "2026-03-26",
departureTime: "20:30",
arrivalTime: "06:30",
price: 1150,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Salem", arrivalTime: "01:00" },
{ stopName: "Coimbatore", arrivalTime: "04:00" }
]
},

{
name: "KSRTC Superfast",
departureCity: "Kochi",
arrivalCity: "Trivandrum",
date: "2026-03-27",
departureTime: "06:30",
arrivalTime: "11:00",
price: 520,
totalSeats: 40,
availableSeats: 40,
seatTypes: ["seater"],
isAC: false,
stops: [
{ stopName: "Alappuzha", arrivalTime: "08:30" }
]
},



{
name: "KPN Travels Sleeper",
departureCity: "Chennai",
arrivalCity: "Bangalore",
date: "2026-03-25",
departureTime: "23:30",
arrivalTime: "06:00",
price: 900,
totalSeats: 36,
availableSeats: 36,
seatTypes: ["sleeper"],
isAC: true,
stops: [
{ stopName: "Vellore", arrivalTime: "02:30" }
]
}

];