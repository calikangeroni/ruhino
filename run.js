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
jeffrey.balistreri@rover.info,@@Masuk123$$,0x481a31c7380c5a2ff2b7e08226eac17ff2776aeb
robin.kris@fexbox.org,@@Masuk123$$,0xf857947599e5cde0b63958f3a38b97976b8ba232
mohammed.keebler@fexbox.org,@@Masuk123$$,0x82f2a9f6bea4356eca585b039bb04ff8f0d32de6
shani.russel@fexbox.org,@@Masuk123$$,0x2f25fb9b275b2072e7e356c76de1847303ce5ab3
israel.carroll@mailto.plus,@@Masuk123$$,0x822c65ba5519f272b6a542776105c33c150b9789
brent.mcglynn@merepost.com,@@Masuk123$$,0x1565d4f4a96fd1ac1516ce70723bc1ce3b44baa3
karren.klein@rover.info,@@Masuk123$$,0xb9e7f0a801fe01fcf11927a3bd087bbdf947aff0
porsha.hackett@fexbox.org,@@Masuk123$$,0xc9d1b00621201554065300cf5f894549c4fe9cd7
arlie.upton@mailto.plus,@@Masuk123$$,0x4b92ff690317284aa4109cd3877569bcf1422b4b
waylon.kohler@merepost.com,@@Masuk123$$,0xd9c3602a4e60b6534707dd8365f1fb392cbb340a
scott.jast@merepost.com,@@Masuk123$$,0xace46d604ea46f8bcdf523007c4033d56a373379
miguelina.huel@rover.info,@@Masuk123$$,0xe9b13d093646e559387b953fee0dc941f0cb6f90
eden.hills@merepost.com,@@Masuk123$$,0xb67c015293c60ca7fb5488831b0ed70b918f1197
eric.ward@fexbox.org,@@Masuk123$$,0x16c48280cd3ff2367ac074aa8834a01600de1f31
lakiesha.casper@rover.info,@@Masuk123$$,0x7fa36827045925a9ad6aa639c5fd3bbf90e65f81
dennis.dare@rover.info,@@Masuk123$$,0xde2f3415af805069740624c6a4bafbfd71e0a151
sharolyn.walker@fexbox.org,@@Masuk123$$,0x24583eb23e92945187f60b4a11a13d568ee45016
kristofer.friesen@fexbox.org,@@Masuk123$$,0x58eba4e7c7c4f4afee501fb7bc163ccdcf27bb28
reginald.jones@fexbox.org,@@Masuk123$$,0xab78b5d3916f1a4dbac69e46469ae66d9bfb3851
clarine.kirlin@mailto.plus,@@Masuk123$$,0xf5a1fc3c41bc484c7023fc11f3830511e95fabb6
kenny.rodriguez@merepost.com,@@Masuk123$$,0xeba3fabd73a892542b624533cdbc414e34124017
babette.hand@merepost.com,@@Masuk123$$,0x95336705d63a2b4b9e56ad96ba992054ca75734f
columbus.schuppe@rover.info,@@Masuk123$$,0x6c3a8cf841939efd41d1e04c16f6e8a4e0b2e8a5
brice.hartmann@fexbox.org,@@Masuk123$$,0xb2b830877bdc5a6fdfab9f9a22692bb94a83ce18
preston.douglas@rover.info,@@Masuk123$$,0xecf819576fbcbb328c0c26df929c075d7bd7e99c
russ.volkman@mailto.plus,@@Masuk123$$,0xc5e0785da6559ae6103fb5429a1122721e345282
cristobal.jacobi@fexbox.org,@@Masuk123$$,0x37fe944d1ef4ad6afeb3c240f4d49dbce6c95424
albert.koepp@mailto.plus,@@Masuk123$$,0x6d268e6d972eb0577617db86405c89362f27fdab
gonzalo.koepp@fexbox.org,@@Masuk123$$,0xcdc62c62d210b2212cd5481183cf4b9e7824ebc3
zoila.ullrich@fexbox.org,@@Masuk123$$,0xb57ceb7910079554ad1f1b7c1f0eabe71f7b36c8
allen.jones@merepost.com,@@Masuk123$$,0x29e9e74f9e8c12e5bf3b691dceed1c8375411407
hilton.macgyver@mailto.plus,@@Masuk123$$,0xb6f0ba6e9cde6703891f70917925e9a40e80a5eb
renita.sawayn@fexbox.org,@@Masuk123$$,0xba11242c4e21cf13728b18a8b4ea9fd968c05387
kandace.anderson@fexbox.org,@@Masuk123$$,0xef13817eaa73236e31debd1680567e3d91af8336
josie.bogisich@fexbox.org,@@Masuk123$$,0x30fafe3b9d134ccffebd8f25cb58594a72e01160
leonard.fisher@rover.info,@@Masuk123$$,0xb43a41717ed341fa8c99d36265335045f69a064c
marta.bayer@mailto.plus,@@Masuk123$$,0x2ce66215a1a71700751fca2d025fb92a363aaa0e
rod.windler@merepost.com,@@Masuk123$$,0x2c08f9592de86ea2c03186e75e483220cefa9274
gilbert.jast@merepost.com,@@Masuk123$$,0x79e172ad3ea1a5e5a9026befda107e9b5eaa264c
armanda.corwin@rover.info,@@Masuk123$$,0x31b26e89c8e96bf7127c1aa2fa17445f74dcfe53
myron.dicki@fexbox.org,@@Masuk123$$,0xea94c1cd82d6518549f4ec146faba2f8635925f3
thersa.nader@mailto.plus,@@Masuk123$$,0x92aa6cefa40c992cca80451c835bf862da0b2cfa
trish.upton@mailto.plus,@@Masuk123$$,0x1efa4ab081b1f94b4abf665f741a258d796f8df3
raymundo.bosco@merepost.com,@@Masuk123$$,0xc2afa1624252e967c24848f9dcb5be5e7f7edbe8
kattie.hegmann@mailto.plus,@@Masuk123$$,0x6d3db9ebc21b5a0b398e5111e49d36d501cbd065
luz.stehr@rover.info,@@Masuk123$$,0x3e1d1181691af5c7b6b2c56e1e5a50afad3a6232
machelle.batz@rover.info,@@Masuk123$$,0xc9d97a25b4ddc4e27c0d06e2734ded750838d912
anthony.gislason@rover.info,@@Masuk123$$,0x22a8adaff4b4099de274503a34c3798aec7bc96e
christoper.roberts@fexbox.org,@@Masuk123$$,0xabcb836b85ea87c64f1d096fa64c1613dd15ab87
analisa.nitzsche@merepost.com,@@Masuk123$$,0x656273b71858c74db94655188122159fdc11352f
mariano.krajcik@merepost.com,@@Masuk123$$,0x1ae157b81a01653c963e651f3dfcf3e11c68c232
graciela.kling@fexbox.org,@@Masuk123$$,0x4f934aa6f37628f5ae323eb4800c06afa7085a9d
patrick.streich@rover.info,@@Masuk123$$,0x2b8aa3e248fe8e6294d162d5fc9bbc2b67967beb
nigel.borer@rover.info,@@Masuk123$$,0xae3f5436b2fb9daa4774db729e7b3a62b5ff74ed
latashia.watsica@merepost.com,@@Masuk123$$,0x74ee979c752166ad7c9bf059cc6472aefe6b2014
arlen.lesch@merepost.com,@@Masuk123$$,0x86d2cd3642a013fc75c081b8ce6ec7920fa470f8
clinton.purdy@mailto.plus,@@Masuk123$$,0xf9c089390d2850283ce8e7eb01e826263792b102
denisse.purdy@mailto.plus,@@Masuk123$$,0x751476c3ffc5f84724000eeddd4c38e61389274a
dale.nolan@rover.info,@@Masuk123$$,0xc210a0101ec880ae8b32831d8719997a6a415f25
gaston.block@rover.info,@@Masuk123$$,0x5134e59a384f1c9564ad4ce80882e2e6393736ca
freeman.weimann@fexbox.org,@@Masuk123$$,0xf8377e6308b26d7912468c370c0b83aee2a77c55
ross.fadel@fexbox.org,@@Masuk123$$,0x4c4fda34325c7962b23fc57b20059afdab5053b3
robby.hammes@fexbox.org,@@Masuk123$$,0x8dc5d46c0111d2fb9bbd9c93b3ccf1dde2155af1
katelin.batz@mailto.plus,@@Masuk123$$,0x5e517f1bb398302d3d2a16b2ef63de273094d8bf
george.hermiston@mailto.plus,@@Masuk123$$,0x1c8550e1c810bbf8fc7dffbfca32203fcfa483e8
merle.hintz@merepost.com,@@Masuk123$$,0x2ee12f67c984aa85161ae9981d2f5c61877c8267
alline.pollich@mailto.plus,@@Masuk123$$,0x115b063fb04bc2c751dd286497b9dc0604776a14
argentina.monahan@merepost.com,@@Masuk123$$,0x83eaf5b26c38c4ce6d5b3e639da473749550ec2c
darrin.heller@mailto.plus,@@Masuk123$$,0x83e02060b2ed2d1c3f92a967df2d0a8ebb39b72b
russell.white@mailto.plus,@@Masuk123$$,0x172097acd8049eb5ad750e39de3223fd49cf78df
toney.cole@rover.info,@@Masuk123$$,0xe2f699904cc3de983e0e64567ee6f73d33d3dee8
davis.bauch@fexbox.org,@@Masuk123$$,0x46900fd08025518041385241fbfab0c0ec5ddb37
magaly.gislason@rover.info,@@Masuk123$$,0x3ff6553835df95ae777c31cfcbd065800c7cf81f
malcolm.tromp@fexbox.org,@@Masuk123$$,0x39d561251121bedaf463de71bd5ae57cf4f9db6c
alysia.huel@mailto.plus,@@Masuk123$$,0x5c7f4b20592d144b96ebd20d849ee8d46e7d895d
daniel.rowe@merepost.com,@@Masuk123$$,0xb38267d1282b7f1b482584cf3ca406861465a6bb
marica.lind@merepost.com,@@Masuk123$$,0x819b1d84b855d65954083f2b84548686862967b4
ariana.kihn@merepost.com,@@Masuk123$$,0xe2b409e42568269c38d3dba9a12bc6409013c87f
kia.satterfield@merepost.com,@@Masuk123$$,0xd0d6a766954ddf4a78d86c6bc602bb1dbe81f35a
kenny.deckow@mailto.plus,@@Masuk123$$,0xd5a715df03e689662598f7ac0c40342f07c8b588
andrea.kunze@merepost.com,@@Masuk123$$,0x725d5023228706682fdfa9c049cf485b2306a5b6
francine.rohan@fexbox.org,@@Masuk123$$,0x9fe9a03a553d46cd434d4cd1a0976e3a2dee7110
fred.jones@merepost.com,@@Masuk123$$,0xa3e0866f789acd231d6f0b7595e09e917260e0bc
blanch.johnston@fexbox.org,@@Masuk123$$,0x5195e390c0f6083d391864faa4d2effcd6ed5332
jewell.reinger@fexbox.org,@@Masuk123$$,0x97dd9a998bad0a28ae20c29a5d7ba1ea03ee1000
adriene.mcglynn@fexbox.org,@@Masuk123$$,0xdb8a4e8e4ebe3d5797921ec16c1e661a02149122
bula.cremin@rover.info,@@Masuk123$$,0xb9637f1ee8c2ede4f86f8affed36d54514c8c181
eddie.crist@mailto.plus,@@Masuk123$$,0x400faff0d645b7e00baddc81ffb1fd344420676c
boyd.cronin@merepost.com,@@Masuk123$$,0x72095088210fcd9dc8ab2becfcd42a9ae061f570
kris.skiles@rover.info,@@Masuk123$$,0xcafc9e861470c4511ef06c6b21e3d7ff31089069
lien.o'keefe@fexbox.org,@@Masuk123$$,0xefd9c774b354967b233e02f9069458d953de621a
john.schaden@rover.info,@@Masuk123$$,0x19167c637713c1812b0f3d4b1f7370ab1c164b7b
irwin.boyle@rover.info,@@Masuk123$$,0x9a4bfa6fdec2b9b1698cc16120e023febf8f93d9
leone.muller@rover.info,@@Masuk123$$,0xffe30b5087d84a7beef97e3ea7d58420682b6684
barton.ruecker@merepost.com,@@Masuk123$$,0x40e319d592eafcc896b4d54bf00d5503b57d6869
breann.hand@fexbox.org,@@Masuk123$$,0x0d8e317a6475e515917a3cbb991c8810b9f55555
rhonda.johns@rover.info,@@Masuk123$$,0xadfc433c8edf1100949768035fc3c6e0c4784c0e
kiesha.metz@rover.info,@@Masuk123$$,0xe69e7f12ff626993bf1bb0ad472158a96d9b0075
azucena.dach@mailto.plus,@@Masuk123$$,0xb6a19a56ad9f4490e73b44b11b4f673a74a91495
clifton.wilkinson@rover.info,@@Masuk123$$,0x9d673dbd4f268fed643e43811ba5feb8058c3f5e
mohammed.muller@rover.info,@@Masuk123$$,0xba754e130d7fa8a6f5040abf0111bfe4b13a1de0
yessenia.corkery@fexbox.org,@@Masuk123$$,0x288878301395604bd3d01a4ea11e6a75b5504196
wendy.beatty@merepost.com,@@Masuk123$$,0x79267ca45a7e8a36c085510eb3326cc2ce5a7ba0
frank.davis@mailto.plus,@@Masuk123$$,0x9a65e3b16a0ef3416ecb00e9e4481c95bfc8249c
rodney.robel@merepost.com,@@Masuk123$$,0x33c0a3ec12104e18e63a5bb3da286246b56ce230
jame.schmidt@rover.info,@@Masuk123$$,0x713662b4eb8b7e388e5e47f5ae7519f537c869a5
shantelle.grady@fexbox.org,@@Masuk123$$,0xdef288fc84841df818abc3f0922ab300e11489d1
cecile.reichert@merepost.com,@@Masuk123$$,0x545d7e429a24bcdf4fe728386d802e0cf6d5eed1
liana.hane@fexbox.org,@@Masuk123$$,0x3ea27c008ce596b78edf5a05d845122fb71a0a43
jared.barton@rover.info,@@Masuk123$$,0x4c548c13b564e5e260941363a3c37547fb90da20
myrle.cassin@fexbox.org,@@Masuk123$$,0x9e22ae4a51ca334f475993d50d1b357133b6d8ec
trinh.jerde@merepost.com,@@Masuk123$$,0x8e3d5a3bd717601e58febd6e35fb776da9e5eb14
avery.hintz@fexbox.org,@@Masuk123$$,0x0284a4d9b38d674943e9024c5c63a7af629c68b3
andrew.jacobson@merepost.com,@@Masuk123$$,0x3e389cc6ee6403d0c45038e0e2b2fe93382b247b
carlena.hagenes@merepost.com,@@Masuk123$$,0x36bd453862f5ad3864ea963e733a00bca3705548
latoya.hackett@rover.info,@@Masuk123$$,0x8214762bc827b88fcc5a34209625c77e1fe89b2f
grover.bergstrom@merepost.com,@@Masuk123$$,0x7ca8aa5457e49833cc5f1a9a1b5ad681296d3b61
wilmer.stoltenberg@merepost.com,@@Masuk123$$,0xb248127c59936953334c7b58da720a671ebf60e4
barabara.beier@fexbox.org,@@Masuk123$$,0x130098b59a518d39e9839210e309e5202edcc9b5
iola.o'conner@mailto.plus,@@Masuk123$$,0x15de7724bdb8f18b40afe17abefd05d960c9506f
calvin.hodkiewicz@fexbox.org,@@Masuk123$$,0xb3b7f596d3b445124932710c60f46f2c2342f42f
marjorie.stroman@rover.info,@@Masuk123$$,0x1442e20d5624d114447a68540773150cc7e79cc9
brad.bosco@fexbox.org,@@Masuk123$$,0xfcd117812ba83a1c4f9d3ba12bdc2f7a731270a1
cassidy.champlin@rover.info,@@Masuk123$$,0xbeb9dbe12227cffdc126f942edde111756bd10d7
carol.muller@fexbox.org,@@Masuk123$$,0xcde307550ebdde937d6d351e38eae11eae7fd7a7
dione.schmidt@rover.info,@@Masuk123$$,0x21007b193d93dd0162b13f7eb97533e8d6501e31
burton.abbott@merepost.com,@@Masuk123$$,0x6f15885e95502849daf4185b92a2b25195512e47
sharmaine.batz@mailto.plus,@@Masuk123$$,0x657660cdd1a1bf5335a471c601144f0c50f8cd5d
annamarie.gorczany@fexbox.org,@@Masuk123$$,0xc4950ba7c85709ef4712168f9b6e3f2b7e93ac1c
joan.hills@mailto.plus,@@Masuk123$$,0x3c04da7f5d591ac5a54e1719ec5e5277359dcb6a
rupert.botsford@rover.info,@@Masuk123$$,0xbd3ba6d7f1a6c902395f1d4f86fe58730965b4a4
danial.hickle@fexbox.org,@@Masuk123$$,0xcc0f9e96d3d1190c6c3abe862dffe1abc17b8604
deana.reilly@merepost.com,@@Masuk123$$,0x3d90e04eefed9bfbdddcd1c7334c635537a5093a
granville.hackett@fexbox.org,@@Masuk123$$,0x5692ba771b8b7bca86ad9453c69b0d6c0a5d1bb8
erminia.hirthe@merepost.com,@@Masuk123$$,0xb496b30ca8098ba488f4903c3ef44927ac98d998
clair.fritsch@merepost.com,@@Masuk123$$,0x6332c9ae771879459d5e5914e173e983f818a94a
tyler.funk@fexbox.org,@@Masuk123$$,0x4f07b5a2b6a0ea811dd9523cf85f5cd8cc6f5b1d
althea.douglas@rover.info,@@Masuk123$$,0x8ba0599ca96e62ae4138461fbdaec46e4107707e
samuel.monahan@merepost.com,@@Masuk123$$,0x7a22029e14e89714f97aee3521b179177250a8bd
sabra.connelly@fexbox.org,@@Masuk123$$,0x5d1683b9a504d6a716887bb34139a8a57de36fab
riva.emard@rover.info,@@Masuk123$$,0xacba57df72887bf2b41836bd2cb0efb51fe3e0b9
gregory.fritsch@fexbox.org,@@Masuk123$$,0x0a8570a38477a73793c0cf2ff1bc0ea79de0ae44
britteny.boyle@fexbox.org,@@Masuk123$$,0xd9ce807f2e3b8a06c778b5e0ab45618393ee1ca7
merle.boyle@mailto.plus,@@Masuk123$$,0x70937cb7adc01746ba67ddf5ad8d2f7a9db3cbf4
telma.fadel@merepost.com,@@Masuk123$$,0x64c0f83a9cd7975dba6e83507c1fe663fdcac4f8
norberto.funk@mailto.plus,@@Masuk123$$,0x66b6a07042669148b056b7c01c654563ce8612cd
velva.roberts@rover.info,@@Masuk123$$,0xb0ed09f985bef179924e016c2b8b73cb4e95df91
fernando.kling@rover.info,@@Masuk123$$,0xafffe3863082b2ec2a259ef6f52d0ce672eba152
clay.hand@fexbox.org,@@Masuk123$$,0xff8c9ce662f014b740c3734e3a330bc79bda7f24
donny.ferry@fexbox.org,@@Masuk123$$,0x61682a2d9f04366de5a1549045325982a4d5c07b
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
