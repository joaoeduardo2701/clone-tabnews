import database from "infra/database";

async function status(request, response) {
  const database = require("infra/database").default;

  const updatedAt = new Date().toISOString();

  const postgresVersion = await database
    .query("SHOW server_version;")
    .then((res) => res.rows[0].server_version);

  const databaseMaxConnections = await database
    .query("SHOW max_connections;")
    .then((res) => res.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const databaseUsingConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseUsingConnectionsValue =
    databaseUsingConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: parseInt(databaseMaxConnections),
        current_connections: databaseUsingConnectionsValue,
      },
    },
  });
}

export default status;
