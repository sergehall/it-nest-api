import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(
        process.env.ATLAS_URI + '/' + process.env.NEST_DATABASE,
      ),
  },
];

// export const databaseProviders = [
//   {
//     provide: 'ASYNC_CONNECTION',
//     useFactory: async () => {
//       const connection = await createConnection(
//         process.env.ATLAS_URI + '/' + process.env.NEST_DATABASE,
//       );
//       console.log('Mongoose connected');
//       return connection;
//     },
//   },
// ];
