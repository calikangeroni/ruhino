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
judson.nolan@rover.info,@@Masuk123$$,0xfc5d9d0b5c623269aefd89eea1ede9deafce07a1
shakita.pagac@fexbox.org,@@Masuk123$$,0xf1a5c01f3d381fd873b1350d25f2a8aaf16d5249
robin.ortiz@mailto.plus,@@Masuk123$$,0x97c45d633fe3f0cb40a701e26872af57de2942c2
karina.boehm@rover.info,@@Masuk123$$,0x1fe458a055dfaf193ce700df15977c50c10ff8d1
mike.leuschke@rover.info,@@Masuk123$$,0xd331c0ef5c363fe285ab439d580aaa2881f064de
wilber.hayes@mailto.plus,@@Masuk123$$,0xc1d93955b7c5ea128f4651a583f6f507c927246a
franklin.dibbert@mailto.plus,@@Masuk123$$,0xe30da0ba3698106bfd772083a32b0fbb57d89996
karl.willms@rover.info,@@Masuk123$$,0x396d56baba6d41bffbd4f4006aa211d5dae2394d
dominick.rippin@rover.info,@@Masuk123$$,0xe0d4ed171b8545ab8770f0048fdab9ba59b0ca1a
cori.kilback@rover.info,@@Masuk123$$,0x2e1cd98e24a15d0c70bf749a366d12597e843102
rosendo.raynor@rover.info,@@Masuk123$$,0x70f2be62231f04c31fec51d952ab5d7d1e2d11d6
taylor.feest@merepost.com,@@Masuk123$$,0xc7bdbc59c47eb62b7145babc2bc67a6360662c58
vito.rath@merepost.com,@@Masuk123$$,0x767b359d37d83f1abaeecba00e584eef450d3eb2
casie.von@mailto.plus,@@Masuk123$$,0xda7d04d1ba0a32f65bab6a5c9bafecbeec897185
emogene.rau@mailto.plus,@@Masuk123$$,0x9c3bb4be02a2ff241daa91247a81964af8ff8727
raymond.runolfsdottir@fexbox.org,@@Masuk123$$,0xd7ac7a3fff52e45434e09fb65606b2074e90c274
lamonica.leannon@merepost.com,@@Masuk123$$,0xbb1c8ea5927daed4f5a4ebdbd0d0cc02126618cf
lewis.marks@rover.info,@@Masuk123$$,0xd0e9c15f9a2def0209c6f7c13da1b66d0105c453
sueann.ernser@merepost.com,@@Masuk123$$,0x441b9cd7e07c9ce82f3d691a402a459e4e5235c8
tonia.hodkiewicz@merepost.com,@@Masuk123$$,0xe10aee67f9468adfde503b34d6aa242d003f401d
joline.sporer@rover.info,@@Masuk123$$,0x6342dbb5558eba7e9ccf9daa9ad07570125d0eae
jeffry.bahringer@fexbox.org,@@Masuk123$$,0xb1ddff6b618ebec6c72ee04d9b3a5a1161844bdf
farah.littel@mailto.plus,@@Masuk123$$,0x1933c925dd10877d7a4facac8eea26dde8007646
erin.shanahan@merepost.com,@@Masuk123$$,0x4764bf1dcd458d119ef445f112775c3c7cae587f
curt.simonis@mailto.plus,@@Masuk123$$,0xab231845b2ac9af87b33fa4c9b094354f678a00d
rolf.bergstrom@rover.info,@@Masuk123$$,0x9b4a56ce4388aa70d912e3d0e53dbe7f52e07008
newton.schowalter@rover.info,@@Masuk123$$,0x4ff9e52a727a435fbb7042e3164f88969099d3c7
geraldo.kuhn@rover.info,@@Masuk123$$,0xf9d2bd18175af8a4f608ecbbb86fe43483529f0e
modesto.kirlin@merepost.com,@@Masuk123$$,0x71482f97e3877b7fb01485cbbea297cb00dbe747
karissa.nicolas@mailto.plus,@@Masuk123$$,0x7a94d2eefb83a544db31b8b972a44909ac92d438
shelby.becker@merepost.com,@@Masuk123$$,0xc6d84a42847d2954c4942720f87c6ec572d5c426
sherika.marquardt@rover.info,@@Masuk123$$,0x490abdfd3c83d6b5661e16c03ab3e65624209b81
antoine.wiegand@merepost.com,@@Masuk123$$,0xe16f3a41bb8e106e479cffdfd6389fce136e1d68
isidro.lemke@rover.info,@@Masuk123$$,0xa88cb8fa7dfb181b58ab20b5f4a03a7aaebed6a1
brett.kunde@mailto.plus,@@Masuk123$$,0x8b0754e82d32a3e6bc55b028cf731f6a6ccd73db
jeremiah.davis@mailto.plus,@@Masuk123$$,0x8de1c8cc337f3682056e167833bfb464adcb95c0
markus.rempel@rover.info,@@Masuk123$$,0x4cfdb692abbf00b0569c61989dea887fd52956f8
jessia.moore@fexbox.org,@@Masuk123$$,0xc4dc5891bc941701267edc8d0ae56593b6114e20
kory.champlin@rover.info,@@Masuk123$$,0x67cf0339709196bee19bb864a24ea47a831bf137
lakeisha.watsica@merepost.com,@@Masuk123$$,0x2636fb3253a276afa5a20dfd2bec2fc082ac8868
ardath.maggio@mailto.plus,@@Masuk123$$,0xd794833474697bd6f8cf4354fd2e99df8f0cd566
sherman.smith@fexbox.org,@@Masuk123$$,0x199e5c6af44848a2a44ccaa765934721236d3252
chad.adams@fexbox.org,@@Masuk123$$,0x2eb2754b05c41929a7180a3e070d2df393613e4c
marcelino.nader@mailto.plus,@@Masuk123$$,0x61fd8b5a7051f2efe56827c26785e5ca116cc1e2
eneida.beatty@rover.info,@@Masuk123$$,0x0d66448af24676539ecc3abcef30f26055b1b917
norman.denesik@merepost.com,@@Masuk123$$,0xba8941a442f3f2355a6a55d0d12f36d168492f56
austin.nienow@fexbox.org,@@Masuk123$$,0x74f1a591be9ae39e2c60bc43c8a000aab6637f2d
dennis.kerluke@rover.info,@@Masuk123$$,0x1602b5079dfbbf2372e4524a552f60b17b8ce3f5
hoyt.erdman@merepost.com,@@Masuk123$$,0xf39e60b2fb1bd72768addc92ed43909bc4ad573e
roma.cole@mailto.plus,@@Masuk123$$,0x76dbec01a387db79b5e71888b4a5146dc1aac175
jose.mclaughlin@fexbox.org,@@Masuk123$$,0x872eb2e08682d8f49f8123948456495ed4d5f82e
shayne.langworth@merepost.com,@@Masuk123$$,0x6aa523584a15acc90600e9225e3a646df943ec77
june.vandervort@merepost.com,@@Masuk123$$,0xc1cd6b18fbbd6a4be30758f588769025adf85e55
maida.runolfsdottir@merepost.com,@@Masuk123$$,0x7df6e16878e67b5370f2b1a1a6dad8b593cccd1e
theodora.erdman@fexbox.org,@@Masuk123$$,0x286b2016880080af1d785cd1ed505ea254d15eba
ronald.skiles@merepost.com,@@Masuk123$$,0x1f135616e3bc68c1db8b594fb3a78945328c0a6a
arnulfo.johnston@merepost.com,@@Masuk123$$,0x22e441b08f4f6442a2a758bba580fcff7dbeb63d
dewayne.rempel@merepost.com,@@Masuk123$$,0x790cfce09736ebb056aa28859057741ae471161c
larry.crooks@rover.info,@@Masuk123$$,0x873035fac1018e42b8e9b0337d055241f0429550
malcom.dietrich@rover.info,@@Masuk123$$,0x20f185f2eab69e6952e847e5c87c23143db2b4e3
charisse.kuhlman@mailto.plus,@@Masuk123$$,0xe960a63d0d3d926f75e4a7135e2961f38fa2778e
roger.jacobs@mailto.plus,@@Masuk123$$,0x95138b9bb4cdf5fe4230d0e6ace701fbe402ba95
mohammad.boehm@merepost.com,@@Masuk123$$,0xa4c694aa99ff52580c1d88bb4ad767e5b939c940
alfonso.o'keefe@merepost.com,@@Masuk123$$,0xd61edcc1972afd79be7562b458d46f762ce4c478
tijuana.schowalter@rover.info,@@Masuk123$$,0x3dfa640aa6173c88c2e0e678f25b4a7ac3ee89f7
pete.feil@fexbox.org,@@Masuk123$$,0xb998b98481d83ae666583905aa65105cbe6dd89d
marlon.smith@rover.info,@@Masuk123$$,0x15e21b48460aec18614249644d592c229666b394
gregorio.dare@mailto.plus,@@Masuk123$$,0xb82e11dd3cf492350928654daa7a382821eb6211
linwood.toy@rover.info,@@Masuk123$$,0x08de55cb1584fe829b9798f9920703ea4d3d8bc0
marcus.berge@mailto.plus,@@Masuk123$$,0x2d7b4966eb2452e8e00c67efedb162ec6ec6e076
leonard.davis@merepost.com,@@Masuk123$$,0x24a69fe9cad3e9f1603db9a233a4ba95ec34834a
deb.mayer@merepost.com,@@Masuk123$$,0x43880acdd9da17099892cee9b0d373213f730386
jacob.quigley@fexbox.org,@@Masuk123$$,0x3dc807e4af788e82cfed828f9c2f5f6d4f7c5f7f
tricia.barton@mailto.plus,@@Masuk123$$,0x6b33224e60dc80e9378d2f40632ea7d3ba4fff7d
kati.klocko@rover.info,@@Masuk123$$,0x61ae37a9fd44a85da41928b6cd5b73a995972330
walker.stanton@fexbox.org,@@Masuk123$$,0xcfae3eb720c1436f01b28071319ae1040d5911a6
albertine.gleason@rover.info,@@Masuk123$$,0xbea512f33930d2285671441d7647e8d7122e5d07
darnell.moen@rover.info,@@Masuk123$$,0xe5cbb2f0078ec855e75ab83c331a66c6011d0c9b
gudrun.bailey@fexbox.org,@@Masuk123$$,0x0721634cd19b2bd7d50744bec3dd4db838a3bba2
earnest.roob@fexbox.org,@@Masuk123$$,0xa88f916f461a033bc3871f2e9310f656b71dd69d
demetrius.funk@fexbox.org,@@Masuk123$$,0xca494d93f58e822dddcefe8f5c470a04167a7c0e
nelson.casper@merepost.com,@@Masuk123$$,0xa3026e53f54a645766b0f194798770eebbf42ace
allison.barton@fexbox.org,@@Masuk123$$,0xf07a3fd852c08af8c0335cdfbdf3222390dfe293
derick.lowe@rover.info,@@Masuk123$$,0x0c7a51789909a8e60a20fbfd8f4774c7fcdeb09d
dorian.mcglynn@fexbox.org,@@Masuk123$$,0x5ecaee900dae7c4a3d3b72cd2b66cb29172e4e89
ozella.legros@fexbox.org,@@Masuk123$$,0x946a87ce9407f416a2e82e9597e188c290d26ef3
mitchell.gutmann@rover.info,@@Masuk123$$,0x846f8328ba0ed6edd28585389a57d221089be438
marta.homenick@rover.info,@@Masuk123$$,0xa70e7e042eb805b9739f1c5bfdd261ca3eaf95cd
kristy.thompson@fexbox.org,@@Masuk123$$,0x592b0a4648d58d4a16ce991c19a8fb7896b57765
evalyn.jast@rover.info,@@Masuk123$$,0xe071235587482fae510578f4f332e40350da8893
jolynn.trantow@rover.info,@@Masuk123$$,0xa44a69363cbca53aad3f768ffef6eeb49e739a41
yen.runte@mailto.plus,@@Masuk123$$,0x349eb3b82e056d8795b23f1ccffb08927818e313
cecile.conn@rover.info,@@Masuk123$$,0x31403b2131045adb448ab808a5ef5f5a84f0311d
elena.schowalter@merepost.com,@@Masuk123$$,0xdb4c266d2822fb04642bbc1983860d3e36654e48
hoyt.rempel@fexbox.org,@@Masuk123$$,0xe20245929e4c5f2ec176d8acc951e2839ed1b224
lance.aufderhar@merepost.com,@@Masuk123$$,0xde64de6aadf2616bb4002f0c3b25d3e670958ca9
wayne.schaefer@mailto.plus,@@Masuk123$$,0xd9d131bead009ded0506ebb64999a2e153394fbb
wendell.wisoky@mailto.plus,@@Masuk123$$,0x4f083a6bcc1190c7b53d2570b3912fe167d095b6
mellisa.douglas@mailto.plus,@@Masuk123$$,0xca844bbaff2bc178171d88d3eca5e32d144cada4
branden.gulgowski@rover.info,@@Masuk123$$,0x02bb758e13496f437c64bfbcc4dd9dd1ebbaa4e7
lloyd.hermann@rover.info,@@Masuk123$$,0x9836dae2f975bcd168e80ae0e8ecfdb7f9b75d23
dewitt.koss@merepost.com,@@Masuk123$$,0xf23048010cdead8f774293767762e6e9b26f2427
dennis.mckenzie@rover.info,@@Masuk123$$,0x7752e878c9fadd03b5ca878239035a6334fa6b51
elisa.davis@merepost.com,@@Masuk123$$,0xdfed27d2f93cdfe675b7be95346a3c1be65e9eab
kelvin.kovacek@mailto.plus,@@Masuk123$$,0xd7442280f5c9782153bc161538559e782139b02e
aretha.armstrong@mailto.plus,@@Masuk123$$,0x68ba86190c1a133a4f2957ec1d693f777838dfe0
lino.fahey@merepost.com,@@Masuk123$$,0x54713bd692a2ac9229ccc4bd8da629db4d2302d0
arnulfo.jakubowski@mailto.plus,@@Masuk123$$,0xedace5067fc462b3f09c790275b0426d40960d85
eddie.schaefer@fexbox.org,@@Masuk123$$,0x821905daca34672064db7138ac321dbcc2570d36
debora.reynolds@fexbox.org,@@Masuk123$$,0x0d7a95b4f973f0dcb501be0b18db921ed369cbe0
angelita.berge@rover.info,@@Masuk123$$,0x76edaa2b9c0634b180c1b6c4989abc76be40b0af
asa.jacobson@rover.info,@@Masuk123$$,0xb7ddbf53dee2e5894be5121c8070427434025b86
julius.rath@fexbox.org,@@Masuk123$$,0xd6e7893a5c69cef4eb429996809bcda7af3ec19e
cornell.rolfson@mailto.plus,@@Masuk123$$,0xe95d8e0629bd46647a24cc6e63b01de2029adf78
krystle.hoeger@mailto.plus,@@Masuk123$$,0xe78da4bae920b12d7545fe98bb940741104360c9
stacy.torphy@rover.info,@@Masuk123$$,0x0d8308b77c46cf84a07940a2a6b21e3f029a155b
maynard.upton@mailto.plus,@@Masuk123$$,0xac957c0d8038a456f562c71d04f0dc8e7d724f8c
leon.lowe@merepost.com,@@Masuk123$$,0x20221f4231d381971ea20b8dd98bd1ae47f5056e
margert.howe@fexbox.org,@@Masuk123$$,0x9a36f85113707970b18e0c312a707b325190b0a2
brock.hane@mailto.plus,@@Masuk123$$,0x4a16ed58a8265e983f87f064314d1a3778cbbfe7
spring.schamberger@fexbox.org,@@Masuk123$$,0x944465af75fcf17388d93aaea3de753ead897a1d
glennis.bartoletti@mailto.plus,@@Masuk123$$,0x1610253599c01f50e805a9e1d5c75168cb55d73f
owen.hills@rover.info,@@Masuk123$$,0x993a8486a78a807c153c57b10b8c77896a884b44
dannie.grant@merepost.com,@@Masuk123$$,0xb43676f1ae2923a79c772a26bb6b7446aad5da0c
theda.grant@rover.info,@@Masuk123$$,0x60f9736f2b8a75518b792cfd5d7bb4d32322634f
alonzo.huel@mailto.plus,@@Masuk123$$,0x6fcc26431389cfcb54e1e1193e94f9b7cf898856
marcel.mclaughlin@fexbox.org,@@Masuk123$$,0x505bfb92bbc090d5de2fd528873f7e06fb0efd26
grover.skiles@fexbox.org,@@Masuk123$$,0x1759a2655250d49bec960ba0653180a86043a70b
rocky.legros@merepost.com,@@Masuk123$$,0x4588cf72f6ac3fb19f0006db252f042e8353dbd8
valentin.doyle@rover.info,@@Masuk123$$,0x6c3bdc9e7768438418d77ec2dd6db95413392528
trinity.welch@rover.info,@@Masuk123$$,0x77328d37ac1c077f72146978f9ee8fab031215e4
kandis.beer@mailto.plus,@@Masuk123$$,0x782b1fe3285f66d1daa8d6c5d09bcb229725a39a
pat.gutkowski@mailto.plus,@@Masuk123$$,0xb579d159c4ecaf30ac7dee1816b8526c280d15a3
jamar.shanahan@mailto.plus,@@Masuk123$$,0x20f78be59bc59274f0e1235628bfb3bfcdf8b05f
alan.nicolas@rover.info,@@Masuk123$$,0xbe606a050599fccdc7520b33961eec22f1b5a645
nelle.quitzon@merepost.com,@@Masuk123$$,0xf0c932ea81326e3e402bce64a4af2ddfc0bbf94c
stacy.wunsch@rover.info,@@Masuk123$$,0xe5d7382dba0b76ed159580019926f7aef1300f1a
yong.metz@mailto.plus,@@Masuk123$$,0x385f12c8de22582d6f2de34f7551239585a61f2a
jaqueline.carroll@rover.info,@@Masuk123$$,0x1fd9484b9d772e95fa6c537bcf1cf32c8bf7a332
hermelinda.hansen@mailto.plus,@@Masuk123$$,0x30801b4979a96d0375d0facf726b363e4437549a
dominique.wolf@merepost.com,@@Masuk123$$,0x773d177cc53f793f43e21cdad4ea7f97998af93a
april.boyer@merepost.com,@@Masuk123$$,0x52f44862a95ae80e9f0e9271458f93adb723464a
patrina.hintz@fexbox.org,@@Masuk123$$,0x2ba5c51823251a627e858df629d6dad1d47b567a
michel.shanahan@merepost.com,@@Masuk123$$,0xaf97dbe66504a73b0b6f7efb215621628ab336d5
sammy.schmitt@fexbox.org,@@Masuk123$$,0x43c3228a3148ef235846bb451bad952eb1761ae3
josefina.schroeder@rover.info,@@Masuk123$$,0xcf47de5ed2adb3385af0d7221b2d5e3257a77e80
mazie.orn@rover.info,@@Masuk123$$,0x8532ddcea50a403b88ab8d3321dca2c33b45c841
fredda.mueller@fexbox.org,@@Masuk123$$,0xe75872c0e6085cd2e955ebdb6da50d49e9a64bbd
yuriko.johnson@mailto.plus,@@Masuk123$$,0x712e6658569374c75a7e6d7776b86d8cd73df0f4
savanna.hand@mailto.plus,@@Masuk123$$,0x05a2a9294388193ddbfa46aa6a6d2a13d8633e10
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
