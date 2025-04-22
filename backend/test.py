import oracledb

"""conn = oracledb.connect(
    user="git",
    password="rootpw",
    dsn="localhost/XEPDB1"  # or correct TNS
)"""

#dsn = "localhost/FREE"
dsn = oracledb.makedsn("localhost", 1521, service_name="FREE")


conn = oracledb.connect(
    user="sys",
    password="sys",
    dsn=dsn,  # or correct TNS
    mode=oracledb.SYSDBA
)

cur = conn.cursor()
cur.execute("SELECT * FROM student")
rows = cur.fetchall()

if not rows:
    print("Table is empty.")
else:
    for row in rows:
        print(row)
"""
cur.execute("SELECT table_name FROM user_tables")
print(cur.fetchall())
"""

conn.close()