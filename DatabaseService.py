import sqlite3
import json
class DatabaseService:
    def __init__(self, dbPath: str):
        self.conn = sqlite3.connect(dbPath, check_same_thread=False)
        self.setup()

    def setup(self):
        cur = self.conn.cursor()
        try:
            cur.execute("PRAGMA foreign_keys = ON;")
            cur.execute('''CREATE TABLE IF NOT EXISTS Groups
                        (id INTEGER PRIMARY KEY, 
                        name TEXT NOT NULL UNIQUE)''')

            cur.execute('''CREATE TABLE IF NOT EXISTS EndpointDetails
                        (groupId INTEGER NOT NULL,
                        endpoint VARCHAR(32) NOT NULL,
                        description TEXT,
                        HTTPMethod VARCHAR(12) NOT NULL,
                        responseBodyType VARCHAR(32) NOT NULL,
                        responseBody text NOT NULL,
                        PRIMARY KEY( endpoint, HTTPMethod)
                        FOREIGN KEY(groupID) REFERENCES Groups(id) ON DELETE CASCADE )
            ''')

            cur.execute('''CREATE TABLE IF NOT EXISTS ResponseHeaders
                        (endpoint VARCHAR(32) NOT NULL,
                        HTTPMethod VARCHAR(12) NOT NULL,
                        key TEXT,
                        value TEXT,
                        FOREIGN KEY(endpoint,HTTPMethod) REFERENCES EndpointDetails(endpoint, HTTPMethod) ON DELETE CASCADE ON UPDATE CASCADE)
                    ''')

            cur.execute('''CREATE VIEW IF NOT EXISTS Overview_VIEW AS
                        SELECT name,groupId, ge.endpoint, description, ge.HTTPMethod, responseBodyType, responseBody, key,value
	                    FROM (Groups as g LEFT JOIN EndpointDetails as ed ON g.id = ed.groupId) as ge
	                    LEFT JOIN ResponseHeaders as rh on (ge.endpoint = rh.endpoint AND ge.HTTPMethod = rh.HTTPMethod)
                    ''')
        except Exception as err:
            print('Query Failed: \nError: {}'.format(str(err)))
            print('DB Could not be setup!')

    """
    generate a json format representaion of the DB
    """
    def generateFormattedDictionary(self) -> dict:
        GeneratedJSON = {'groups': {}}
        try:
            cur = self.conn.cursor()
            sqlQuery = 'SELECT * FROM Overview_VIEW'
            cur.execute(sqlQuery)
            rows = cur.fetchall()
            for row in rows:
                rowData = {'groupName':row[0],'groupId': row[1], 'endpoint':row[2], 'description': row[3], 'HTTPMethod':row[4], 'responseBodyType': row[5], 'responseBody': row[6] ,'headerKey': row[7], 'headerValue': row[8]}

                if rowData['groupId'] is None:
                    GeneratedJSON['groups'][rowData['groupName']] = []
                    continue

                if rowData['groupName'] not in GeneratedJSON['groups']:
                    GeneratedJSON['groups'][rowData['groupName']] = []

                endpointDetails = GeneratedJSON['groups'][rowData['groupName']]
                self.addEndpointsToGroups(rowData, endpointDetails)
               
            return GeneratedJSON

        except Exception as err:
            print(err)
    
    def addEndpointsToGroups(self, rowData: dict, endpointDetails: list) -> None:
        responseHeaders = {rowData['headerKey']: rowData['headerValue']}
        if rowData['headerKey'] is None or rowData['headerValue'] is None:
            responseHeaders = {}

        convertedJSON = json.loads(rowData['responseBody'])
        newEndpointInfo = {'endpoint': rowData['endpoint'], 'description': rowData['description'], 'HTTPMethod': rowData['HTTPMethod'], 'responseBodyType': rowData['responseBodyType'], 'responseBody': convertedJSON, "responseHeaders": [responseHeaders]}

        insertNewRow = True
        if len(endpointDetails) > 0:
            for i, detail in enumerate(endpointDetails):
                if rowData['endpoint'] == detail['endpoint'] and rowData['HTTPMethod'] == detail['HTTPMethod']:
                    endpointDetails[i]['responseHeaders'].append({rowData['headerKey']: rowData['headerValue']})
                    insertNewRow = False
        
        if insertNewRow:
            endpointDetails.append(newEndpointInfo)


    def clearGroupsTable(self):
        try:
            cur = self.conn.cursor()

            sqlQuery = 'DELETE FROM Groups'
            cur.execute(sqlQuery)
            self.conn.commit()
        except Exception as err:
            raise Exception(err)
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
    
    def loadFormattedJSON(self, formattedJSON: dict) -> None:
            self.clearGroupsTable()
            groups = formattedJSON['groups']
            self.loadGroups(groups)

            for groupName, val in groups.items():
                self.loadEndpoints(groupName,val)

    def loadEndpoints(self, groupName: str, endpoints:[]) -> None:
        if len(endpoints) == 0:
            return
        try:
            for val in endpoints:
                responseHeaders = val.pop('responseHeaders', None)
                if responseHeaders is None:
                    raise Exception("Response Headers not defined correctly. Please check naming.")
                val['responseBody'] = json.dumps(val['responseBody'])
                self.insertEndpoint(groupName, val) 
                self.loadResponseHeaders(val['endpoint'], val['HTTPMethod'], responseHeaders)
        except Exception as err:
            raise err

    def loadResponseHeaders(self,endpoint: str, HTTPMethod:str, responseHeaders: []) -> None:
        if len(responseHeaders) == 0:
            return
        try:
            for val in responseHeaders:
                self.insertResponseHeaders(endpoint, HTTPMethod, val)
        except Exception as err:
            raise err

    def loadGroups(self, groups: dict) -> None:
        if not dict:
            return
        
        for groupName, val in groups.items():
            try:
                self.insertNewGroup(groupName)
            except Exception as err:
                raise err
            
    def insertNewGroup(self, groupName: str) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'INSERT INTO groups (name) values(?)'
            cur.execute(sqlQuery, [groupName])
            self.conn.commit()
        except Exception as err:
            raise Exception(err)
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
        
    def deleteGroup(self, groupName: str) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'DELETE FROM Groups WHERE name = ?'
            cur.execute(sqlQuery, [groupName])
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
    
    def updateGroup(self,groupName: str, newGroupName: str) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'UPDATE Groups SET name = ? WHERE name = ?'
            values = tuple([newGroupName, groupName])
            cur.execute(sqlQuery, values)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))

    def getGroupID(self, groupName: str) -> int:
        try:
            sqlQuery = 'SELECT * from Groups WHERE name = ?'
            cur = self.conn.cursor()
            cur.execute(sqlQuery, [groupName])
        except Exception as err:
            print('Query Failed: {} \nError: {}'.format(sqlQuery,str(err)))
        
        try:
            rows = cur.fetchall()[0]
            groupId = rows[0]
            return groupId
        except IndexError as err:
            print('Group Name: "{}" not found'.format(groupName))
        except Exception as err:
            print(err)
        return -1

    def insertEndpoint(self, groupName: str, endpointDetails: dict) -> None:
        groupId = self.getGroupID(groupName)
        if groupId > 0:
            try:
                cur = self.conn.cursor()
                sqlQuery = 'INSERT INTO EndpointDetails ( endpoint, description, HTTPMethod, responseBodyType, responseBody,groupId) values(?,?,?,?,?,?)'
                endpointDetails['groupId'] = groupId
                values = tuple([endpointDetails['endpoint'], endpointDetails['description'], endpointDetails['HTTPMethod'], endpointDetails['responseBodyType'], endpointDetails['responseBody'], endpointDetails['groupId']])
                cur.execute(sqlQuery, values)
                self.conn.commit()
            except Exception as err:
                print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
        else:
            print('Group ID not found')
    
    def updateEndpoint(self, endpoint: str, HTTPMethod: str,  newEndpointDetails: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = '''UPDATE EndpointDetails SET endpoint = ?, description = ?, HTTPMethod = ?, responseBodyType = ?, responseBody = ? WHERE endpoint = ? AND HTTPMethod= ?'''

            values = tuple([newEndpointDetails['endpoint'], newEndpointDetails['description'], newEndpointDetails['HTTPMethod'], newEndpointDetails['responseBodyType'], json.dumps(newEndpointDetails['responseBody']), endpoint, HTTPMethod])
            cur.execute(sqlQuery, values)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
            raise Exception(err)
        
    def selectAllEndpoints(self) -> dict:
        endpoints = []
        try:
            cur = self.conn.cursor()
            sqlQuery = 'SELECT * FROM Overview_VIEW'
            cur.execute(sqlQuery)
            rows = cur.fetchall()
            for row in rows:
                rowData = {'groupName':row[0],'groupId': row[1], 'endpoint':row[2], 'description': row[3], 'HTTPMethod':row[4], 'responseBodyType': row[5], 'responseBody': row[6] ,'headerKey': row[7], 'headerValue': row[8]}
                if not any( rowData['endpoint'] == endpoint['endpoint'] and rowData['HTTPMethod'] == endpoint['HTTPMethod'] for endpoint in endpoints):
                    del rowData['groupName']
                    del rowData['groupId']
                    headerKey = rowData.pop('headerKey')
                    headerValue = rowData.pop('headerValue')
                    rowData['responseBody'] = json.loads(rowData['responseBody'])
                    rowData['responseHeaders'] = [{headerKey:headerValue}]
                    endpoints.append(rowData)
                else:
                    responseHeader = {rowData['headerKey']: rowData['headerValue']}
                    index = next((index for index, item in enumerate(endpoints) if rowData['endpoint'] == item['endpoint'] and rowData['HTTPMethod'] == item['HTTPMethod']), None)
                    endpoints[index]['responseHeaders'].append(responseHeader)

            return endpoints
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))

    def deleteEndpoint(self, groupName: str, endpointDetails: dict) -> None:
        groupId = self.getGroupID(groupName)
        if groupId > 0:
            try:
                cur = self.conn.cursor()
                sqlQuery = 'DELETE FROM EndpointDetails WHERE endpoint=? and HTTPMethod=? and groupId=?'
                values = tuple([endpointDetails['endpoint'], endpointDetails['HTTPMethod'], groupId])
                cur.execute(sqlQuery, values)
                self.conn.commit()
            except Exception as err:
                print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))
        else:
            print('Group ID not found')
    
    def insertResponseHeaders(self, endpoint: str, HTTPMethod: str, headers: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'INSERT INTO ResponseHeaders (endpoint, HTTPMethod, key, value) values(?,?,?,?)'
            key = tuple(headers.keys())[0]
            value = tuple(headers.values())[0]
            headers = tuple([endpoint, HTTPMethod, key, value])
            cur.execute(sqlQuery, headers)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))

    def updateResponseHeaders(self, endpoint: str, HTTPMethod: str, headers: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'UPDATE ResponseHeaders SET key = ?, value=? WHERE endpoint = ? AND HTTPMethod=?'
            key = tuple(headers.keys())[0]
            value = tuple(headers.values())[0]
            sqlValues = tuple([key, value, endpoint, HTTPMethod])
            cur.execute(sqlQuery, sqlValues)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))

    def deleteResponseHeaders(self, endpoint: str, HTTPMethod: str, headers: dict) -> None:
        try:
            cur = self.conn.cursor()
            sqlQuery = 'DELETE FROM ResponseHeaders WHERE endpoint=? and HTTPMethod=? and key=? and value=?'
            key = tuple(headers.keys())[0]
            value = tuple(headers.values())[0]
            sqlValues = tuple([endpoint, HTTPMethod, key, value])
            cur.execute(sqlQuery, sqlValues)
            self.conn.commit()
        except Exception as err:
            print('Query Failed: {} \nError:{}'.format(sqlQuery,str(err)))