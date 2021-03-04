const categories = [
  'Concerts',
  'Sports',
  'Theater',
  'Comedy',
];

const random = (limit) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let string = '';
  for (let ii = 0; ii < limit; ii++) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }
  return string;
};

const randomDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + Math.ceil(Math.random() * 5));
  date.setMonth(Math.ceil(Math.random() * 12));
  date.setDate(Math.ceil(Math.random() * 28));
  return date;
};

export const generateMockData = async (client) => {
  const tickets = {
    Concerts: [],
    Sports: [],
    Theater: [],
    Comedy: [],
  };
  // Create 6 different users
  for (let i = 0; i < 9; i++) {
    // Register new user
    const user = await client.post('/api/users/signup', {
      email: `${random(10)}@mock.com`,
      password: 'a1234',
      name: random(10)
    }, { withCredentials: true });

    const cookie = user.headers['set-cookie'][0].split(';')[0];

    // Loop over all categories
    for (const category of categories) {
      // Create ticket per category
      const { data } = await client.post('/api/tickets', {
        title: random(15),
        price: Math.round(Math.random() * Math.floor(100)),
        category,
        description: `${category} event. ${random(20)}`,
        date: randomDate()
      }, { withCredentials: true, headers: { cookie } });

      tickets[category].push(data);
    }
  }

  return tickets;
}