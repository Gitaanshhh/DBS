import oracledb

conn = oracledb.connect(
    user="git",
    password="rootpw",
    dsn="localhost/XEPDB1"  # or correct TNS
)

cur = conn.cursor()
cur.execute("SELECT * FROM git.new")
rows = cur.fetchall()

if not rows:
    print("Table is empty.")
else:
    for row in rows:
        print(row)

cur.execute("SELECT table_name FROM user_tables")
print(cur.fetchall())

conn.close()
