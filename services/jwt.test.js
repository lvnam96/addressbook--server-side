const jwt = require('./jwt');
const path = require('path');
const fs = require('fs');

xdescribe('public key start with BEGIN RSA PUBLIC KEY', () => {
  it('should work for RS family of algorithms', (done) => {
    const certPub = fs.readFileSync(path.resolve(__dirname, '../tests/rsa-public-key.pem'));
    const certPriv = fs.readFileSync(path.resolve(__dirname, '../tests/rsa-private.pem'));

    jwt
      .sign('bar', certPriv, undefined)
      .then((token) => {
        return jwt.verify(token, certPub, undefined);
      })
      .then((id) => done())
      .catch((err) => console.error(err));
  });
});
