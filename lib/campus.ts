/**
 * Static campus reference content.
 *
 * This is sample/illustrative data for the demo. Room numbers, timings and
 * contacts are placeholders — check official Bennett University sources for
 * current details.
 */

export const CAMPUS = {
  name: "Bennett University",
  addressLines: [
    "Plot Nos 8-11, TechZone II",
    "Greater Noida, Uttar Pradesh 201310",
  ],
  // Approximate campus centre, used for the embedded map.
  lat: 28.4498,
  lng: 77.5846,
};

export type CampusPlace = {
  key: string;
  name: string;
  kind: "academic" | "residence" | "sport" | "food" | "service" | "landmark";
  blurb: string;
};

export const CAMPUS_PLACES: CampusPlace[] = [
  {
    key: "n-block",
    name: "N Block (Academic)",
    kind: "academic",
    blurb: "Lecture theatres, School of Engineering and Applied Sciences labs.",
  },
  {
    key: "lrc",
    name: "Learning Resource Centre (LRC)",
    kind: "academic",
    blurb: "The library building — study floors, reading rooms, and archives.",
  },
  {
    key: "admin",
    name: "Administration Block",
    kind: "service",
    blurb: "Registrar, admissions, accounts, and the student services desk.",
  },
  {
    key: "boys-hostel",
    name: "Boys' Hostel",
    kind: "residence",
    blurb: "Residence blocks with mess, common rooms, and 24x7 security.",
  },
  {
    key: "girls-hostel",
    name: "Girls' Hostel",
    kind: "residence",
    blurb: "Residence blocks with mess, common rooms, and 24x7 security.",
  },
  {
    key: "sports-complex",
    name: "Sports Complex",
    kind: "sport",
    blurb: "Cricket and football grounds, indoor courts, gym, and pool.",
  },
  {
    key: "food-court",
    name: "Food Court",
    kind: "food",
    blurb: "Multiple outlets, open through the day and late evening.",
  },
  {
    key: "medical",
    name: "Medical Centre",
    kind: "service",
    blurb: "On-campus infirmary with a doctor on call and an ambulance.",
  },
  {
    key: "times-square",
    name: "Times Square (Central Plaza)",
    kind: "landmark",
    blurb: "The main open plaza where most fests and stalls are set up.",
  },
];

export const HOSTEL_INFO = {
  intro:
    "On-campus residence is available to enrolled students. Rooms are allotted for the academic year; the residence desk handles allotment, room changes, and maintenance requests.",
  roomTypes: [
    { name: "Triple sharing", note: "Bed, desk, and wardrobe per student; shared bathroom on the floor." },
    { name: "Double sharing", note: "Two students per room, attached or shared bathroom." },
    { name: "Single occupancy", note: "Limited availability, allotted by request and seniority." },
  ],
  mess: [
    { meal: "Breakfast", time: "7:30 – 9:30 am" },
    { meal: "Lunch", time: "12:30 – 2:30 pm" },
    { meal: "Snacks", time: "5:00 – 6:00 pm" },
    { meal: "Dinner", time: "8:00 – 10:00 pm" },
  ],
  rules: [
    "Carry your student ID; entry to hostel blocks is card-controlled.",
    "In-time for the main gate is 10:30 pm unless you have an approved late pass.",
    "Guests are received in the visitor lounge only, until 7:00 pm.",
    "Report maintenance issues through the residence desk or the app noticeboard.",
    "Cooking appliances and heaters are not allowed in rooms.",
  ],
  contacts: [
    { role: "Chief Warden", detail: "warden@campus.edu · Admin Block, Room 004" },
    { role: "Residence Desk", detail: "residence@campus.edu · open 9 am – 8 pm" },
    { role: "Security (24x7)", detail: "Main gate control room" },
  ],
};

export const LIBRARY_INFO = {
  intro:
    "The library sits inside the Learning Resource Centre. It holds the print collection, subscribes to the major research databases, and runs the borrowing service and study rooms.",
  hours: [
    { day: "Monday – Friday", time: "8:00 am – 12:00 midnight" },
    { day: "Saturday – Sunday", time: "9:00 am – 8:00 pm" },
    { day: "Exam season", time: "Open 24 hours (announced each term)" },
  ],
  borrowing: [
    "Undergraduates may borrow up to 6 items for 14 days.",
    "Postgraduates and research scholars: up to 10 items for 30 days.",
    "Renew online up to twice if no one has reserved the item.",
    "Reference books, journals, and the reserve collection are library-use only.",
    "Overdue items accrue a small daily fine; settle it at the circulation desk.",
  ],
  eResources: [
    "IEEE Xplore",
    "ACM Digital Library",
    "ScienceDirect (Elsevier)",
    "SpringerLink",
    "JSTOR",
    "Scopus & Web of Science",
    "O'Reilly / Safari learning platform",
    "Turnitin (via faculty)",
  ],
  studyRooms:
    "Group study rooms on the upper floors can be booked for two hours at a time at the circulation desk. Silent reading rooms need no booking.",
};

export const LRC_INFO = {
  intro:
    "The Learning Resource Centre (LRC) is the library and study building. Access is by student ID card; the turnstiles at the entrance log entry and exit.",
  access: [
    "Tap your student ID at the entrance turnstile. Lost card? Get a temporary pass from the desk with a second photo ID.",
    "Alumni and visitors need a day pass issued at the front desk.",
    "Bags go on the racks near the entrance; laptops and valuables stay with you.",
  ],
  floorGuide: [
    { floor: "Ground", use: "Circulation desk, new arrivals, newspapers, help desk." },
    { floor: "First", use: "General collection, silent reading room, individual carrels." },
    { floor: "Second", use: "Reference and research collection, databases lab, group study rooms." },
    { floor: "Third", use: "Archives, thesis collection, and the discussion commons." },
  ],
  facilities: [
    "Wi-Fi throughout; power points at every desk.",
    "Print, scan, and photocopy stations on the ground and first floors (pay from your student account).",
    "Water points on each floor; a small café adjoins the ground floor.",
    "Accessibility: lift access to all floors, and assistive-tech workstations on the second floor.",
  ],
  etiquette:
    "First floor and above are silent zones. Take calls in the stairwells or ground-floor lobby. Re-shelve nothing — leave used books on the trolleys.",
};
