const bluebird = require("bluebird");
const fs = require("fs");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const puppeteer = require("puppeteer-extra");
const useProxy = require("@stableproxy/puppeteer-page-proxy");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const IDRIVE_ENPOINT = "d4b6.or4.idrivee2-60.com";
const IDRIVE_ACCESS_KEY_ID = "5ce3lLJdmdBVLqcX7RPD";
const IDRIVE_SECRET_ACCESS_KEY = "a6USwSGtrxBDlV2n19XUJWcMt69ivtpu5zm63Hfi";
const BUCKET_NAME = "alchemy-dwi-cookies";

const CONCURENCY = 2;
const HEADLESS = false; // HEADLESS  false or false;

const USE_PROXY = false;
const PROTOCOL = "http";
const PROXY_HOST = "gate.smartproxy.com";
const PROXY_PORT = "7000";
const PROXY_USERNAME = "spoj3coqzt";
const PROXY_PASSWORD = "ttZaB35y17tG~Ocsdw";

const dataAccount = `
lavern.gerhold@mailto.plus,@@Masuk123$$,0x8823a43fca98d4828983616ff6f83fa6edcbef21
echo.sawayn@merepost.com,@@Masuk123$$,0xfbc18c4e3b19eddfc531878e63ab8628e8056ee2
inez.wyman@merepost.com,@@Masuk123$$,0x4cadaa27af992bb2ca7736c5d26e451b6da7577e
quincy.beatty@fexbox.org,@@Masuk123$$,0xa5fd180d5c7fc9f58318c45a5b392a4b75b3317e
graciela.nienow@fexbox.org,@@Masuk123$$,0xbf422f5e7970c43ff43ad0be90a8a2a57e7d9ca1
blake.paucek@fexbox.org,@@Masuk123$$,0x9f635cd9f1969d21266cb1381d0e87b9e3855d64
eleonora.aufderhar@merepost.com,@@Masuk123$$,0xf3f41895bce01917e7ee52bd65dd654afb521cfc
jada.swift@fexbox.org,@@Masuk123$$,0xfe0f7e3e781234cec00fa074ebfacff4220577c9
donn.beatty@rover.info,@@Masuk123$$,0x6a0d1ba65332a229ec86d14706ebf8b41a1ee1fd
gary.quigley@fexbox.org,@@Masuk123$$,0xbdfab0fc8f2102920652470a9b13070bf2056fbc
trudy.cartwright@rover.info,@@Masuk123$$,0x04f587fe5a66884349c4c945a0c99ab76addf649
alonso.thiel@mailto.plus,@@Masuk123$$,0x6723bf831ea97aad4b9cc375b0c882c41d0519fb
rosanne.legros@fexbox.org,@@Masuk123$$,0x08f387d0901413d4f2747de63ee534bff2e59c39
phylicia.langosh@merepost.com,@@Masuk123$$,0x321b99abb0857e414c1bdbaf561245fefe9c0686
dylan.kling@mailto.plus,@@Masuk123$$,0x8fdd767f36071d98512e58d9771d8c0422536124
kamilah.dibbert@rover.info,@@Masuk123$$,0x9582908f7942f23ae967194da2aa49e69edd835b
regan.johns@merepost.com,@@Masuk123$$,0x17ae5dd57e762c54104c19967b556bddeddc9de2
carroll.treutel@fexbox.org,@@Masuk123$$,0x28ec7d745d903691dc674e57929ad397cc5ca635
harriett.zulauf@fexbox.org,@@Masuk123$$,0x27b543780b7311b449a56bafcb75ba15eba4c30c
tamika.o'hara@rover.info,@@Masuk123$$,0xdf7224d783112f19f20fe83365cfa0c58af0ac6c
eloise.pollich@fexbox.org,@@Masuk123$$,0x1a8fcb6f04ed158a4b0d198403c2107df2d0082c
candie.reichel@fexbox.org,@@Masuk123$$,0x913841d8dac050415a33d90537000b9aad08e876
nenita.feil@mailto.plus,@@Masuk123$$,0x793863a521c1391d754ebf8327af9ee8f75a25ca
tamara.legros@rover.info,@@Masuk123$$,0x4ea590c2a895ffcdee9f7fcb16e5e1e0d2a3e79c
tommy.herzog@merepost.com,@@Masuk123$$,0xac13e1a8a5e365c512d633c70ad8f83569f8eec9
adan.padberg@merepost.com,@@Masuk123$$,0xae651d9c3174c3cd2453a73b5be0234c3b01ecdc
jeanelle.bins@rover.info,@@Masuk123$$,0x3f76c9e79a1fab307bd2b8726aaf8652c34271ec
belinda.jenkins@mailto.plus,@@Masuk123$$,0x19ef212856e6aec53a6d04b9788a63ee994ab569
anibal.wuckert@merepost.com,@@Masuk123$$,0x29af047e0b64f432a9240141a53aeee752c3400f
karisa.hagenes@rover.info,@@Masuk123$$,0xa9244449758ec6872e22c3bc18e25e8931744f06
maurice.kreiger@rover.info,@@Masuk123$$,0x34fe20cc7b594aef5c7512fc5f113169d20de0c8
ailene.borer@mailto.plus,@@Masuk123$$,0x78f6ed917e77f05cbded3ce726628f4810a536ea
donn.pfeffer@rover.info,@@Masuk123$$,0xd199e21f5235e9c03e81dc5f89c720bcbc3f00fc
lucila.runolfsson@mailto.plus,@@Masuk123$$,0x17d3585e8cf0e5179816b9c7c1cc47f67ac7090c
jonas.johnston@merepost.com,@@Masuk123$$,0x228c813ed8fcd5e5a22498cd92bf6ce44a3a9cad
christian.koelpin@mailto.plus,@@Masuk123$$,0xa4e2971a1ec378df1d8896e029b7934188ec7291
brice.dickinson@merepost.com,@@Masuk123$$,0xf7a5f947ef0cbce33d7e8c61a23086bd51710b8d
kristian.funk@merepost.com,@@Masuk123$$,0x0b210e4c759517b8a25cdd495ee58f68f2d051c4
lilli.ratke@rover.info,@@Masuk123$$,0x04e754f066b3778fa6cea4dad5ad39792ff9a958
casey.bernier@mailto.plus,@@Masuk123$$,0x0e9d9c2bd4a69c2a65eaf773deb5debad1c0462e
betsy.schinner@mailto.plus,@@Masuk123$$,0x949c8e78d0b937a1652d738054360cbfa1339b06
rona.heaney@rover.info,@@Masuk123$$,0x3a863ed3218547addcb87e4bcc01eea930b94456
tracey.thiel@mailto.plus,@@Masuk123$$,0xe70681ebf018a95174804e32021dfdac38cd9cf3
emile.parker@merepost.com,@@Masuk123$$,0xf11a38969863d31049881901fd1c45beb62c6acd
raphael.aufderhar@fexbox.org,@@Masuk123$$,0xdd833482dc89c897975923520c86cde9cc317149
chantay.sanford@fexbox.org,@@Masuk123$$,0x2fbd721475bf25c91863baf37a8f80daa9e41b70
ana.senger@fexbox.org,@@Masuk123$$,0xa73e89fe19db966f0dc5af3415a79c62e4c9cbc1
leopoldo.brown@merepost.com,@@Masuk123$$,0x03cdec785b7989f2f7086ec8f8265451f0496f63
mariano.doyle@mailto.plus,@@Masuk123$$,0x49d5ef37a587c7fcebc2ee089cc0b9e4eb28a1e3
stephany.ernser@fexbox.org,@@Masuk123$$,0x4e7771a10e56e65005b21724257d50022fcd2d1a
minerva.lang@merepost.com,@@Masuk123$$,0x31b254782f257f8224d2f718fedf5b17c121485a
jacinta.lang@merepost.com,@@Masuk123$$,0x15318a26388fb29f13eebdef4ceb10f33328a3b4
gale.roberts@mailto.plus,@@Masuk123$$,0x39d170e2c003ec62d50cd5105304d119efd54702
kylee.lakin@fexbox.org,@@Masuk123$$,0xf36656dba9288570d564677ebbee4a4a4cd0e9e1
delbert.bernier@rover.info,@@Masuk123$$,0x146869375f1d13bf006fb95d31a4bfb7906ef7ae
allen.carter@rover.info,@@Masuk123$$,0x411bee8476ca599e934defdf9f37f6c65b4d5a33
kimberli.ernser@fexbox.org,@@Masuk123$$,0x61e0abcba3635042d1becc10e8bcf343b5f88463
sonny.witting@fexbox.org,@@Masuk123$$,0xf469f0b3dc47cf1308e570ebf069994a7deb34de
xavier.lebsack@merepost.com,@@Masuk123$$,0xe228eae2a487463c9c97625452bf2e3001632e66
isreal.jakubowski@fexbox.org,@@Masuk123$$,0x5f3331da777e62374a6c945daf018a8b3f513d6f
erasmo.flatley@merepost.com,@@Masuk123$$,0x1e3265251505c1623d8de0a0f5e0c6b8bd3a5a89
glendora.mraz@mailto.plus,@@Masuk123$$,0x0a32ed995136b2130af79d257412045e7be57368
emery.emmerich@merepost.com,@@Masuk123$$,0x652bd165877225387dbd041fad02a9cc75e35fa7
wilbur.hand@fexbox.org,@@Masuk123$$,0xc9e87464d90ffe04be15245e071cee844b2b5900
dwain.jast@fexbox.org,@@Masuk123$$,0x4061e2c5223d9510049c163749047b6dc137cfe7
rigoberto.weimann@rover.info,@@Masuk123$$,0x8fd619e028d7ede142130b2a539f88282bc5063f
ross.keeling@merepost.com,@@Masuk123$$,0x2ed5b83350cb7c788503ad6df28b512a70557ccc
omar.conroy@merepost.com,@@Masuk123$$,0xb0fe54a047c14615e6ec8806c5654fc82b45cc4d
nigel.walker@merepost.com,@@Masuk123$$,0xc0517ad90545a303665079ef9040d40681c92dde
warren.smitham@mailto.plus,@@Masuk123$$,0x38b2ec10332f1f2e4f08b5f853482c4e8facd251
silas.emmerich@rover.info,@@Masuk123$$,0x360f115153f53f326c472c7da16dd2c0642f45ff
claude.sipes@rover.info,@@Masuk123$$,0xc05e201bf3324fac5b5023af59d86c66e25bb170
brendon.runolfsdottir@fexbox.org,@@Masuk123$$,0x65561da6c80d360c4d061f1358c641fb78eaa2a2
melaine.ebert@mailto.plus,@@Masuk123$$,0x5488cdae7bb4f417a22cd6efbf9db1d395d717bd
jon.roob@merepost.com,@@Masuk123$$,0x3a1209e0730574debd3a70bdf6e17503bd66d304
lindsy.gerhold@mailto.plus,@@Masuk123$$,0x77f8316b76ec67cf4a2ce7adee18c126972e6337
sandy.monahan@mailto.plus,@@Masuk123$$,0x005339a26847545f90d9ea75f3e02833c4a205f0
ardis.vonrueden@mailto.plus,@@Masuk123$$,0x13d1c1e191a9399d24be55e066bb63269cc44cb2
yael.hoeger@fexbox.org,@@Masuk123$$,0x12ef127afb71ec8eebf6f60f5be0f5d4f809a7ef
etsuko.hand@merepost.com,@@Masuk123$$,0xfad3be70d6ec011829c813128de4e16f33ec57b8
carroll.lang@rover.info,@@Masuk123$$,0x1655aa220ebdac1baca1732b5bd425c349befbbd
ebony.bradtke@rover.info,@@Masuk123$$,0x7208cbe16540e6a632f5d3f1fc0fac08ef012ff2
deon.jenkins@mailto.plus,@@Masuk123$$,0xe14e6b2ad18d6bcd14063c82f6d08141ecdfc2b7
lena.wyman@merepost.com,@@Masuk123$$,0x7c397359bad29ff78ef9db2558c9131ff28c0674
janeen.schumm@mailto.plus,@@Masuk123$$,0x8210d10c08c1171117dcaccf83def0f1d3b76b5a
romona.dickinson@mailto.plus,@@Masuk123$$,0x4287c79479a387b913c40f2e51a1e60c9b68cba4
jacquelyn.jones@merepost.com,@@Masuk123$$,0x554413029111d221c4915246d6a4eb1362fe8741
sherrie.kovacek@rover.info,@@Masuk123$$,0x0d8f2db511da203a74043708ca963ed369240f68
katheryn.huels@rover.info,@@Masuk123$$,0x53d9ccb865a3d46f96dcd5c6f71f59e512a239f1
jordan.harris@merepost.com,@@Masuk123$$,0xdb34b2a5b3a0a9d67836c4c3f8bd3057c4994063
lanette.zulauf@fexbox.org,@@Masuk123$$,0x050ef9501ddcc5ff9c74b03ab1db131aed8f5bf1
modesto.stanton@fexbox.org,@@Masuk123$$,0xb34815d3dcfc113926e3be908f868963876afede
renae.blick@mailto.plus,@@Masuk123$$,0x9a468be28b80879d99858bded349ebdd87ea15aa
laurence.douglas@fexbox.org,@@Masuk123$$,0x1838d1b6789f026f92fb8a21468e2cd80cb5a71a
bella.lockman@merepost.com,@@Masuk123$$,0x05a92381366b59d1e1d14adac2075280e93d65f9
clair.doyle@rover.info,@@Masuk123$$,0xb9ee0fdcc7d3102ba4905414b927acab5ab121b7
garfield.wiegand@mailto.plus,@@Masuk123$$,0xf0a6b2b3ec07fccd74a51de153a961f673f1d0fc
dominick.lind@merepost.com,@@Masuk123$$,0x16829f670931b2099b5e397c3cc4d875abd390dd
anibal.price@mailto.plus,@@Masuk123$$,0x5ebf65308eeff17581b6a8f872ede8b30d012554
cheyenne.hermann@fexbox.org,@@Masuk123$$,0x9b8a0a1d7ab8ea67f3011b04334edc6c5d8a840c
adriene.sanford@fexbox.org,@@Masuk123$$,0x52283f489ebeb73a0b54188d10112553b2e70ac4
ellis.gerlach@fexbox.org,@@Masuk123$$,0xedf4dcf68882f4ec7c0438ee17a1d14c0414d7c3
loriann.erdman@merepost.com,@@Masuk123$$,0x3a0073fa0fbda985cfcac6b106629c7a538aa8ef
tristan.kihn@fexbox.org,@@Masuk123$$,0x58e910628067eead06003e8a80363dc0a1137b64
celia.hessel@rover.info,@@Masuk123$$,0x393b85c6e839053140f5613f795b4534ce437cd3
vance.cronin@merepost.com,@@Masuk123$$,0xda0eb59a80d2ce3531f67a701a6ab4d31a0c03bc
kent.moore@fexbox.org,@@Masuk123$$,0xbf232cacc9a60bd2af6b87e682d160e4dd2237b3
tom.block@merepost.com,@@Masuk123$$,0x8baa4554313cd6441ae97c789c20500fcf000e3c
bethanie.sporer@mailto.plus,@@Masuk123$$,0x851003738cd6e8a5c13f6580ade258457efb1eca
johana.kris@rover.info,@@Masuk123$$,0x6fce966cc4b5ac4de34dd24db907025ab29965e8
donte.breitenberg@fexbox.org,@@Masuk123$$,0xf0858466c6e5ddaa1ae24fc02391beef0ccb36eb
wes.lehner@rover.info,@@Masuk123$$,0x15d2ed2a144065a1ebe4cb08fa99ab7cd8eaaae2
sherri.littel@mailto.plus,@@Masuk123$$,0x0aaaeba54c8440079934a4657a4a3e3864202d29
larita.bergnaum@rover.info,@@Masuk123$$,0x8b6a455cd2e2cf8ba8ccc153837226bbb4b432d7
sharleen.windler@merepost.com,@@Masuk123$$,0x9fdb7a8cd3da0cb334b9a1b7361b7d148750a9d2
janita.harvey@mailto.plus,@@Masuk123$$,0x893f7b3691ecfb63529a1ca2cf8686f15f6e07c8
leonard.kihn@merepost.com,@@Masuk123$$,0x0f56332502f291b618361cca53ddb69c486c7564
astrid.kuhlman@fexbox.org,@@Masuk123$$,0x742f998fdfe54ce0f9ad46d2e3f6dd998ef488be
len.goyette@merepost.com,@@Masuk123$$,0x9d82882c3b6dd6110da88c16f66013e1fe6c1ae2
noe.schamberger@merepost.com,@@Masuk123$$,0xdebc100cfd1934cc2cd55022117f598fc37f9022
luigi.nader@merepost.com,@@Masuk123$$,0x1211b0f1a6479b37a0494b08adbb4c3782a36994
grant.franecki@rover.info,@@Masuk123$$,0xbab82e80f61e92b627e81998cf853010fe3167d5
johana.schroeder@merepost.com,@@Masuk123$$,0xf107df66b09e7a18ad9b83444afdbeb78aa2e618
samantha.brekke@fexbox.org,@@Masuk123$$,0x22249c4947036cb998beccf204ab9661f5bd6a41
stanford.ebert@rover.info,@@Masuk123$$,0x829c3cdec2d5155e4401bde61245c49319b5a560
jeffrey.jones@mailto.plus,@@Masuk123$$,0x8e9fc584af4095865ed803b8880d148cce1dc95e
melania.kuvalis@mailto.plus,@@Masuk123$$,0x8d6c49d8d6b84c051f5d560f423157102c8ca977
anna.tromp@rover.info,@@Masuk123$$,0x0996256ae699dd0d27491f386359db06b6c428a9
leisha.vonrueden@fexbox.org,@@Masuk123$$,0xcf113b13a50e387dd61e0365046794bd601524c9
joetta.goyette@fexbox.org,@@Masuk123$$,0x8b333af237285ac49ba1da07f41be755132d4351
carlton.murray@mailto.plus,@@Masuk123$$,0x115910bfdce24242ff38f733c41431a7961c7597
eric.boyle@fexbox.org,@@Masuk123$$,0x4f841b119ba04755a0d5996824f2365b33fdb21b
connie.okuneva@mailto.plus,@@Masuk123$$,0xda7fff0751bda221504f0512b8a555157b103942
bud.langosh@rover.info,@@Masuk123$$,0xf4e072dc08cbfd14671ea1f2136651eb06de5804
nicole.bahringer@merepost.com,@@Masuk123$$,0xea372504eeb4d4ff9e53f97fe32f1572999eb57f
van.hamill@merepost.com,@@Masuk123$$,0x73fa5e45ee02874d5fcbfd2962c85bd635f8dda4
tessie.heller@rover.info,@@Masuk123$$,0x869d53285160d5806f65d881e7429c399e937a01
cameron.steuber@rover.info,@@Masuk123$$,0x923dd1cb0a378ce8e5348badbfe5c25e2f8c9566
dustin.christiansen@mailto.plus,@@Masuk123$$,0xe6c844229bcc9a8f47971984a6ddb3d470c00868
marge.block@mailto.plus,@@Masuk123$$,0xa84a974073f5f8814491306267a8b53b795c4f3c
pearlene.kuhn@mailto.plus,@@Masuk123$$,0x5a983a968c95642f115713633a4706e9a2b988b1
lois.stroman@merepost.com,@@Masuk123$$,0x831ba8c54645565028aba07a7d92f71faad8723c
osvaldo.price@mailto.plus,@@Masuk123$$,0x4664ed4b38ffe7654152bfd29a7c83d9e2ce612b
eliseo.huels@fexbox.org,@@Masuk123$$,0x5b25157b3eed6ba17995dca9a9b2d3f669f95dd8
tyrone.pfeffer@fexbox.org,@@Masuk123$$,0xf5ca2107684f05a71bd1b7541422e8afa78213a9
gene.kutch@mailto.plus,@@Masuk123$$,0x219d052c7005e72c549ec5ced8a8756d35f8d874
eugenio.murphy@merepost.com,@@Masuk123$$,0x7a68aa8ddfa0f93c65a666662c863d8733a12be0
maple.swift@merepost.com,@@Masuk123$$,0x6cce2fc514d1e30d39c35a4cf3c24d135791976e
eileen.wilderman@merepost.com,@@Masuk123$$,0x595b657c65929fc4694fb313d81cbb4a68e62610
christian.stamm@fexbox.org,@@Masuk123$$,0x5f6eecc6c3ba19b0e642eee2dbc6b4d4faa60aaf
`;

const waiting = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getData = (data, start, end) => {
  const splitData = data.split(/\r?\n/).filter((n) => n);
  const sliceData = splitData.slice(start, end);
  return sliceData;
};

const s3 = () => {
  const endpoint = new AWS.Endpoint(IDRIVE_ENPOINT);
  const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: IDRIVE_ACCESS_KEY_ID,
    secretAccessKey: IDRIVE_SECRET_ACCESS_KEY,
  });

  return s3;
};

const existsBucket = async (bucketName) => {
  try {
    await listObjects(bucketName);

    return true;
  } catch (err) {
    if (err.code == "NoSuchBucket") {
      return false;
    } else {
      throw err;
    }
  }
};

const listObjects = (bucketName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
    };

    s3().listObjects(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getObject = (bucketName, fileName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
    };

    s3().getObject(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const createObject = async (obj, bucketName, fileName) => {
  const buf = Buffer.from(JSON.stringify(obj));

  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "application/json",
      ACL: "private",
    };

    s3().upload(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const checkExistsObject = async (bucketName, fileName) => {
  try {
    await getObject(bucketName, fileName);

    return true;
  } catch (err) {
    if (err && (err.code == "NoSuchKey" || err.code == "NoSuchBucket"))
      return false;
  }
};

const saveCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const reaponseCookies = await session.send("Network.getAllCookies");

  await session.detach();
  await createObject(reaponseCookies.cookies, BUCKET_NAME, cookieFile);
};

const loadCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const cookies = JSON.parse(cookieFile);
  await session.send("Network.setCookies", {
    cookies: cookies,
  });
  await session.detach();
};

const retryElement = async (page, element, xpath = false, retryCount = 2) => {
  try {
    if (xpath) {
      return await page.waitForXPath(element, { timeout: 8000 });
    } else {
      return await page.waitForSelector(element, { timeout: 8000 });
    }
  } catch (err) {
    if (retryCount <= 0) {
      throw err;
    }
    const currentUrl = await page.url();
    await page.goto(currentUrl, { waitUntil: "networkidle2" });

    return await retryElement(page, element, (xpath = false), retryCount - 1);
  }
};

const launchBrowser = async () => {
  try {
    let browser;

    let args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-notifications",
      "--no-first-run",
      "--disable-gpu",
      // "--start-maximized",
      "--disable-infobars",
      "--disable-web-security",
      "--ignore-certificate-errors",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
      "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
    ];

    const proxyHost = `${PROTOCOL}://${PROXY_HOST}:${PROXY_PORT}`;

    USE_PROXY ? args.push(`--proxy-server=${proxyHost}`) : null;

    let browserOptions = {
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: HEADLESS,
      ignoreHTTPSErrors: true,
      acceptInsecureCerts: true,
      defaultViewport: null,
      args: args,
    };

    browser = await puppeteer.launch(browserOptions);
    const context = browser.defaultBrowserContext();

    context.overridePermissions("https://auth.alchemy.com", [
      "geolocation",
      "notifications",
    ]);
    context.overridePermissions("https://www.alchemy.com", [
      "geolocation",
      "notifications",
    ]);

    const [page] = await browser.pages();

    if (USE_PROXY) {
      await page.authenticate({
        username: PROXY_USERNAME,
        password: PROXY_PASSWORD,
      });
    }

    await page.setRequestInterception(true);
    const rejectRequestPattern = [
      "googlesyndication.com",
      "/*.doubleclick.net",
      "/*.amazon-adsystem.com",
      "/*.adnxs.com",
      "/*.ads.net",
    ];
    const blockList = [];
    page.on("request", (request) => {
      if (
        rejectRequestPattern.find((pattern) => request.url().match(pattern))
      ) {
        blockList.push(request.url());
        request.abort();
      } else request.continue();
    });

    return { page, browser };
  } catch (err) {
    console.log(`Browser ${err}`);
  }
};

const login = async (page, email, password) => {
  try {
    await page.goto("https://www.alchemy.com/faucets/arbitrum-sepolia", {
      waitUntil: "networkidle2",
    });

    const cookieFile = `${email}.json`;

    const isExistCookies = await checkExistsObject(BUCKET_NAME, cookieFile);

    if (isExistCookies) {
      const getCookies = await getObject(BUCKET_NAME, cookieFile);
      const cookies = getCookies.Body.toString("utf-8");
      await loadCookies(page, cookies);
    }

    await waiting(5000);

    const logoutButtonElm = await page.$$eval("button", (button) => {
      const logoutButton = button.find(
        (btn) => btn.textContent.trim() == "Logout"
      );

      if (logoutButton) {
        return true;
      }

      return false;
    });

    if (logoutButtonElm) {
      return true;
    }

    await page.$$eval("button", (button) => {
      const loginButton = button.find(
        (btn) => btn.textContent.trim() == "Alchemy Login"
      );

      if (loginButton) {
        loginButton.focus();
        loginButton.click();
      }
    });

    await waiting(10000);

    try {
      await retryElement(page, 'input[type="email"]');

      const inputUser = await page.$('input[type="email"]');
      await page.evaluate((user) => {
        user.focus();
        user.click();
      }, inputUser);
      await page.keyboard.type(email);

      const inputPass = await page.$('input[type="password"]');
      await page.evaluate((pass) => {
        pass.focus();
        pass.click();
      }, inputPass);
      await page.keyboard.type(password);

      await page.waitForSelector('button[type="submit"]');
      const buttonLogin = await page.$('button[type="submit"]');

      await page.evaluate((login) => {
        login.click();
      }, buttonLogin);

      await waiting(15000);

      await saveCookies(page, cookieFile);
    } catch (err) {}

    return true;
  } catch (err) {
    console.log(`[${email}] - Login error ${err}`);
  }
};
const claimFoucet = async (page, email, wallet) => {
  let success = false;
  let retry = 0;
  let maxTry = 3;
  let message = "";

  try {
    while (!success && retry <= maxTry) {
      await waiting(2000);

      await retryElement(page, 'form input[type="text"]');
      const walletInputElm = await page.$('form input[type="text"]');

      await page.evaluate((walletInput) => {
        walletInput.focus();
        walletInput.click();
      }, walletInputElm);

      await page.keyboard.down("Control");
      await page.keyboard.press("A");
      await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");
      await page.keyboard.sendCharacter(wallet);

      await page.waitForXPath('//div/button[contains(., "Send Me ETH")]');

      const [sendButtonElm] = await page.$x(
        '//div/button[contains(., "Send Me ETH")]'
      );

      await waiting(2000);

      await sendButtonElm.click();

      await waiting(4000);

      const successClaimElm = await page.$x(
        '//*[@id="root"]/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div[2]'
      );

      if (successClaimElm !== "undefined" && successClaimElm.length > 0) {
        console.log(`[${email}] - BERHASIL CLAIM ARBIT !!`);
        success = true;
        return true;
      } else {
        const [spanMessageElm] = await page.$x('//div[@role="alert"]/span');

        let textMessage = await page.evaluate(
          (element) => element.textContent.trim(),
          spanMessageElm
        );

        message = textMessage;

        retry++;

        await waiting(3000);
      }
    }

    console.log(`[${email}] - GAGAL CLAIM ARBIT ${message}`);
    return true;
  } catch (err) {
    console.log(`[${email}] - TERJADI ERROR: ${err}`);
  }
};

const bot = async (page, account) => {
  let success = false;
  try {
    await page.bringToFront();
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    await client.send("Page.enable");
    await client.send("Page.setWebLifecycleState", { state: "active" });

    const data = account.split(",");
    const email = data[0];
    const password = data[1];
    const wallet = data[2];

    const sigin = await login(page, email, password);

    if (sigin) {
      success = await claimFoucet(page, email, wallet);
    }

    return success;
  } catch (err) {
    console.log(err);
  }
};
(async () => {
  const args = process.argv;

  // const startData = parseInt(args[2]);
  // const endData = parseInt(args[3]);

  // if (!startData && !endData) {
  //   console.log(`Params require "node run.js 0 5"`);
  //   process.exit();
  // }

  // For github action
  const rangeDate = process.env.RANGE_INDEX;
  const splitDate = rangeDate.split(",");
  const startData = splitDate[0];
  const endData = splitDate[1];

  const accounts = getData(dataAccount, startData, endData);

  return bluebird.map(
    accounts,
    async (account) => {
      const { page, browser } = await launchBrowser();

      try {
        await bot(page, account);
      } catch (err) {
        await browser.close();
      }

      await browser.close();
    },
    { concurrency: CONCURENCY }
  );
})();
