process.env.NODE_ENV  = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
   process.env.PORT = 3000;
   process.env.MONGODB_URI = 'mongodb://localhost:27017/live-editor'
} else if (process.env.NODE_ENV === 'test') {
   process.env.PORT = 3000;
   process.env.MONGODB_URI = 'mongodb://localhost:27017/live-editor-test'
}