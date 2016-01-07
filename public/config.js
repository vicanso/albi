System.config({
  baseURL: "/static",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "bundle/bootstrap.js": [
      "js/bootstrap.js",
      "components/http.js",
      "components/lazy-load.js",
      "components/globals.js",
      "npm:lodash@3.10.1",
      "github:components/jquery@2.1.4",
      "components/debug.js",
      "npm:superagent@1.6.1",
      "npm:node-uuid@1.4.7",
      "npm:babel-runtime@5.8.34/core-js/promise",
      "npm:lodash@3.10.1/index",
      "github:components/jquery@2.1.4/jquery",
      "npm:superagent@1.6.1/lib/client",
      "npm:debug@2.2.0",
      "npm:node-uuid@1.4.7/uuid",
      "npm:core-js@1.2.6/library/fn/promise",
      "github:jspm/nodelibs-process@0.1.2",
      "npm:component-emitter@1.1.2",
      "npm:reduce-component@1.0.1",
      "npm:debug@2.2.0/browser",
      "github:jspm/nodelibs-crypto@0.1.0",
      "github:jspm/nodelibs-buffer@0.1.0",
      "npm:core-js@1.2.6/library/modules/es6.object.to-string",
      "npm:core-js@1.2.6/library/modules/$.core",
      "npm:core-js@1.2.6/library/modules/es6.string.iterator",
      "npm:core-js@1.2.6/library/modules/web.dom.iterable",
      "npm:core-js@1.2.6/library/modules/es6.promise",
      "github:jspm/nodelibs-process@0.1.2/index",
      "npm:reduce-component@1.0.1/index",
      "npm:component-emitter@1.1.2/index",
      "npm:debug@2.2.0/debug",
      "github:jspm/nodelibs-crypto@0.1.0/index",
      "github:jspm/nodelibs-buffer@0.1.0/index",
      "npm:core-js@1.2.6/library/modules/$.iterators",
      "npm:core-js@1.2.6/library/modules/$",
      "npm:core-js@1.2.6/library/modules/$.library",
      "npm:core-js@1.2.6/library/modules/$.global",
      "npm:core-js@1.2.6/library/modules/$.is-object",
      "npm:core-js@1.2.6/library/modules/$.a-function",
      "npm:core-js@1.2.6/library/modules/$.strict-new",
      "npm:core-js@1.2.6/library/modules/$.same-value",
      "npm:core-js@1.2.6/library/modules/$.string-at",
      "npm:core-js@1.2.6/library/modules/$.iter-define",
      "npm:core-js@1.2.6/library/modules/es6.array.iterator",
      "npm:core-js@1.2.6/library/modules/$.classof",
      "npm:core-js@1.2.6/library/modules/$.ctx",
      "npm:core-js@1.2.6/library/modules/$.export",
      "npm:core-js@1.2.6/library/modules/$.an-object",
      "npm:core-js@1.2.6/library/modules/$.for-of",
      "npm:core-js@1.2.6/library/modules/$.set-proto",
      "npm:core-js@1.2.6/library/modules/$.wks",
      "npm:core-js@1.2.6/library/modules/$.species-constructor",
      "npm:core-js@1.2.6/library/modules/$.microtask",
      "npm:core-js@1.2.6/library/modules/$.descriptors",
      "npm:core-js@1.2.6/library/modules/$.redefine-all",
      "npm:core-js@1.2.6/library/modules/$.set-to-string-tag",
      "npm:core-js@1.2.6/library/modules/$.set-species",
      "npm:core-js@1.2.6/library/modules/$.iter-detect",
      "npm:process@0.11.2",
      "npm:ms@0.7.1",
      "npm:crypto-browserify@3.11.0",
      "npm:buffer@3.6.0",
      "npm:core-js@1.2.6/library/modules/$.defined",
      "npm:core-js@1.2.6/library/modules/$.to-integer",
      "npm:core-js@1.2.6/library/modules/$.has",
      "npm:core-js@1.2.6/library/modules/$.add-to-unscopables",
      "npm:core-js@1.2.6/library/modules/$.iter-step",
      "npm:core-js@1.2.6/library/modules/$.cof",
      "npm:core-js@1.2.6/library/modules/$.uid",
      "npm:core-js@1.2.6/library/modules/$.fails",
      "npm:core-js@1.2.6/library/modules/$.redefine",
      "npm:core-js@1.2.6/library/modules/$.hide",
      "npm:core-js@1.2.6/library/modules/$.iter-create",
      "npm:core-js@1.2.6/library/modules/$.to-iobject",
      "npm:core-js@1.2.6/library/modules/$.iter-call",
      "npm:core-js@1.2.6/library/modules/$.is-array-iter",
      "npm:core-js@1.2.6/library/modules/$.to-length",
      "npm:core-js@1.2.6/library/modules/core.get-iterator-method",
      "npm:core-js@1.2.6/library/modules/$.shared",
      "npm:core-js@1.2.6/library/modules/$.task",
      "npm:process@0.11.2/browser",
      "npm:ms@0.7.1/index",
      "npm:crypto-browserify@3.11.0/index",
      "npm:core-js@1.2.6/library/modules/$.property-desc",
      "npm:core-js@1.2.6/library/modules/$.invoke",
      "npm:buffer@3.6.0/index",
      "npm:core-js@1.2.6/library/modules/$.iobject",
      "npm:core-js@1.2.6/library/modules/$.html",
      "npm:core-js@1.2.6/library/modules/$.dom-create",
      "npm:create-hash@1.1.2",
      "npm:randombytes@2.0.1",
      "npm:create-hmac@1.1.4",
      "npm:pbkdf2@3.0.4",
      "npm:browserify-cipher@1.0.0",
      "npm:diffie-hellman@5.0.0",
      "npm:browserify-sign@4.0.0",
      "npm:create-ecdh@4.0.0",
      "npm:public-encrypt@4.0.0",
      "npm:browserify-sign@4.0.0/algos",
      "npm:base64-js@0.0.8",
      "npm:ieee754@1.1.6",
      "npm:isarray@1.0.0",
      "npm:randombytes@2.0.1/browser",
      "npm:pbkdf2@3.0.4/browser",
      "npm:create-ecdh@4.0.0/browser",
      "npm:create-hash@1.1.2/browser",
      "npm:create-hmac@1.1.4/browser",
      "npm:browserify-cipher@1.0.0/browser",
      "npm:browserify-sign@4.0.0/browser",
      "npm:public-encrypt@4.0.0/browser",
      "npm:diffie-hellman@5.0.0/browser",
      "npm:base64-js@0.0.8/lib/b64",
      "npm:isarray@1.0.0/index",
      "npm:ieee754@1.1.6/index",
      "npm:browserify-aes@1.0.5/modes",
      "npm:browserify-des@1.0.0/modes",
      "npm:bn.js@4.6.2",
      "npm:elliptic@6.0.2",
      "npm:inherits@2.0.1",
      "npm:ripemd160@1.0.1",
      "npm:sha.js@2.4.4",
      "npm:cipher-base@1.0.2",
      "github:jspm/nodelibs-stream@0.1.0",
      "npm:evp_bytestokey@1.0.0",
      "npm:browserify-des@1.0.0",
      "npm:create-hash@1.1.2/md5",
      "npm:browserify-aes@1.0.5/browser",
      "npm:browserify-sign@4.0.0/sign",
      "npm:browserify-sign@4.0.0/verify",
      "npm:public-encrypt@4.0.0/publicEncrypt",
      "npm:diffie-hellman@5.0.0/lib/generatePrime",
      "npm:public-encrypt@4.0.0/privateDecrypt",
      "npm:diffie-hellman@5.0.0/lib/dh",
      "npm:diffie-hellman@5.0.0/lib/primes.json!github:systemjs/plugin-json@0.1.0",
      "npm:bn.js@4.6.2/lib/bn",
      "npm:inherits@2.0.1/inherits_browser",
      "npm:browserify-sign@4.0.0/curves",
      "npm:public-encrypt@4.0.0/xor",
      "npm:ripemd160@1.0.1/lib/ripemd160",
      "npm:cipher-base@1.0.2/index",
      "github:jspm/nodelibs-stream@0.1.0/index",
      "npm:browserify-des@1.0.0/index",
      "npm:create-hash@1.1.2/helpers",
      "npm:public-encrypt@4.0.0/mgf",
      "npm:browserify-rsa@4.0.0",
      "npm:parse-asn1@5.0.0",
      "npm:sha.js@2.4.4/index",
      "npm:evp_bytestokey@1.0.0/index",
      "npm:browserify-aes@1.0.5/encrypter",
      "npm:browserify-aes@1.0.5/decrypter",
      "npm:elliptic@6.0.2/lib/elliptic",
      "npm:public-encrypt@4.0.0/withPublic",
      "npm:miller-rabin@4.0.0",
      "npm:browserify-aes@1.0.5/modes/ecb",
      "npm:brorand@1.0.5",
      "npm:browserify-rsa@4.0.0/index",
      "npm:browserify-aes@1.0.5/aes",
      "npm:browserify-aes@1.0.5/modes/cbc",
      "npm:browserify-aes@1.0.5/modes/cfb",
      "npm:browserify-aes@1.0.5/modes/cfb8",
      "npm:browserify-aes@1.0.5/modes/cfb1",
      "npm:browserify-aes@1.0.5/modes/ofb",
      "npm:browserify-aes@1.0.5/modes/ctr",
      "npm:elliptic@6.0.2/lib/elliptic/utils",
      "github:jspm/nodelibs-string_decoder@0.1.0",
      "npm:stream-browserify@1.0.0",
      "npm:des.js@1.0.0",
      "npm:sha.js@2.4.4/sha",
      "npm:sha.js@2.4.4/sha1",
      "npm:sha.js@2.4.4/sha224",
      "npm:sha.js@2.4.4/sha384",
      "npm:sha.js@2.4.4/sha256",
      "npm:sha.js@2.4.4/sha512",
      "npm:browserify-aes@1.0.5/streamCipher",
      "npm:browserify-aes@1.0.5/authCipher",
      "npm:elliptic@6.0.2/lib/elliptic/hmac-drbg",
      "npm:elliptic@6.0.2/lib/elliptic/curve/index",
      "npm:elliptic@6.0.2/lib/elliptic/curves",
      "npm:elliptic@6.0.2/lib/elliptic/ec/index",
      "npm:elliptic@6.0.2/lib/elliptic/eddsa/index",
      "npm:parse-asn1@5.0.0/index",
      "npm:elliptic@6.0.2/package.json!github:systemjs/plugin-json@0.1.0",
      "npm:miller-rabin@4.0.0/lib/mr",
      "npm:brorand@1.0.5/index",
      "npm:elliptic@6.0.2/lib/elliptic/precomputed/secp256k1",
      "github:jspm/nodelibs-string_decoder@0.1.0/index",
      "npm:sha.js@2.4.4/hash",
      "npm:browserify-aes@1.0.5/ghash",
      "npm:elliptic@6.0.2/lib/elliptic/ec/key",
      "npm:buffer-xor@1.0.3",
      "npm:hash.js@1.0.3",
      "npm:browserify-aes@1.0.5",
      "npm:stream-browserify@1.0.0/index",
      "npm:des.js@1.0.0/lib/des",
      "npm:elliptic@6.0.2/lib/elliptic/curve/base",
      "npm:elliptic@6.0.2/lib/elliptic/curve/short",
      "npm:elliptic@6.0.2/lib/elliptic/curve/mont",
      "npm:elliptic@6.0.2/lib/elliptic/curve/edwards",
      "npm:elliptic@6.0.2/lib/elliptic/eddsa/key",
      "npm:elliptic@6.0.2/lib/elliptic/ec/signature",
      "npm:elliptic@6.0.2/lib/elliptic/eddsa/signature",
      "npm:parse-asn1@5.0.0/asn1",
      "npm:parse-asn1@5.0.0/fixProc",
      "npm:parse-asn1@5.0.0/aesid.json!github:systemjs/plugin-json@0.1.0",
      "npm:des.js@1.0.0/lib/des/utils",
      "npm:buffer-xor@1.0.3/index",
      "npm:des.js@1.0.0/lib/des/cipher",
      "github:jspm/nodelibs-events@0.1.1",
      "npm:string_decoder@0.10.31",
      "npm:hash.js@1.0.3/lib/hash",
      "npm:readable-stream@1.1.13/readable",
      "npm:readable-stream@1.1.13/writable",
      "npm:readable-stream@1.1.13/duplex",
      "npm:readable-stream@1.1.13/transform",
      "npm:readable-stream@1.1.13/passthrough",
      "npm:des.js@1.0.0/lib/des/des",
      "npm:des.js@1.0.0/lib/des/cbc",
      "npm:des.js@1.0.0/lib/des/ede",
      "npm:asn1.js@4.3.0",
      "npm:string_decoder@0.10.31/index",
      "npm:minimalistic-assert@1.0.0",
      "github:jspm/nodelibs-events@0.1.1/index",
      "npm:hash.js@1.0.3/lib/hash/utils",
      "npm:hash.js@1.0.3/lib/hash/common",
      "npm:hash.js@1.0.3/lib/hash/sha",
      "npm:hash.js@1.0.3/lib/hash/hmac",
      "npm:hash.js@1.0.3/lib/hash/ripemd",
      "npm:readable-stream@1.1.13/lib/_stream_readable",
      "npm:readable-stream@1.1.13/lib/_stream_writable",
      "npm:readable-stream@1.1.13/lib/_stream_duplex",
      "npm:readable-stream@1.1.13/lib/_stream_transform",
      "npm:readable-stream@1.1.13/lib/_stream_passthrough",
      "npm:asn1.js@4.3.0/lib/asn1",
      "npm:minimalistic-assert@1.0.0/index",
      "npm:events@1.0.2",
      "npm:isarray@0.0.1",
      "npm:core-util-is@1.0.2",
      "npm:asn1.js@4.3.0/lib/asn1/api",
      "npm:asn1.js@4.3.0/lib/asn1/base/index",
      "npm:asn1.js@4.3.0/lib/asn1/constants/index",
      "npm:asn1.js@4.3.0/lib/asn1/encoders/index",
      "npm:asn1.js@4.3.0/lib/asn1/decoders/index",
      "npm:isarray@0.0.1/index",
      "npm:events@1.0.2/events",
      "npm:core-util-is@1.0.2/lib/util",
      "npm:asn1.js@4.3.0/lib/asn1/base/reporter",
      "github:jspm/nodelibs-vm@0.1.0",
      "npm:asn1.js@4.3.0/lib/asn1/base/buffer",
      "npm:asn1.js@4.3.0/lib/asn1/base/node",
      "npm:asn1.js@4.3.0/lib/asn1/constants/der",
      "npm:asn1.js@4.3.0/lib/asn1/encoders/der",
      "npm:asn1.js@4.3.0/lib/asn1/encoders/pem",
      "npm:asn1.js@4.3.0/lib/asn1/decoders/der",
      "npm:asn1.js@4.3.0/lib/asn1/decoders/pem",
      "github:jspm/nodelibs-vm@0.1.0/index",
      "npm:vm-browserify@0.0.4",
      "npm:vm-browserify@0.0.4/index",
      "npm:indexof@0.0.1",
      "npm:indexof@0.0.1/index"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.34",
    "babel-runtime": "npm:babel-runtime@5.8.34",
    "core-js": "npm:core-js@1.2.6",
    "debug": "npm:debug@2.2.0",
    "jquery": "github:components/jquery@2.1.4",
    "lodash": "npm:lodash@3.10.1",
    "node-uuid": "npm:node-uuid@1.4.7",
    "superagent": "npm:superagent@1.6.1",
    "superagent-extend": "npm:superagent-extend@0.1.6",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-constants@0.1.0": {
      "constants-browserify": "npm:constants-browserify@0.0.1"
    },
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.11.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-net@0.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "timers": "github:jspm/nodelibs-timers@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-timers@0.1.0": {
      "timers-browserify": "npm:timers-browserify@1.4.2"
    },
    "github:jspm/nodelibs-tty@0.1.0": {
      "tty-browserify": "npm:tty-browserify@0.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:asn1.js@4.3.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "bn.js": "npm:bn.js@4.6.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:async@0.9.2": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:babel-runtime@5.8.34": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browserify-aes@1.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.2",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:browserify-cipher@1.0.0": {
      "browserify-aes": "npm:browserify-aes@1.0.5",
      "browserify-des": "npm:browserify-des@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
    },
    "npm:browserify-des@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:browserify-rsa@4.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "constants": "github:jspm/nodelibs-constants@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.1"
    },
    "npm:browserify-sign@4.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "browserify-rsa": "npm:browserify-rsa@4.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.0.2",
      "inherits": "npm:inherits@2.0.1",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@1.0.27-1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:cipher-base@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:combined-stream@0.0.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "delayed-stream": "npm:delayed-stream@0.0.5",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:create-ecdh@4.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.0.2"
    },
    "npm:create-hash@1.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "ripemd160": "npm:ripemd160@1.0.1",
      "sha.js": "npm:sha.js@2.4.4"
    },
    "npm:create-hmac@1.1.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:crypto-browserify@3.11.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.0",
      "browserify-sign": "npm:browserify-sign@4.0.0",
      "create-ecdh": "npm:create-ecdh@4.0.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "diffie-hellman": "npm:diffie-hellman@5.0.0",
      "inherits": "npm:inherits@2.0.1",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "public-encrypt": "npm:public-encrypt@4.0.0",
      "randombytes": "npm:randombytes@2.0.1"
    },
    "npm:debug@2.2.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ms": "npm:ms@0.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:delayed-stream@0.0.5": {
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:des.js@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
    },
    "npm:diffie-hellman@5.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.0",
      "randombytes": "npm:randombytes@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:elliptic@6.0.2": {
      "bn.js": "npm:bn.js@4.6.2",
      "brorand": "npm:brorand@1.0.5",
      "hash.js": "npm:hash.js@1.0.3",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:evp_bytestokey@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:form-data@0.2.0": {
      "async": "npm:async@0.9.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "combined-stream": "npm:combined-stream@0.0.7",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "mime-types": "npm:mime-types@2.0.14",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:formidable@1.0.14": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:hash.js@1.0.3": {
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:methods@1.0.1": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:miller-rabin@4.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "brorand": "npm:brorand@1.0.5"
    },
    "npm:mime-db@1.12.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:mime-types@2.0.14": {
      "mime-db": "npm:mime-db@1.12.0"
    },
    "npm:mime@1.3.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:node-uuid@1.4.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:pako@0.2.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:parse-asn1@5.0.0": {
      "asn1.js": "npm:asn1.js@4.3.0",
      "browserify-aes": "npm:browserify-aes@1.0.5",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-to-regexp@1.2.1": {
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:pbkdf2@3.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:public-encrypt@4.0.0": {
      "bn.js": "npm:bn.js@4.6.2",
      "browserify-rsa": "npm:browserify-rsa@4.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "randombytes": "npm:randombytes@2.0.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:randombytes@2.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.0.27-1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:ripemd160@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sha.js@2.4.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:superagent-extend@0.1.6": {
      "path-to-regexp": "npm:path-to-regexp@1.2.1",
      "superagent": "npm:superagent@1.6.1"
    },
    "npm:superagent@1.6.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "cookiejar": "npm:cookiejar@2.0.6",
      "debug": "npm:debug@2.2.0",
      "extend": "npm:extend@1.2.1",
      "form-data": "npm:form-data@0.2.0",
      "formidable": "npm:formidable@1.0.14",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "methods": "npm:methods@1.0.1",
      "mime": "npm:mime@1.3.4",
      "qs": "npm:qs@2.3.3",
      "readable-stream": "npm:readable-stream@1.0.27-1",
      "reduce-component": "npm:reduce-component@1.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:timers-browserify@1.4.2": {
      "process": "npm:process@0.11.2"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
