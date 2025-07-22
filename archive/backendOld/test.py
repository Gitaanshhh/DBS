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
cur.execute("SELECT * FROM SYS.Student")
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

cur.execute("SELECT table_name FROM all_tables WHERE owner = 'SYS' AND table_name = 'STUDENT'")
print(cur.fetchall())

cur.execute("SELECT COUNT(*) FROM SYS.Student")
print(cur.fetchone())

conn.close()