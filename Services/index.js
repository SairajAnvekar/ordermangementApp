require('module-alias/register');
const http = require('http'),
      OrderManagerAPI = require('@OrderManagerAPI'),
      OrderManagerServer = http.Server(OrderManagerAPI),
      PORT = process.env.PORT || 3001,
      LOCAL = '0.0.0.0';
      OrderManagerServer.listen(PORT, LOCAL, () => console.log(`InventoryManagementAPI running on ${PORT}`));