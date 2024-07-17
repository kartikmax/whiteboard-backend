import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://scene_db_user:HrV5HcJlcVp6hM4VACvWtaOOs1VayGmn@dpg-cqbtvvuehbks73e00clg-a.singapore-postgres.render.com/scene_db'
  });

export default pool;
