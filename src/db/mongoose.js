const mongoose = require('mongoose')
const connection = 'mongodb+srv://dascolt1:Spartanj1@cluster0.khxst.mongodb.net/connect-pi?retryWrites=true&w=majority'
mongoose.connect(connection, {
	useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})