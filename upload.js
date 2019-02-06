const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
  uploadFileToBlockBlob
} = require("@azure/storage-blob");

const fs = require("fs");
const path = require("path");

const STORAGE_ACCOUNT_NAME = process.env.ACCOUNT_NAME_DEV;
const ACCOUNT_ACCESS_KEY = process.env.ACCOUNT_KEY_DEV;

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

async function showContainerNames(aborter, serviceURL) {
  let response;
  let marker;

  do {
    response = await serviceURL.listContainersSegment(aborter, marker);
    marker = response.marker;
    for (let container of response.containerItems) {
      console.log(` - ${container.name}`);
    }
  } while (marker);
}

async function uploadLocalFile(aborter, containerURL, filePath) {
  filePath = path.resolve(filePath);

  const pathArray = filePath.split(path.sep);

  var fileName = '';

  for(let i = 6; i < pathArray.length; i++){
    fileName = path.join(fileName,pathArray[i]);
  }

  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL);
}

async function showBlobNames(aborter, containerURL) {
  let response;
  let marker;

  do {
    response = await containerURL.listBlobFlatSegment(aborter);
    marker = response.marker;
    for (let blob of response.segment.blobItems) {
      console.log(` - ${blob.name}`);
    }
  } while (marker);
}

function sleep(seconds) 
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}


async function execute() {
  const containerName = "$web";
  const folderPath = "./dist";
  const walk = require('walk');
  const files = [];

  const walker  = walk.walk(folderPath, { followLinks: false });

  walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    files.push(root + '/' + stat.name);
    next();
  });

  walker.on('end', function() {
    console.log(files);
  });


  const credentials = new SharedKeyCredential(
    STORAGE_ACCOUNT_NAME,
    ACCOUNT_ACCESS_KEY
  );
  const pipeline = StorageURL.newPipeline(credentials);
  const serviceURL = new ServiceURL(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
  );

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

  const aborter = Aborter.timeout(30 * ONE_MINUTE);

  console.log("Containers:");
  await showContainerNames(aborter, serviceURL);

  for(let file of files){
    await uploadLocalFile(aborter, containerURL, file);
    console.log(`Local file "${file}" is uploaded`);
  }

  console.log(`Blobs in "${containerName}" container:`);
  await showBlobNames(aborter, containerURL);
}

execute()
  .then(() => console.log("Done"))
  .catch(e => console.log(e));
