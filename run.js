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
grant.hilpert@mailto.plus,@@Masuk123$$,0xd309f1e3e649e820c60c4079c6d7f739632cee08
sherill.smith@rover.info,@@Masuk123$$,0x9b650891db22f401a1adef54e76189326ca70be4
julieta.bechtelar@merepost.com,@@Masuk123$$,0x242ed3097c196c77e67cca71cca815f85590f7fa
gil.langosh@mailto.plus,@@Masuk123$$,0xe3b44e482d0ea34d06c339c72ff92a4c574823a3
sang.kertzmann@mailto.plus,@@Masuk123$$,0xf522ac4e2a5a75a9396b097479f65e54cff19021
quinton.ryan@rover.info,@@Masuk123$$,0x8ba12effd944782d16b7ff35ba2d931583d1c843
matt.fahey@mailto.plus,@@Masuk123$$,0x51951302a8827ae5b749b4188cf02f52a537a716
annita.hammes@fexbox.org,@@Masuk123$$,0xc94b44bb968dd3ecda36a092e119373a7d3ac8dc
zoila.feeney@rover.info,@@Masuk123$$,0x480350dc6ea4cf7a7fb45d698c3c1bb1e6189165
chung.bins@fexbox.org,@@Masuk123$$,0x203c7927d2063b06b5244413213863bae85d8a55
raymundo.ledner@fexbox.org,@@Masuk123$$,0xab3f309ea45a849a12537b0eb09903622bfd2a2d
hilario.dooley@rover.info,@@Masuk123$$,0xde583297937529e57d578114e4c1777dcce04a4e
ivana.hilll@mailto.plus,@@Masuk123$$,0x4994666588a110cab9ed4f4faad341cf5f273706
merle.dibbert@merepost.com,@@Masuk123$$,0x06c37d6cd9045a7ffa6a4544db8ddc5e4d901b9f
omer.harvey@fexbox.org,@@Masuk123$$,0x9bcf8e781dbc8f35c1d40101b7c959c4b539831f
matt.ernser@fexbox.org,@@Masuk123$$,0xe078f8476ca7f36d078298bfa40ecddd5bf4273a
angie.nader@fexbox.org,@@Masuk123$$,0x30478b988bdef2fb8854374d89af2996a41b67a2
ranae.wunsch@merepost.com,@@Masuk123$$,0x10ec42e9454f732b5b09189b9595423470e68603
terrence.altenwerth@fexbox.org,@@Masuk123$$,0x7b12ee40b8e81abfb1e45d27a81a58d641bdccce
taina.yost@rover.info,@@Masuk123$$,0xe0fb56fe2ae04876c52bd79287ece5445b76d035
jason.wisozk@fexbox.org,@@Masuk123$$,0x977c543492a7e6b3f29bac499c3ac6de665f27e2
romaine.hackett@rover.info,@@Masuk123$$,0xfa52c2d0132c201120a6d5f15e4bf919225b8d8e
terrell.paucek@rover.info,@@Masuk123$$,0xdbed6a64c1b3630a6afe7463febe992261f88596
cruz.powlowski@merepost.com,@@Masuk123$$,0x8c65e8f70926b0aed1e04e0c9bb02460f86bd7cf
calvin.hettinger@fexbox.org,@@Masuk123$$,0xf241614167062730870eab60ad02ce6ec40d4df6
randell.corwin@rover.info,@@Masuk123$$,0x39a1a9423d080f10f4f6db222552349593b506b1
bill.padberg@merepost.com,@@Masuk123$$,0xfe0c963a05d63ffa790555d37c2ad482754a4bf5
pat.hyatt@merepost.com,@@Masuk123$$,0xe0179540521751ec3c5f7d8239559258ac75e875
abel.cronin@mailto.plus,@@Masuk123$$,0x17cc44762f6961c6d8ee830c9e17c15462641e00
antoine.wisoky@merepost.com,@@Masuk123$$,0x5829d43335a6343a2e0da9d8d8d71e8c21511fdd
georgia.torphy@rover.info,@@Masuk123$$,0x61dee69f4615abaf60f08c01bb8b9300e2c5e076
wilmer.ernser@fexbox.org,@@Masuk123$$,0x6d28ca46232097379d84856e6dd95d9d48f9411e
demetrius.quigley@rover.info,@@Masuk123$$,0x596b38955a26fc0f8ed77e0d6934a7d01e9e8909
rosamond.rodriguez@mailto.plus,@@Masuk123$$,0x59aa89145e21ff19988f75c50fcf897c404f8f6b
tynisha.collins@rover.info,@@Masuk123$$,0x2f2e519176337f96bade74564b05226dc8f2333d
marco.hoeger@mailto.plus,@@Masuk123$$,0x5a2c14ce800fc80f0602880cb2b3fc5a2274f03c
sheri.rutherford@merepost.com,@@Masuk123$$,0x09e809f26eaa35c2a59f173f0897ef080111863f
darwin.gulgowski@mailto.plus,@@Masuk123$$,0xb0fce44c59d66ce55030bdf00085f0018b6f00c9
delpha.conroy@fexbox.org,@@Masuk123$$,0x278db6c686245830d02bdea0896abbc8fbf09efc
crissy.koch@fexbox.org,@@Masuk123$$,0x976d73c5f58223cdb65952d4b8887f3a86333aa5
jami.macejkovic@rover.info,@@Masuk123$$,0x8c94ed80bf7d1097334d9383e83592ed1c99a822
leonila.olson@merepost.com,@@Masuk123$$,0xb33fe7c2c581c9957ae711f9c4c4cfa6e2941129
marget.sporer@merepost.com,@@Masuk123$$,0x57e894faaca4ee159ee98baa4867e5ebdc370061
ashley.dietrich@rover.info,@@Masuk123$$,0x5fb849b954af3586758f9838eccf2cc15ce15a40
theo.armstrong@fexbox.org,@@Masuk123$$,0xdf4ab7ea8632a3f2931f6ec30d6b8a263e1beccf
ka.mckenzie@mailto.plus,@@Masuk123$$,0xc00c4cf38c32e0b3d97c23873bccfcccf9e19e43
mertie.buckridge@fexbox.org,@@Masuk123$$,0x7a1cea0532e7ade2806a8e5ffd2d3f01683c746a
brandy.terry@rover.info,@@Masuk123$$,0xbb25fbc0bfdc829f99fb75bf7e732ec90d5a734b
casie.macgyver@mailto.plus,@@Masuk123$$,0xb213776fc25b5f060dddd3c27458541b3147ed36
carol.fisher@rover.info,@@Masuk123$$,0xa08f98eda374122f5ede69c4f606a786fcfabec5
willard.morar@fexbox.org,@@Masuk123$$,0xcc04a6c7ff0957fbcc1f663280d4011a4a2673b6
rey.gibson@mailto.plus,@@Masuk123$$,0x1eedd7bc2357762275877da409844c9edafa4f3e
tony.corwin@mailto.plus,@@Masuk123$$,0x4e08b8e478aac0b89543f1cd84df311cb6142530
kerri.kirlin@mailto.plus,@@Masuk123$$,0x4da675882bd148120b98bcdef1f09ec3c8ffe629
sabrina.hahn@fexbox.org,@@Masuk123$$,0x7c73af2165b01b89f758e71c6b7a9b266438c858
alona.gulgowski@fexbox.org,@@Masuk123$$,0xf28ff2b7ba1594df04273c516d7107811581a3b8
gerda.fahey@mailto.plus,@@Masuk123$$,0xda85a1b46b6ed45b5410251b7a6a76ad85f9966e
ray.metz@merepost.com,@@Masuk123$$,0xd000537ffc26718b3f1758cd54eefaff8fb6cf2b
joaquin.mclaughlin@mailto.plus,@@Masuk123$$,0x72bd49b5d9cdb0d8f71ca6074b8f606bd513d8f3
newton.grady@rover.info,@@Masuk123$$,0xe9c199f3ceeffb59f9ca199e39bf19d9e559456b
moises.christiansen@fexbox.org,@@Masuk123$$,0x540d0bfe00aaa1292a18a601406cadc91092026d
dominique.kuhic@mailto.plus,@@Masuk123$$,0xe0e5a9241d98bf78eaabd23c46120f93a373b511
seymour.fadel@merepost.com,@@Masuk123$$,0x6c2317500f8b586a5580e76fcf7115a244c92280
milly.kohler@rover.info,@@Masuk123$$,0x584f62c2ce25d98153f6e1f3d92184db2cea0df2
elanor.crist@mailto.plus,@@Masuk123$$,0x7b232aa44a1f6c3c6e3a53399443cd76e70efd13
teodoro.vonrueden@mailto.plus,@@Masuk123$$,0x3ea24aa2ed8f3f690e0d960b14e90edccdf139c5
ernestina.reinger@merepost.com,@@Masuk123$$,0xdf8f64730063c32528f06cca820b01d11cf9f2bb
patricia.tromp@rover.info,@@Masuk123$$,0xcc33766c77d66ecead0799484ec9ae0d18dc9014
armando.mraz@mailto.plus,@@Masuk123$$,0x8a178c293299e5efc501ac300b8b7be0438ebf5a
peter.wisoky@rover.info,@@Masuk123$$,0x90f25d61fe0972863d76cf4a7bcef71c1e38bc78
eliseo.hermann@merepost.com,@@Masuk123$$,0x81fca8bb57dae20910ef389ac9a36fb5dbd1921e
hermila.kutch@fexbox.org,@@Masuk123$$,0xb56f19066494b9d3d0d660bc5387a8fc647e3e30
emanuel.powlowski@mailto.plus,@@Masuk123$$,0xfc6a8329581e529f4279c6d8ec0677bc15f36fee
milton.langworth@fexbox.org,@@Masuk123$$,0x907274acc582efbf40977388d3875223bc7b02a4
migdalia.price@rover.info,@@Masuk123$$,0xff7af95a3913304d283e00d5df980d024a5a8438
seymour.bergstrom@fexbox.org,@@Masuk123$$,0x638c2bbf85aea4974c3b02600ff69abfa9515080
adolph.ward@fexbox.org,@@Masuk123$$,0x61572e228a9f2814cbd64252d8bb1ee45113996a
garth.lakin@merepost.com,@@Masuk123$$,0x7cab515ab31b6f72e27a1eaf7299f369b0d2e590
raymon.jerde@merepost.com,@@Masuk123$$,0x92f6d7a647779625f20fea252780dce4867f3c5b
wiley.grady@mailto.plus,@@Masuk123$$,0x2d3db214b15f1e7e1f5353ecf7aa2c8f10d00b28
tameka.sipes@mailto.plus,@@Masuk123$$,0x4bb526a06716ab731039147b94a98fc1c4aac99d
janell.walker@merepost.com,@@Masuk123$$,0xadf084831c4004d0f076a546303f23db62104acc
jaime.frami@merepost.com,@@Masuk123$$,0x8b5ac7583449528c4b5c4fd0b9c1618194bf7d61
tobie.wehner@fexbox.org,@@Masuk123$$,0xb9c643b27d1b9affbb9ef4b0f901c6561e1e8146
akiko.heaney@merepost.com,@@Masuk123$$,0x3265743ee4d93fd230b22d3c4e5cbae69985ebc1
trey.jerde@fexbox.org,@@Masuk123$$,0xa3834b6a07fed636907f4de89fe90d5f83e7ae4d
cruz.bogan@mailto.plus,@@Masuk123$$,0x4e8b0372852680a5df1eda9ccff1f48fbb37216d
dusty.sawayn@rover.info,@@Masuk123$$,0xc05fb7fff65b8c7ccdf7adf02f702090b0a36aee
cleta.will@merepost.com,@@Masuk123$$,0xe3f71c4f393d71147236c02aa84f00b2af819046
alonzo.streich@merepost.com,@@Masuk123$$,0xfa75b37ad2152cc1367aec69c952c453f6b595a7
jesus.jerde@merepost.com,@@Masuk123$$,0xfadac686de50e86788336fea1e243b4443094211
jamel.dietrich@fexbox.org,@@Masuk123$$,0xa219a239942cab3f107c08bef69241e75128985c
cecelia.tromp@mailto.plus,@@Masuk123$$,0x54fc164331b1f01eace277ee35978a503a6fcb4a
ardath.hand@mailto.plus,@@Masuk123$$,0x79b697eb0f74f06011887610d1e7b61cf880bda5
benjamin.paucek@rover.info,@@Masuk123$$,0x463763892d832156e054ecca8d6070e4d986ae7d
colby.o'connell@rover.info,@@Masuk123$$,0x342a8831723afdde6189ad16ab0347ad7a90f600
willene.morar@rover.info,@@Masuk123$$,0xc8e1a005a7d34fef4ed7fd68dc80f857cc62114e
rene.spencer@mailto.plus,@@Masuk123$$,0x3f620c1b8c29dd40fcb89eef37df7cbed99e7f0c
tamatha.mclaughlin@mailto.plus,@@Masuk123$$,0xac2dd1c4a484938f40661485bfd5fea35308c578
lianne.mills@rover.info,@@Masuk123$$,0x2b829007d812d14d322f0c134372b4f264f7097e
arden.botsford@fexbox.org,@@Masuk123$$,0x850981052894eb712a1777e82654178a8471d838
jacques.pouros@mailto.plus,@@Masuk123$$,0x51967068b8c76574bb550553b35cf6ce752aaf00
nakesha.crooks@rover.info,@@Masuk123$$,0x1ee76ee1509c7cec8cea6a14478620b21f8028f8
danette.grant@merepost.com,@@Masuk123$$,0x962dfcd26d66798f2b1191ba4644f7a20acc85ff
rheba.schneider@fexbox.org,@@Masuk123$$,0xa0c640b9347574534416fbd9819ced0d595b4c3a
renaldo.hagenes@merepost.com,@@Masuk123$$,0x80c27f74e1fa1d43ecc21e2ec5ef176c1cbeed9b
laila.cormier@rover.info,@@Masuk123$$,0xb01e20d05a64df40fd69d35f142b32549831bee8
jaime.stiedemann@fexbox.org,@@Masuk123$$,0x6974e94c2f6aadf77029844386f76ba2ac0978a5
jeromy.mosciski@mailto.plus,@@Masuk123$$,0xa84c9278403722f45d2b4433b0cba74a5ffcf584
edris.berge@fexbox.org,@@Masuk123$$,0x56548f7fe70605516a4de5fbb78f5dfc2a3522dd
modesto.bins@merepost.com,@@Masuk123$$,0xb0d09fb7840517e9c99255c58c51f0450eca5883
caryl.schuppe@rover.info,@@Masuk123$$,0x645ba11a27417732129fa92c3ee735a0b72ee938
stephanie.hills@merepost.com,@@Masuk123$$,0xbd038817cb5771ceac7fb835a1ee60fa17a116f6
emile.o'connell@mailto.plus,@@Masuk123$$,0x6e33dc1df4c334e26b7143c5a412aa2e53d78835
emmett.kuvalis@rover.info,@@Masuk123$$,0x65de4502ad0c2d48d1a4f540fbfd64a0573db020
bennett.kuhn@rover.info,@@Masuk123$$,0xe8341804b2f64f85ee645a2d09b22a2f9e3a7f95
earnestine.luettgen@rover.info,@@Masuk123$$,0xf4e58cb271a23526b86c235688d3f508c1542a3e
jonelle.kautzer@fexbox.org,@@Masuk123$$,0x8bbf3701706487dc7318a71379838d8790bfbff5
arletta.mante@merepost.com,@@Masuk123$$,0x89e2cc5d2f28f59374322a314f7bd76004951248
shelli.swaniawski@fexbox.org,@@Masuk123$$,0x5dd4f32403e920f9223c3e58a68d7f1b94cd4963
ernest.harber@rover.info,@@Masuk123$$,0x3c19768bbb01ffe293ac7ca8152c0230790ecd66
collin.armstrong@rover.info,@@Masuk123$$,0xd1ad711b8539e52765a16e29afa3eca7f72d636e
horace.volkman@rover.info,@@Masuk123$$,0x4cc77b600a9d95bbfce6a7fb0d202062e0b41235
dwana.kihn@merepost.com,@@Masuk123$$,0x4a24107ad2ef32aae3bda59ee47dd6ef47d05493
erin.kessler@mailto.plus,@@Masuk123$$,0xbb9f7c462fd22c5b3c98df65c6570812fae31987
laverne.kertzmann@merepost.com,@@Masuk123$$,0x2b3369a53b024ad22bee7dd1a0d452745233075f
roselle.sanford@mailto.plus,@@Masuk123$$,0x2ee359653b9fcb5b3f976f8d2ee4b2d5d9cea376
chuck.koch@fexbox.org,@@Masuk123$$,0xc41e01263ed87e963d9ebd4068fcb3778ed863e2
aldo.legros@fexbox.org,@@Masuk123$$,0x9a821912541b6105f5bc680d0f59358f4add5ad0
dollie.monahan@merepost.com,@@Masuk123$$,0x00f59d221c2c2e794ddf8f310ca65a438c1b5720
gregg.fadel@mailto.plus,@@Masuk123$$,0x3d637634b5ffcc75f3ad51f77e499ece10b7df3c
fredric.swaniawski@fexbox.org,@@Masuk123$$,0x6594d92fd77e52ee43f236c0c93cc8ec9d234f03
elliot.rosenbaum@merepost.com,@@Masuk123$$,0x2b08f16ec63bf42d8a56f074e3f9af98011d0e06
eugenie.kautzer@merepost.com,@@Masuk123$$,0x992d5ad72cdab40f25a0cdae2146eb36a55c124c
kraig.shanahan@fexbox.org,@@Masuk123$$,0x386441ec4bf29d0cbc24fbc46f691d7bd949f887
arielle.thompson@mailto.plus,@@Masuk123$$,0x5512acee4aed0245e162f546d55de647af9397e7
reggie.williamson@merepost.com,@@Masuk123$$,0x7e7bcb00dfc5c6ca3a5eb775e53263835f841389
sima.feest@mailto.plus,@@Masuk123$$,0x2628dadbbe2a32805c9d567f296b10b281ca48f1
august.reichert@mailto.plus,@@Masuk123$$,0xaf88dd18cf59953ecdcf3e55365909505bb9ac8a
brandy.kunze@fexbox.org,@@Masuk123$$,0x257a0ed305f535473031f28edc922f7350493349
lon.stokes@merepost.com,@@Masuk123$$,0x93c89de5c3dbd67c324dafa1383ec00a45cec79b
rolando.dubuque@fexbox.org,@@Masuk123$$,0xa33795b3177292060a74213fa3774e9b2c6379dd
jerrold.schneider@rover.info,@@Masuk123$$,0xf182988892d2be7ecf4a541a38c0db2826d1b247
abdul.wyman@rover.info,@@Masuk123$$,0xacb0ca6955cf4e1adb28e4645bd684af93bd0b96
assunta.brown@mailto.plus,@@Masuk123$$,0x907d6ac988f7347663f0462a722880584d11763b
tena.considine@mailto.plus,@@Masuk123$$,0x4abdf391a4e07ea32111418440415c6ee2fc5b9e
jacinto.konopelski@merepost.com,@@Masuk123$$,0x42162ab1d359ae680dffd03b0e5826808a0b5f75
meggan.balistreri@mailto.plus,@@Masuk123$$,0xea88a87fa1f8345c6737f65b7b37bc2298637f36
gil.reynolds@fexbox.org,@@Masuk123$$,0x69de3585a8a0e1f1d61f22208243267869542ec9
seth.gottlieb@rover.info,@@Masuk123$$,0x25dbe7ee8682d807560409b6054f82ff6412a0b5
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
