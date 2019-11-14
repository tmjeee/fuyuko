(v) GET /groups

(v) GET /group/:groupId

(v) GET /groups/no-role/:roleId

(v) DELETE /group/:groupId/role/:roleId

POST /group/:groupId/add-role/:roleId

POST /role

GET /users/not-in-group/:groupId

POST /group/:groupId/add-user/:userId

POST /group/:groupId/remove-user/:userId

GET /self-registers

DELETE /self-register/:selfRegisterId

GET /users/status/{enabled/disabled/deleted}

DELETE /user/:userId

POST /user/:userId/status/{enabled/disabled}
