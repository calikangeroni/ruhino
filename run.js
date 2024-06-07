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
william.reilly@mailto.plus,@@Masuk123$$,0xff65db253412282ac6f5cb4d4d8220db6e7dd109
van.pouros@rover.info,@@Masuk123$$,0x08696976d0351831bbfb1e97607b88af60afe101
floria.schmitt@rover.info,@@Masuk123$$,0xf547b497c4d063dc54e5a3257bd87dbebf127bf6
carolyn.balistreri@rover.info,@@Masuk123$$,0x65fff532c43eb5d514cfabefe14cb554ddc44819
mark.lueilwitz@rover.info,@@Masuk123$$,0xe9146bfdcfbd904f729a1a0b1054d17338008bb8
bill.gleason@fexbox.org,@@Masuk123$$,0x7fffd14c9a193ef61a735e118cf8ceac0e4773ba
joel.anderson@rover.info,@@Masuk123$$,0xf9c6ead65f226effc360cca4808942b650fc6da6
charlie.volkman@rover.info,@@Masuk123$$,0x6493189997a7a659b785977328f6f4dd57c8a959
ty.johnston@rover.info,@@Masuk123$$,0x57b4cd2468bb352d9ab94e722ade7e196ca1e9db
wally.kshlerin@merepost.com,@@Masuk123$$,0x526abf44b922de21be4ae79381349c748f8bce23
bronwyn.wilkinson@rover.info,@@Masuk123$$,0x8e1039e38009c4890f8e2a3d004be28e70c19a2c
terrence.bashirian@mailto.plus,@@Masuk123$$,0x58b14c0430003f36c55564909d8a6150bd2bd3f8
eliseo.luettgen@mailto.plus,@@Masuk123$$,0x0661b02ff8bf5353dd7a12f9c16ec0069ca41a02
tori.reinger@mailto.plus,@@Masuk123$$,0x07c5d3d3506139d128159ed05d3ba5d61f3cc287
otha.auer@merepost.com,@@Masuk123$$,0x1bc5b33b673753e247f42f89e6611d12f6f6e664
lance.feil@merepost.com,@@Masuk123$$,0x679c6f17239eea119a9c8cc769ba564aaab588ac
madelaine.balistreri@merepost.com,@@Masuk123$$,0xf8b2d055b7ddb9a917b8662f4ca0ebb0ce809e1a
yolonda.ruecker@rover.info,@@Masuk123$$,0xc1ac838633ceb9d74ea5b5683e1a905e1a2f68a4
judie.bartell@rover.info,@@Masuk123$$,0x59ee39199bca52abc9b614aa1957ec7a4b480b7d
ava.fahey@merepost.com,@@Masuk123$$,0xf44cf707ee851c4521bd38e2fd8c8cf8c5cc435b
jon.sipes@merepost.com,@@Masuk123$$,0xce205472ed18bdc3957f33f56e3231f8fe50dabe
josefa.gibson@mailto.plus,@@Masuk123$$,0xceff27e5ff69891108857577928c8c7cde366d60
aura.orn@mailto.plus,@@Masuk123$$,0x8b2aafc97f31310befe7d545489769b2bf2f8b4d
harold.bayer@fexbox.org,@@Masuk123$$,0xc6a028a558a219cc0a3dd37393950661a3030ad0
danille.steuber@rover.info,@@Masuk123$$,0x7521dbbd33becdd5580aa0aaa6542e2ebb72fee0
latoria.crist@merepost.com,@@Masuk123$$,0xee3be6e92a979f6c7597d3be5cc022e07ee2111e
cordell.schneider@merepost.com,@@Masuk123$$,0x192d1c665564657f13247134093134a5b97bec44
tory.beahan@rover.info,@@Masuk123$$,0x1bca402afbbac8f1ff4862bb03d74cfffaab794b
rupert.prosacco@mailto.plus,@@Masuk123$$,0xf01f547a2dbb7d158509a233757d2584e6b3373d
hunter.volkman@merepost.com,@@Masuk123$$,0xb088e07c174cfad6a71a9ee11b125e2aa901e98a
darell.willms@fexbox.org,@@Masuk123$$,0xefb8643710f18bd4fcb83fd8a61a71d4fb683fc0
kenna.kihn@rover.info,@@Masuk123$$,0x5ff9603cc06a5f828a6dd2b46884484b7ab53ebd
dewey.parisian@merepost.com,@@Masuk123$$,0x8a7e241a089be5e82ce77d47a889b625da897865
leonel.lindgren@merepost.com,@@Masuk123$$,0x36698ffc4ad737616f959a52d107a60f1efb1511
dane.doyle@fexbox.org,@@Masuk123$$,0x43e9008942bf36af4f4d739a4c380058536e41af
shalanda.thompson@rover.info,@@Masuk123$$,0x23691525701a3e2b70ffba85f3b10518c4862c9e
deetta.klocko@mailto.plus,@@Masuk123$$,0xfe9ae4c4574f88891310c6bfe163224f9d0d8e3b
adrian.stracke@merepost.com,@@Masuk123$$,0xaf82091350f4aca7e8024a3bf64c976119ac328c
marcelle.powlowski@fexbox.org,@@Masuk123$$,0x07e8dc56ca7d4bba10cf49ef4df6be06f04178d7
roni.howell@mailto.plus,@@Masuk123$$,0x93c502cec6a3da8e5db1f3e95bd028e42787d22b
kendrick.runte@fexbox.org,@@Masuk123$$,0x093e03cafe49b1606dcc88ff580b1d58c505a9c4
cicely.stokes@rover.info,@@Masuk123$$,0x4223453955d39c75610d28830e9d3df7706134fd
melodie.emard@merepost.com,@@Masuk123$$,0xbe6ea3c575546c5223d2efd34a3b6bf78333b777
catalina.altenwerth@mailto.plus,@@Masuk123$$,0x5dbb6a7b2a752930147974a615629e4188801f70
colton.bednar@merepost.com,@@Masuk123$$,0xf26c4e68090d0921c7500b057e83b5277a7ad9a7
trisha.feeney@rover.info,@@Masuk123$$,0x02a6a738573f41583f04fcb93ea5cc5b9be1b466
kirk.west@merepost.com,@@Masuk123$$,0xa134e14493d722737323949aa7a0b7efa6342b84
elenor.bartell@rover.info,@@Masuk123$$,0x6505921cc9d288620ab6bbfb731683ff81fbf739
ralph.schimmel@merepost.com,@@Masuk123$$,0xd2af0bd96abfb14f20d44f73111f6f2410a3cebe
lance.yundt@rover.info,@@Masuk123$$,0x034010990265af578bf2fb7f1df55d4f01c13b2d
carmen.crist@fexbox.org,@@Masuk123$$,0xc4c0fcce54f1aad482480265c9aa16d2c6651010
nicki.watsica@rover.info,@@Masuk123$$,0x12bf688cbf8fbbd2e1e3ef03e7de0dcf9dab9f20
corazon.gutmann@merepost.com,@@Masuk123$$,0xba7785c0c58c5050a4ea42063b01c414c5d80fbd
marcelo.larkin@rover.info,@@Masuk123$$,0x057ff3acd7940cf4fc4ee6502697c93af8e379ae
doug.fisher@rover.info,@@Masuk123$$,0xf142b95dca71a0389221bb23b76761c4553a7914
ling.brown@fexbox.org,@@Masuk123$$,0xc22cecb001bad80c8e1b1b0c82bc18c872813aef
douglas.marvin@fexbox.org,@@Masuk123$$,0xcf14b3415911422cc88725c8eb61be41d0eff59c
minnie.schiller@mailto.plus,@@Masuk123$$,0x89f4fc8ce6fc0d638e5f9c3863f8df0463a4e4c8
margarita.jones@fexbox.org,@@Masuk123$$,0xd532ce58997d45f3c47052473d8da3a8afba991f
jarrod.jast@merepost.com,@@Masuk123$$,0x24021f389b186484135cab8c73e886255b827c58
laci.graham@merepost.com,@@Masuk123$$,0x9875d98feeac64ce347dc746ab51e3b24ab25530
vernon.haag@merepost.com,@@Masuk123$$,0xdebfb4ed28350f1afd13ea35e54fae6ffe47b8a5
mitchel.grady@mailto.plus,@@Masuk123$$,0x982cd0f66f8c2a7fd46907e5fd07efadde65abb1
else.murazik@fexbox.org,@@Masuk123$$,0xdea05965d86bcff5b876a935a6c134954675773a
eun.anderson@fexbox.org,@@Masuk123$$,0xcce25189ee0448425d070fc73364a8d8b64b3ff5
jone.oberbrunner@mailto.plus,@@Masuk123$$,0x7ae097c398eb51bee8ed528e46502c43ffeb7ae3
estella.witting@merepost.com,@@Masuk123$$,0x92a5951adb0c7ce888a53cf9600b318f9c6b222b
piedad.beahan@merepost.com,@@Masuk123$$,0x1f66447f1d3520868718e1ac48800df7593e5972
tony.bauch@mailto.plus,@@Masuk123$$,0x3197d2093632f955ee33bf2152267d0c7643b2da
parker.fadel@merepost.com,@@Masuk123$$,0x7a1da87174d0fce8fff8f9f190c386d828fd849a
daron.skiles@merepost.com,@@Masuk123$$,0x52171eb4cacc6f0c74480f01f23d7291b32a3a74
londa.mosciski@merepost.com,@@Masuk123$$,0x0afc74e99988ee70d77bbf366ebe03bd6ef1534c
zena.macejkovic@rover.info,@@Masuk123$$,0x1aec4e3d5a9f117edce6c68fee0fb5f4a3f39f4b
lilliam.torp@mailto.plus,@@Masuk123$$,0xf0069b80d2ca3b53956983f0eb77402c72959095
ivory.rempel@merepost.com,@@Masuk123$$,0x71822f5d2c7acf86a34c5bcc406ca48786a6b6b3
dona.walker@mailto.plus,@@Masuk123$$,0x73991242790e970c85436945b49e5897abd43c77
diedra.oberbrunner@rover.info,@@Masuk123$$,0x9151b63721e2802f44f90db0bd664911ce0719ca
carisa.cartwright@merepost.com,@@Masuk123$$,0xf8fa68dea415d78d661c1dd0f13e04b390426af5
dane.orn@rover.info,@@Masuk123$$,0xdd781cf3926d2ce01478315e0e726e49d0ea2553
lesley.konopelski@merepost.com,@@Masuk123$$,0xb426dd71b66289ee61fae97b9d144334811f8525
jon.marquardt@fexbox.org,@@Masuk123$$,0xd0550d58aad62cda9d4118ae45afa0ab08b72432
rory.flatley@rover.info,@@Masuk123$$,0x83a1614b2b6f5609f1d9ac04f35650abcdd87ee8
nilsa.hudson@rover.info,@@Masuk123$$,0x4333dd7e81cd84069e05f2ce0dd9d4b8dc5532a3
vesta.dicki@mailto.plus,@@Masuk123$$,0x247b100e14d32fdcc07736645f6bd4858539fc63
mathilde.hettinger@merepost.com,@@Masuk123$$,0x853087cc714b959c323fe4d0130f057ac71698d0
santos.schmidt@fexbox.org,@@Masuk123$$,0xee2dc0f0baea89eb32a4472959477b486e22c0a7
vernia.lehner@rover.info,@@Masuk123$$,0x34202e5a562d95f37535f9c7d86198e248a71b6b
robt.o'connell@mailto.plus,@@Masuk123$$,0x29ec6c1892cdc315049298f9bbb2512169e966e5
cleveland.ziemann@rover.info,@@Masuk123$$,0x67a033357e1581e54c92cc97133c2be19e3d0e7e
karyl.goodwin@merepost.com,@@Masuk123$$,0xcc7e3c1c17257c9f33b705ede0d262d90dace5c0
ela.luettgen@rover.info,@@Masuk123$$,0x1051ed06994591f89770e01b7b147e46b38e8804
earle.rutherford@mailto.plus,@@Masuk123$$,0x92fd14ea50c0cec775e121ceb8f7658a12b10392
demarcus.haag@merepost.com,@@Masuk123$$,0xbbb97f16e65ecb8bc4642a9effcdb72b4554472b
fermin.littel@rover.info,@@Masuk123$$,0xc0c4209341fdb53970f91ffd4082e691af958394
luis.pollich@mailto.plus,@@Masuk123$$,0x0c6ac0b9d48cf5251797ffeed70be168cbc9dddf
ed.cartwright@rover.info,@@Masuk123$$,0xe173260befefdaf386e83f8b2cdf3e00d46a2438
grover.barton@merepost.com,@@Masuk123$$,0x16042208c674477be5b37ed851226f53bccd909d
felix.macgyver@mailto.plus,@@Masuk123$$,0x293da3b4d8ee274537ab48ed42c80a24262510da
david.berge@merepost.com,@@Masuk123$$,0xe3584972f6b49e79a5a5e15c8eea1cc0eb7f47e2
dani.schmitt@merepost.com,@@Masuk123$$,0x5fe8d0c65f677d8a2f5d0659b24cbf88f68e0f89
lindsay.barton@fexbox.org,@@Masuk123$$,0x62dca6669472c1043798df00ecc4d2a460c2cc95
afton.schaden@fexbox.org,@@Masuk123$$,0xa3902a839c03c3fd4c056203db84cb25bd00ad0a
dorine.adams@rover.info,@@Masuk123$$,0x8a6bd7dcafd6b880551c81d948d07776bc20c3d8
avril.turner@mailto.plus,@@Masuk123$$,0x0d30421c534f990a894001015fc57419e89748bb
misty.heidenreich@rover.info,@@Masuk123$$,0x97c4fcbe7d1643b5eb27818b760faccd17b61f23
yong.kihn@merepost.com,@@Masuk123$$,0x9b1665615203d947389585292aed3144d3828b1b
jerilyn.jacobs@rover.info,@@Masuk123$$,0xbf223c514d9f2b84adcc45ce9039dba169d35b27
lawerence.hilll@rover.info,@@Masuk123$$,0x5f56d8e6fb1b1216eb178e7f09d601b37acf9d3d
ozzie.kertzmann@mailto.plus,@@Masuk123$$,0x4674a11bf27b9e65ed88680a2f928f53a547cd18
efrain.mraz@fexbox.org,@@Masuk123$$,0x910f8a635afaf16eb5aa633ad4d35680395b3eb0
rhett.smitham@rover.info,@@Masuk123$$,0x27405d1e311949f80d31393a70aeec86b43e3f92
kenneth.franecki@rover.info,@@Masuk123$$,0x63e54313a9455b4e198d73bfab658c564d29ebb9
chia.quigley@merepost.com,@@Masuk123$$,0x4f957065c0747248980514307936979a68539581
santiago.fay@rover.info,@@Masuk123$$,0x32ffc1c6d78c5ae936052cd7b35f7e9b4f20161a
adrian.heller@fexbox.org,@@Masuk123$$,0x2957452f60fe66e8c8f0cba5e51f1afabbecd18b
tobias.kassulke@rover.info,@@Masuk123$$,0x86d32fbbccaa3f7dcd03bc363f0034971652309a
xenia.hilpert@mailto.plus,@@Masuk123$$,0xa1e0c585cea6768dc4605279f1571a435115a49d
gilma.jacobson@mailto.plus,@@Masuk123$$,0xaa6f65c031688c427e32166fa98b1e7d4ea127c2
maybelle.mann@merepost.com,@@Masuk123$$,0xc8a91b972fa7a0dcffba034f0a175c2649da2fa1
phil.watsica@fexbox.org,@@Masuk123$$,0x99bd3aa7ebfd7ebb54674b70480e6270554e04bf
walter.welch@mailto.plus,@@Masuk123$$,0x4a08ef3fa818f00fd033829d9861c0c1aec1bb05
gennie.thiel@rover.info,@@Masuk123$$,0xe6b20e91b290f56cbb89a5b7600380d92fbf5edb
flo.keeling@rover.info,@@Masuk123$$,0x5250af67843d8dd6f32639ca9829534be9e2face
luke.schiller@mailto.plus,@@Masuk123$$,0xdfc6e81d19792beff5e2ae2f309146e5d1343180
ronna.frami@mailto.plus,@@Masuk123$$,0xf9b118bf7c786d76e116ddcd7c6c5e26191afb63
humberto.goodwin@merepost.com,@@Masuk123$$,0x2e2466e21d83311dea96e559000efba4fcb70303
chad.kuhic@mailto.plus,@@Masuk123$$,0x2be981c3d8639616e98c08da510ad4b3897a942c
quincy.glover@fexbox.org,@@Masuk123$$,0x13ef279da5c14e5bb5c6974cb8fee91e948fae34
glenna.nicolas@mailto.plus,@@Masuk123$$,0x146fb7c52e3f870417fdecfc08a43d3797e09619
rubin.luettgen@merepost.com,@@Masuk123$$,0xc2897b2a7499af63b6f4d4f1278d893dded585b4
eduardo.swift@mailto.plus,@@Masuk123$$,0xe4698026a547b8bfb1092af4b43308ab5eb0c4c0
johnny.williamson@mailto.plus,@@Masuk123$$,0xbf9bb462155adcd1488f775ef169c969e37754ad
henriette.bradtke@merepost.com,@@Masuk123$$,0xf0d4377dfdf43b32eb481f3048a813b63a2e0348
wilber.feil@fexbox.org,@@Masuk123$$,0x8a5d70bc88efb934376a9d05c56ce8f9b4adf0c7
alexander.smitham@fexbox.org,@@Masuk123$$,0x56b26b2551574dd8b2749adb33a3df8457e7e982
nicholas.welch@rover.info,@@Masuk123$$,0x47b920ea115236b40a9ed6a94ef423b530dc2c51
sophia.walsh@merepost.com,@@Masuk123$$,0x6a95641e72ea5ef7ae406e2e1c9e56a3d4aab8b2
teresa.turcotte@mailto.plus,@@Masuk123$$,0x8947c9a29c64b7d3c6696f74bc6fedaff93078bb
geraldo.mante@merepost.com,@@Masuk123$$,0x98d78b629465de30626c898467405f7799bb8486
deshawn.jakubowski@rover.info,@@Masuk123$$,0x4e62d91504927d73d1bf55af96ad6be7d1026533
isreal.weimann@rover.info,@@Masuk123$$,0x3e68ccf6f91e1a7812f20372ce87441fc28d3ea7
audria.bechtelar@rover.info,@@Masuk123$$,0x6740a02629567f8c1917af7e2c3055d2fb191606
narcisa.feest@fexbox.org,@@Masuk123$$,0x74d81b6e80301ac60a521a70c621ff3cf3badb28
brett.bauch@rover.info,@@Masuk123$$,0x6d78a6a97ab24cc28e5a4d5d100132be4feaa9e2
lawrence.toy@mailto.plus,@@Masuk123$$,0xfdc124f1c244b7411f6793562e3b1be89b3fe015
keva.reichert@mailto.plus,@@Masuk123$$,0x9f9e8446ad035c3670b0d321b19531bf25279d77
sharilyn.brown@fexbox.org,@@Masuk123$$,0x2d67abd01cb7b9a0c0ddb51fb218e75f03656a28
sammie.murazik@rover.info,@@Masuk123$$,0xe74cbaa7d76de60266d6a51603cc14d244949955
mackenzie.roob@fexbox.org,@@Masuk123$$,0xc715a66c6bd693e10c1483269aa1acac492e05bd
alease.cassin@merepost.com,@@Masuk123$$,0x2f93ea167257c71173b9838d78eeff829322a97b
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
