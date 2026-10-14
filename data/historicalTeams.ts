import type { HistoricalTeam } from "./types";

/**
 * Historical IPL squad data.
 * All squads are based on actual registered players for the given season.
 * Ratings represent player quality around that specific season.
 * Price = fictional auction value in Crore based on rating.
 */
export const HISTORICAL_TEAMS: HistoricalTeam[] = [
  // ─────────────────────────────────────────────────────────────────
  // RR 2008 — The original champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "rr-2008",
    team: "RR",
    season: 2008,
    players: [
      { id: "sm-warne", name: "Shane Warne", role: "BOWL", nationality: "OVERSEAS", rating: 88, battingRating: 42, bowlingRating: 88, price: 11 },
      { id: "sr-tendulkar-rr", name: "Shane Watson", role: "AR", nationality: "OVERSEAS", rating: 86, battingRating: 82, bowlingRating: 78, price: 10 },
      { id: "yusuf-pathan-08", name: "Yusuf Pathan", role: "AR", nationality: "IND", rating: 83, battingRating: 83, bowlingRating: 68, price: 8 },
      { id: "sohail-tanvir-08", name: "Sohail Tanvir", role: "BOWL", nationality: "OVERSEAS", rating: 82, battingRating: 38, bowlingRating: 82, price: 7 },
      { id: "graeme-smith-08", name: "Graeme Smith", role: "BAT", nationality: "OVERSEAS", rating: 80, battingRating: 80, bowlingRating: 22, price: 7 },
      { id: "swapnil-asnodkar", name: "Swapnil Asnodkar", role: "BAT", nationality: "IND", rating: 70, battingRating: 70, bowlingRating: 12, price: 4 },
      { id: "ravindra-jadeja-08", name: "Ravindra Jadeja", role: "AR", nationality: "IND", rating: 72, battingRating: 62, bowlingRating: 68, price: 4 },
      { id: "munaf-patel-08", name: "Munaf Patel", role: "BOWL", nationality: "IND", rating: 75, battingRating: 22, bowlingRating: 75, price: 5 },
      { id: "dinesh-salunkhe", name: "Dinesh Salunkhe", role: "WK", nationality: "IND", rating: 62, battingRating: 60, bowlingRating: 10, price: 3 },
      { id: "kamran-khan", name: "Kamran Khan", role: "BOWL", nationality: "IND", rating: 66, battingRating: 20, bowlingRating: 66, price: 3 },
      { id: "tanvir-ahmed-rr", name: "Tanvir Ahmed", role: "BOWL", nationality: "OVERSEAS", rating: 72, battingRating: 18, bowlingRating: 72, price: 4 },
      { id: "naman-ojha-08", name: "Naman Ojha", role: "WK", nationality: "IND", rating: 68, battingRating: 66, bowlingRating: 10, price: 3 },
      { id: "mohammad-kaif-08", name: "Mohammad Kaif", role: "BAT", nationality: "IND", rating: 66, battingRating: 66, bowlingRating: 8, price: 3 },
      { id: "taruwar-kohli-rr", name: "Taruwar Kohli", role: "BAT", nationality: "IND", rating: 60, battingRating: 60, bowlingRating: 5, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CSK 2010 — The machine begins
  // ─────────────────────────────────────────────────────────────────
  {
    id: "csk-2010",
    team: "CSK",
    season: 2010,
    players: [
      { id: "ms-dhoni-10", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 92, battingRating: 88, bowlingRating: 15, price: 16 },
      { id: "suresh-raina-10", name: "Suresh Raina", role: "BAT", nationality: "IND", rating: 84, battingRating: 84, bowlingRating: 42, price: 9 },
      { id: "murali-vijay-10", name: "Murali Vijay", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 10, price: 6 },
      { id: "michael-hussey-10", name: "Michael Hussey", role: "BAT", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 15, price: 9 },
      { id: "mathew-hayden-10", name: "Matthew Hayden", role: "BAT", nationality: "OVERSEAS", rating: 80, battingRating: 80, bowlingRating: 12, price: 7 },
      { id: "albie-morkel-10", name: "Albie Morkel", role: "AR", nationality: "OVERSEAS", rating: 78, battingRating: 72, bowlingRating: 75, price: 6 },
      { id: "s-badrinath-10", name: "S. Badrinath", role: "BAT", nationality: "IND", rating: 74, battingRating: 74, bowlingRating: 8, price: 5 },
      { id: "ravichandran-ashwin-10", name: "Ravichandran Ashwin", role: "AR", nationality: "IND", rating: 82, battingRating: 62, bowlingRating: 82, price: 8 },
      { id: "doug-bollinger-10", name: "Doug Bollinger", role: "BOWL", nationality: "OVERSEAS", rating: 78, battingRating: 20, bowlingRating: 78, price: 6 },
      { id: "lakshmipathy-balaji-10", name: "L. Balaji", role: "BOWL", nationality: "IND", rating: 72, battingRating: 18, bowlingRating: 72, price: 4 },
      { id: "jacob-oram-10", name: "Jacob Oram", role: "AR", nationality: "OVERSEAS", rating: 76, battingRating: 68, bowlingRating: 74, price: 5 },
      { id: "muttiah-muralitharan-10", name: "Muttiah Muralitharan", role: "BOWL", nationality: "OVERSEAS", rating: 84, battingRating: 15, bowlingRating: 84, price: 9 },
      { id: "manpreet-gony-10", name: "Manpreet Gony", role: "BOWL", nationality: "IND", rating: 68, battingRating: 22, bowlingRating: 68, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CSK 2011 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "csk-2011",
    team: "CSK",
    season: 2011,
    players: [
      { id: "ms-dhoni-11", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 94, battingRating: 90, bowlingRating: 15, price: 17 },
      { id: "suresh-raina-11", name: "Suresh Raina", role: "BAT", nationality: "IND", rating: 86, battingRating: 86, bowlingRating: 44, price: 10 },
      { id: "murali-vijay-11", name: "Murali Vijay", role: "BAT", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 10, price: 7 },
      { id: "michael-hussey-11", name: "Michael Hussey", role: "BAT", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 15, price: 10 },
      { id: "dwayne-bravo-11", name: "Dwayne Bravo", role: "AR", nationality: "OVERSEAS", rating: 86, battingRating: 78, bowlingRating: 84, price: 10 },
      { id: "ravichandran-ashwin-11", name: "Ravichandran Ashwin", role: "AR", nationality: "IND", rating: 86, battingRating: 64, bowlingRating: 86, price: 10 },
      { id: "albie-morkel-11", name: "Albie Morkel", role: "AR", nationality: "OVERSEAS", rating: 78, battingRating: 74, bowlingRating: 76, price: 6 },
      { id: "s-badrinath-11", name: "S. Badrinath", role: "BAT", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 8, price: 5 },
      { id: "wriddhiman-saha-11", name: "Wriddhiman Saha", role: "WK", nationality: "IND", rating: 74, battingRating: 72, bowlingRating: 10, price: 5 },
      { id: "muttiah-muralitharan-11", name: "Muttiah Muralitharan", role: "BOWL", nationality: "OVERSEAS", rating: 83, battingRating: 14, bowlingRating: 83, price: 8 },
      { id: "doug-bollinger-11", name: "Doug Bollinger", role: "BOWL", nationality: "OVERSEAS", rating: 78, battingRating: 20, bowlingRating: 78, price: 6 },
      { id: "lakshmipathy-balaji-11", name: "L. Balaji", role: "BOWL", nationality: "IND", rating: 74, battingRating: 18, bowlingRating: 74, price: 5 },
      { id: "shadab-jakati-11", name: "Shadab Jakati", role: "BOWL", nationality: "IND", rating: 68, battingRating: 22, bowlingRating: 68, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // KKR 2012 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "kkr-2012",
    team: "KKR",
    season: 2012,
    players: [
      { id: "gautam-gambhir-12", name: "Gautam Gambhir", role: "BAT", nationality: "IND", rating: 88, battingRating: 88, bowlingRating: 8, price: 11 },
      { id: "sunil-narine-12", name: "Sunil Narine", role: "AR", nationality: "OVERSEAS", rating: 90, battingRating: 60, bowlingRating: 90, price: 13 },
      { id: "manoj-tiwary-12", name: "Manoj Tiwary", role: "BAT", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 12, price: 5 },
      { id: "brendon-mccullum-12", name: "Brendon McCullum", role: "WK", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "yusuf-pathan-12", name: "Yusuf Pathan", role: "AR", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 65, price: 7 },
      { id: "jacques-kallis-12", name: "Jacques Kallis", role: "AR", nationality: "OVERSEAS", rating: 86, battingRating: 84, bowlingRating: 78, price: 10 },
      { id: "lakshmipathy-balaji-kkr", name: "L. Balaji", role: "BOWL", nationality: "IND", rating: 74, battingRating: 18, bowlingRating: 74, price: 5 },
      { id: "rajat-bhatia-12", name: "Rajat Bhatia", role: "AR", nationality: "IND", rating: 70, battingRating: 60, bowlingRating: 68, price: 4 },
      { id: "iqbal-abdulla-12", name: "Iqbal Abdulla", role: "BOWL", nationality: "IND", rating: 68, battingRating: 22, bowlingRating: 68, price: 3 },
      { id: "brad-haddin-12", name: "Brad Haddin", role: "WK", nationality: "OVERSEAS", rating: 76, battingRating: 74, bowlingRating: 10, price: 5 },
      { id: "shakib-al-hasan-12", name: "Shakib Al Hasan", role: "AR", nationality: "OVERSEAS", rating: 84, battingRating: 74, bowlingRating: 82, price: 9 },
      { id: "braydon-scott-12", name: "Debabrata Das", role: "BAT", nationality: "IND", rating: 62, battingRating: 62, bowlingRating: 8, price: 3 },
      { id: "marchant-de-lange-12", name: "Marchant de Lange", role: "BOWL", nationality: "OVERSEAS", rating: 74, battingRating: 18, bowlingRating: 74, price: 5 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MI 2013 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "mi-2013",
    team: "MI",
    season: 2013,
    players: [
      { id: "rohit-sharma-13", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 88, battingRating: 88, bowlingRating: 22, price: 11 },
      { id: "sachin-tendulkar-13", name: "Sachin Tendulkar", role: "BAT", nationality: "IND", rating: 86, battingRating: 86, bowlingRating: 15, price: 10 },
      { id: "lasith-malinga-13", name: "Lasith Malinga", role: "BOWL", nationality: "OVERSEAS", rating: 92, battingRating: 18, bowlingRating: 92, price: 16 },
      { id: "kieron-pollard-13", name: "Kieron Pollard", role: "AR", nationality: "OVERSEAS", rating: 88, battingRating: 84, bowlingRating: 78, price: 11 },
      { id: "harbhajan-singh-13", name: "Harbhajan Singh", role: "AR", nationality: "IND", rating: 80, battingRating: 58, bowlingRating: 82, price: 7 },
      { id: "dinesh-karthik-13", name: "Dinesh Karthik", role: "WK", nationality: "IND", rating: 80, battingRating: 78, bowlingRating: 10, price: 7 },
      { id: "ricky-ponting-13", name: "Ricky Ponting", role: "BAT", nationality: "OVERSEAS", rating: 82, battingRating: 82, bowlingRating: 15, price: 8 },
      { id: "aditya-tare-13", name: "Aditya Tare", role: "WK", nationality: "IND", rating: 66, battingRating: 64, bowlingRating: 8, price: 3 },
      { id: "ambati-rayudu-13", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 12, price: 6 },
      { id: "pragyan-ojha-13", name: "Pragyan Ojha", role: "BOWL", nationality: "IND", rating: 74, battingRating: 18, bowlingRating: 74, price: 5 },
      { id: "dhawal-kulkarni-13", name: "Dhawal Kulkarni", role: "BOWL", nationality: "IND", rating: 70, battingRating: 15, bowlingRating: 70, price: 4 },
      { id: "munaf-patel-13", name: "Munaf Patel", role: "BOWL", nationality: "IND", rating: 72, battingRating: 18, bowlingRating: 72, price: 4 },
      { id: "hardik-pandya-13", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 68, battingRating: 62, bowlingRating: 65, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // KKR 2014 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "kkr-2014",
    team: "KKR",
    season: 2014,
    players: [
      { id: "gautam-gambhir-14", name: "Gautam Gambhir", role: "BAT", nationality: "IND", rating: 86, battingRating: 86, bowlingRating: 8, price: 10 },
      { id: "sunil-narine-14", name: "Sunil Narine", role: "AR", nationality: "OVERSEAS", rating: 92, battingRating: 62, bowlingRating: 92, price: 16 },
      { id: "manish-pandey-14", name: "Manish Pandey", role: "BAT", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 10, price: 7 },
      { id: "robin-uthappa-14", name: "Robin Uthappa", role: "WK", nationality: "IND", rating: 86, battingRating: 84, bowlingRating: 12, price: 10 },
      { id: "yusuf-pathan-14", name: "Yusuf Pathan", role: "AR", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 62, price: 6 },
      { id: "ryan-ten-doeschate", name: "Ryan ten Doeschate", role: "AR", nationality: "OVERSEAS", rating: 76, battingRating: 72, bowlingRating: 72, price: 5 },
      { id: "brad-hogg-14", name: "Brad Hogg", role: "BOWL", nationality: "OVERSEAS", rating: 76, battingRating: 22, bowlingRating: 76, price: 5 },
      { id: "umesh-yadav-14", name: "Umesh Yadav", role: "BOWL", nationality: "IND", rating: 78, battingRating: 20, bowlingRating: 78, price: 6 },
      { id: "shakib-al-hasan-14", name: "Shakib Al Hasan", role: "AR", nationality: "OVERSEAS", rating: 82, battingRating: 72, bowlingRating: 80, price: 8 },
      { id: "piyush-chawla-14", name: "Piyush Chawla", role: "BOWL", nationality: "IND", rating: 72, battingRating: 30, bowlingRating: 72, price: 4 },
      { id: "morne-morkel-14", name: "Morne Morkel", role: "BOWL", nationality: "OVERSEAS", rating: 80, battingRating: 18, bowlingRating: 80, price: 7 },
      { id: "lakshmipathy-balaji-14", name: "L. Balaji", role: "BOWL", nationality: "IND", rating: 70, battingRating: 16, bowlingRating: 70, price: 4 },
      { id: "sachin-rana-14", name: "Sachindra Pandey", role: "BAT", nationality: "IND", rating: 62, battingRating: 62, bowlingRating: 10, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MI 2015 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "mi-2015",
    team: "MI",
    season: 2015,
    players: [
      { id: "rohit-sharma-15", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 90, battingRating: 90, bowlingRating: 22, price: 13 },
      { id: "lasith-malinga-15", name: "Lasith Malinga", role: "BOWL", nationality: "OVERSEAS", rating: 90, battingRating: 16, bowlingRating: 90, price: 13 },
      { id: "kieron-pollard-15", name: "Kieron Pollard", role: "AR", nationality: "OVERSEAS", rating: 88, battingRating: 85, bowlingRating: 78, price: 11 },
      { id: "harbhajan-singh-15", name: "Harbhajan Singh", role: "AR", nationality: "IND", rating: 78, battingRating: 55, bowlingRating: 80, price: 6 },
      { id: "lendl-simmons-15", name: "Lendl Simmons", role: "BAT", nationality: "OVERSEAS", rating: 82, battingRating: 82, bowlingRating: 15, price: 8 },
      { id: "corey-anderson-15", name: "Corey Anderson", role: "AR", nationality: "OVERSEAS", rating: 80, battingRating: 76, bowlingRating: 74, price: 7 },
      { id: "ambati-rayudu-15", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 12, price: 7 },
      { id: "aditya-tare-15", name: "Aditya Tare", role: "WK", nationality: "IND", rating: 68, battingRating: 66, bowlingRating: 8, price: 3 },
      { id: "hardik-pandya-15", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 76, battingRating: 70, bowlingRating: 72, price: 5 },
      { id: "mitchell-mcclenaghan-15", name: "Mitchell McClenaghan", role: "BOWL", nationality: "OVERSEAS", rating: 78, battingRating: 14, bowlingRating: 78, price: 6 },
      { id: "shreyas-gopal-15", name: "Shreyas Gopal", role: "BOWL", nationality: "IND", rating: 66, battingRating: 22, bowlingRating: 66, price: 3 },
      { id: "jasprit-bumrah-15", name: "Jasprit Bumrah", role: "BOWL", nationality: "IND", rating: 84, battingRating: 10, bowlingRating: 84, price: 9 },
      { id: "unmukt-chand-15", name: "Unmukt Chand", role: "BAT", nationality: "IND", rating: 64, battingRating: 64, bowlingRating: 8, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SRH 2016 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "srh-2016",
    team: "SRH",
    season: 2016,
    players: [
      { id: "david-warner-16", name: "David Warner", role: "BAT", nationality: "OVERSEAS", rating: 94, battingRating: 94, bowlingRating: 15, price: 17 },
      { id: "shikhar-dhawan-16", name: "Shikhar Dhawan", role: "BAT", nationality: "IND", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "kane-williamson-16", name: "Kane Williamson", role: "BAT", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 25, price: 10 },
      { id: "ben-cutting-16", name: "Ben Cutting", role: "AR", nationality: "OVERSEAS", rating: 76, battingRating: 72, bowlingRating: 70, price: 5 },
      { id: "naman-ojha-16", name: "Naman Ojha", role: "WK", nationality: "IND", rating: 72, battingRating: 70, bowlingRating: 8, price: 4 },
      { id: "deepak-hooda-16", name: "Deepak Hooda", role: "AR", nationality: "IND", rating: 72, battingRating: 70, bowlingRating: 65, price: 4 },
      { id: "yuvraj-singh-16", name: "Yuvraj Singh", role: "BAT", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 42, price: 7 },
      { id: "rashid-khan-16", name: "Rashid Khan", role: "BOWL", nationality: "OVERSEAS", rating: 88, battingRating: 45, bowlingRating: 88, price: 11 },
      { id: "bhuvneshwar-kumar-16", name: "Bhuvneshwar Kumar", role: "BOWL", nationality: "IND", rating: 88, battingRating: 30, bowlingRating: 88, price: 11 },
      { id: "barinder-sran-16", name: "Barinder Sran", role: "BOWL", nationality: "IND", rating: 72, battingRating: 15, bowlingRating: 72, price: 4 },
      { id: "mustafizur-rahman-16", name: "Mustafizur Rahman", role: "BOWL", nationality: "OVERSEAS", rating: 86, battingRating: 14, bowlingRating: 86, price: 10 },
      { id: "ashish-reddy-16", name: "Ashish Reddy", role: "AR", nationality: "IND", rating: 68, battingRating: 62, bowlingRating: 64, price: 3 },
      { id: "moises-henriques-16", name: "Moises Henriques", role: "AR", nationality: "OVERSEAS", rating: 74, battingRating: 68, bowlingRating: 68, price: 5 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // RCB 2016 — The legendary but unlucky team
  // ─────────────────────────────────────────────────────────────────
  {
    id: "rcb-2016",
    team: "RCB",
    season: 2016,
    players: [
      { id: "virat-kohli-16", name: "Virat Kohli", role: "BAT", nationality: "IND", rating: 98, battingRating: 98, bowlingRating: 18, price: 20 },
      { id: "ab-devilliers-16", name: "AB de Villiers", role: "WK", nationality: "OVERSEAS", rating: 96, battingRating: 96, bowlingRating: 10, price: 19 },
      { id: "chris-gayle-16", name: "Chris Gayle", role: "BAT", nationality: "OVERSEAS", rating: 90, battingRating: 90, bowlingRating: 38, price: 13 },
      { id: "shane-watson-16", name: "Shane Watson", role: "AR", nationality: "OVERSEAS", rating: 80, battingRating: 78, bowlingRating: 72, price: 7 },
      { id: "kl-rahul-16", name: "KL Rahul", role: "WK", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 8, price: 7 },
      { id: "sachin-baby-16", name: "Sachin Baby", role: "BAT", nationality: "IND", rating: 66, battingRating: 66, bowlingRating: 8, price: 3 },
      { id: "iqbal-abdulla-16", name: "Iqbal Abdulla", role: "BOWL", nationality: "IND", rating: 68, battingRating: 20, bowlingRating: 68, price: 3 },
      { id: "yuzvendra-chahal-16", name: "Yuzvendra Chahal", role: "BOWL", nationality: "IND", rating: 84, battingRating: 18, bowlingRating: 84, price: 9 },
      { id: "samuel-badree-16", name: "Samuel Badree", role: "BOWL", nationality: "OVERSEAS", rating: 74, battingRating: 12, bowlingRating: 74, price: 5 },
      { id: "pawan-negi-16", name: "Pawan Negi", role: "AR", nationality: "IND", rating: 70, battingRating: 58, bowlingRating: 68, price: 4 },
      { id: "adam-milne-16", name: "Adam Milne", role: "BOWL", nationality: "OVERSEAS", rating: 74, battingRating: 12, bowlingRating: 74, price: 5 },
      { id: "stuart-binny-16", name: "Stuart Binny", role: "AR", nationality: "IND", rating: 68, battingRating: 62, bowlingRating: 64, price: 3 },
      { id: "kedar-jadhav-16", name: "Kedar Jadhav", role: "AR", nationality: "IND", rating: 74, battingRating: 72, bowlingRating: 60, price: 5 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MI 2017 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "mi-2017",
    team: "MI",
    season: 2017,
    players: [
      { id: "rohit-sharma-17", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 90, battingRating: 90, bowlingRating: 22, price: 13 },
      { id: "lasith-malinga-17", name: "Lasith Malinga", role: "BOWL", nationality: "OVERSEAS", rating: 88, battingRating: 14, bowlingRating: 88, price: 11 },
      { id: "kieron-pollard-17", name: "Kieron Pollard", role: "AR", nationality: "OVERSEAS", rating: 86, battingRating: 83, bowlingRating: 76, price: 10 },
      { id: "hardik-pandya-17", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 86, battingRating: 80, bowlingRating: 80, price: 10 },
      { id: "jasprit-bumrah-17", name: "Jasprit Bumrah", role: "BOWL", nationality: "IND", rating: 90, battingRating: 10, bowlingRating: 90, price: 13 },
      { id: "jos-buttler-17", name: "Jos Buttler", role: "WK", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 10, price: 10 },
      { id: "lendl-simmons-17", name: "Lendl Simmons", role: "BAT", nationality: "OVERSEAS", rating: 80, battingRating: 80, bowlingRating: 12, price: 7 },
      { id: "krunal-pandya-17", name: "Krunal Pandya", role: "AR", nationality: "IND", rating: 78, battingRating: 72, bowlingRating: 74, price: 6 },
      { id: "ambati-rayudu-17", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 12, price: 6 },
      { id: "nitish-rana-17", name: "Nitish Rana", role: "BAT", nationality: "IND", rating: 72, battingRating: 72, bowlingRating: 15, price: 4 },
      { id: "mitchell-mcclenaghan-17", name: "Mitchell McClenaghan", role: "BOWL", nationality: "OVERSEAS", rating: 76, battingRating: 12, bowlingRating: 76, price: 5 },
      { id: "harbhajan-singh-17", name: "Harbhajan Singh", role: "AR", nationality: "IND", rating: 75, battingRating: 52, bowlingRating: 78, price: 5 },
      { id: "rahul-chahar-17", name: "Rahul Chahar", role: "BOWL", nationality: "IND", rating: 70, battingRating: 14, bowlingRating: 70, price: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CSK 2018 — Champions (after 2-year ban)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "csk-2018",
    team: "CSK",
    season: 2018,
    players: [
      { id: "ms-dhoni-18", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 90, battingRating: 88, bowlingRating: 15, price: 13 },
      { id: "suresh-raina-18", name: "Suresh Raina", role: "BAT", nationality: "IND", rating: 82, battingRating: 82, bowlingRating: 40, price: 8 },
      { id: "shane-watson-18", name: "Shane Watson", role: "AR", nationality: "OVERSEAS", rating: 84, battingRating: 82, bowlingRating: 70, price: 9 },
      { id: "ambati-rayudu-18", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 82, battingRating: 82, bowlingRating: 12, price: 8 },
      { id: "sam-billings-18", name: "Sam Billings", role: "WK", nationality: "OVERSEAS", rating: 74, battingRating: 72, bowlingRating: 10, price: 5 },
      { id: "dwayne-bravo-18", name: "Dwayne Bravo", role: "AR", nationality: "OVERSEAS", rating: 84, battingRating: 74, bowlingRating: 82, price: 9 },
      { id: "faf-du-plessis-18", name: "Faf du Plessis", role: "BAT", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 12, price: 9 },
      { id: "deepak-chahar-18", name: "Deepak Chahar", role: "AR", nationality: "IND", rating: 78, battingRating: 44, bowlingRating: 78, price: 6 },
      { id: "ravindra-jadeja-18", name: "Ravindra Jadeja", role: "AR", nationality: "IND", rating: 86, battingRating: 74, bowlingRating: 84, price: 10 },
      { id: "imran-tahir-18", name: "Imran Tahir", role: "BOWL", nationality: "OVERSEAS", rating: 84, battingRating: 12, bowlingRating: 84, price: 9 },
      { id: "shardul-thakur-18", name: "Shardul Thakur", role: "AR", nationality: "IND", rating: 74, battingRating: 56, bowlingRating: 74, price: 5 },
      { id: "mark-wood-18", name: "Mark Wood", role: "BOWL", nationality: "OVERSEAS", rating: 76, battingRating: 14, bowlingRating: 76, price: 5 },
      { id: "karn-sharma-18", name: "Karn Sharma", role: "BOWL", nationality: "IND", rating: 70, battingRating: 20, bowlingRating: 70, price: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MI 2019 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "mi-2019",
    team: "MI",
    season: 2019,
    players: [
      { id: "rohit-sharma-19", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 92, battingRating: 92, bowlingRating: 20, price: 16 },
      { id: "jasprit-bumrah-19", name: "Jasprit Bumrah", role: "BOWL", nationality: "IND", rating: 95, battingRating: 10, bowlingRating: 95, price: 18 },
      { id: "kieron-pollard-19", name: "Kieron Pollard", role: "AR", nationality: "OVERSEAS", rating: 88, battingRating: 84, bowlingRating: 76, price: 11 },
      { id: "hardik-pandya-19", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 88, battingRating: 82, bowlingRating: 82, price: 11 },
      { id: "krunal-pandya-19", name: "Krunal Pandya", role: "AR", nationality: "IND", rating: 80, battingRating: 72, bowlingRating: 78, price: 7 },
      { id: "quinton-de-kock-19", name: "Quinton de Kock", role: "WK", nationality: "OVERSEAS", rating: 88, battingRating: 88, bowlingRating: 10, price: 11 },
      { id: "lasith-malinga-19", name: "Lasith Malinga", role: "BOWL", nationality: "OVERSEAS", rating: 85, battingRating: 12, bowlingRating: 85, price: 10 },
      { id: "suryakumar-yadav-19", name: "Suryakumar Yadav", role: "BAT", nationality: "IND", rating: 82, battingRating: 82, bowlingRating: 12, price: 8 },
      { id: "alzarri-joseph-19", name: "Alzarri Joseph", role: "BOWL", nationality: "OVERSEAS", rating: 80, battingRating: 14, bowlingRating: 80, price: 7 },
      { id: "ishan-kishan-19", name: "Ishan Kishan", role: "WK", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 10, price: 5 },
      { id: "jason-behrendorff-19", name: "Jason Behrendorff", role: "BOWL", nationality: "OVERSEAS", rating: 74, battingRating: 10, bowlingRating: 74, price: 5 },
      { id: "rahul-chahar-19", name: "Rahul Chahar", role: "BOWL", nationality: "IND", rating: 76, battingRating: 14, bowlingRating: 76, price: 5 },
      { id: "yohan-blake-19", name: "Yohan Blake", role: "BAT", nationality: "OVERSEAS", rating: 64, battingRating: 64, bowlingRating: 10, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MI 2020 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "mi-2020",
    team: "MI",
    season: 2020,
    players: [
      { id: "rohit-sharma-20", name: "Rohit Sharma", role: "BAT", nationality: "IND", rating: 92, battingRating: 92, bowlingRating: 20, price: 16 },
      { id: "jasprit-bumrah-20", name: "Jasprit Bumrah", role: "BOWL", nationality: "IND", rating: 95, battingRating: 10, bowlingRating: 95, price: 18 },
      { id: "kieron-pollard-20", name: "Kieron Pollard", role: "AR", nationality: "OVERSEAS", rating: 87, battingRating: 84, bowlingRating: 74, price: 10 },
      { id: "hardik-pandya-20", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 90, battingRating: 84, bowlingRating: 84, price: 13 },
      { id: "suryakumar-yadav-20", name: "Suryakumar Yadav", role: "BAT", nationality: "IND", rating: 86, battingRating: 86, bowlingRating: 12, price: 10 },
      { id: "quinton-de-kock-20", name: "Quinton de Kock", role: "WK", nationality: "OVERSEAS", rating: 88, battingRating: 88, bowlingRating: 10, price: 11 },
      { id: "krunal-pandya-20", name: "Krunal Pandya", role: "AR", nationality: "IND", rating: 78, battingRating: 70, bowlingRating: 76, price: 6 },
      { id: "ishan-kishan-20", name: "Ishan Kishan", role: "WK", nationality: "IND", rating: 80, battingRating: 80, bowlingRating: 10, price: 7 },
      { id: "trent-boult-20", name: "Trent Boult", role: "BOWL", nationality: "OVERSEAS", rating: 90, battingRating: 14, bowlingRating: 90, price: 13 },
      { id: "rahul-chahar-20", name: "Rahul Chahar", role: "BOWL", nationality: "IND", rating: 78, battingRating: 14, bowlingRating: 78, price: 6 },
      { id: "nathan-coulter-nile-20", name: "Nathan Coulter-Nile", role: "AR", nationality: "OVERSEAS", rating: 76, battingRating: 64, bowlingRating: 74, price: 5 },
      { id: "james-pattinson-20", name: "James Pattinson", role: "BOWL", nationality: "OVERSEAS", rating: 78, battingRating: 14, bowlingRating: 78, price: 6 },
      { id: "jayant-yadav-20", name: "Jayant Yadav", role: "AR", nationality: "IND", rating: 68, battingRating: 50, bowlingRating: 66, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CSK 2021 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "csk-2021",
    team: "CSK",
    season: 2021,
    players: [
      { id: "ms-dhoni-21", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 88, battingRating: 85, bowlingRating: 15, price: 11 },
      { id: "faf-du-plessis-21", name: "Faf du Plessis", role: "BAT", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 12, price: 10 },
      { id: "ruturaj-gaikwad-21", name: "Ruturaj Gaikwad", role: "BAT", nationality: "IND", rating: 84, battingRating: 84, bowlingRating: 8, price: 9 },
      { id: "moeen-ali-21", name: "Moeen Ali", role: "AR", nationality: "OVERSEAS", rating: 84, battingRating: 78, bowlingRating: 80, price: 9 },
      { id: "suresh-raina-21", name: "Suresh Raina", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 38, price: 6 },
      { id: "ravindra-jadeja-21", name: "Ravindra Jadeja", role: "AR", nationality: "IND", rating: 90, battingRating: 78, bowlingRating: 88, price: 13 },
      { id: "dwayne-bravo-21", name: "Dwayne Bravo", role: "AR", nationality: "OVERSEAS", rating: 82, battingRating: 72, bowlingRating: 80, price: 8 },
      { id: "deepak-chahar-21", name: "Deepak Chahar", role: "AR", nationality: "IND", rating: 82, battingRating: 48, bowlingRating: 82, price: 8 },
      { id: "imran-tahir-21", name: "Imran Tahir", role: "BOWL", nationality: "OVERSEAS", rating: 80, battingRating: 10, bowlingRating: 80, price: 7 },
      { id: "shardul-thakur-21", name: "Shardul Thakur", role: "AR", nationality: "IND", rating: 78, battingRating: 60, bowlingRating: 78, price: 6 },
      { id: "josh-hazlewood-21", name: "Josh Hazlewood", role: "BOWL", nationality: "OVERSEAS", rating: 86, battingRating: 12, bowlingRating: 86, price: 10 },
      { id: "karn-sharma-21", name: "Karn Sharma", role: "BOWL", nationality: "IND", rating: 68, battingRating: 18, bowlingRating: 68, price: 3 },
      { id: "ambati-rayudu-21", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 10, price: 6 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // GT 2022 — Champions (debut season!)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "gt-2022",
    team: "GT",
    season: 2022,
    players: [
      { id: "hardik-pandya-22", name: "Hardik Pandya", role: "AR", nationality: "IND", rating: 90, battingRating: 82, bowlingRating: 84, price: 13 },
      { id: "shubman-gill-22", name: "Shubman Gill", role: "BAT", nationality: "IND", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "rashid-khan-22", name: "Rashid Khan", role: "BOWL", nationality: "OVERSEAS", rating: 94, battingRating: 52, bowlingRating: 94, price: 17 },
      { id: "david-miller-22", name: "David Miller", role: "BAT", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "wriddhiman-saha-22", name: "Wriddhiman Saha", role: "WK", nationality: "IND", rating: 78, battingRating: 76, bowlingRating: 10, price: 6 },
      { id: "jason-roy-22", name: "Jason Roy", role: "BAT", nationality: "OVERSEAS", rating: 80, battingRating: 80, bowlingRating: 10, price: 7 },
      { id: "lockie-ferguson-22", name: "Lockie Ferguson", role: "BOWL", nationality: "OVERSEAS", rating: 84, battingRating: 10, bowlingRating: 84, price: 9 },
      { id: "rahul-tewatia-22", name: "Rahul Tewatia", role: "AR", nationality: "IND", rating: 78, battingRating: 72, bowlingRating: 70, price: 6 },
      { id: "mohammed-shami-22", name: "Mohammed Shami", role: "BOWL", nationality: "IND", rating: 88, battingRating: 18, bowlingRating: 88, price: 11 },
      { id: "alzarri-joseph-22", name: "Alzarri Joseph", role: "BOWL", nationality: "OVERSEAS", rating: 80, battingRating: 12, bowlingRating: 80, price: 7 },
      { id: "abhinav-manohar-22", name: "Abhinav Manohar", role: "BAT", nationality: "IND", rating: 72, battingRating: 72, bowlingRating: 8, price: 4 },
      { id: "jayant-yadav-22", name: "Jayant Yadav", role: "AR", nationality: "IND", rating: 68, battingRating: 50, bowlingRating: 66, price: 3 },
      { id: "vijay-shankar-22", name: "Vijay Shankar", role: "AR", nationality: "IND", rating: 70, battingRating: 64, bowlingRating: 66, price: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // LSG 2022 — Debut season
  // ─────────────────────────────────────────────────────────────────
  {
    id: "lsg-2022",
    team: "LSG",
    season: 2022,
    players: [
      { id: "kl-rahul-22", name: "KL Rahul", role: "WK", nationality: "IND", rating: 90, battingRating: 90, bowlingRating: 8, price: 13 },
      { id: "quinton-de-kock-22", name: "Quinton de Kock", role: "WK", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 10, price: 10 },
      { id: "evin-lewis-22", name: "Evin Lewis", role: "BAT", nationality: "OVERSEAS", rating: 78, battingRating: 78, bowlingRating: 10, price: 6 },
      { id: "manish-pandey-22", name: "Manish Pandey", role: "BAT", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 10, price: 5 },
      { id: "deepak-hooda-22", name: "Deepak Hooda", role: "AR", nationality: "IND", rating: 78, battingRating: 74, bowlingRating: 68, price: 6 },
      { id: "krunal-pandya-22", name: "Krunal Pandya", role: "AR", nationality: "IND", rating: 78, battingRating: 72, bowlingRating: 76, price: 6 },
      { id: "jason-holder-22", name: "Jason Holder", role: "AR", nationality: "OVERSEAS", rating: 82, battingRating: 72, bowlingRating: 80, price: 8 },
      { id: "avesh-khan-22", name: "Avesh Khan", role: "BOWL", nationality: "IND", rating: 80, battingRating: 14, bowlingRating: 80, price: 7 },
      { id: "mark-wood-22", name: "Mark Wood", role: "BOWL", nationality: "OVERSEAS", rating: 82, battingRating: 12, bowlingRating: 82, price: 8 },
      { id: "ravi-bishnoi-22", name: "Ravi Bishnoi", role: "BOWL", nationality: "IND", rating: 78, battingRating: 16, bowlingRating: 78, price: 6 },
      { id: "andrew-tye-22", name: "Andrew Tye", role: "BOWL", nationality: "OVERSEAS", rating: 74, battingRating: 12, bowlingRating: 74, price: 5 },
      { id: "dushmantha-chameera-22", name: "Dushmantha Chameera", role: "BOWL", nationality: "OVERSEAS", rating: 76, battingRating: 12, bowlingRating: 76, price: 5 },
      { id: "mohsin-khan-22", name: "Mohsin Khan", role: "BOWL", nationality: "IND", rating: 74, battingRating: 10, bowlingRating: 74, price: 5 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CSK 2023 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "csk-2023",
    team: "CSK",
    season: 2023,
    players: [
      { id: "ms-dhoni-23", name: "MS Dhoni", role: "WK", nationality: "IND", rating: 87, battingRating: 84, bowlingRating: 15, price: 10 },
      { id: "ruturaj-gaikwad-23", name: "Ruturaj Gaikwad", role: "BAT", nationality: "IND", rating: 88, battingRating: 88, bowlingRating: 8, price: 11 },
      { id: "devon-conway-23", name: "Devon Conway", role: "WK", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 8, price: 9 },
      { id: "ajinkya-rahane-23", name: "Ajinkya Rahane", role: "BAT", nationality: "IND", rating: 78, battingRating: 78, bowlingRating: 8, price: 6 },
      { id: "moeen-ali-23", name: "Moeen Ali", role: "AR", nationality: "OVERSEAS", rating: 82, battingRating: 76, bowlingRating: 78, price: 8 },
      { id: "ravindra-jadeja-23", name: "Ravindra Jadeja", role: "AR", nationality: "IND", rating: 91, battingRating: 80, bowlingRating: 90, price: 15 },
      { id: "shivam-dube-23", name: "Shivam Dube", role: "AR", nationality: "IND", rating: 78, battingRating: 76, bowlingRating: 68, price: 6 },
      { id: "ambati-rayudu-23", name: "Ambati Rayudu", role: "BAT", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 10, price: 5 },
      { id: "deepak-chahar-23", name: "Deepak Chahar", role: "AR", nationality: "IND", rating: 80, battingRating: 46, bowlingRating: 80, price: 7 },
      { id: "tushar-deshpande-23", name: "Tushar Deshpande", role: "BOWL", nationality: "IND", rating: 74, battingRating: 14, bowlingRating: 74, price: 5 },
      { id: "ben-stokes-23", name: "Ben Stokes", role: "AR", nationality: "OVERSEAS", rating: 82, battingRating: 78, bowlingRating: 76, price: 8 },
      { id: "matheesha-pathirana-23", name: "Matheesha Pathirana", role: "BOWL", nationality: "OVERSEAS", rating: 82, battingRating: 10, bowlingRating: 82, price: 8 },
      { id: "simarjeet-singh-23", name: "Simarjeet Singh", role: "BOWL", nationality: "IND", rating: 68, battingRating: 12, bowlingRating: 68, price: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // KKR 2024 — Champions
  // ─────────────────────────────────────────────────────────────────
  {
    id: "kkr-2024",
    team: "KKR",
    season: 2024,
    players: [
      { id: "shreyas-iyer-24", name: "Shreyas Iyer", role: "BAT", nationality: "IND", rating: 86, battingRating: 86, bowlingRating: 10, price: 10 },
      { id: "sunil-narine-24", name: "Sunil Narine", role: "AR", nationality: "OVERSEAS", rating: 90, battingRating: 76, bowlingRating: 90, price: 13 },
      { id: "venkatesh-iyer-24", name: "Venkatesh Iyer", role: "AR", nationality: "IND", rating: 80, battingRating: 78, bowlingRating: 68, price: 7 },
      { id: "phil-salt-24", name: "Phil Salt", role: "WK", nationality: "OVERSEAS", rating: 86, battingRating: 86, bowlingRating: 10, price: 10 },
      { id: "rahmanullah-gurbaz-24", name: "Rahmanullah Gurbaz", role: "WK", nationality: "OVERSEAS", rating: 82, battingRating: 82, bowlingRating: 10, price: 8 },
      { id: "angkrish-raghuvanshi-24", name: "Angkrish Raghuvanshi", role: "BAT", nationality: "IND", rating: 74, battingRating: 74, bowlingRating: 8, price: 5 },
      { id: "rinku-singh-24", name: "Rinku Singh", role: "BAT", nationality: "IND", rating: 82, battingRating: 82, bowlingRating: 8, price: 8 },
      { id: "andre-russell-24", name: "Andre Russell", role: "AR", nationality: "OVERSEAS", rating: 90, battingRating: 86, bowlingRating: 80, price: 13 },
      { id: "mitchell-starc-24", name: "Mitchell Starc", role: "BOWL", nationality: "OVERSEAS", rating: 88, battingRating: 18, bowlingRating: 88, price: 11 },
      { id: "varun-chakravarthy-24", name: "Varun Chakravarthy", role: "BOWL", nationality: "IND", rating: 82, battingRating: 16, bowlingRating: 82, price: 8 },
      { id: "harshit-rana-24", name: "Harshit Rana", role: "BOWL", nationality: "IND", rating: 76, battingRating: 16, bowlingRating: 76, price: 5 },
      { id: "ramandeep-singh-24", name: "Ramandeep Singh", role: "AR", nationality: "IND", rating: 72, battingRating: 68, bowlingRating: 64, price: 4 },
      { id: "suyash-sharma-24", name: "Suyash Sharma", role: "BOWL", nationality: "IND", rating: 72, battingRating: 12, bowlingRating: 72, price: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // RCB 2025 — Champions (finally!)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "rcb-2025",
    team: "RCB",
    season: 2025,
    players: [
      { id: "virat-kohli-25", name: "Virat Kohli", role: "BAT", nationality: "IND", rating: 94, battingRating: 94, bowlingRating: 18, price: 17 },
      { id: "phil-salt-25", name: "Phil Salt", role: "WK", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "rajat-patidar-25", name: "Rajat Patidar", role: "BAT", nationality: "IND", rating: 82, battingRating: 82, bowlingRating: 8, price: 8 },
      { id: "liam-livingstone-25", name: "Liam Livingstone", role: "AR", nationality: "OVERSEAS", rating: 84, battingRating: 82, bowlingRating: 74, price: 9 },
      { id: "tim-david-25", name: "Tim David", role: "BAT", nationality: "OVERSEAS", rating: 84, battingRating: 84, bowlingRating: 10, price: 9 },
      { id: "jitesh-sharma-25", name: "Jitesh Sharma", role: "WK", nationality: "IND", rating: 76, battingRating: 76, bowlingRating: 8, price: 5 },
      { id: "krunal-pandya-25", name: "Krunal Pandya", role: "AR", nationality: "IND", rating: 78, battingRating: 70, bowlingRating: 76, price: 6 },
      { id: "bhuvneshwar-kumar-25", name: "Bhuvneshwar Kumar", role: "BOWL", nationality: "IND", rating: 84, battingRating: 28, bowlingRating: 84, price: 9 },
      { id: "josh-hazlewood-25", name: "Josh Hazlewood", role: "BOWL", nationality: "OVERSEAS", rating: 86, battingRating: 10, bowlingRating: 86, price: 10 },
      { id: "yash-dayal-25", name: "Yash Dayal", role: "BOWL", nationality: "IND", rating: 76, battingRating: 12, bowlingRating: 76, price: 5 },
      { id: "nuwan-thushara-25", name: "Nuwan Thushara", role: "BOWL", nationality: "OVERSEAS", rating: 78, battingRating: 10, bowlingRating: 78, price: 6 },
      { id: "swapnil-singh-25", name: "Swapnil Singh", role: "AR", nationality: "IND", rating: 70, battingRating: 58, bowlingRating: 68, price: 4 },
      { id: "suyash-prabhudessai-25", name: "Suyash Prabhudessai", role: "BAT", nationality: "IND", rating: 70, battingRating: 70, bowlingRating: 8, price: 4 },
    ],
  },
];

export default HISTORICAL_TEAMS;
