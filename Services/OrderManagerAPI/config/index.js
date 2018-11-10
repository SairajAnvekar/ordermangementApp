module.exports = {
  secret: 'saikala',
  session: { session: false },
  database: process.env.MONGODB ||'mongodb://localhost/orderManager'
}