# At frontend folder level
npx openapi -i http://localhost:3001/api-json -o src/lib/api

WITH_CREDENTIALS: true,

!!!!!!
Dont forget to change WITH_CREDENTIALS in OpenAPI.ts back to true after running this command.

