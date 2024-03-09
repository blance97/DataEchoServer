import express, {Application} from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRouter';
import initializeDatabase from '../scripts/createTables';
import apiDetailsRouter from "./routes/apiDetailsRouter";
import jsonData from './data/exampleLayout.json';
import jsonLayoutLoader from "./services/convertToSQLFormat";
import convertToJSONFormat from "./services/convertToJSONFomart";
import dataInterchangerRouter from "./routes/dataInterchangerRouter";

const app: Application = express()
const port = 3000;

initializeDatabase();

app.use(bodyParser.json());


app.use('/api/des', groupRouter); // Use the group routes for paths starting with '/api/des'
app.use('/api/des', apiDetailsRouter); // Use the api details routes for paths starting with '/api/des'
app.use('/api/des', dataInterchangerRouter); // Use the data interchanger routes for paths starting with '/api/des'

//     const { name, description } = req.body;

//     // Check if the name already exists in the 'groups' table
//     const checkDuplicate = db.prepare('SELECT COUNT(*) as count FROM groups WHERE name = ?');
//     checkDuplicate.get(name, (err, result) => {
//       if (err) {
//         res.status(500).json({ error: `Database error: ${err.message}` });
//       } else {
//         const count = result.count;

//         if (count > 0) {
//           // Name already exists, return an error
//           res.status(400).json({ error: 'Group name already exists.' });
//         } else {
//           // Insert the group into the 'groups' table
//           const insertGroup = db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)');
//           insertGroup.run(name, description, (err) => {
//             if (err) {
//               res.status(500).json({ error: `Failed to add the group to the database: ${err.message}` });
//             } else {
//               res.json({ message: 'Group added successfully.' });
//             }

//             // Finalize the statements
//             insertGroup.finalize();
//             checkDuplicate.finalize();
//           });
//         }
//       }
//     });
// });

// app.delete('/api/des/deleteGroupByName/:groupName', (req, res) => {
//   const groupName = req.params.groupName;

//   // Check if the group exists
//   const checkGroupExistence = db.prepare('SELECT COUNT(*) as count FROM groups WHERE name = ?');
//   checkGroupExistence.get(groupName, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: `Database error: ${err.message}` });
//     } else {
//       const count = result.count;

//       if (count === 0) {
//         // Group not found, return a 404
//         res.status(404).json({ error: 'Group not found.' });
//         checkGroupExistence.finalize();
//       } else {
//         // Delete the group and related API details from the 'groups' and 'api_details' tables
//         const deleteGroup = db.prepare('DELETE FROM groups WHERE name = ?');
//         deleteGroup.run(groupName, (err) => {
//           if (err) {
//             res.status(500).json({ error: `Failed to delete the group from the database: ${err.message}` });
//           } else {
//             res.json({ message: 'Group and related API details deleted successfully.' });
//           }

//           // Finalize the statements
//           deleteGroup.finalize();
//           checkGroupExistence.finalize();
//         });
//       }
//     }
//   });
// });


// app.post('/api/des/addApiDetail', (req, res) => {
//   const { group_id, endpoint_name, api_method, api_response_body, api_response_code } = req.body;

//   // Check if the combination of endpoint_name and api_method already exists in the 'api_details' table
//   const checkDuplicate = db.prepare('SELECT COUNT(*) as count FROM api_details WHERE endpoint_name = ? AND api_method = ?');
//   checkDuplicate.get(endpoint_name, api_method, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: `Database error: ${err.message}` });
//     } else {
//       const count = result.count;

//       if (count > 0) {
//         // Combination of endpoint_name and api_method already exists, return an error
//         res.status(400).json({ error: 'Api detail already exists.' });
//       } else {
//         // Insert the api_detail into the 'api_details' table
//         const insertApiDetail = db.prepare('INSERT INTO api_details (group_id, endpoint_name, api_method, api_response_body, api_response_code) VALUES (?, ?, ?, ?, ?)');
//         insertApiDetail.run(group_id, endpoint_name, api_method, api_response_body, api_response_code, (err) => {
//           if (err) {
//             res.status(500).json({ error: `Failed to add the api_detail to the database: ${err.message}` });
//           } else {
//             res.json({ message: 'Api detail added successfully.' });
//           }

//           // Finalize the statements
//           insertApiDetail.finalize();
//           checkDuplicate.finalize();
//         });
//       }
//     }
//   });
// });

// app.delete('/api/des/deleteApiDetail', (req, res) => {
//   const { api_name, api_method } = req.body;

//   // Check if the API details exist
//   const checkExistence = db.prepare('SELECT COUNT(*) as count FROM api_details WHERE api_name = ? AND api_method = ?');
//   checkExistence.get(api_name, api_method, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: `Database error: ${err.message}` });
//     } else {
//       const count = result.count;

//       if (count === 0) {
//         // API details not found, return a 404 error
//         res.status(404).json({ error: 'API details not found.' });
//       } else {
//         // Delete the API details
//         const deleteApiDetail = db.prepare('DELETE FROM api_details WHERE api_name = ? AND api_method = ?');
//         deleteApiDetail.run(api_name, api_method, (err) => {
//           if (err) {
//             res.status(500).json({ error: `Failed to delete API details: ${err.message}` });
//           } else {
//             res.json({ message: 'API details deleted successfully.' });
//           }

//           // Finalize the statements
//           deleteApiDetail.finalize();
//           checkExistence.finalize();
//         });
//       }
//     }
//   });
// });


// app.put('/api/des/editApiDetail', (req, res) => {
//   const { api_name, api_method, newApiResponseBody, newApiResponseCode } = req.body;

//   // Check if the API details exist
//   const checkExistence = db.prepare('SELECT COUNT(*) as count FROM api_details WHERE api_name = ? AND api_method = ?');
//   checkExistence.get(api_name, api_method, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: `Database error: ${err.message}` });
//     } else {
//       const count = result.count;

//       if (count === 0) {
//         // API details not found, return a 404 error
//         res.status(404).json({ error: 'API details not found.' });
//       } else {
//         // Update the API details
//         const updateApiDetail = db.prepare('UPDATE api_details SET api_response_body = ?, api_response_code = ? WHERE api_name = ? AND api_method = ?');
//         updateApiDetail.run(newApiResponseBody, newApiResponseCode, api_name, api_method, (err) => {
//           if (err) {
//             res.status(500).json({ error: `Failed to update API details: ${err.message}` });
//           } else {
//             res.json({ message: 'API details updated successfully.' });
//           }

//           // Finalize the statements
//           updateApiDetail.finalize();
//           checkExistence.finalize();
//         });
//       }
//     }
//   });
// });


// Your other server setup and routes go here...

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
