if (process.env.NODE_ENV != 'ci') {
  require('dotenv').config({
    path: '.env.test',
  });
}
