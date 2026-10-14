// All site content lives here — a single source of truth for services, fees,
// opening hours and contact details, taken from the current ranelaghsurgery.com
// (Eircode and rating from the practice's Google Maps listing, checked 14 Oct 2026).

export const clinic = {
  name: 'Ranelagh Surgery',
  doctor: 'Dr Shahram Nikrow',
  founded: 2005,
  phone: '01 497 1747',
  phoneHref: 'tel:+35314971747',
  fax: '01 497 1748',
  email: 'ranelaghsurgery@gmail.com',
  addressLines: ['32 Dunville Avenue', 'Ranelagh, Dublin 6', 'D06 NR77'],
  addressText: '32 Dunville Avenue, Ranelagh, Dublin 6, D06 NR77',
  mapsUrl: 'https://maps.google.com/?cid=16150278489711603271',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ranelagh+Surgery+32+Dunville+Avenue+Dublin+6+D06+NR77',
  mapEmbed: 'https://www.google.com/maps?q=Ranelagh+Surgery,+32+Dunville+Avenue,+Ranelagh,+Dublin+6&z=16&output=embed',
  rating: { score: '4.5', count: 41, source: 'Google' },
  officialSite: 'https://ranelaghsurgery.com',
};

// Two appointment sessions a day, by appointment. day: 0 = Sunday … 6 = Saturday.
// Times in minutes after midnight (Irish time).
const weekday = [
  { name: 'Morning clinic', text: '10am – 1.30pm', open: 600, close: 810 },
  { name: 'Evening clinic', text: '4pm – 6.30pm', open: 960, close: 1110 },
];
export const hours = [
  { day: 1, label: 'Monday', sessions: weekday },
  { day: 2, label: 'Tuesday', sessions: weekday },
  { day: 3, label: 'Wednesday', sessions: weekday },
  { day: 4, label: 'Thursday', sessions: weekday },
  { day: 5, label: 'Friday', sessions: weekday },
  { day: 6, label: 'Saturday', sessions: [], note: 'Suspended until further notice' },
  { day: 0, label: 'Sunday', sessions: [], note: 'Closed' },
];

// Out-of-hours services listed on the current site, for registered patients.
export const outOfHours = [
  {
    name: 'Luke Doc',
    phone: '01 669 9499', phoneHref: 'tel:+35316699499',
    when: ['Monday – Friday, 6.30pm – 10pm', 'Saturday, Sunday and public holidays, 10am – 6pm'],
    where: 'Clonskeagh Gate House, Clonskeagh Hospital, Vergemount Hall, Dublin 6',
    fee: 'Visit €80. Free with a medical card or GP visit card (please bring your card).',
    price: '€80', free: 'Visit fee. Free with a medical card or GP visit card (please bring your card).',
  },
  {
    name: 'GP 24',
    phone: '01 518 0808', phoneHref: 'tel:+35315180808',
    when: ['24-hour phone consultations and house calls', 'Please only call if it is essential'],
    fee: 'House call €110 for private patients. Free with a medical card or GP visit card.',
    price: '€110', free: 'House call for private patients. Free with a medical card or GP visit card.',
  },
];

export const nav = [
  { label: 'Home', path: '' },
  { label: 'About', path: 'about' },
  { label: 'Services', path: 'services' },
  { label: 'Opening times', path: 'hours' },
  { label: 'Fees', path: 'fees' },
  { label: 'Contact', path: 'contact' },
];

// Services, grouped. Each item is the current site's own wording, lightly tidied.
export const serviceGroups = [
  {
    id: 'gp', icon: 'stethoscope', title: 'GP care',
    text: 'A wide range of GP services, including assessment, diagnosis, management and treatment of medical conditions.',
    items: ['Assessment and diagnosis', 'Management and treatment of medical conditions', 'Phone consultations', 'Driving test medicals'],
  },
  {
    id: 'screening', icon: 'droplet', title: 'Tests & screening',
    text: 'Health checks and tests, with blood tests taken by the nurse.',
    items: ['Health screening', 'Blood tests', 'Sexual health (STI) screening', 'Cervical smears, performed by a nurse'],
  },
  {
    id: 'vaccines', icon: 'syringe', title: 'Vaccines',
    text: 'Vaccines for children and adults.',
    items: ['Childhood vaccinations', 'Flu vaccine', 'Pneumonia vaccine'],
    notice: 'Travel vaccinations are temporarily suspended.',
  },
  {
    id: 'family', icon: 'baby', title: 'Pregnancy & family',
    text: 'Care for you and your family, from pregnancy onwards.',
    items: ['Pregnancy care, with free antenatal visits', 'Post-delivery checks at 2 and 6 weeks', 'Children under 6: free GP visits'],
  },
  {
    id: 'minor', icon: 'bandage', title: 'Minor procedures',
    text: 'Small procedures done here at the practice.',
    items: ['Suturing (stitches)', 'Wart freezing'],
  },
];

// Fees as listed on the current site (no date shown): confirm with the practice.
export const fees = [
  { name: 'GP visit', price: '€55' },
  { name: 'GP visit with blood tests', price: '€75', note: 'Usual price; can vary with the tests requested' },
  { name: 'Phone consultation', price: '€20 – €50', note: 'Depending on how long it takes' },
  { name: 'Full blood test with the nurse', price: '€40' },
  { name: 'Flu vaccine', price: '€25', note: 'No consultation charge' },
  { name: 'STI screening', price: '€80', note: 'Includes the consultation' },
];

export const freeCare = [
  { title: 'Medical cards', text: 'GMS medical cards accepted.' },
  { title: 'Under 6 and over 70', text: 'Free GP visit cards accepted.' },
  { title: 'Cervical smears', text: 'Free for those registered with CervicalCheck.' },
  { title: 'Pregnancy', text: 'Free antenatal visits and post-delivery checks at 2 and 6 weeks.' },
];

export const faqs = [
  { q: 'How do I make an appointment?', a: 'Please phone the practice on 01 497 1747. Appointments are not made by email.' },
  { q: 'Can I be seen outside normal hours?', a: 'Appointments outside normal hours can at times be given if needed. Ask when you call.' },
  { q: 'Are you open on Saturdays?', a: 'Saturday opening is suspended until further notice.' },
  { q: 'Do you accept medical cards?', a: 'Yes. GMS medical cards are accepted, as are free GP visit cards for children under 6 and adults over 70.' },
  { q: 'How much is a visit?', a: 'A GP visit is €55. A phone consultation is €20 – €50, depending on how long it takes. See the Fees page for the full list.' },
  { q: 'How can I pay?', a: 'All major credit and debit cards are accepted.' },
  { q: 'Do you give travel vaccines?', a: 'Travel vaccinations are temporarily suspended.' },
  { q: 'Who do I call when the practice is closed?', a: 'Registered patients can use Luke Doc on 01 669 9499 (weekday evenings until 10pm, weekends and public holidays 10am – 6pm), or GP 24 on 01 518 0808 for 24-hour phone consultations and house calls. In an emergency, call 999 or 112.' },
];
