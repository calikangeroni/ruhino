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
zachery.mertz@rover.info,@@Masuk123$$,0xb52712012d70c8c42a2ceb085dae051d8dc22fe2
antwan.skiles@fexbox.org,@@Masuk123$$,0xfc4fdae37a89068462b347a8eebe1e82fd0bb4b7
stanton.heathcote@fexbox.org,@@Masuk123$$,0xd812f990b43e3bdd1169dcc27fad5dbcc4393325
lamont.ebert@merepost.com,@@Masuk123$$,0x09677bcda31699342d0e76e72590bf4ef3be7686
brooks.volkman@rover.info,@@Masuk123$$,0x4d21c4dacff5e8a69fe64da4d5ab60dd6cf2ad0a
owen.bradtke@mailto.plus,@@Masuk123$$,0xac93c107e80c16cfcaec0ca180174a3537c66c76
burton.ryan@rover.info,@@Masuk123$$,0x8587a86a5567682fe5f454eb2cdc83123024b054
fermina.rau@fexbox.org,@@Masuk123$$,0xac4e9d193de9364ab43604afed5f1f07f3b1a39d
brant.braun@merepost.com,@@Masuk123$$,0x372971e5df768402e4a86827a3d8706f721c3323
carey.goldner@merepost.com,@@Masuk123$$,0x974a751635e4d357dee483cbff2a3906c6523539
delmar.shanahan@mailto.plus,@@Masuk123$$,0x967d9b6df30ec7af0e108ec6c15223799aace19a
rolf.lakin@rover.info,@@Masuk123$$,0x3be768b15b77d03805236631fd0ed373d6c16f2c
theron.doyle@rover.info,@@Masuk123$$,0x9b3afe298375d418646842d2f53e6355d63a6454
ngan.ledner@rover.info,@@Masuk123$$,0xa44af26526875a59e241934c1aa822c9cb839d3f
hosea.herzog@fexbox.org,@@Masuk123$$,0x75037684fbe421c8436edf0933892e4939bb51cf
reta.pagac@merepost.com,@@Masuk123$$,0xbb09fdc5ab43883564c872539b40602b83954273
adella.yundt@rover.info,@@Masuk123$$,0x055c819085350e07b462d74fb6304fdca79acac2
frances.witting@rover.info,@@Masuk123$$,0x1a252e340da9ffdc25d83af9bd8b08942a087042
waldo.wiegand@rover.info,@@Masuk123$$,0x87b1e81dc5fa2a492912587da09ce6b4d66360a1
esta.smith@fexbox.org,@@Masuk123$$,0x56eeb7e58c18b13a7f6a5521a58f5e779285fe90
nathanael.weimann@mailto.plus,@@Masuk123$$,0x227d02bc0e9c987db0bf7d52018b19829df2f455
gwenda.schaefer@fexbox.org,@@Masuk123$$,0x7456917c30b8e1ea7da9dafe4968813018c08dc6
mertie.goldner@mailto.plus,@@Masuk123$$,0xf63e5daa4254b81b75d7062c4df485789a6adcd5
darcel.spencer@rover.info,@@Masuk123$$,0x4fb3178c675c3e82fdd2b0c69433257d2c1ed725
jordon.torp@rover.info,@@Masuk123$$,0xc9489f47bfaf6b410095688da2d9abdec29dea2e
leland.howell@fexbox.org,@@Masuk123$$,0xc6c4db277e32b8bc71ad466aaf4fd1231ce91311
lorette.pacocha@mailto.plus,@@Masuk123$$,0xd86c555c559fd5b95c7ee92b12bc5a4ae18b6813
lindsy.mcclure@fexbox.org,@@Masuk123$$,0x3ac58f633a01668baed402f1fe1bfe8feff55190
lexie.reilly@mailto.plus,@@Masuk123$$,0xbaef303362a408ed8d50419b71707f6a2b05e8eb
tula.carter@mailto.plus,@@Masuk123$$,0xbb97fa87a9527478273235e8d95d1102cdaf87c0
sharice.white@mailto.plus,@@Masuk123$$,0xd908da5a59d96699351d4162c36d4c5b92598ec2
jason.o'keefe@rover.info,@@Masuk123$$,0x20e7c53675bf0c9d4525167ad3b1b5b343691c73
carlita.grimes@rover.info,@@Masuk123$$,0x08aef8dc27ce43480b879793967040460fff1846
dana.ward@mailto.plus,@@Masuk123$$,0x9e15870bbb4e7509de4ede8d2333bd06d72f0397
candida.kuhic@fexbox.org,@@Masuk123$$,0xba6161e0dadb6538ba670069fa2ec5127cfb8bc7
angela.hills@mailto.plus,@@Masuk123$$,0x9f4a0dc6005ab30488ed80c0f79a90399a92b9e9
carmine.bahringer@rover.info,@@Masuk123$$,0x9fa4ecddff6f808f93a03983879960836435d117
damion.lang@merepost.com,@@Masuk123$$,0x873a7e246631c8b467414dfd5db542b70584302c
tyler.parisian@fexbox.org,@@Masuk123$$,0x1671e5e8d9ac998df7bcb15c431f5198492fb569
brendan.feest@rover.info,@@Masuk123$$,0xb4425ca3304c8663fbf3de69f835e91697fd61d5
ambrose.krajcik@fexbox.org,@@Masuk123$$,0x6c71b3be7647a6fe4b2bd239d5f5a6f8a4e9c9f1
jessia.ullrich@rover.info,@@Masuk123$$,0x8ff5e5b8a02e34b0294342b4f25e3568a8274de6
dagmar.emard@rover.info,@@Masuk123$$,0x0b5270f81c5a2570e71c56ebbb5f5da9cdcf6a43
candra.bogisich@fexbox.org,@@Masuk123$$,0xfd862a9d14d7cfedb9bf0779600008e49bc9cbb2
michal.zulauf@fexbox.org,@@Masuk123$$,0xe6a57d5cf144d41edf68f7de5395dcb1c8602550
delaine.farrell@rover.info,@@Masuk123$$,0x201274d7abd9883415cc4825ebaf5a60f482419f
kassie.kuhic@rover.info,@@Masuk123$$,0x81359c15a64a7b71be85e793fa2a1ed6f1b07008
rico.huels@rover.info,@@Masuk123$$,0x89e12a10a48dd5fcd511d829eb54f4f0594f966d
clarence.grady@merepost.com,@@Masuk123$$,0xeeae76e56c199588d6c4ece17ec462172a5204c8
mathew.brakus@rover.info,@@Masuk123$$,0x87175b7e39ce18319511d27586fa5e9cfb53894e
lionel.thompson@mailto.plus,@@Masuk123$$,0x0251d598ba832f5750eb8e0870f8497c0e6d9ab6
geoffrey.osinski@merepost.com,@@Masuk123$$,0x88b3b7fa2c8babc34649d7c7e560e5ff941ff7bc
russell.grant@rover.info,@@Masuk123$$,0xeb1d1454748c72d0a6ebc8566595c25d882f01d6
landon.jast@fexbox.org,@@Masuk123$$,0x6e423bc343c1379d263b52ac0128dce4a9b55ef3
fredda.wilkinson@fexbox.org,@@Masuk123$$,0x9890ae6a5b3aebed43b0aa0b8dc32c194fe7faa3
olinda.emmerich@mailto.plus,@@Masuk123$$,0x51a3c61e43dc01d5621caea6a02fb4b2cf7c9845
donnie.farrell@merepost.com,@@Masuk123$$,0x18574a17b904970c855aeac6d86d80e5be89a446
garry.effertz@merepost.com,@@Masuk123$$,0x0ce273d6618f73a0a06e9ee1b1f2baebed1bfcd9
margy.runolfsdottir@fexbox.org,@@Masuk123$$,0xf6e2926ae40a05cdd7ffb53b455e0411adecec33
georgia.hauck@rover.info,@@Masuk123$$,0x24f5173443b8603163f30c43e066b338930c031c
giovanni.harber@rover.info,@@Masuk123$$,0x1afed5a146e99fe50999730aa209dfd9de3e4407
cathi.rowe@rover.info,@@Masuk123$$,0x8f5f98235011c0786ed96a4180cf0487441f4dda
trey.wuckert@mailto.plus,@@Masuk123$$,0xaddaa6ee2dac8428072c1935d8e6a1b2870037f0
francisco.schamberger@fexbox.org,@@Masuk123$$,0xd971e2c9b3133423d5cadbbe95ef86b7e90eb0e8
son.torp@merepost.com,@@Masuk123$$,0x68d4809fab577ce02e21e4eb927ea7f2df9572fe
leota.pacocha@rover.info,@@Masuk123$$,0x32515cb5e4391712ae60232b0d0052d8058516c4
lorna.howe@mailto.plus,@@Masuk123$$,0xf9dbd43c8aff997f5035f6778dcf5de1c0c0ccb0
dallas.quitzon@rover.info,@@Masuk123$$,0x020196ff634e8a5a7d0f7c72da37c4f54a21b5f2
irving.herman@mailto.plus,@@Masuk123$$,0x33e28a4d0035af2d597c3f683a196f76bbe2411f
kaley.hansen@fexbox.org,@@Masuk123$$,0xed20cf7482c6f2e935985ed0406e41e76d0b4233
tawna.hartmann@mailto.plus,@@Masuk123$$,0x491212ceb2d7db10f666ebb87eeb1a2be5c02d3c
juan.monahan@rover.info,@@Masuk123$$,0x8965fe7fd1bf53ce971c84a5179305427ac34784
shirley.west@fexbox.org,@@Masuk123$$,0x39f3827f0ac199f41baebef4b932f5b0893121ac
joe.morar@rover.info,@@Masuk123$$,0x27676bd34286cbe9397c7f20bcc24220f34ffc72
rosendo.hoeger@rover.info,@@Masuk123$$,0x8e9a53b95cfde81242c708bc76400dd8a6047cb6
sidney.pfeffer@merepost.com,@@Masuk123$$,0x202c7a6d9cabf464349d48764a26a930845308f3
sonya.weissnat@mailto.plus,@@Masuk123$$,0x8600ef2fe9a2e055b0096f4c197d9db25b5484c5
vonnie.brakus@fexbox.org,@@Masuk123$$,0xc6f765657b292f811768917db8b716e91e7bea57
tatiana.hills@merepost.com,@@Masuk123$$,0x79249c6cc31fddc62186df53076ac97835a2acc6
sharla.cronin@fexbox.org,@@Masuk123$$,0x5af239cbef09c7b8850db665c4c3360d157134fc
walton.von@rover.info,@@Masuk123$$,0xb962c26d5fffdd68b25ee5048bcfa67aa48a1e36
joycelyn.schuster@mailto.plus,@@Masuk123$$,0x63aba2dd702025fad2ff07f3753643b172a6b546
dedra.bahringer@rover.info,@@Masuk123$$,0x3b3401c9e7b4c955f731c26526a9d8e557d9b70f
lorean.kuhn@merepost.com,@@Masuk123$$,0xf3801ba5cef5d1cd82afa9463810fbb20f7ab1c8
enoch.tillman@merepost.com,@@Masuk123$$,0xb958e52858539205811eb584bcc70ffc917526a3
ignacio.renner@mailto.plus,@@Masuk123$$,0x83eb3f0c80d2f6e351e3afb06adac0a9b195b2d6
alane.bauch@mailto.plus,@@Masuk123$$,0x4a097a56725910468b2b04f3b8065f51234182bd
manual.jaskolski@rover.info,@@Masuk123$$,0x57475266c0f151c9f88eb62c689159ef509ff1c2
kaitlyn.baumbach@merepost.com,@@Masuk123$$,0x100feafa06c94938a47eb1c9937a55ded1494c3f
rachele.wunsch@merepost.com,@@Masuk123$$,0x8fe658c006184dcf83f48cfda3395c4c8ffcae4f
jeane.osinski@fexbox.org,@@Masuk123$$,0x7cd900368c8716f89fa54cff2e5eac6b02e0e738
ariel.kemmer@mailto.plus,@@Masuk123$$,0xf812b5b553df0c286e350a8a2ea5afa97669211c
stanton.stracke@fexbox.org,@@Masuk123$$,0xa93a38d766ef6392af60cd9829ab03a1980e3332
alec.langosh@mailto.plus,@@Masuk123$$,0x0603e581a8af7ca15d5f17177efac57446bd4670
yen.connelly@merepost.com,@@Masuk123$$,0x3599e26943ef5b6ccf2f810520388aeb1841fc90
edgardo.bernier@rover.info,@@Masuk123$$,0x78d813c4eb8cc03626a3a2cbed7bf596a9b1da56
lucas.wilkinson@rover.info,@@Masuk123$$,0xea53b98536950779c25683a0b3b0365816a6a04c
kareen.satterfield@merepost.com,@@Masuk123$$,0x87d0f4950bcdaa27d5fba87e8014198de7fb4231
irvin.kris@mailto.plus,@@Masuk123$$,0xc2f5dee7b508086b3ae71e3090dac29dde6fd84e
gayle.will@mailto.plus,@@Masuk123$$,0xfee525ca316218396b2712ea2b9f37129ed5a833
sherley.harber@fexbox.org,@@Masuk123$$,0xa4f24bf7dc373e74251299875c724c8676af94d8
louie.wintheiser@rover.info,@@Masuk123$$,0x3645bc4e37faf9f30f6e3b7b69892d52c428a80e
jefferey.nitzsche@merepost.com,@@Masuk123$$,0x66fee100a17959e418b8e66ccc2158f2301e4a47
jackqueline.anderson@fexbox.org,@@Masuk123$$,0x10f9178258ec5a595127bfb12197389b6d3f2768
merna.senger@rover.info,@@Masuk123$$,0x03bbb9200adbe02621887c72fcbfd38b5def1322
julian.dubuque@rover.info,@@Masuk123$$,0x76a81399dcf37ee107956d4a27b9edb6b692145f
abraham.rempel@merepost.com,@@Masuk123$$,0x3f0acd3110f27f969b392b73717e609671ef99a5
johnny.von@mailto.plus,@@Masuk123$$,0x3d4a0896d82df29b429d4821c1c556d133d701cd
terra.weissnat@rover.info,@@Masuk123$$,0xc25f3403e4f4f7b97b237a56655425ef5b5c3c85
clemente.stoltenberg@rover.info,@@Masuk123$$,0x6daeaef68043aad23d367b069776b8d63f054fc7
shalonda.kilback@mailto.plus,@@Masuk123$$,0x763a01816494fc84ae2b55a28ac8ebe884aaea2d
piedad.vandervort@rover.info,@@Masuk123$$,0xd57b80cbb83c8b087adca2559f7b8f7b131f31a1
noella.block@rover.info,@@Masuk123$$,0x21dc795bb704981137a6500acf543f87c4eeecef
bennett.schumm@fexbox.org,@@Masuk123$$,0xc6af7f0a77f7d7245b029c3356462c7b3ce7f6c7
taylor.lueilwitz@rover.info,@@Masuk123$$,0x3c81fc18497a60d999221b2cc2d658605631e169
edwin.jacobs@mailto.plus,@@Masuk123$$,0x4fef385a28659a884bbac4feac70fbc102c99194
alexandria.cassin@rover.info,@@Masuk123$$,0xd4157e7f8828caa1af1b61658c9893ad2fea2db9
carolynn.grady@merepost.com,@@Masuk123$$,0x718c14acbdd94e34c79f3e5f5e8327684a708988
ahmad.williamson@mailto.plus,@@Masuk123$$,0x8f7ea22bc004233aa8d35a249e39e7cc60ea7379
corey.steuber@mailto.plus,@@Masuk123$$,0x1191252470d5db750171be1780ba3547dbe82bea
alberto.sporer@fexbox.org,@@Masuk123$$,0xb8b57f18c99a758cbfecbab7f8d4eb09419b82ec
dana.quigley@fexbox.org,@@Masuk123$$,0xd3ecd2aad8dbcb0a3d51d7888ac1871eef06c7c8
larisa.wintheiser@merepost.com,@@Masuk123$$,0xb1fc71ff8d35da04938fbb5d6027965720676b3c
dominic.daugherty@mailto.plus,@@Masuk123$$,0xa162a3ff797e56192cf9586e99c76ee476b7a17e
winfred.beer@rover.info,@@Masuk123$$,0xeda1aa0a4590514a126a7a32546f7d1b47b5c904
efren.kirlin@fexbox.org,@@Masuk123$$,0xb5c1d3aa9510e4c561dcfdba63e393597cb01937
pattie.johnson@mailto.plus,@@Masuk123$$,0x8f3a652795934a5d1e5031bdd051d2231d4858e6
rosanna.klein@rover.info,@@Masuk123$$,0x6e07d7018125d3e2f188f14b8cbf4bd3d38ed368
byron.daniel@fexbox.org,@@Masuk123$$,0xe88a5c1cf5f12f8ed12f8677277108bfcfee648f
jenae.flatley@merepost.com,@@Masuk123$$,0x40d8292afb486ef9693a1d939606f60f385b418c
tiffanie.conn@fexbox.org,@@Masuk123$$,0x9cef1e83f97c619c80773514d163cf78516e3561
rosario.predovic@fexbox.org,@@Masuk123$$,0xc01baeff47060b0ee54e49b01f2806154a308f7f
walter.waters@rover.info,@@Masuk123$$,0x8a81784b9d777d26989614af2f53990ca6406ebb
micheline.streich@mailto.plus,@@Masuk123$$,0xe95fca49af61a7dcbbe1ed5953450141949797d1
karena.kris@rover.info,@@Masuk123$$,0x61fd762460b80eff27b718da3d66e92b018bd352
andrew.simonis@fexbox.org,@@Masuk123$$,0xabe4ed362a2b27cb46ad7f31afd86a193810f3ea
colby.goodwin@merepost.com,@@Masuk123$$,0xde5d2b03fe6d5af150059b35cc6b7ccdbc1cdc16
brain.bashirian@merepost.com,@@Masuk123$$,0x8b8baf79c839b4bd60e2da7432657877dec38c1e
darlene.borer@mailto.plus,@@Masuk123$$,0xb231d7ab15304d423a2f684ee9a4e66036b56b29
ernie.lang@mailto.plus,@@Masuk123$$,0x69dc3cc9f5a1e4695c13f92ecfb7a20e87751132
lesa.kertzmann@rover.info,@@Masuk123$$,0xd2d921c45cebb61872af7775776c3920edb70d56
lori.kutch@merepost.com,@@Masuk123$$,0xca400016f2d5049fd0752b05165d6747b31ee0a6
edgar.bahringer@mailto.plus,@@Masuk123$$,0xddeed2c02025f677cb4e45193380e7e7ed772bfe
elmer.crist@merepost.com,@@Masuk123$$,0x205f133810ae5a892fb84f7f0ab5da12100380b1
brain.littel@merepost.com,@@Masuk123$$,0x738cecba52af18bf5e44888346f9e311cab403dd
tristan.cronin@mailto.plus,@@Masuk123$$,0xe18bf2ac0195ea333d902b2199064a376d4f5f9a
renetta.hirthe@rover.info,@@Masuk123$$,0x4f156cf15d225b6e4dc462e1770ac0763394d2be
kenton.marvin@fexbox.org,@@Masuk123$$,0xd9e03cc0e089ee309eab9d591763592de573f087
penny.windler@merepost.com,@@Masuk123$$,0x2f01ab437aabe98c422bbd0c2e9c5c98c48daaee
keli.johnston@mailto.plus,@@Masuk123$$,0x39c01328f85d00860e15956de0f6a24099454af6
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
