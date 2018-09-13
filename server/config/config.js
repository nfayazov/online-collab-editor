var env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;

if (env === 'development') {
   process.env.PORT = 3000;
   process.env.MONGODB_URI = 'mongodb://localhost:27017/live-editor'
} else if (env === 'test') {
   process.env.PORT = 3000;
   process.env.MONGODB_URI = 'mongodb://localhost:27017/live-editor-test'
}