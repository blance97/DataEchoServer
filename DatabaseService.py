import sqlite3
class DatabaseService:
    def __init__(self, dbPath: str):
        self.conn = sqlite3.connect(dbPath)
        self.setup()
        
    def setup(self):
        cur = self.conn.cursor()
        try:
            cur.execute("""CREATE TABLE IF NOT EXISTS Groups
                        (id INTEGER PRIMARY KEY, 
                        name TEXT NOT NULL UNIQUE)""")

            cur.execute("""CREATE TABLE IF NOT EXISTS EndpointDetails
                        (groupId INTEGER NOT NULL,
                        endpoint VARCHAR(32) NOT NULL,
                        description TEXT,
                        HTTPMethod VARCHAR(12) NOT NULL,
                        responseBodyType VARCHAR(32) NOT NULL,
                        responseBody text NOT NULL,
                        PRIMARY KEY( endpoint, HTTPMethod)
                        FOREIGN KEY(groupID) REFERENCES Groups(id) ON DELETE CASCADE )
            """)

            cur.execute("""CREATE TABLE IF NOT EXISTS ResponseHeaders
                        (endpoint VARCHAR(32) NOT NULL,
                        HTTPMethod VARCHAR(12) NOT NULL,
                        key TEXT,
                        value TEXT,
                        FOREIGN KEY(endpoint,HTTPMethod) REFERENCES EndpointDetails(endpoint, HTTPMethod) ON DELETE CASCADE ON UPDATE CASCADE)
                    """)
        except Exception as err:
            print('Query Failed: \nError: {}'.format(str(err)))
            print('DB Could not be setup!')

    def insertNewGroup(self, groupName: str) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = "INSERT INTO Groups (name) values(?)"
            cur.execute(sqlQuery, [groupName])
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
    
    def getGroupID(self, groupName: str) -> int:
        try:
            sqlQuery = "SELECT * from Groups WHERE name = ?"
            cur = self.conn.cursor()
            cur.execute(sqlQuery, [groupName])
        except Exception as err:
            print('Query Failed: {} \nError: {}'.format(sqlQuery,str(err)))
        
        try:
            rows = cur.fetchall()[0]
            groupId = rows[0]
            return groupId
        except IndexError as err:
            print("Group Name: '{}' not found".format(groupName))
        except Exception as err:
            print(err)
        return -1

    def insertEndpoint(self, groupName: str, endpointDetails: dict) -> None:
        groupId = self.getGroupID(groupName)
        if groupId > 0:
            try:
                cur = self.conn.cursor()
                sqlQuery = "INSERT INTO EndpointDetails ( endpoint, description, HTTPMethod, responseBodyType, responseBody,groupId) values(?,?,?,?,?,?)"
                endpointDetails['groupId'] = groupId
                values = tuple(endpointDetails.values())
                cur.execute(sqlQuery, values)
                self.conn.commit()
            except Exception as err:
                print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
        else:
            print("Group ID not found")

    def deleteEndpoint(self, groupName: str, endpointDetails: dict) -> None:
        groupId = self.getGroupID(groupName)
        if groupId > 0:
            try:
                cur = self.conn.cursor()
                sqlQuery = "DELETE FROM EndpointDetails WHERE endpoint=? and HTTPMethod=? and groupId=?"
                values = tuple([endpointDetails['endpoint'], endpointDetails['HTTPMethod'], groupId])
                cur.execute(sqlQuery, values)
                self.conn.commit()
            except Exception as err:
                print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
        else:
            print("Group ID not found")
    
    def insertResponseHeaders(self, endpoint: str, HTTPMethod: str, headers: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = "INSERT INTO ResponseHeaders (endpoint, HTTPMethod, key, value) values(?,?,?,?)"
            values = tuple([endpoint, HTTPMethod, tuple(headers.keys())[0], tuple(headers.values())[0]])
            cur.execute(sqlQuery, values)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))

    def deleteResponseHeaders(self, endpoint: str, HTTPMethod: str, headers: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = "DELETE FROM ResponseHeaders WHERE endpoint=? and HTTPMethod=? and key=? and value=?"
            values = tuple([endpoint, HTTPMethod, tuple(headers.keys())[0], tuple(headers.values())[0]])
            cur.execute(sqlQuery, values)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))