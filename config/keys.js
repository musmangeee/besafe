if (process.env.NODE_ENV === "production") require("dotenv").config();
module.exports = {
  mongodb:
    process.env.mongodb ||
    "mongodb+srv://root:rCyzTLz0t1cihwN8@besafeproject-l4jmp.mongodb.net/BS?retryWrites=true&w=majority",
  secret: process.env.secret || "c6aSsUzQBACrdWoWy6g7BkuxwKfkPbmB"
};
