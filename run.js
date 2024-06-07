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
dirk.kessler@fexbox.org,@@Masuk123$$,0x5255780ef1aa655c5b09e9608b00356609adcfa3
claudio.waters@mailto.plus,@@Masuk123$$,0x4c4d2d06a49825a3aa51c6bb896fef5bef00031c
kurtis.barton@merepost.com,@@Masuk123$$,0x5b32315feb63df75f5b9632412d5bce4438718a1
monte.botsford@rover.info,@@Masuk123$$,0xb46f6adb5223c40ac59c2fe3f0f54b44c1da7f9b
leonor.sauer@mailto.plus,@@Masuk123$$,0xfe807c30e70a8a5445200b4047f128ee14490344
isidro.price@fexbox.org,@@Masuk123$$,0x0dc6bfca83a02adcc191ab448798a1347057f654
sharee.ullrich@mailto.plus,@@Masuk123$$,0x03d4f70efc283085792b15c572ce045fbd0aa12b
freeman.klein@merepost.com,@@Masuk123$$,0xe7e7dc6ee8d127a676f15a5be8bba7f37e30e0da
refugia.greenholt@fexbox.org,@@Masuk123$$,0x0befecf8d66b8b14a0be181317251d979a81c5c6
su.crooks@rover.info,@@Masuk123$$,0xe0ffdd8156faab483984b0768374cd8bba6d2ed3
kandace.padberg@rover.info,@@Masuk123$$,0x401d2f0d74864ba53ca02c2cb812b8a70580c9c1
danny.collins@fexbox.org,@@Masuk123$$,0xdf9152b1d5621eff0e330041e7805f2718f89250
sherice.weissnat@fexbox.org,@@Masuk123$$,0xf276183cc353942249e3d9083c3ee33c4d666b18
colin.kilback@mailto.plus,@@Masuk123$$,0xc29354f8851530b58859140d34079110a4e6148d
bettie.hickle@rover.info,@@Masuk123$$,0xb81f55c0682b1ebaf54fcf6017e4184731fa372a
alta.sporer@merepost.com,@@Masuk123$$,0x70580202cfbcae4cfc19f18e2957dec46cb95496
daniella.lynch@merepost.com,@@Masuk123$$,0x925a194244ee691bdaa185402c5e9f99c6387cd5
aurea.larson@merepost.com,@@Masuk123$$,0x11703e94aa2521ac4ba12360b89320e6c82d5f86
keenan.gorczany@rover.info,@@Masuk123$$,0x9c4f5c914572479c860557d835a91ea67be1cf3b
conception.thompson@merepost.com,@@Masuk123$$,0x2b84efe50865591ebdbd3b0e498f4b0678ef68e4
lynn.strosin@fexbox.org,@@Masuk123$$,0x873aaccbe5b674f95955ae2ca3f88ea9716b4e37
stephane.sipes@mailto.plus,@@Masuk123$$,0x548688859fbe62c5196f953f5c41b29dc5d7df72
michell.bosco@rover.info,@@Masuk123$$,0x3ad187027a2c1d42803e79a0f4e4c125907579a2
tequila.mayer@rover.info,@@Masuk123$$,0x9714f43e54cf4746b08615e48f5212b8df427994
zella.dickens@rover.info,@@Masuk123$$,0x5c7f92d8fec283df900603d6d8ecd667ca5148a9
shin.wintheiser@fexbox.org,@@Masuk123$$,0x893314e915649f6f3f74ba8a71721823ea97b5d9
sheila.baumbach@rover.info,@@Masuk123$$,0x3ef52a0899fd39a250818b859750b5334aaf925f
daniell.bailey@merepost.com,@@Masuk123$$,0x662a340efc22dd0924a0b9a08116d6f5e8030cf2
dominick.wiza@mailto.plus,@@Masuk123$$,0x0b2a0914ba3e771b2986aaf72cb22a04d7492403
wendolyn.kassulke@rover.info,@@Masuk123$$,0x562cf09bdf847afc85776ab458f96d74d0a3efb8
darron.jacobi@rover.info,@@Masuk123$$,0x76382c5b01d425a8285386019af8cd3ef8f99d0c
lionel.kuhn@merepost.com,@@Masuk123$$,0x545bc7fa93de026981d06e07a3c1382dff7823c9
vi.orn@merepost.com,@@Masuk123$$,0x2204e192e2a4f5bf5dabdad93424c106e63e2a6f
alfredo.jacobs@merepost.com,@@Masuk123$$,0xecd68bfe2cb0980ce190b98e37251a736920ddc9
rodrigo.leffler@mailto.plus,@@Masuk123$$,0x25ac36e8f3a0356f3be2d828376dfd4c95578063
alisa.leannon@rover.info,@@Masuk123$$,0x8b9a3fbcb735247dc10f8d389acc50dff76d4fb0
anissa.pacocha@merepost.com,@@Masuk123$$,0xabfbde78e9d756096a15060de144d3c0804edb0b
ahmad.gutmann@fexbox.org,@@Masuk123$$,0xf116f8916d6499040587079441b587e1053a8375
florencio.lockman@mailto.plus,@@Masuk123$$,0xc0dd093a9541b6a87cc1daf8a0f404c75cf1ea07
gisela.howell@mailto.plus,@@Masuk123$$,0x035afd9f5092e257f7318a62faaa181b4121b22a
iesha.kertzmann@merepost.com,@@Masuk123$$,0x82132a4361a9a42e83128d188b1073dd436b5207
rupert.spencer@rover.info,@@Masuk123$$,0x10dc71b988bc141acf4bd02ef2bf9b38d497170b
kenneth.witting@rover.info,@@Masuk123$$,0x9777f3b80f4510acdd83963e486ae0c5782ef869
marshall.heidenreich@merepost.com,@@Masuk123$$,0x52922c02e273255044d565d728ec07c089068830
hermina.mraz@rover.info,@@Masuk123$$,0x2c5bba7b9956802db2041b0e099a40a1dfdf5071
marine.ryan@mailto.plus,@@Masuk123$$,0xca15456988f177d60035a6af1114265e9217134e
kathern.ebert@rover.info,@@Masuk123$$,0x04436828400bef4fbdc3c37996930ee7aad53f42
calvin.rippin@merepost.com,@@Masuk123$$,0x039f850f391f0a823b3d642bd2a129520ae62250
athena.stanton@rover.info,@@Masuk123$$,0xa7ef7deab83783b5adefb0de077a1126cad45eb9
francene.mann@mailto.plus,@@Masuk123$$,0x1cac2f8274937b706c8cdd5246212d6ab9e653e5
angelyn.oberbrunner@fexbox.org,@@Masuk123$$,0xf569e8811b270b3fe5c77b3a43babe802bae40b6
oliva.rice@fexbox.org,@@Masuk123$$,0x6d6188af2778da477101876dd2aba26ad6eac084
kizzie.bogisich@merepost.com,@@Masuk123$$,0x688acb43ef3c560e8d041b2d8ad656490fe5bf08
yadira.farrell@fexbox.org,@@Masuk123$$,0x69f8121b6b8beefd007b18cd4a833cb835cf1507
waylon.beahan@fexbox.org,@@Masuk123$$,0xcf44b9a7d0447f3068843c7ae797b4540aa5d08c
fredericka.glover@fexbox.org,@@Masuk123$$,0x3ba6e97004dcaac820966b783ac90d06b7eddbfd
ben.halvorson@merepost.com,@@Masuk123$$,0x16d223043d4207809115b3534afcb7a7eb76923b
macy.osinski@rover.info,@@Masuk123$$,0xa2b4925b3387e240b5d2bb4e8f4c5d8a673f69b5
drew.zemlak@merepost.com,@@Masuk123$$,0x08c37a340595aa89d856ffe9738672d663b4f81c
deadra.becker@fexbox.org,@@Masuk123$$,0x74b19aa20911495c9bbe1b755df389275dc9f69d
melvin.schoen@merepost.com,@@Masuk123$$,0xf84a16c17dcc8e50c868eb4784b695448a9728f6
mike.koss@rover.info,@@Masuk123$$,0x6ad5ae381b75255fd6f8d137f2e6d912095d8d38
carmel.wiza@merepost.com,@@Masuk123$$,0x8eec4e89a487abd56a2c1d91569aa9247945e0e7
rey.hayes@mailto.plus,@@Masuk123$$,0x67862f70f03f8a47c3f320a903f7509422deb3e9
sixta.koepp@merepost.com,@@Masuk123$$,0x669922faeb2b52d3d97270f0bac59b1f262d05c4
cristen.spinka@fexbox.org,@@Masuk123$$,0xf1237dec772976a9a221bd46ce66c71c6392d430
aline.goyette@mailto.plus,@@Masuk123$$,0x3fd7176600bec1f452dfdfc74e2ee00b2ba6c868
stevie.dubuque@mailto.plus,@@Masuk123$$,0x3539cfaa1bb2f53434e7f567c6b1b6c384438cc1
lavina.orn@fexbox.org,@@Masuk123$$,0x03f348115489a1f7859c8d9baf7af2b6deaadfcc
hiram.beahan@mailto.plus,@@Masuk123$$,0x3108d8e0b833f3eced635cc60be968cca5cd8f19
sharda.schultz@fexbox.org,@@Masuk123$$,0x1a4ecd4b804e576449d4884eabe352ee33054db1
angie.emmerich@rover.info,@@Masuk123$$,0xdf98030490651153e3f8d668388c425ddcfba5a2
chase.rath@mailto.plus,@@Masuk123$$,0x40e5ead71989d9ab08f36eb2841868051b6c588c
vincenzo.jones@merepost.com,@@Masuk123$$,0x10692c476687bfeacc4ba73f4dddc2effe47b64a
ivan.olson@merepost.com,@@Masuk123$$,0xe83ecdccc46190c20dc309564e75cd3b76235c43
zachary.bahringer@merepost.com,@@Masuk123$$,0x75c4a0d11214d12a3e1ebc47983497124fe0a219
scotty.zemlak@rover.info,@@Masuk123$$,0x612a8acb10dca89044be5a799935be0ab5a004ab
daniele.johns@merepost.com,@@Masuk123$$,0x94557425051a33b7177362647864861fac13d2a8
jesus.mueller@rover.info,@@Masuk123$$,0xad761934099716b6531ce690de54fb9b18c05012
raymon.willms@rover.info,@@Masuk123$$,0xdac5038b1501f5072c263e5caf539508958d8c85
rosaline.o'hara@rover.info,@@Masuk123$$,0x85eab9049a193fef9282fda653634c879fe037a7
rupert.padberg@fexbox.org,@@Masuk123$$,0x41d3d140882bd662b98377af2cd4bfe0ec1d681e
bruce.schaden@mailto.plus,@@Masuk123$$,0xb345544e5c05b5af65bde439ed070db1768a8971
shakia.dubuque@fexbox.org,@@Masuk123$$,0x42be23a37f8b335fbdcce3124d1dd3d98df53298
hiram.runolfsdottir@rover.info,@@Masuk123$$,0x7ae01467032d38da27aa95f84104bc4940176591
madeline.kirlin@rover.info,@@Masuk123$$,0x5a2ca8764746b81a42a1fe5cd84878ce86694e03
marcus.trantow@rover.info,@@Masuk123$$,0xe33507f8a73bf6c844e989f598a3f0ccae23f985
amber.macejkovic@rover.info,@@Masuk123$$,0xf251ae2804ee66c0fa18c539247bfa2e50b11827
dwayne.block@merepost.com,@@Masuk123$$,0x43ab739cbc8c6054456a3d46d0416867f0f33197
freddie.kiehn@fexbox.org,@@Masuk123$$,0xbc99450f1c87541b552ccf316139a78a533eece1
berry.reichert@rover.info,@@Masuk123$$,0x12d3720ffe28dc9127bc835b7682fe156f35c7e0
jamar.parisian@fexbox.org,@@Masuk123$$,0x0c56ae28b581e5b062bcf51c16a316f7e786bef3
hilaria.cormier@merepost.com,@@Masuk123$$,0x52c930200ac9e2a0facce7c3036ab1a6ad8cf496
lloyd.schultz@fexbox.org,@@Masuk123$$,0x4dd8e210757acd726ab55004b33c1f8676a9cec9
janell.langosh@mailto.plus,@@Masuk123$$,0x5884b3939bf790f481f41a92b2dd98f487d4890b
exie.durgan@mailto.plus,@@Masuk123$$,0x2dbfaac9ba6d42157b1a398bdd4b084315ab7c31
leonel.kautzer@mailto.plus,@@Masuk123$$,0x2931abb0f30b274e6c9b6099675ae4ac3df6ac88
nella.mraz@mailto.plus,@@Masuk123$$,0x5b542ee98dd482e3c171758c8540a7ff241607c1
crystle.schaefer@mailto.plus,@@Masuk123$$,0xdcfa565b9bdb4d294c0ea658cb7f1f8449d73e3c
russell.cremin@mailto.plus,@@Masuk123$$,0x8320f36ae3ebd1b3e02f5d83ea3804ede9f53753
christena.wilkinson@rover.info,@@Masuk123$$,0xa13eb2578aa52129a15b1d1dcc11c37b0f3e90d8
harris.waters@mailto.plus,@@Masuk123$$,0x2bade6291bc4c450ed9094ac89a64fbdf2d3ba9f
doug.lakin@rover.info,@@Masuk123$$,0x91f8cf11bdf46d4096ec2abf40193e5bdd69dcb2
doris.bailey@fexbox.org,@@Masuk123$$,0xb1c75a92141ca8db20fad492fb6e3d1ac71713e5
sylvester.cartwright@mailto.plus,@@Masuk123$$,0x69ce697898bd63500269c8b35e19d2935e476479
giuseppina.hand@mailto.plus,@@Masuk123$$,0xce3ee24b2d1d6045d804a85f11e3fa3662e1f537
malinda.feest@fexbox.org,@@Masuk123$$,0xfc1ab5d01f05420b31dd539345255d7740ea3dec
jamison.smith@merepost.com,@@Masuk123$$,0x88ea37278fcad233aeec9ae0980185e7b786638c
catina.koch@merepost.com,@@Masuk123$$,0x3fa82c86892096d4fec10a4efeff0a66b8cc3967
fermin.stroman@rover.info,@@Masuk123$$,0x678ad358184cc5c0081bbbd3bfb488a9bd9f5836
qiana.hills@merepost.com,@@Masuk123$$,0xe6dc62180bde5c698cb52092912092c05e0ddb79
saran.braun@mailto.plus,@@Masuk123$$,0x83989b21ae78e4b4f1aad89a670216ce44eabfa3
lanny.aufderhar@rover.info,@@Masuk123$$,0x54e404f2b7a715b3d0f7a10e5d0d57482ff87cad
bryan.walter@merepost.com,@@Masuk123$$,0xee4496e1a5169a0d7e90ba62bb4687c044168644
johnie.haag@rover.info,@@Masuk123$$,0x9879257f264ed02343d18210b97a59fb39f064bf
nery.powlowski@fexbox.org,@@Masuk123$$,0xf1b76d8af56e4182b317879b3cbcd14829e97680
lamar.schneider@mailto.plus,@@Masuk123$$,0x76d0df578f7c36d90718acec541501adbf535874
adah.mccullough@mailto.plus,@@Masuk123$$,0xcd7ca42cdcdf0ae43e9960488a194101d04b8017
emery.conroy@mailto.plus,@@Masuk123$$,0x10fe411bfab1149aeb10cbb634034d35b3453758
cyrus.denesik@fexbox.org,@@Masuk123$$,0xd71d70af1cf84012648ae2486c2d5ea7b76fb1c9
yahaira.shanahan@fexbox.org,@@Masuk123$$,0x198b1efb1a7703f7a3f35517e2030bb6228d1677
jimmie.christiansen@mailto.plus,@@Masuk123$$,0x9aca4c2eee45c25f8cba78ede12497a62ff8027b
carola.lemke@rover.info,@@Masuk123$$,0x3438f02c3d9f474c4c044130d33b9c729164ddf9
laverna.ward@merepost.com,@@Masuk123$$,0x6e5b60db8ffb2e50d4fdf11d7b945d3436a0aea1
weston.wiza@fexbox.org,@@Masuk123$$,0xc219529ee9ef5693fe59cc0f7468e8dd88da71a4
shane.schamberger@mailto.plus,@@Masuk123$$,0xb23ad9b2f324a8cb7193c134ac2cf0feea844f98
anton.hackett@fexbox.org,@@Masuk123$$,0x96edb9f89173c2e27566924a40f11df4f32c0326
rey.shanahan@mailto.plus,@@Masuk123$$,0x516f24bb7c752ab30da4c7fe0c98271429db5a1c
julio.adams@rover.info,@@Masuk123$$,0x4cdafc1546d7f311ea4843c283b385955f4a3d12
lakeisha.lockman@mailto.plus,@@Masuk123$$,0xa33a52124eb08c97ba002a33386253fb442fb788
roseline.o'keefe@mailto.plus,@@Masuk123$$,0x4f1732d11c279f3fafde6b9c32fcf2f4d84af499
thanh.swaniawski@mailto.plus,@@Masuk123$$,0x59b35d4027fbbaffe2216f8bd823ff0ea8b9ec88
dottie.gleichner@fexbox.org,@@Masuk123$$,0xf45e1903c5b265955e6aef5add74094e0a190c97
gil.schaefer@fexbox.org,@@Masuk123$$,0xcdd1d1812bb94f398f98de26cbeee02332a859d3
rocky.senger@fexbox.org,@@Masuk123$$,0xb01d01fefb0486241e3d99e8d05c1470d3348672
rafael.leuschke@rover.info,@@Masuk123$$,0x14938bb45063f6f47207606d11a9d4e5738f9425
erica.o'keefe@merepost.com,@@Masuk123$$,0xc77b58b4c63c628d8038c0d624f55d90436093e0
joetta.davis@mailto.plus,@@Masuk123$$,0x17289f1741e8f374bd79ae87fea9f83598055a6e
gregorio.stanton@rover.info,@@Masuk123$$,0x395ad8843dc1ac993f9791d8185659634ed0cfde
orval.flatley@merepost.com,@@Masuk123$$,0x67d4c363eb4f1158b0892d3c87ec1a8c06da5526
jeffry.hoppe@rover.info,@@Masuk123$$,0x8d4adee343a30cf096202832df15ab1072f18cab
ossie.mills@merepost.com,@@Masuk123$$,0x93cfe7f42e84c6bf6ace46613920fb37ba4da74a
dawne.flatley@fexbox.org,@@Masuk123$$,0xdda5a34fd7a83f8ad6ac2f05c4abcf091fd10d2a
breanne.rosenbaum@rover.info,@@Masuk123$$,0x3d874f932a0c9c45f9b1bb8329e30f32b6c8de0f
rudolf.nader@merepost.com,@@Masuk123$$,0x797ed8822aa944f94adccca8b7a783345b1ce775
selina.fahey@rover.info,@@Masuk123$$,0xe1c1f82c61998945719970f530b88134f3e7f49b
sabra.borer@fexbox.org,@@Masuk123$$,0xedbb40f6d09a9a557b815f820b53c80cdf4965a2
jermaine.schmidt@merepost.com,@@Masuk123$$,0x6252fbfe021cc853fc57f0d6a63080c0791c5916
emanuel.von@rover.info,@@Masuk123$$,0xd0738027cdd0ed30ae3140a1defb7b995348616a
ignacio.schamberger@mailto.plus,@@Masuk123$$,0x10dd70a6d12dcb86305fd600d392dfb06bcf1e62
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
