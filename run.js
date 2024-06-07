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
wesley.mills@mailto.plus,@@Masuk123$$,0xc7a1f37b993e1825e4ac96ddc08422d9c99e37b9
elijah.hoppe@fexbox.org,@@Masuk123$$,0x73f50d98707d87dd5c82b534dddc1f4471aa56ef
janiece.bashirian@fexbox.org,@@Masuk123$$,0x35902c0dda2537e7e9364736a85f4463eed8f7f0
fernando.metz@rover.info,@@Masuk123$$,0x32c8f4e9a90a1aac9fadfd225c9496d3a04ee3b9
clark.bailey@rover.info,@@Masuk123$$,0xc15a7cdda8b18c4ef8ce061a803cd8efaa142d73
graig.harris@rover.info,@@Masuk123$$,0x9221780c0cb1f61091b3e02ef94fe7d213277631
angela.keebler@merepost.com,@@Masuk123$$,0x252a989db96786b3b2e0cfc9cf5ddcf0359cc921
dalton.morar@mailto.plus,@@Masuk123$$,0xcb7a8f7e116699dc93b68f6e7ecf75cbfa4ae9d9
marylee.orn@fexbox.org,@@Masuk123$$,0x7c86ef0016909855ad57db09b69013fd026b5050
filiberto.wisozk@merepost.com,@@Masuk123$$,0x957dc0d71e46ee7443b7290c4b28b116b281aa4d
shad.harber@mailto.plus,@@Masuk123$$,0x6997572d648513eb0b93e4e00e097027ea045cbf
rico.swift@fexbox.org,@@Masuk123$$,0xb77243da23a8e3c67c744ea539a18331ec147730
cristobal.jakubowski@mailto.plus,@@Masuk123$$,0x29d63b9545f97078168196ca45b6cf3997ccb1bb
terrence.hintz@merepost.com,@@Masuk123$$,0x9a9b5a1f36f88ac45d114a03623fb1eb6a948614
luciano.kuvalis@fexbox.org,@@Masuk123$$,0x24063f0992e27629cc990d8e7927b918e64ae1e0
in.koepp@merepost.com,@@Masuk123$$,0xde63207d86d489936f5d5872a8243119d722d7dd
jeanett.kerluke@fexbox.org,@@Masuk123$$,0xe24425716bce7b5bc33c90fda19649b03f2e0b6c
denver.russel@rover.info,@@Masuk123$$,0x9d02184c3d68353649b045ccfc4063340f64ea84
brendon.rolfson@merepost.com,@@Masuk123$$,0xd9e72d4b9942548553f17a6ea459f2b08ee84216
vickie.wyman@merepost.com,@@Masuk123$$,0xd0dfaa276fd90f7c0f03b42245cb5243cf8b66d6
lyn.braun@fexbox.org,@@Masuk123$$,0xc76189cb2c8607166066acf59834fc5a2f92a72d
bert.marquardt@fexbox.org,@@Masuk123$$,0x75531b615739b3e995a37eec58b00fd1b621c990
russell.vandervort@mailto.plus,@@Masuk123$$,0x4d67ce8d624c5c243a4be819a4a741cecaa2b28a
julio.osinski@merepost.com,@@Masuk123$$,0xb1e270f3d1283422d2bc28580c9a7535f646c1ff
kathlyn.koelpin@fexbox.org,@@Masuk123$$,0xae6d60a43c1c525357b301a927098184bfd790e9
chloe.zulauf@fexbox.org,@@Masuk123$$,0x2dbffd17f4d5c6da9cb0ce022ccab612bcc71993
allena.wintheiser@fexbox.org,@@Masuk123$$,0xc359147d3ba3ff2a0123d2850324c7a4cfe18bd8
jeromy.ratke@merepost.com,@@Masuk123$$,0x3fa7af1cd83e1a5f75c11de92ffbb1b18fb43784
tiesha.kerluke@fexbox.org,@@Masuk123$$,0xf45288968ebaa0f48c5a696d7694460910570827
shanna.lehner@mailto.plus,@@Masuk123$$,0xd6d4d616d804407c8cf494289c14be018a00de34
kathe.krajcik@merepost.com,@@Masuk123$$,0x218b464bdba12eb61a4b85d8864b0e9799e291c9
tamika.ratke@mailto.plus,@@Masuk123$$,0x835e96b0563a5804afdc8c3b8e1a7545b0ef2174
byron.watsica@merepost.com,@@Masuk123$$,0x84c7b050d6619b196d8b0128a0b2569a10fbe028
keira.reynolds@rover.info,@@Masuk123$$,0x4269857cc1e30d065e2916a71b8644bc2144c90f
tamika.nienow@merepost.com,@@Masuk123$$,0xe920b0e0415d1ca64a1aa9a0b510d75f5a12e471
rodolfo.ondricka@rover.info,@@Masuk123$$,0x6edce51085b6d688d957d9a5dfa25ac5e4de50ab
jan.wisoky@fexbox.org,@@Masuk123$$,0x228a233e36be5af834b70aacf82b6a2e1c37c489
jess.ortiz@rover.info,@@Masuk123$$,0x25e666fe88fd896efd41a2cb39d5a81ad4ab58d6
carlie.bayer@mailto.plus,@@Masuk123$$,0x4afa4758027324fdae3945843b365f50b279100c
cody.steuber@fexbox.org,@@Masuk123$$,0x26f154d8c2ed96a1975ef53ed56686b9b784f9db
joesph.wintheiser@rover.info,@@Masuk123$$,0x583df69afb369d6718e8b016a29547314d6367a4
sidney.franecki@fexbox.org,@@Masuk123$$,0x97bdfa19085146c454dcc83c5935fa6ba7e70123
neville.dickinson@fexbox.org,@@Masuk123$$,0xc93ca255494966a2c74ac25bb13b0d7b7105467e
luciano.cummings@mailto.plus,@@Masuk123$$,0xf87b24ab0a174934844c2cd53e698d50b070fc56
spencer.beahan@mailto.plus,@@Masuk123$$,0xbd5719c7fb62b16a553522efdd069034d962d7e4
hortencia.runolfsson@fexbox.org,@@Masuk123$$,0x3928f5435fb0063cc867bb9252a6454c72d0787d
jordan.kuvalis@fexbox.org,@@Masuk123$$,0x84836d325a5fc624c229188245dcff7d18217d78
otha.rau@fexbox.org,@@Masuk123$$,0x58f79a67ffdad1964f90faf07c35e2e20066b980
chet.will@mailto.plus,@@Masuk123$$,0xa61363b5c470ad125f59bd51cc6dbebcb85a9e28
estrella.corkery@merepost.com,@@Masuk123$$,0x2d271bf1116a3a0bde64592ac746f69b6730b120
charlette.metz@fexbox.org,@@Masuk123$$,0xf04e030bddaed1af3d24c996edff332291a1f7dc
terrell.nienow@merepost.com,@@Masuk123$$,0xdf00b6ed905a70acdc7d8e188291eb85e2a9a614
wilburn.kirlin@mailto.plus,@@Masuk123$$,0x0b626979e5617e06bfe0c6917363d00933d8779a
rocio.zulauf@merepost.com,@@Masuk123$$,0x8f46c9fe31868c274dc8752b9e3dbed534f3de14
adeline.stracke@mailto.plus,@@Masuk123$$,0xd114a518a9f07b9241fa336b215c274334794b0e
tashia.dibbert@mailto.plus,@@Masuk123$$,0xda69a6c875e0a8cf4a0dc2da75dfd1bdf25496c6
eliz.predovic@fexbox.org,@@Masuk123$$,0x88a20471f6fd474cea9af7215c1d4de2bc083ad1
thomas.thompson@rover.info,@@Masuk123$$,0x9bded5d9050419e1f7b49d4173244fabe885e504
shari.gleason@merepost.com,@@Masuk123$$,0x30647e2a076f1f79320e46de64fd6edd89ab4382
karima.glover@fexbox.org,@@Masuk123$$,0xd404f4f2a87160fdf36b24e8f6ca2ec238a81ff2
lonnie.bogisich@merepost.com,@@Masuk123$$,0x88426f4fb2c11d46568fc9d3e8ca31a98664215a
ernesto.daugherty@mailto.plus,@@Masuk123$$,0x82bdfed50766bcfb6e01cafd88dbf1f8a907127b
ron.swift@rover.info,@@Masuk123$$,0xcfa86b9894f11c155e831ed716f1663024feb38b
maegan.zulauf@merepost.com,@@Masuk123$$,0x2aa00dc72d2dcecabe3a9e8a50740ecf865fbaf2
junie.grant@merepost.com,@@Masuk123$$,0x1e232a298efb2c1f8734143866c5591afe517a83
doyle.zemlak@rover.info,@@Masuk123$$,0x78d3fb63ca867b75a5414712765bf56512375e53
kristofer.batz@merepost.com,@@Masuk123$$,0x4234e34643fec71dc446f355eadb488eb97052f1
aubrey.keebler@fexbox.org,@@Masuk123$$,0x8c07783cb674bdfb8c93339fa036f404182d7a12
thanh.graham@mailto.plus,@@Masuk123$$,0x1fd11d7b9879674a506704e5775e614da1b6aa32
ronna.will@rover.info,@@Masuk123$$,0x11c2f95b115ab813e35bd2cdf7e182a27338142c
denny.huels@mailto.plus,@@Masuk123$$,0x8ad4176d3acba702fb833e990ca9d27601aa7849
olin.legros@merepost.com,@@Masuk123$$,0x768c9d89028f0be74255ee595301f1e21e192212
craig.windler@rover.info,@@Masuk123$$,0x068847984f096f52821b3a9767e4f31d4167d0ec
danial.veum@fexbox.org,@@Masuk123$$,0x4cffd1f2dac9836b04f56001e4413fcc2e952cef
christopher.kertzmann@merepost.com,@@Masuk123$$,0x6407ffb080c1d1d157b401bc9374da01d9a3c2ca
nelson.west@mailto.plus,@@Masuk123$$,0x0e68625dab4cf6a2afc539fc33dfcaa3c064a9bb
jewell.greenholt@mailto.plus,@@Masuk123$$,0x72735ae60579085280f2388f675ad5ad15096d82
man.stanton@merepost.com,@@Masuk123$$,0xa7f850dba721ed0a64982b0f3942dbe31d5055d4
shawnee.hartmann@merepost.com,@@Masuk123$$,0x1f26f514826bd871ebabe99e5d2bc647e0da8657
katelin.mayer@merepost.com,@@Masuk123$$,0x004b8a7f817d35ac2fe393c064e7f94407dfe611
gertie.veum@merepost.com,@@Masuk123$$,0xbc8ed65224cfdb44902abfb49edd577d3cb6c051
mervin.white@fexbox.org,@@Masuk123$$,0x587d7a2e9fc26c02fab07cc484d3714f6939e69b
audrie.purdy@fexbox.org,@@Masuk123$$,0xfa7968a1875ea5abdf02e0c920c81330c51e1336
don.o'kon@fexbox.org,@@Masuk123$$,0x8f7ba3b368c2acac16d2862312e9042f65617dd1
tyrell.medhurst@mailto.plus,@@Masuk123$$,0xb09b47a18966f0854950ed7cb6c1eac990aaee43
roosevelt.morar@rover.info,@@Masuk123$$,0x08f3b8c6b9841163f1c26b0a217ffaabc8a9a3d0
florinda.terry@rover.info,@@Masuk123$$,0xcd926d7afc58e568dfff4e5965e869300e5e080c
lyman.mertz@mailto.plus,@@Masuk123$$,0xfc386dcbed701f41961f57c9230367b004f1cfd7
nettie.lemke@merepost.com,@@Masuk123$$,0xefbac945121d2dbcac2dcfc12fcc54c281c68994
suanne.langosh@mailto.plus,@@Masuk123$$,0x75f72858f65d52cd26b632b98f1babc16255121a
frankie.fahey@rover.info,@@Masuk123$$,0xf69f8b997daaf34d7d0cfe4e0af00e3bab29e9ea
corie.littel@mailto.plus,@@Masuk123$$,0xc8abbfb8c554712a77a4bec1b9a16d41e2f2ecaf
joan.prosacco@rover.info,@@Masuk123$$,0x062728c57cb78764d8e70e68a51764e83c87a9a2
sharyl.gutkowski@mailto.plus,@@Masuk123$$,0x13fcb3d225743d7e0c5fbb344a1b9ec68baeeb21
patrina.hettinger@fexbox.org,@@Masuk123$$,0xa508535b5bd28977799f15d5d6ed1a2eb40a33f4
sammie.rice@mailto.plus,@@Masuk123$$,0x74b04230262e6e5a99142576c6472bd68a3d83dd
lucrecia.lang@rover.info,@@Masuk123$$,0xdee0c633e6075275cb4f2699188e12460b665338
tad.price@merepost.com,@@Masuk123$$,0xe8c5b7fa369d57683555f296ab4e83637389c771
winnie.schoen@merepost.com,@@Masuk123$$,0x12c92f3d8ef991d58a11492ae69cc7502b34d82c
carrol.schuster@fexbox.org,@@Masuk123$$,0xe0e8bed7f59c3c4af578533c8269b7eb379bb728
augustus.harris@rover.info,@@Masuk123$$,0x917fc59b8f03716be80b1513124e2f6b33fcdc3a
ivan.purdy@mailto.plus,@@Masuk123$$,0x603b56004a975daeff77e2763943627b9cc2e471
jarrett.kuhlman@rover.info,@@Masuk123$$,0x1b0ba5ea21e09b63f6aa52aa86530e45c4df7cec
giuseppina.will@merepost.com,@@Masuk123$$,0x18a1c5128a45044f9bb88145e8049c9cd831cda9
numbers.schamberger@merepost.com,@@Masuk123$$,0x80c4402290547a34e78cc299b0ca83fc2e395e76
sheree.walsh@mailto.plus,@@Masuk123$$,0x4cd58031fe18184eed835fd5e76c2419a274fbd0
ivory.kuhn@mailto.plus,@@Masuk123$$,0x9bdaaad9a09c562c6791b5892216ba9d0bcf44a9
margarette.boehm@fexbox.org,@@Masuk123$$,0xfc2883b1c91c48e7542e42b571e2baca8d72ee77
sofia.champlin@fexbox.org,@@Masuk123$$,0x4fb101a9a8b3769c2a5c6b6caea42b3d9afdd120
salvador.shanahan@rover.info,@@Masuk123$$,0xa4e942c5aac02f07b93011479a40bae84e422a77
charlie.powlowski@merepost.com,@@Masuk123$$,0x5733c95c7f40b962f0e2e41bb7a61835055d3364
portia.beatty@fexbox.org,@@Masuk123$$,0x65acce14290a71a8f9d1102f27283f9fc0ecbe19
melany.schowalter@fexbox.org,@@Masuk123$$,0xd23c577ac85bcd045ce94722441e84eafb08c96e
fletcher.keeling@rover.info,@@Masuk123$$,0x9a2983c2d904bcceefe75171cfb5034797f404af
tod.prohaska@mailto.plus,@@Masuk123$$,0x475ebf4cb250b1ca5db9f5e6d2b4224845de8add
jerrod.schulist@rover.info,@@Masuk123$$,0x2e036196bdffd178b53b2e59d117172477aedf96
willian.vandervort@fexbox.org,@@Masuk123$$,0xf2f2887ad002d1d46636e3846b82605906cbd09c
dayle.aufderhar@rover.info,@@Masuk123$$,0x1132895433c60abc6bdd63dea33868f3f96b9ded
holli.wilkinson@rover.info,@@Masuk123$$,0x664ecccc788e3bd728e2ae1278154f5adac96e45
caron.russel@merepost.com,@@Masuk123$$,0xc330bcf5686970f93b0e1b5167e4498cba089964
bobby.gibson@fexbox.org,@@Masuk123$$,0x2181eabdfef05338e2818c6e029f48f43c7f60a0
marcelo.bartell@mailto.plus,@@Masuk123$$,0x81b55f5153bec90e1e86d2b914e9fc2d162cad66
wesley.hintz@mailto.plus,@@Masuk123$$,0xdec16cd6d03b96d65ba65a4cac46533652abad79
jolie.bernhard@rover.info,@@Masuk123$$,0xab7c2b8445756700fc80bf218f95f1f69ddb3013
rudolf.luettgen@merepost.com,@@Masuk123$$,0x560751a0c781fc0c3db036dd1e0fc97b01b98864
jena.donnelly@merepost.com,@@Masuk123$$,0x4b97d2bba416b1593ae7277288f72961e62211e6
jewell.gleichner@mailto.plus,@@Masuk123$$,0x55492ded34ddc743c7fe89c2076eaa42289066da
logan.mante@mailto.plus,@@Masuk123$$,0xebcd8fad9f7a54e83f30f9d3c2ce723e79bffea6
nicolle.abbott@merepost.com,@@Masuk123$$,0x748affe33d3f2628cb7c4620b9033960b6ba0263
merrie.wisozk@fexbox.org,@@Masuk123$$,0x57c7f68bb8203741ed5ec0e81b4cb2ba9f726458
edwardo.gleichner@merepost.com,@@Masuk123$$,0xcd0172bdbbc8c85cca4cbf42acf3fe51d4f6213a
sidney.cassin@rover.info,@@Masuk123$$,0x70f2904f559cc45d0f27bd2020efb4a89c3d0825
adelle.blick@merepost.com,@@Masuk123$$,0x46dc862f2d283d1ed0b778f13cdc4eae93e7745d
terrell.labadie@fexbox.org,@@Masuk123$$,0xaf1535249f5f552080c6b7783140c910af8d1470
neville.abbott@merepost.com,@@Masuk123$$,0x50fe65f7adbbc43e0857104d14613446cff76b94
cortez.jones@merepost.com,@@Masuk123$$,0x03234bcc74e061a1b500594752bb74c1d612b4f8
marquis.farrell@merepost.com,@@Masuk123$$,0x9643d8ff4fbbfeb475300f94ec66890e1912530c
marylin.miller@rover.info,@@Masuk123$$,0x6b290bfe0f92637343e0f9eb02a4f48c56083d6f
yong.murazik@mailto.plus,@@Masuk123$$,0x15bb7507f4be750a6bf6d7a6deb6e04dd6ba14b5
pearlie.littel@rover.info,@@Masuk123$$,0x094e493124e848124662744b6a5244b74be8fbd5
rosendo.steuber@merepost.com,@@Masuk123$$,0xf697222e8b445fdb8b0ac13388296336c0bf99d3
exie.terry@merepost.com,@@Masuk123$$,0x601e466b515546e68dc65fdaf112cb4b3940d555
jamie.kuphal@rover.info,@@Masuk123$$,0xf4bba32850aa4e89fdb941f48e46ff7e79f54ee6
rafael.lemke@rover.info,@@Masuk123$$,0x47f80c3c3e7bbd67d26d8130778bebbe5d15cf2f
boris.collier@fexbox.org,@@Masuk123$$,0x133564bb72986d9d15358dc333309b48946da7da
noah.blick@mailto.plus,@@Masuk123$$,0x1b3e04113b8111352da2086759db00c1b520e517
carlena.fritsch@mailto.plus,@@Masuk123$$,0x63a2d735f51a290869f4396a61ec72184576997f
stephen.zboncak@rover.info,@@Masuk123$$,0xed3feca50c8fc9ed201b2044561f10e3c1cd4c48
anibal.schroeder@fexbox.org,@@Masuk123$$,0x93bd334f2e33625b44bc361ed622f806e122a9c9
khadijah.ebert@mailto.plus,@@Masuk123$$,0x4684c86bf9bcd6bbdea726e326a9d4d7aa2f7d44
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
