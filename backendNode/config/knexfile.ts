export default {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3',
      },
      useNullAsDefault: true,
      debug: false
    },
    // Add other environments as needed (e.g., production).
  };