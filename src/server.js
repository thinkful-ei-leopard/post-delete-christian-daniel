const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`));