const postLoginMenu = [
  {
    label: 'Sell Tickets',
    href: '/tickets/new'
  },
  {
    label: 'My Orders',
    href: '/orders'
  }
];

const preLoginMenu = [
  {
    label: 'Sign In',
    href: '/auth/signin'
  },
  {
    label: 'Sign Up',
    href: '/auth/signup'
  }
];

module.exports = {
  postLoginMenu,
  preLoginMenu
};