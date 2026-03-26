#!/bin/bash
node -e "const crypto = require('crypto'); const key = crypto.randomBytes(32); console.log(Buffer.from(key).toString('base64url'))"