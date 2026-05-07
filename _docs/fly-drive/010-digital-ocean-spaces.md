Digital Ocean Spaces
Digital Ocean Spaces is an S3-compatible storage service. Therefore, you can use the S3Driver to manage files on DO Spaces. Make sure to install the following peer dependencies in your project.

Copy code to clipboard
npm i @aws-sdk/s3-request-presigner @aws-sdk/client-s3
Once done, you can create an instance of the S3 Driver and use it as follows.

Copy code to clipboard
import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'

const disk = new Disk(
new S3Driver({
credentials: {
accessKeyId: 'SPACES_KEY',
secretAccessKey: 'SPACES_SECRET',
},

    endpoint: 'https://sgp1.digitaloceanspaces.com',
    region: 'sgp1',

    bucket: 'SPACES_BUCKET',
    visibility: 'private',

})
)
You may pass all the options accepted by the @aws-sdk/client-s3 package to the S3Driver. However, the following options must always be defined when using DO spaces.

endpoint

Make sure to always define the endpoint of the Digital Ocean Spaces service. The endpoint should not include the bucket name.

region

Define the region in which the bucket was created.

bucket

The bucket option defines the S3 bucket for managing files.

Creating public URLs
Public URLs can be created for files uploaded to DO spaces with public visibility. The public URL can point to a CDN if you have configured the cdnUrl inside the driver config. Otherwise, it will fall back to the endpoint of your bucket region. For example:

When CDN URL is configured
Copy code to clipboard
const disk = new Disk(
new S3Driver({
cdnUrl: 'https://testing-drive.sgp1.cdn.digitaloceanspaces.com',
endpoint: 'https://sgp1.digitaloceanspaces.com',
bucket: 'testing-drive',
})
)

const URL = await disk.getUrl('avatar.png')
console.log(URL) // https://testing-drive.sgp1.cdn.digitaloceanspaces.com/avatar.png
When CDN URL is not configured
Copy code to clipboard
const disk = new Disk(
new S3Driver({
cdnUrl: 'https://testing-drive.sgp1.cdn.digitaloceanspaces.com',
endpoint: 'https://sgp1.digitaloceanspaces.com',
bucket: 'testing-drive',
})
)

const URL = await disk.getUrl('avatar.png')
console.log(URL) // https://sgp1.digitaloceanspaces.com/testing-drive/avatar.png
You may also create a public URL by defining a custom URL builder within the configuration. For example:

Self-generating public URLs
Copy code to clipboard
const disk = new Disk(
new S3Driver({
bucket: 'testing-drive',
endpoint: 'https://sgp1.digitaloceanspaces.com',
urlBuilder: {
async generateURL(key, bucket, s3Client) {
return `https://some-custom-url/files/${bucket}/${key}`
},
},
})
)

const URL = await disk.getUrl('avatar.png')
console.log(URL) // https://some-custom-url/files/testing-drive/avatar.png
Creating signed URLs
Signed URLs are created to provide time-based access to a private file hosted on DO spaces. For example:

Copy code to clipboard
const disk = new Disk(new S3Driver({}))

const signedURL = await disk.getSignedUrl('invoice.pdf', {
expiresIn: '30mins',
})
At the time of generating the signed URL, you can pass one of the following options along with the options accepted by GetObjectCommand class.

Copy code to clipboard
await disk.getSignedUrl('invoice.pdf', {
expiresIn: '30mins',
contentType: 'application/pdf',
contentDisposition: 'attachment',

/\*\*

- Additional options applicable for S3 only
  \*/
  ResponseCacheControl: 'max-age=604800',
  })
  Having issues?
  Endpoint should not include the bucket name
  Even though the Digital Ocean control panel displays the endpoint with the bucket name, you cannot use it with the AWS SDK to manage files.

With the SDK, it is recommended to use the following combination for the spaces endpoint.

Copy code to clipboard
https://<region>.digitaloceanspaces.com

# Examples

https://nyc3.digitaloceanspaces.com
https://sgp.digitaloceanspaces.com
