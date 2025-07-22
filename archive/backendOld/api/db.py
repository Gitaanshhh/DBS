import oracledb

# Create DSN
dsn = oracledb.makedsn("localhost", 1521, service_name="FREE")

# Create connection
conn = oracledb.connect(
    user="sys",
    password="sys",
    dsn=dsn,
    mode=oracledb.SYSDBA
) 