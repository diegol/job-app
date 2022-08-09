async function up(db) {


  await db.schema
    .createTable('job')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('mobile_number', 'varchar(255)', (col) => col.notNull())
    .addColumn('address', 'varchar(255)')
    .addColumn('status', `enum("scheduled", "active", "invoicing", "to priced", "completed")`)
    .addColumn('created_at', 'datetime', (col) => col.notNull())
    .addColumn('updated_at', 'datetime', (col) => col.notNull())
    .execute()

    await db.schema
    .createTable('note')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('description', 'varchar(2000)', (col) => col.notNull())
    .addColumn('job_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'datetime', (col) => col.notNull())
    .addColumn('updated_at', 'datetime', (col) => col.notNull())
    .addForeignKeyConstraint(
      'job_note_id_fk', ['job_id'], 'job', ['id'],
    )
    .execute();
    //[TODO] ADD indexes and a TEXT search
}

async function down(db) {
  await db.schema.dropTable("note").execute();
    await db.schema.dropTable("job").execute();
}

module.exports = { up, down };
